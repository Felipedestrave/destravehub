import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ConfigScreen } from './ConfigScreen';
import { GameScreen } from './GameScreen';
import { ResultScreen } from './ResultScreen';
import type { MrpConfig, MrpQuestion, MrpUserAnswer, MrpStatus } from '../../types/mrp';

interface MrpAppProps {
    userToken?: string;
}

export const MrpApp: React.FC<MrpAppProps> = ({ userToken }) => {
    const [status, setStatus] = useState<MrpStatus>('CONFIG');
    const [config, setConfig] = useState<MrpConfig | null>(null);
    const [questions, setQuestions] = useState<MrpQuestion[]>([]);
    const [answers, setAnswers] = useState<MrpUserAnswer[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
            setStatus('PLAYING');
        } catch (err: any) {
            setError(err.message ?? 'Erro inesperado.');
            setStatus('CONFIG');
        } finally {
            setIsLoading(false);
        }
    };

    const handleComplete = async (userAnswers: MrpUserAnswer[]) => {
        setAnswers(userAnswers);
        setStatus('RESULTS');

        // Persist result (non-blocking)
        if (userToken && config) {
            const totalScore = userAnswers.reduce((acc, a) => acc + a.scoreEarned, 0);
            const maxPossible = questions.reduce((acc, q) => acc + q.points, 0);
            const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
            const rankLabel = percentage >= 90 ? 'Sensei' : percentage >= 70 ? 'Avançado' : percentage >= 50 ? 'Esforçado' : 'Iniciante';

            fetch('/api/mrp/save-result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
                body: JSON.stringify({ config, answers: userAnswers, totalScore, percentage, rankLabel }),
            }).catch(() => { /* non-blocking */ });
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
            <div className="mrp-loading-screen">
                <Loader2 size={40} className="mrp-loading-spin" />
                <p className="mrp-loading-label">IA gerando cenários de role play...</p>
                <p className="mrp-loading-sub">Isso pode levar alguns segundos</p>
            </div>
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
        <>
            {status === 'CONFIG' && <ConfigScreen onSubmit={handleGenerate} isLoading={isLoading} />}
            {status === 'PLAYING' && config && (
                <GameScreen questions={questions} mode={config.mode} onComplete={handleComplete} />
            )}
            {status === 'RESULTS' && config && (
                <ResultScreen config={config} questions={questions} answers={answers} onRestart={handleRestart} />
            )}

            <style>{`
        .mrp-loading-screen {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 0.75rem; padding: 5rem 1rem; text-align: center;
        }
        .mrp-loading-spin {
          color: var(--color-brand);
          animation: mrp-spin 0.8s linear infinite;
        }
        @keyframes mrp-spin { to { transform: rotate(360deg); } }
        .mrp-loading-label { font-family: var(--font-outfit); font-size: 1.1rem; font-weight: 700; color: var(--color-slate-dark); margin: 0; }
        .mrp-loading-sub { font-family: var(--font-inter); font-size: 0.85rem; color: var(--color-slate-mid); margin: 0; }
        .mrp-error-screen {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 0.75rem; padding: 4rem 1rem; text-align: center; max-width: 400px; margin: 0 auto;
        }
        .mrp-error-icon { color: var(--color-action); }
        .mrp-error-title { font-family: var(--font-outfit); font-size: 1.25rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
        .mrp-error-msg { font-family: var(--font-inter); font-size: 0.875rem; color: var(--color-slate-mid); margin: 0; }
        .mrp-error-btn {
          margin-top: 0.5rem; padding: 0.7rem 1.75rem;
          border: 1.5px solid var(--color-slate-border); border-radius: 0.75rem;
          background: none; font-family: var(--font-outfit); font-weight: 700; font-size: 0.9rem;
          color: var(--color-slate-dark); cursor: pointer; transition: background 150ms;
        }
        .mrp-error-btn:hover { background: var(--color-ice); }
      `}</style>
        </>
    );
};
