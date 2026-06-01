import React from 'react';
import { Trophy, Target, RotateCcw, Save, Loader2, CheckCircle2 } from 'lucide-react';
import type { LegoConfig, LegoSentence } from '../../types/lego';
import { FinalizeMissionButton } from '../shared/FinalizeMissionButton';

interface ResultScreenProps {
    config: LegoConfig;
    sentences: LegoSentence[];
    score: number;
    onRestart: () => void;
    onSave?: (title: string) => void;
    isSaving?: boolean;
    initialTitle?: string;
    hideActions?: boolean;
    rewards?: any;
    senseiWhatsapp?: string | null;
    onFinalize?: () => Promise<void>;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
    config,
    sentences,
    score,
    onRestart,
    onSave,
    isSaving,
    initialTitle,
    hideActions,
    rewards,
    senseiWhatsapp,
    onFinalize
}) => {
    const maxPossible = sentences.length * 20;
    const percentage = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;

    let rank = { label: 'Iniciante', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.2)' };
    if (percentage >= 90) rank = { label: '⛩️ Sensei', color: '#d97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.2)' };
    else if (percentage >= 70) rank = { label: '🌸 Avançado', color: '#16a34a', bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.2)' };
    else if (percentage >= 50) rank = { label: '📚 Esforçado', color: '#2563eb', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.2)' };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 animate-[fade-in_0.4s_ease-out]">
            <div className="text-center">
                <h2 className="font-outfit text-3xl font-extrabold text-slate-dark mb-1">Missão Concluída!</h2>
                <p className="font-inter text-slate-mid">Veja seu desempenho no treino sintático Lego.</p>
            </div>

            <div className="flex items-center gap-4 border-[1.5px] rounded-2xl p-5" style={{ background: rank.bg, borderColor: rank.border }}>
                <Trophy size={32} style={{ color: rank.color, flexShrink: 0 }} />
                <div>
                    <p className="font-inter text-xs font-bold uppercase tracking-widest text-slate-mid">Ranking IA</p>
                    <p className="font-outfit text-2xl font-extrabold m-0" style={{ color: rank.color }}>{rank.label}</p>
                </div>
                <div className="font-outfit text-4xl font-extrabold ml-auto" style={{ color: rank.color }}>
                    {percentage}%
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border-[1.5px] border-slate-border rounded-2xl p-5 text-center flex flex-col items-center">
                    <Target size={24} className="text-brand mb-1" />
                    <p className="font-outfit text-3xl font-extrabold text-brand m-0">{score}</p>
                    <p className="font-inter text-sm font-bold text-slate-dark">Score Total</p>
                    <p className="font-inter text-xs text-slate-mid">de {maxPossible} pts</p>
                </div>
                <div className="bg-white border-[1.5px] border-slate-border rounded-2xl p-5 text-center flex flex-col items-center">
                    <CheckCircle2 size={24} className="text-action mb-1" />
                    <p className="font-outfit text-3xl font-extrabold text-action m-0">{sentences.length}</p>
                    <p className="font-inter text-sm font-bold text-slate-dark">Frases Montadas</p>
                    <p className="font-inter text-xs text-slate-mid">100% concluído</p>
                </div>
            </div>

            {rewards && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-amber-50/50 border-[1.5px] border-amber-200 rounded-2xl p-5 text-center flex flex-col items-center">
                        <div className="text-amber-600 text-xs font-extrabold mb-1">COINS</div>
                        <p className="font-outfit text-3xl font-extrabold text-amber-600 m-0">+{rewards.coinsGain}</p>
                        <p className="text-xs font-bold text-amber-800">Destrave Coins</p>
                    </div>
                    <div className="bg-indigo-50/50 border-[1.5px] border-indigo-200 rounded-2xl p-5 text-center flex flex-col items-center">
                        <div className="text-indigo-600 text-xs font-extrabold mb-1">XP</div>
                        <p className="font-outfit text-3xl font-extrabold text-indigo-600 m-0">+{rewards.xpGain}</p>
                        <p className="text-xs font-bold text-indigo-800">Experiência</p>
                    </div>
                </div>
            )}

            {!hideActions ? (
                <div className="flex gap-4 mt-4">
                    <button onClick={onRestart} className="flex-[1] flex justify-center items-center gap-2 py-4 rounded-xl bg-slate-100 text-slate-mid font-outfit font-bold hover:bg-slate-200 transition-colors">
                        <RotateCcw size={18} /> Novo Treino
                    </button>
                    {onSave && (
                        <button
                            onClick={() => onSave(initialTitle || 'Destrave Lego')}
                            disabled={isSaving}
                            className="flex-[2] flex justify-center items-center gap-2 py-4 rounded-xl bg-brand text-white font-outfit font-bold hover:-translate-y-1 transition-all shadow-md shadow-brand/20 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Salvar na Central
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-slate-border p-8 text-center shadow-lg w-full mt-4">
                    {onFinalize && !rewards ? (
                        <FinalizeMissionButton onFinalize={onFinalize} />
                    ) : (
                        <>
                            {senseiWhatsapp ? (
                                <a
                                    href={`/api/contact/sensei?teacherId=${senseiWhatsapp}&text=${encodeURIComponent(`Oi Sensei! Acabei de completar o Destrave Lego e atingi ${percentage}% de desempenho! 🧱`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-outfit font-bold text-white text-base transition-all hover:-translate-y-0.5 w-full bg-[#25D366] shadow-[0_4px_14px_rgba(37,211,102,0.35)]"
                                >
                                    💬 Falar com o Sensei no WhatsApp
                                </a>
                            ) : (
                                <button
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-outfit font-bold text-white text-base transition-all bg-brand hover:-translate-y-0.5 w-full shadow-md shadow-brand/20"
                                >
                                    Voltar ao Dashboard
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
