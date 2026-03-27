import React, { useState } from 'react';
import { type LucideIcon, CheckCircle, ArrowLeft, Layers } from 'lucide-react';
import { AdvancedLoading } from '../shared/AdvancedLoading';
import { supabase } from '../../lib/supabase';
import { DeckGenerator } from './DeckGenerator';
import { ReviewStudio } from './ReviewStudio';
import { RoleGuard } from '../shared/RoleGuard';
import type { FlashcardStatus, FlashDeck, DeckConfig } from '../../types/flashcards';

interface FlashcardsAppProps {
    userToken?: string;
    assignmentId?: string;
    editingId?: string;
    initialDeck?: FlashDeck;
    publicAccess?: boolean;
}

export const FlashcardsApp: React.FC<FlashcardsAppProps> = ({ userToken, assignmentId, editingId, initialDeck, publicAccess }) => {
    const [status, setStatus] = useState<FlashcardStatus>(initialDeck ? 'REVIEW' : 'GENERATE');
    const [deck, setDeck] = useState<FlashDeck | null>(initialDeck || null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (config: DeckConfig) => {
        setIsGenerating(true);
        setStatus('LOADING');
        setError(null);

        try {
            const response = await fetch('/api/flashcards/generate-deck', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erro ao gerar deck.');

            setDeck({
                title: config.title,
                level: config.level,
                cards: data.cards
            });
            setStatus('REVIEW');
        } catch (err: any) {
            setError(err.message);
            setStatus('GENERATE');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleApprove = async (finalDeck: FlashDeck) => {
        setIsSaving(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || userToken;

            if (!token) throw new Error('Sessão expirada. Por favor, faça login novamente.');

            const endpoint = editingId ? '/api/activities/update' : '/api/activities/save';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: editingId,
                    title: finalDeck.title,
                    type: 'flashcards',
                    config: finalDeck
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erro ao salvar atividade.');
            }

            setStatus('SAVED');
        } catch (err: any) {
            console.error('[Flashcards Save Error]', err);
            setError(err.message);
            alert(`Falha ao salvar: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const reset = () => {
        setDeck(null);
        setStatus('GENERATE');
        setError(null);
    };

    return (
        <div className="flash-app-host">
            <RoleGuard allowedRole="teacher" bypassIfAssignmentId={assignmentId} publicAccess={publicAccess}>
                {status === 'GENERATE' && (
                    <DeckGenerator onGenerate={handleGenerate} isLoading={isGenerating} />
                )}

                {status === 'LOADING' && (
                    <AdvancedLoading 
                        title="Construindo seu Deck"
                        Icon={Layers}
                        type="cards"
                        messages={[
                            "Baralhando o conhecimento estratégico...",
                            "Sintonizando com o Gemini...",
                            "Extraindo vocabulário contextual...",
                            "Preparando algoritmos de repetição..."
                        ]}
                    />
                )}

                {status === 'REVIEW' && deck && (
                    <ReviewStudio
                        deck={deck}
                        onApprove={handleApprove}
                        onCancel={reset}
                        isSaving={isSaving}
                    />
                )}

                {status === 'SAVED' && (
                    <div className="flash-success-state">
                        <div className="success-icon-bg">
                            <CheckCircle size={40} className="text-white" />
                        </div>
                        <h2>Deck Pronto!</h2>
                        <p>Seus cards foram sintonizados e salvos. Seu aluno já pode começar a prática SRS no portal dele.</p>
                        <div className="success-actions">
                            <button onClick={reset} className="btn-again">Criar Outro Deck</button>
                            <a href="/dashboard/activities" className="btn-view">Ir para Central de Atividades</a>
                        </div>
                    </div>
                )}
            </RoleGuard>

            <style>{`
                .flash-app-host { padding: 1rem 0 4rem; width: 100%; }
                
                .flash-loading-state {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 6rem 1rem; text-align: center; gap: 1rem;
                }
                .flash-loading-state h3 { font-family: var(--font-outfit); font-size: 1.5rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
                .flash-loading-state p { font-size: 1rem; color: var(--color-slate-mid); max-width: 400px; line-height: 1.5; }

                .flash-success-state {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 5rem 1rem; text-align: center; gap: 1rem;
                    background: white; border-radius: 2rem; border: 1.5px solid var(--color-slate-border);
                    max-width: 600px; margin: 0 auto; box-shadow: 0 10px 40px -10px rgba(88,49,126,0.1);
                    animation: fade-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .success-icon-bg {
                    width: 80px; height: 80px; border-radius: 2rem; background: #22c55e;
                    display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;
                    box-shadow: 0 8px 25px rgba(34,197,94,0.3);
                }
                .flash-success-state h2 { font-family: var(--font-outfit); font-size: 2rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
                .flash-success-state p { font-size: 1rem; color: var(--color-slate-mid); max-width: 450px; line-height: 1.6; }
                .success-actions { display: flex; gap: 1rem; margin-top: 2rem; }
                .btn-again {
                    padding: 0.875rem 1.5rem; border-radius: 1rem; border: 1.5px solid var(--color-slate-border);
                    background: white; font-family: var(--font-outfit); font-weight: 700; color: var(--color-slate-dark);
                    cursor: pointer; transition: all 150ms;
                }
                .btn-again:hover { background: var(--color-ice); border-color: var(--color-brand); color: var(--color-brand); }
                .btn-view {
                    padding: 0.875rem 1.5rem; border-radius: 1rem; border: none;
                    background: var(--color-brand); color: white; font-family: var(--font-outfit); font-weight: 800;
                    text-decoration: none; display: flex; align-items: center; gap: 0.5rem;
                    transition: transform 150ms;
                }
                .btn-view:hover { transform: scale(1.05); }

                @keyframes fade-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};
