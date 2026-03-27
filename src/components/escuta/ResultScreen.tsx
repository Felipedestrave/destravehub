import React from 'react';
import { Trophy, RotateCcw, Star, CheckCircle, XCircle, Save } from 'lucide-react';
import type { GameResult } from '../../types/escuta';

interface ResultScreenProps {
    result: GameResult;
    onRestart: () => void;
    onSave?: (title?: string) => void;
    isSaving?: boolean;
    hideActions?: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRestart, onSave, isSaving, hideActions }) => {

    const { score, total, history } = result;
    const correctCount = history.filter((h) => h.correct).length;
    const accuracy = Math.round((correctCount / total) * 100);
    const hintCount = history.filter((h) => h.usedHint).length;

    const getRating = () => {
        if (accuracy >= 90) return { label: 'Excelente!', color: 'text-emerald-600', stars: 3 };
        if (accuracy >= 70) return { label: 'Bom trabalho!', color: 'text-brand', stars: 2 };
        return { label: 'Continue praticando!', color: 'text-action', stars: 1 };
    };

    const rating = getRating();

    return (
        <div className="max-w-2xl mx-auto w-full py-8 px-4">
            {/* Hero Result */}
            <div className="card text-center mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand via-brand/60 to-action rounded-t-3xl" />

                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand/10 rounded-full mb-5 mt-2">
                    <Trophy size={36} className="text-brand" />
                </div>

                <div className="flex justify-center gap-1 mb-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Star
                            key={i}
                            size={28}
                            className={i < rating.stars ? 'text-action fill-action' : 'text-slate-border'}
                            fill={i < rating.stars ? 'currentColor' : 'none'}
                        />
                    ))}
                </div>

                <h2 className={`font-outfit font-extrabold text-3xl mb-1 ${rating.color}`}>{rating.label}</h2>
                <p className="text-slate-mid font-inter text-base">
                    Você acertou <strong className="text-slate-dark">{correctCount} de {total}</strong> questões
                </p>

                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-ice rounded-2xl p-4">
                        <p className="font-outfit font-extrabold text-3xl text-brand">{score}</p>
                        <p className="text-xs font-outfit uppercase tracking-wider text-slate-mid mt-1">Pontos</p>
                    </div>
                    <div className="bg-ice rounded-2xl p-4">
                        <p className="font-outfit font-extrabold text-3xl text-emerald-600">{accuracy}%</p>
                        <p className="text-xs font-outfit uppercase tracking-wider text-slate-mid mt-1">Precisão</p>
                    </div>
                    <div className="bg-ice rounded-2xl p-4">
                        <p className="font-outfit font-extrabold text-3xl text-action">{hintCount}</p>
                        <p className="text-xs font-outfit uppercase tracking-wider text-slate-mid mt-1">Dicas usadas</p>
                    </div>
                </div>
            </div>

            {/* Question Review */}
            <div className="card mb-6">
                <h3 className="font-outfit font-bold text-slate-dark text-lg mb-4">Revisão das questões</h3>
                <div className="flex flex-col gap-3">
                    {history.map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-3 p-4 rounded-2xl border ${item.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                                }`}
                        >
                            <div className="shrink-0 mt-0.5">
                                {item.correct
                                    ? <CheckCircle size={20} className="text-emerald-600" />
                                    : <XCircle size={20} className="text-red-500" />}
                            </div>
                            <div className="min-w-0">
                                <p className="font-jp text-sm text-slate-dark leading-snug truncate">
                                    {item.questionData.question.japanese_sentence}
                                </p>
                                <p className="text-xs text-slate-mid mt-0.5 font-inter">
                                    {item.questionData.question.context_name} · {item.points > 0 ? `+${item.points} pts` : '+0 pts'}
                                    {item.usedHint && ' · 💡 dica'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            {!hideActions ? (
                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={onRestart} className="btn-ghost flex-1 flex items-center justify-center gap-2">
                        <RotateCcw size={18} />
                        Praticar novamente
                    </button>
                    {onSave && (
                        <button 
                            onClick={() => onSave()} 
                            disabled={isSaving}
                            className="btn-brand flex-1 flex items-center justify-center gap-2"
                        >
                            {isSaving ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <Save size={18} />}
                            Salvar na Central
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-slate-border p-8 text-center shadow-lg animate-fade-in">
                    <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-brand" />
                    </div>
                   <h1 className="font-outfit text-2xl font-extrabold text-slate-dark mb-2">Missão Concluída! 🚀</h1>
                   <p className="text-slate-mid mb-6 px-4">Parabéns pelo seu esforço! Seus resultados foram registrados e seu professor poderá analisá-los em breve.</p>
                   <div className="flex justify-center">
                       <a href="/dashboard" className="px-8 py-3 bg-brand text-white rounded-xl font-outfit font-bold hover:scale-105 transition-transform shadow-md">
                           Voltar para o Dashboard
                       </a>
                   </div>
                </div>
            )}

        </div>
    );
};
