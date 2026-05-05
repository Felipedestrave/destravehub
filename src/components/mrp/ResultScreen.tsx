import React, { useMemo } from 'react';
import { Trophy, Target, Lightbulb, RotateCcw, CheckCircle2, XCircle, Save, Loader2 } from 'lucide-react';
import type { MrpConfig, MrpQuestion, MrpUserAnswer } from '../../types/mrp';
import { FinalizeMissionButton } from '../shared/FinalizeMissionButton';

interface ResultScreenProps {
    config: MrpConfig;
    questions: MrpQuestion[];
    answers: MrpUserAnswer[];
    onRestart: () => void;
    onSave?: (title: string) => void;
    isSaving?: boolean;
    initialTitle?: string;
    hideActions?: boolean;
    rewards?: any;
    senseiWhatsapp?: string | null;
    onFinalize?: () => Promise<void>;
}

const RANK_LEVELS = [
    { min: 90, label: '⛩️ Sensei', color: '#d97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.2)' },
    { min: 70, label: '🌸 Avançado', color: '#16a34a', bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.2)' },
    { min: 50, label: '📚 Esforçado', color: '#2563eb', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.2)' },
    { min: 0, label: '🌱 Iniciante', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.2)' },
];

export const ResultScreen: React.FC<ResultScreenProps> = ({ config, questions, answers, onRestart, onSave, isSaving, initialTitle, hideActions, rewards, senseiWhatsapp, onFinalize }) => {
    const totalScore = answers.reduce((acc, a) => acc + a.scoreEarned, 0);
    const maxPossible = questions.reduce((acc, q) => acc + q.points, 0);
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const hintsUsed = answers.filter((a) => a.usedHint).length;
    const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;

    const rank = useMemo(() => RANK_LEVELS.find((r) => percentage >= r.min) ?? RANK_LEVELS[3], [percentage]);

    return (
        <div className="mrp-result-wrapper">
            {/* Title */}
            <div className="mrp-result-header">
                <h2 className="mrp-result-title">Relatório de Desempenho</h2>
                <p className="mrp-result-subtitle">Treinamento concluído — confira seu resultado abaixo.</p>
            </div>

            {/* Rank Banner */}
            <div
                className="mrp-rank-banner"
                style={{ background: rank.bg, borderColor: rank.border }}
            >
                <Trophy size={28} style={{ color: rank.color, flexShrink: 0 }} />
                <div>
                    <p className="mrp-rank-eyebrow">Ranking IA</p>
                    <p className="mrp-rank-label" style={{ color: rank.color }}>{rank.label}</p>
                </div>
                <div className="mrp-rank-pct" style={{ color: rank.color }}>
                    {percentage}%
                </div>
            </div>

            {/* Stats Grid */}
            <div className="mrp-stats-grid">
                <div className="mrp-stat-card">
                    <Target size={20} className="mrp-stat-icon brand" />
                    <p className="mrp-stat-value brand">{totalScore}</p>
                    <p className="mrp-stat-label">Score Total</p>
                    <p className="mrp-stat-sub">de {maxPossible} pts</p>
                </div>
                <div className="mrp-stat-card">
                    <CheckCircle2 size={20} className="mrp-stat-icon action" />
                    <p className="mrp-stat-value action">{correctCount}</p>
                    <p className="mrp-stat-label">Corretas</p>
                    <p className="mrp-stat-sub">de {questions.length} questões</p>
                </div>
                <div className="mrp-stat-card">
                    <Lightbulb size={20} className="mrp-stat-icon hint" />
                    <p className="mrp-stat-value hint">{hintsUsed}</p>
                    <p className="mrp-stat-label">Dicas usadas</p>
                    <p className="mrp-stat-sub">com penalidade</p>
                </div>

                {/* Gamificação */}
                {rewards && (
                    <>
                        <div className="mrp-stat-card" style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.2)' }}>
                            <div style={{ color: '#d97706', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>COINS</div>
                            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '2rem', fontWeight: 900, color: '#d97706', margin: 0 }}>+{rewards.coinsGain}</p>
                            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#92400e', margin: 0 }}>Destrave Coins</p>
                        </div>
                        <div className="mrp-stat-card" style={{ background: 'rgba(79,70,229,0.05)', borderColor: 'rgba(79,70,229,0.2)' }}>
                            <div style={{ color: '#4f46e5', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>XP</div>
                            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '2rem', fontWeight: 900, color: '#4f46e5', margin: 0 }}>+{rewards.xpGain}</p>
                            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#3730a3', margin: 0 }}>Experiência</p>
                        </div>
                    </>
                )}
            </div>

            {/* Detailed Review */}
            <div className="mrp-review-section">
                <h3 className="mrp-review-title">Revisão Detalhada</h3>
                <div className="mrp-review-list">
                    {questions.map((q, idx) => {
                        const ans = answers.find((a) => a.questionId === q.id);
                        return (
                            <div key={idx} className={`mrp-review-item ${ans?.isCorrect ? 'correct' : 'incorrect'}`}>
                                <div className={`mrp-review-num ${ans?.isCorrect ? 'correct' : 'incorrect'}`}>
                                    {ans?.isCorrect
                                        ? <CheckCircle2 size={16} />
                                        : <XCircle size={16} />}
                                </div>
                                <div className="mrp-review-content">
                                    <p className="mrp-review-scenario">{q.scenario}</p>
                                    <div className="mrp-review-meta">
                                        <span className="mrp-review-tag">{q.level}</span>
                                        <span>{ans?.scoreEarned ?? 0} pts</span>
                                        {ans?.usedHint && <span className="mrp-review-hint-badge">Dica</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            {!hideActions ? (
                <div className="mrp-result-actions">
                    <button onClick={onRestart} className="mrp-restart-btn flex-1">
                        <RotateCcw size={16} />
                        Novo Treinamento
                    </button>
                    {onSave && (
                        <button 
                            onClick={() => onSave(initialTitle || 'Novo Role Play')} 
                            disabled={isSaving}
                            className="mrp-save-btn flex-1"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Salvar na Central
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-border p-8 text-center shadow-lg" style={{ width: '100%', marginTop: '1rem' }}>
                    <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} className="text-brand" />
                    </div>
                    <h1 className="font-outfit text-2xl font-extrabold text-slate-dark mb-2">Role Play Concluído! 🎭</h1>
                    <p className="text-slate-mid mb-2 px-4">
                        Você atingiu <strong className="text-slate-dark">{percentage}%</strong> de desempenho — Rank: <strong className="text-slate-dark">{rank.label}</strong>
                    </p>
                    {onFinalize && !rewards ? (
                        <FinalizeMissionButton onFinalize={onFinalize} />
                    ) : (
                        <>
                            <p className="text-slate-mid mb-5 px-4 text-sm">Gostou do desafio? Clique abaixo para contar como foi para o Sensei!</p>
                            {senseiWhatsapp ? (
                                <a
                                    href={`/api/contact/sensei?teacherId=${senseiWhatsapp}&text=${encodeURIComponent(`Oi Sensei! Acabei de completar o Role Play e atingi ${percentage}% de desempenho (${rank.label}). Quero saber mais sobre as aulas! 🎭`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-outfit font-bold text-white text-base transition-all hover:-translate-y-0.5"
                                    style={{ background: '#25D366', boxShadow: '0 4px 14px rgba(37,211,102,0.35)', textDecoration: 'none' }}
                                >
                                    💬 Falar com o Sensei no WhatsApp
                                </a>
                            ) : (
                                <button 
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-outfit font-bold text-white text-base transition-all bg-brand hover:-translate-y-0.5"
                                >
                                    Voltar ao Dashboard
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}


            <style>{`
        .mrp-result-wrapper { display: flex; flex-direction: column; gap: 1.5rem; max-width: 680px; width: 100%; margin: 0 auto; }
        .mrp-result-header { display: flex; flex-direction: column; gap: 0.25rem; }
        .mrp-result-title {
          font-family: var(--font-outfit); font-size: 1.75rem; font-weight: 900;
          color: var(--color-slate-dark); margin: 0;
        }
        .mrp-result-subtitle { font-family: var(--font-inter); font-size: 0.9rem; color: var(--color-slate-mid); margin: 0; }
        .mrp-rank-banner {
          display: flex; align-items: center; gap: 1rem;
          border: 1.5px solid; border-radius: 1rem; padding: 1.25rem 1.5rem;
        }
        .mrp-rank-eyebrow { font-family: var(--font-inter); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-slate-mid); margin: 0; }
        .mrp-rank-label { font-family: var(--font-outfit); font-size: 1.375rem; font-weight: 900; margin: 0.125rem 0 0; }
        .mrp-rank-pct { font-family: var(--font-outfit); font-size: 2.5rem; font-weight: 900; margin-left: auto; }
        @media (max-width: 500px) {
          .mrp-rank-banner { padding: 1rem; gap: 0.75rem; }
          .mrp-rank-label { font-size: 1.1rem; }
          .mrp-rank-pct { font-size: 1.75rem; }
        }
        .mrp-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.875rem; }
        @media (max-width: 500px) { .mrp-stats-grid { grid-template-columns: 1fr; } }
        .mrp-stat-card {
          background: white; border: 1.5px solid var(--color-slate-border);
          border-radius: 1rem; padding: 1.125rem 1rem; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
        }
        .mrp-stat-icon { margin-bottom: 0.25rem; }
        .mrp-stat-icon.brand { color: var(--color-brand); }
        .mrp-stat-icon.action { color: var(--color-action); }
        .mrp-stat-icon.hint { color: #d97706; }
        .mrp-stat-value { font-family: var(--font-outfit); font-size: 2rem; font-weight: 900; margin: 0; }
        .mrp-stat-value.brand { color: var(--color-brand); }
        .mrp-stat-value.action { color: var(--color-action); }
        .mrp-stat-value.hint { color: #d97706; }
        .mrp-stat-label { font-family: var(--font-inter); font-size: 0.8rem; font-weight: 700; color: var(--color-slate-dark); margin: 0; }
        .mrp-stat-sub { font-family: var(--font-inter); font-size: 0.72rem; color: var(--color-slate-mid); margin: 0; }
        .mrp-review-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .mrp-review-title { font-family: var(--font-outfit); font-size: 1rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
        .mrp-review-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .mrp-review-item {
          display: flex; align-items: flex-start; gap: 0.75rem;
          padding: 0.75rem 1rem; border-radius: 0.75rem;
          border: 1.5px solid;
          transition: transform 100ms;
        }
        .mrp-review-item:hover { transform: translateX(2px); }
        .mrp-review-item.correct { background: rgba(34,197,94,0.04); border-color: rgba(34,197,94,0.2); }
        .mrp-review-item.incorrect { background: rgba(239,68,68,0.04); border-color: rgba(239,68,68,0.15); }
        .mrp-review-num { width: 28px; height: 28px; border-radius: 0.5rem; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .mrp-review-num.correct { background: rgba(34,197,94,0.15); color: #16a34a; }
        .mrp-review-num.incorrect { background: rgba(239,68,68,0.15); color: #dc2626; }
        .mrp-review-content { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; min-width: 0; }
        .mrp-review-scenario { font-family: var(--font-inter); font-size: 0.875rem; color: var(--color-slate-dark); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mrp-review-meta { display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-inter); font-size: 0.72rem; color: var(--color-slate-mid); }
        .mrp-review-tag {
          background: rgba(88,49,126,0.1); color: var(--color-brand);
          border-radius: 999px; padding: 0.1rem 0.45rem;
          font-weight: 700; font-size: 0.65rem; letter-spacing: 0.04em;
        }
        .mrp-review-hint-badge {
          background: rgba(255,127,50,0.1); color: var(--color-action);
          border-radius: 999px; padding: 0.1rem 0.45rem;
          font-weight: 700; font-size: 0.65rem;
        }
        .mrp-result-actions { display: flex; gap: 1rem; width: 100%; }
        .mrp-restart-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: var(--color-brand); color: white;
          border: none; border-radius: 0.875rem;
          font-family: var(--font-outfit); font-size: 1rem; font-weight: 800;
          cursor: pointer; transition: background 150ms, box-shadow 150ms, transform 100ms;
          box-shadow: 0 4px 16px rgba(88,49,126,0.25);
        }
        .mrp-restart-btn:hover { background: #4C2A6D; box-shadow: 0 6px 24px rgba(88,49,126,0.35); transform: translateY(-1px); }
        
        .mrp-save-btn {
            display: flex; align-items: center; justify-content: center; gap: 0.5rem;
            padding: 0.875rem 1.5rem;
            background: white; border: 2px solid var(--color-brand); color: var(--color-brand);
            border-radius: 0.875rem;
            font-family: var(--font-outfit); font-size: 1rem; font-weight: 800;
            cursor: pointer; transition: all 150ms;
        }
        .mrp-save-btn:hover:not(:disabled) { background: var(--color-ice); transform: translateY(-1px); }
        .mrp-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
        </div>
    );
};
