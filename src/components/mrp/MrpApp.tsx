import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Theater, Users, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ConfigScreen } from './ConfigScreen';
import { ReviewScreen } from './ReviewScreen';
import { GameScreen } from './GameScreen';
import { ResultScreen } from './ResultScreen';
import { RoleGuard } from '../shared/RoleGuard';
import { AdvancedLoading } from '../shared/AdvancedLoading';
import type { MrpConfig, MrpQuestion, MrpUserAnswer, MrpStatus } from '../../types/mrp';
interface MrpAppProps {
    userToken?: string;
    assignmentId?: string;
    editingId?: string;
    initialConfig?: MrpConfig;
    initialQuestions?: MrpQuestion[];
    initialTitle?: string;
    publicAccess?: boolean;
}


export const MrpApp: React.FC<MrpAppProps> = ({ userToken, assignmentId, editingId, initialConfig, initialQuestions, initialTitle, publicAccess }) => {

    const [status, setStatus] = useState<MrpStatus>(initialQuestions ? (editingId ? 'REVIEW' : 'PLAYING') : 'CONFIG');
    const [config, setConfig] = useState<MrpConfig | null>(initialConfig || null);
    const [questions, setQuestions] = useState<MrpQuestion[]>(initialQuestions || []);
    const [answers, setAnswers] = useState<MrpUserAnswer[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    React.useEffect(() => {
        if (!editingId && initialQuestions && initialQuestions.length > 0) {
            setQuestions(initialQuestions);
            setConfig(initialConfig || null);
            setStatus('PLAYING');
        }
    }, [initialQuestions, initialConfig, editingId]);

    const handleGenerate = async (newConfig: MrpConfig) => {
        setConfig(newConfig);
        setError(null);
        setIsLoading(true);
        setStatus('LOADING');

        try {
            const res = await fetch('/api/mrp/generate-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newConfig),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Erro ao gerar questões.');
            if (!data.questions || data.questions.length === 0) {
                throw new Error('A IA não conseguiu gerar questões com esse texto. Tente um conteúdo diferente.');
            }

            setQuestions(data.questions);
            setAnswers([]);
            setStatus('REVIEW');
        } catch (err: any) {
            console.error('[MRP Generate Error]', err);
            setError(err.message ?? 'Erro inesperado.');
            setStatus('CONFIG');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveActivity = async (title: string) => {
        if (!questions.length || !config) return;
        setIsSaving(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) throw new Error('Não autenticado. Por favor, faça login novamente.');

            const endpoint = editingId ? '/api/activities/update' : '/api/activities/save';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: editingId,
                    title,
                    type: 'mrp',
                    config: {
                        ...config,
                        questions 
                    }
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao salvar missão.');

            setStatus('SAVED');
        } catch (err: any) {
            console.error('[MRP Save Error]', err);
            alert(`Erro ao salvar: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleComplete = async (userAnswers: MrpUserAnswer[]) => {
        setAnswers(userAnswers);
        setStatus('RESULTS');

        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || userToken;

        if (token && config) {
            const totalScore = userAnswers.reduce((acc, a) => acc + a.scoreEarned, 0);
            const maxPossible = questions.reduce((acc, q) => acc + q.points, 0);
            const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
            const rankLabel = percentage >= 90 ? 'Sensei' : percentage >= 70 ? 'Avançado' : percentage >= 50 ? 'Esforçado' : 'Iniciante';

            const endpoint = assignmentId ? '/api/missions/save-result' : '/api/mrp/save-result';
            
            fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ 
                    assignmentId,
                    config, 
                    answers: userAnswers, 
                    score: totalScore, 
                    totalQuestions: questions.length,
                    percentage, 
                    rankLabel,
                    history: userAnswers // For compliance with generic API
                }),
            }).catch((err) => console.error('[MrpApp] Error saving:', err));
        }
    };

    const handleRestart = () => {
        setStatus('CONFIG');
        setQuestions([]);
        setAnswers([]);
        setConfig(null);
        setError(null);
    };

    if (status === 'LOADING') {
        return (
            <AdvancedLoading 
                title="Criando Cenário de Role Play"
                Icon={Theater}
                type="pulse"
                messages={[
                    "Invocando os personagens do Sensei...",
                    "Sintonizando os diálogos adaptados...",
                    "Preparando os gatilhos culturais...",
                    "Quase lá! Polindo a gramática..."
                ]}
            />
        );
    }

    if (error) {
        return (
            <div className="mrp-error-screen">
                <AlertCircle size={36} className="mrp-error-icon" />
                <h3 className="mrp-error-title">Algo deu errado</h3>
                <p className="mrp-error-msg">{error}</p>
                <button onClick={handleRestart} className="mrp-error-btn">Tentar novamente</button>
            </div>
        );
    }

    return (
        <div className="mrp-app-host">
            <RoleGuard allowedRole="teacher" bypassIfAssignmentId={assignmentId} publicAccess={publicAccess}>

                {status === 'CONFIG' && <ConfigScreen onSubmit={handleGenerate} isLoading={isLoading} />}
                
                {status === 'REVIEW' && config && (
                    <ReviewScreen 
                        questions={questions} 
                        config={config} 
                        onSave={handleSaveActivity}
                        onStartGame={() => setStatus('PLAYING')}
                        onCancel={handleRestart}
                        isSaving={isSaving}
                        initialTitle={initialTitle}
                    />
                )}

                {status === 'PLAYING' && config && (
                    <GameScreen questions={questions} mode={config.mode} onComplete={handleComplete} />
                )}
                
                {status === 'RESULTS' && config && (
                    <ResultScreen
                    config={config}
                    questions={questions}
                    answers={answers}
                    onRestart={handleRestart}
                    onSave={(!assignmentId && !publicAccess) ? handleSaveActivity : undefined}
                    isSaving={isSaving}
                    initialTitle={initialTitle}
                    hideActions={!!assignmentId}
                />
                )}



                {status === 'SAVED' && (
                    <div className="mrp-success-state">
                        <div className="mrp-success-icon-bg">
                            <CheckCircle size={40} className="text-white" />
                        </div>
                        <h2>Missão Salva!</h2>
                        <p>O mini role play foi adicionado à sua biblioteca. Você já pode atribuir esta atividade aos seus alunos na Central.</p>
                        <div className="mrp-success-actions">
                            <button onClick={handleRestart} className="mrp-btn-again">Criar Outro MRP</button>
                            <a href="/dashboard/activities" className="mrp-btn-view">Ir para Central</a>
                        </div>
                    </div>
                )}
            </RoleGuard>

            <style>{`
                .mrp-app-host { width: 100%; padding-bottom: 4rem; }
                .mrp-loading-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 5rem 1rem; text-align: center; }
                .mrp-loading-spin { color: var(--color-brand); animation: mrp-spin 0.8s linear infinite; }
                @keyframes mrp-spin { to { transform: rotate(360deg); } }
                .mrp-loading-label { font-family: var(--font-outfit); font-size: 1.1rem; font-weight: 700; color: var(--color-slate-dark); margin: 0; }
                .mrp-loading-sub { font-family: var(--font-inter); font-size: 0.85rem; color: var(--color-slate-mid); margin: 0; }
                .mrp-error-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 4rem 1rem; text-align: center; max-width: 400px; margin: 0 auto; }
                .mrp-error-icon { color: var(--color-action); }
                .mrp-error-title { font-family: var(--font-outfit); font-size: 1.25rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
                .mrp-error-msg { font-family: var(--font-inter); font-size: 0.875rem; color: var(--color-slate-mid); margin: 0; }
                .mrp-error-btn { margin-top: 0.5rem; padding: 0.7rem 1.75rem; border: 1.5px solid var(--color-slate-border); border-radius: 0.75rem; background: none; font-family: var(--font-outfit); font-weight: 700; font-size: 0.9rem; color: var(--color-slate-dark); cursor: pointer; transition: background 150ms; }
                .mrp-error-btn:hover { background: var(--color-ice); }

                .mrp-success-state {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 5rem 1.5rem; text-align: center; gap: 1rem;
                    background: white; border-radius: 2rem; border: 1.5px solid var(--color-slate-border);
                    max-width: 600px; margin: 2rem auto; box-shadow: 0 10px 40px -10px rgba(88,49,126,0.1);
                    animation: fade-in 0.5s ease;
                }
                .mrp-success-icon-bg {
                    width: 80px; height: 80px; border-radius: 2rem; background: #22c55e;
                    display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;
                    box-shadow: 0 8px 25px rgba(34,197,94,0.3);
                }
                .mrp-success-state h2 { font-family: var(--font-outfit); font-size: 2rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
                .mrp-success-state p { font-size: 1rem; color: var(--color-slate-mid); max-width: 400px; line-height: 1.6; }
                .mrp-success-actions { display: flex; gap: 1rem; margin-top: 2rem; }
                .mrp-btn-again { padding: 0.9rem 1.5rem; border-radius: 1rem; border: 1.5px solid var(--color-slate-border); background: white; font-family: var(--font-outfit); font-weight: 700; color: var(--color-slate-dark); cursor: pointer; transition: all 150ms; }
                .mrp-btn-view { padding: 0.9rem 1.75rem; border-radius: 1rem; border: none; background: var(--color-brand); color: white; font-family: var(--font-outfit); font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 0.6rem; transition: transform 150ms; }
                .mrp-btn-view:hover { transform: scale(1.05); filter: brightness(1.1); }
            `}</style>
        </div>
    );
};
