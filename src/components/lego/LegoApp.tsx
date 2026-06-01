import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Blocks, ArrowLeft, BookOpen } from 'lucide-react';
import { BuddyView, type BuddyState } from '../buddy/BuddyView';
import { STORE_ITEMS } from '../../lib/store';
import { getBuddyPhrase } from '../../lib/buddy-phrases';
import { supabase } from '../../lib/supabase';
import { UploadScreen } from './UploadScreen';
import { ReviewScreen } from './ReviewScreen';
import { GameScreen } from './GameScreen';
import { ResultScreen } from './ResultScreen';
import { RoleGuard } from '../shared/RoleGuard';
import { AdvancedLoading } from '../shared/AdvancedLoading';
import { MaterialsDrawer } from '../materials/MaterialsDrawer';
import type { LegoConfig, LegoSentence, LegoStatus } from '../../types/lego';

interface LegoAppProps {
    userToken?: string;
    assignmentId?: string;
    editingId?: string;
    initialConfig?: LegoConfig;
    initialSentences?: LegoSentence[];
    initialTitle?: string;
    publicAccess?: boolean;
    activityId?: string;
    senseiWhatsapp?: string | null;
}

export const LegoApp: React.FC<LegoAppProps> = ({ userToken, assignmentId, editingId, initialConfig, initialSentences, initialTitle, publicAccess, activityId, senseiWhatsapp }) => {
    const [status, setStatus] = useState<LegoStatus>(initialSentences ? (editingId ? 'REVIEW' : 'PLAYING') : 'UPLOAD');
    const [config, setConfig] = useState<LegoConfig | null>(initialConfig || null);
    const [sentences, setSentences] = useState<LegoSentence[]>(initialSentences || []);
    const [score, setScore] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [rewards, setRewards] = useState<any>(null);
    const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);

    // BUDDY COMPANION
    const [buddyState, setBuddyState] = useState<BuddyState>('idle');
    const [buddyMessage, setBuddyMessage] = useState<string | null>(null);
    const [buddyAvatarUrl, setBuddyAvatarUrl] = useState<string>('/assets/avatars/tanuki-novato.png');
    const [buddyAvatarId, setBuddyAvatarId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) return;
            supabase.from('profiles').select('equipped').eq('id', session.user.id).single().then(({ data }) => {
                const equipped = data?.equipped as any;
                if (equipped?.avatar) {
                    setBuddyAvatarId(equipped.avatar);
                    const item = STORE_ITEMS.find(i => i.id === equipped.avatar);
                    if (item?.previewUrl) setBuddyAvatarUrl(item.previewUrl);
                }
            });
        });
    }, []);

    const triggerBuddy = (newState: BuddyState, type?: 'success' | 'error', customMsg?: string) => {
        setBuddyState(newState);
        if (customMsg) {
            setBuddyMessage(customMsg);
        } else if (type) {
            setBuddyMessage(getBuddyPhrase(buddyAvatarId || null, type));
        }
        setTimeout(() => {
            setBuddyState('idle');
            setBuddyMessage(null);
        }, 3000); // 3s message
    };

    const handleGenerate = async (newConfig: LegoConfig) => {
        setConfig(newConfig);
        setError(null);
        setIsLoading(true);
        setStatus('LOADING');

        try {
            const res = await fetch('/api/lego/generate-blocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newConfig),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Erro ao gerar blocos.');
            if (!data.sentences || data.sentences.length === 0) {
                throw new Error('A IA não conseguiu gerar blocos com esse texto.');
            }

            setSentences(data.sentences);
            setScore(0);
            setStatus('REVIEW');
        } catch (err: any) {
            console.error('[Lego Generate Error]', err);
            setError(err.message ?? 'Erro inesperado.');
            setStatus('UPLOAD');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveActivity = async (title: string, editedSentences?: LegoSentence[]) => {
        const finalSentences = editedSentences ?? sentences;
        if (!finalSentences.length || !config) return;
        setIsSaving(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) throw new Error('Não autenticado.');

            const endpoint = editingId ? '/api/activities/update' : '/api/activities/save';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    id: editingId,
                    title,
                    type: 'lego',
                    config: {
                        ...config,
                        sentences: finalSentences
                    }
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Erro ao salvar missão.');

            setStatus('SAVED');
        } catch (err: any) {
            alert(`Erro ao salvar: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleFinalize = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || userToken;
        if (!token || !config) return;

        const maxPossible = sentences.length * 20;
        const percentage = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
        const rankLabel = percentage >= 90 ? 'Sensei' : percentage >= 70 ? 'Avançado' : percentage >= 50 ? 'Esforçado' : 'Iniciante';

        const endpoint = assignmentId ? '/api/missions/save-result' : '/api/activities/save-result'; // Adapt if lego has specific endpoint, else use generic if modified
        
        try {
            const res = await fetch('/api/missions/save-result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ 
                    assignmentId,
                    config, 
                    score, 
                    totalQuestions: sentences.length,
                    percentage, 
                    rankLabel,
                    history: { score },
                    title: initialTitle || 'Missão Lego'
                }),
            });

            if (!res.ok) throw new Error('Erro ao salvar resultados');

            const data = await res.json();
            if (data.rewards) setRewards(data.rewards);
        } catch (err: any) {
            console.error('Finalize error', err);
        }
    };

    if (status === 'LOADING') {
        return (
            <AdvancedLoading 
                title="Sintetizando Gramática"
                Icon={Blocks}
                type="pulse"
                messages={["Quebrando as frases...", "Analisando partículas...", "Separando verbos e objetos..."]}
            />
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 p-16 text-center max-w-sm mx-auto">
                <AlertCircle size={36} className="text-action" />
                <h3 className="font-outfit text-xl font-extrabold text-slate-dark">Algo deu errado</h3>
                <p className="font-inter text-sm text-slate-mid">{error}</p>
                <button onClick={() => setStatus('UPLOAD')} className="mt-2 px-6 py-3 border-[1.5px] border-slate-border rounded-xl font-outfit font-bold text-slate-dark hover:bg-ice transition-colors">Tentar novamente</button>
            </div>
        );
    }

    return (
        <div className="w-full pb-16 relative">
            <RoleGuard allowedRole="teacher" bypassIfAssignmentId={assignmentId} publicAccess={publicAccess}>
                
                {status === 'UPLOAD' && <UploadScreen onSubmit={handleGenerate} isLoading={isLoading} />}
                
                {status === 'REVIEW' && config && (
                    <ReviewScreen 
                        sentences={sentences} 
                        config={config} 
                        onSave={handleSaveActivity}
                        onStartGame={(edited) => { setSentences(edited); setStatus('PLAYING'); }}
                        onCancel={() => setStatus('UPLOAD')}
                        isSaving={isSaving}
                        initialTitle={initialTitle}
                    />
                )}

                {status === 'PLAYING' && config && (
                    <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-4">
                            <a href="/dashboard" className="inline-flex items-center gap-2 text-slate-mid hover:text-brand transition-colors font-outfit font-bold group">
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                Sair da Missão
                            </a>
                            <button onClick={() => setIsMaterialsOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white border-[1.5px] border-slate-border rounded-xl font-outfit font-bold text-slate-dark hover:bg-ice transition-all shadow-sm group">
                                <BookOpen size={18} className="text-brand group-hover:scale-110 transition-transform" />
                                <span>Materiais</span>
                            </button>
                        </div>
                        <GameScreen 
                            sentences={sentences} 
                            onComplete={(finalScore) => { setScore(finalScore); setStatus('RESULT'); }} 
                            onTriggerBuddy={triggerBuddy}
                        />
                        <BuddyView avatarUrl={buddyAvatarUrl} avatarId={buddyAvatarId} state={buddyState} message={buddyMessage} />
                        <MaterialsDrawer isOpen={isMaterialsOpen} onClose={() => setIsMaterialsOpen(false)} activityId={activityId} />
                    </>
                )}

                {status === 'RESULT' && config && (
                    <ResultScreen
                        config={config}
                        sentences={sentences}
                        score={score}
                        onRestart={() => setStatus('UPLOAD')}
                        onSave={(!assignmentId && !publicAccess) ? handleSaveActivity : undefined}
                        onFinalize={handleFinalize}
                        isSaving={isSaving}
                        hideActions={!!assignmentId}
                        rewards={rewards}
                        senseiWhatsapp={senseiWhatsapp}
                    />
                )}

                {status === 'SAVED' && (
                    <div className="flex flex-col items-center justify-center p-16 text-center gap-4 bg-white rounded-[2rem] border-[1.5px] border-slate-border max-w-xl mx-auto shadow-[0_10px_40px_-10px_rgba(88,49,126,0.1)] animate-[fade-in_0.5s_ease]">
                        <div className="w-20 h-20 rounded-[2rem] bg-[#22c55e] flex items-center justify-center mb-5 shadow-[0_8px_25px_rgba(34,197,94,0.3)]">
                            <CheckCircle size={40} className="text-white" />
                        </div>
                        <h2 className="font-outfit text-3xl font-extrabold text-slate-dark">Missão Salva!</h2>
                        <p className="text-base text-slate-mid max-w-[400px]">O Destrave Lego foi adicionado à sua biblioteca. Você já pode atribuir esta atividade aos seus alunos na Central.</p>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => { setStatus('UPLOAD'); setConfig(null); setSentences([]); }} className="px-6 py-3.5 rounded-xl border-[1.5px] border-slate-border bg-white font-outfit font-bold text-slate-dark hover:bg-slate-50 transition-colors">Criar Outro Lego</button>
                            <a href="/dashboard/activities" className="px-7 py-3.5 rounded-xl bg-brand text-white font-outfit font-extrabold flex items-center gap-2 hover:-translate-y-0.5 transition-transform shadow-md shadow-brand/20">Ir para Central</a>
                        </div>
                    </div>
                )}
            </RoleGuard>
        </div>
    );
};
