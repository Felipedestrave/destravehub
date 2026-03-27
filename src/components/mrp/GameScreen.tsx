import React, { useState, useMemo } from 'react';
import { Lightbulb, ChevronRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { QuizMode, type MrpQuestion, type MrpUserAnswer } from '../../types/mrp';

interface GameScreenProps {
    questions: MrpQuestion[];
    mode: QuizMode;
    onComplete: (answers: MrpUserAnswer[]) => void;
}

function normalizeForComparison(str: string): string {
    return str.replace(/[\s\u3000\u3001\u3002,.?!！？]/g, '').trim();
}

export const GameScreen: React.FC<GameScreenProps> = ({ questions, mode, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState<MrpUserAnswer[]>([]);
    const [showHint, setShowHint] = useState(false);
    const [currentInput, setCurrentInput] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

    const currentQuestion = questions[currentIndex];
    const maxScore = useMemo(() => questions.reduce((acc, q) => acc + q.points, 0), [questions]);
    const progress = ((currentIndex) / questions.length) * 100;
    const pointsThisQuestion = showHint ? Math.floor(currentQuestion.points / 2) : currentQuestion.points;

    const shuffledOptions = useMemo(() => {
        if (!currentQuestion?.options) return [];
        return [...currentQuestion.options].sort(() => Math.random() - 0.5);
    }, [currentQuestion]);

    const handleNext = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex((i) => i + 1);
            setShowHint(false);
            setCurrentInput('');
            setFeedback(null);
        } else {
            onComplete(userAnswers);
        }
    };

    const submitAnswer = async (answer: string) => {
        if (isVerifying || feedback) return;
        setIsVerifying(true);

        let isCorrect = false;
        let feedbackText = '';
        let pointsEarned = 0;

        if (mode === QuizMode.MULTIPLE_CHOICE) {
            isCorrect = normalizeForComparison(answer) === normalizeForComparison(currentQuestion.correctAnswer);
            feedbackText = isCorrect
                ? `✓ Correto! ${currentQuestion.explanation}`
                : `Incorreto. A resposta era: ${currentQuestion.correctAnswer}. ${currentQuestion.explanation}`;
            pointsEarned = isCorrect ? pointsThisQuestion : 0;
            setScore((p) => p + pointsEarned);
            setFeedback({ isCorrect, text: feedbackText });
            setUserAnswers((prev) => [
                ...prev,
                { questionId: currentQuestion.id, answer, usedHint: showHint, isCorrect, scoreEarned: pointsEarned },
            ]);
            setIsVerifying(false);
        } else {
            try {
                const res = await fetch('/api/mrp/validate-answer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: currentQuestion, userAnswer: answer }),
                });
                const validation = await res.json();
                isCorrect = validation.isCorrect;
                feedbackText = isCorrect
                    ? `✓ Correto! ${validation.feedback}`
                    : `Incorreto. ${validation.feedback}\n\nResposta de referência: ${currentQuestion.correctAnswer}`;
                pointsEarned = isCorrect ? pointsThisQuestion : 0;
                setScore((p) => p + pointsEarned);
                setFeedback({ isCorrect, text: feedbackText });
                setUserAnswers((prev) => [
                    ...prev,
                    { questionId: currentQuestion.id, answer, usedHint: showHint, isCorrect, scoreEarned: pointsEarned, feedback: validation.feedback },
                ]);
            } catch {
                setFeedback({ isCorrect: false, text: 'Erro ao avaliar resposta. Tente novamente.' });
            }
            setIsVerifying(false);
        }
    };

    return (
        <div className="mrp-game-wrapper">
            {/* Progress Header */}
            <div className="mrp-game-header">
                <div className="mrp-game-progress-meta">
                    <span className="mrp-game-progress-label">
                        Questão <strong>{currentIndex + 1}</strong> de {questions.length}
                    </span>
                    <span className="mrp-level-tag">{currentQuestion.level}</span>
                </div>
                <div className="mrp-game-score-display">
                    <span className="mrp-game-score-num">{score}</span>
                    <span className="mrp-game-score-max">/ {maxScore} pts</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mrp-progress-bar-track">
                <div className="mrp-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Card */}
            <div className="mrp-card">
                {/* Scenario */}
                <div className="mrp-scenario-block">
                    <div className="mrp-scenario-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <div>
                        <span className="mrp-scenario-eyebrow">Cenário</span>
                        <p className="mrp-scenario-text">{currentQuestion.scenario}</p>
                    </div>
                </div>

                {/* Task */}
                <div className="mrp-task-block">
                    <div className="mrp-task-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                            <rect x="9" y="3" width="6" height="4" rx="1" />
                            <line x1="9" y1="12" x2="15" y2="12" />
                            <line x1="9" y1="16" x2="12" y2="16" />
                        </svg>
                    </div>
                    <div>
                        <span className="mrp-task-eyebrow">Tarefa</span>
                        <p className="mrp-task-text">{currentQuestion.task}</p>
                    </div>
                </div>

                {/* Answer zone */}
                {!feedback && (
                    <div className="mrp-answer-zone">
                        {mode === QuizMode.MULTIPLE_CHOICE ? (
                            <div className="mrp-options-grid-game">
                                {shuffledOptions.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => submitAnswer(opt)}
                                        disabled={isVerifying}
                                        className="mrp-option-btn"
                                    >
                                        <span className="mrp-option-letter">{String.fromCharCode(65 + i)}</span>
                                        <span className="mrp-option-text">{opt}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="mrp-discursive-zone">
                                <textarea
                                    value={currentInput}
                                    onChange={(e) => setCurrentInput(e.target.value)}
                                    disabled={isVerifying}
                                    placeholder="Digite sua resposta em japonês..."
                                    className="mrp-disc-textarea"
                                    rows={3}
                                />
                                <button
                                    onClick={() => submitAnswer(currentInput)}
                                    disabled={isVerifying || !currentInput.trim()}
                                    className="mrp-disc-btn"
                                >
                                    {isVerifying ? (
                                        <><Loader2 size={16} className="mrp-spin-inline" /> Avaliando...</>
                                    ) : (
                                        <>Enviar Resposta <ChevronRight size={16} /></>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Hint */}
                        <div className="mrp-hint-area">
                            {!showHint ? (
                                <button onClick={() => setShowHint(true)} className="mrp-hint-trigger">
                                    <Lightbulb size={14} />
                                    Usar Dica <span className="mrp-hint-penalty">(−50% dos pontos)</span>
                                </button>
                            ) : (
                                <div className="mrp-hint-box">
                                    <Lightbulb size={16} className="mrp-hint-icon" />
                                    <p className="mrp-hint-text">{currentQuestion.hint}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Feedback */}
                {feedback && (
                    <div className={`mrp-feedback-block ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
                        <div className="mrp-feedback-header">
                            {feedback.isCorrect
                                ? <CheckCircle2 size={20} className="mrp-feedback-icon correct" />
                                : <XCircle size={20} className="mrp-feedback-icon incorrect" />}
                            <span className={`mrp-feedback-label ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
                                {feedback.isCorrect ? 'Correto!' : 'Incorreto'}
                            </span>
                            <span className="mrp-feedback-points">
                                {feedback.isCorrect ? `+${pointsThisQuestion} pts` : '0 pts'}
                            </span>
                        </div>
                        <p className="mrp-feedback-text">{feedback.text}</p>
                        <button onClick={handleNext} className="mrp-next-btn">
                            {currentIndex + 1 < questions.length ? 'Próxima Questão →' : 'Ver Resultado →'}
                        </button>
                    </div>
                )}
            </div>

            {/* Footer meta */}
            <div className="mrp-game-footer">
                <span>Valendo: <strong>{pointsThisQuestion} pts</strong></span>
                <span>Level: <strong>{currentQuestion.level}</strong></span>
            </div>

            <style>{`
        .mrp-game-wrapper { display: flex; flex-direction: column; gap: 1rem; max-width: 700px; width: 100%; margin: 0 auto; }
        .mrp-game-header { display: flex; align-items: center; justify-content: space-between; }
        .mrp-game-progress-meta { display: flex; align-items: center; gap: 0.625rem; }
        .mrp-game-progress-label { font-family: var(--font-inter); font-size: 0.85rem; color: var(--color-slate-mid); }
        .mrp-game-progress-label strong { color: var(--color-slate-dark); }
        .mrp-level-tag {
          background: rgba(88,49,126,0.1);
          color: var(--color-brand);
          border: 1px solid rgba(88,49,126,0.2);
          border-radius: 999px;
          padding: 0.15rem 0.6rem;
          font-family: var(--font-outfit);
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.06em;
        }
        .mrp-game-score-display { display: flex; align-items: baseline; gap: 0.25rem; }
        .mrp-game-score-num { font-family: var(--font-outfit); font-size: 1.75rem; font-weight: 900; color: var(--color-action); }
        .mrp-game-score-max { font-family: var(--font-inter); font-size: 0.8rem; color: var(--color-slate-mid); }
        .mrp-progress-bar-track {
          height: 5px;
          background: var(--color-slate-border);
          border-radius: 999px;
          overflow: hidden;
        }
        .mrp-progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-brand), var(--color-action));
          border-radius: 999px;
          transition: width 0.4s ease;
        }
        .mrp-card {
          background: white;
          border: 1.5px solid var(--color-slate-border);
          border-radius: 1.25rem;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: 0 2px 16px rgba(30,41,59,0.06);
        }
        @media (max-width: 600px) {
          .mrp-card { padding: 1rem; gap: 1rem; }
          .mrp-game-score-num { font-size: 1.5rem; }
          .mrp-scenario-text, .mrp-task-text { font-size: 0.95rem; }
        }
        .mrp-scenario-block, .mrp-task-block { display: flex; align-items: flex-start; gap: 0.875rem; }
        .mrp-scenario-icon {
          width: 40px; height: 40px; border-radius: 0.75rem; flex-shrink: 0;
          background: rgba(88,49,126,0.08); color: var(--color-brand);
          display: flex; align-items: center; justify-content: center;
        }
        .mrp-task-icon {
          width: 40px; height: 40px; border-radius: 0.75rem; flex-shrink: 0;
          background: rgba(255,127,50,0.08); color: var(--color-action);
          display: flex; align-items: center; justify-content: center;
        }
        .mrp-scenario-eyebrow, .mrp-task-eyebrow {
          display: block;
          font-family: var(--font-inter);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }
        .mrp-scenario-eyebrow { color: var(--color-brand); }
        .mrp-task-eyebrow { color: var(--color-action); }
        .mrp-scenario-text, .mrp-task-text {
          font-family: var(--font-inter);
          font-size: 1rem;
          color: var(--color-slate-dark);
          margin: 0;
          line-height: 1.55;
        }
        .mrp-task-text { font-style: italic; }
        .mrp-answer-zone { display: flex; flex-direction: column; gap: 1rem; }
        .mrp-options-grid-game { display: grid; grid-template-columns: 1fr 1fr; gap: 0.625rem; }
        @media (max-width: 500px) { .mrp-options-grid-game { grid-template-columns: 1fr; } }
        .mrp-option-btn {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: var(--color-ice);
          border: 1.5px solid var(--color-slate-border);
          border-radius: 0.875rem;
          cursor: pointer;
          text-align: left;
          transition: border-color 150ms, background 150ms, transform 100ms;
        }
        .mrp-option-btn:hover:not(:disabled) {
          border-color: var(--color-brand);
          background: rgba(88,49,126,0.04);
          transform: translateY(-1px);
        }
        .mrp-option-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .mrp-option-letter {
          width: 30px; height: 30px; border-radius: 0.5rem; flex-shrink: 0;
          background: white; border: 1.5px solid var(--color-slate-border);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-outfit); font-size: 0.75rem; font-weight: 800;
          color: var(--color-slate-mid);
        }
        .mrp-option-text { font-family: var(--font-inter); font-size: 0.95rem; color: var(--color-slate-dark); line-height: 1.4; }
        .mrp-discursive-zone { display: flex; flex-direction: column; gap: 0.75rem; }
        .mrp-disc-textarea {
          width: 100%; box-sizing: border-box;
          border: 1.5px solid var(--color-slate-border); border-radius: 0.75rem;
          padding: 0.875rem 1rem;
          font-family: var(--font-inter); font-size: 1rem; color: var(--color-slate-dark);
          background: var(--color-ice);
          resize: vertical; outline: none;
          transition: border-color 150ms, box-shadow 150ms;
        }
        .mrp-disc-textarea:focus { border-color: var(--color-brand); box-shadow: 0 0 0 3px rgba(88,49,126,0.12); }
        .mrp-disc-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          padding: 0.75rem 1.5rem;
          background: var(--color-brand); color: white;
          border: none; border-radius: 0.75rem;
          font-family: var(--font-outfit); font-size: 0.95rem; font-weight: 700;
          cursor: pointer; transition: background 150ms;
        }
        .mrp-disc-btn:hover:not(:disabled) { background: #4C2A6D; }
        .mrp-disc-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .mrp-spin-inline { animation: mrp-spin 0.7s linear infinite; }
        @keyframes mrp-spin { to { transform: rotate(360deg); } }
        .mrp-hint-area { display: flex; justify-content: center; }
        .mrp-hint-trigger {
          display: flex; align-items: center; gap: 0.375rem;
          background: none; border: none; cursor: pointer;
          font-family: var(--font-inter); font-size: 0.8rem; color: var(--color-slate-mid);
          transition: color 150ms;
        }
        .mrp-hint-trigger:hover { color: var(--color-brand); }
        .mrp-hint-penalty { font-size: 0.72rem; opacity: 0.7; }
        .mrp-hint-box {
          display: flex; align-items: flex-start; gap: 0.625rem;
          background: rgba(255,127,50,0.06); border: 1px solid rgba(255,127,50,0.2);
          border-radius: 0.75rem; padding: 0.75rem 1rem; width: 100%;
        }
        .mrp-hint-icon { color: var(--color-action); flex-shrink: 0; margin-top: 1px; }
        .mrp-hint-text { font-family: var(--font-inter); font-size: 0.875rem; color: var(--color-slate-dark); margin: 0; font-style: italic; }
        .mrp-feedback-block {
          border-radius: 1rem; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;
          animation: mrp-slide-up 0.35s ease-out;
        }
        .mrp-feedback-block.correct { background: rgba(34,197,94,0.06); border: 1.5px solid rgba(34,197,94,0.25); }
        .mrp-feedback-block.incorrect { background: rgba(239,68,68,0.06); border: 1.5px solid rgba(239,68,68,0.25); }
        @keyframes mrp-slide-up { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .mrp-feedback-header { display: flex; align-items: center; gap: 0.5rem; }
        .mrp-feedback-icon.correct { color: #22c55e; }
        .mrp-feedback-icon.incorrect { color: #ef4444; }
        .mrp-feedback-label { font-family: var(--font-outfit); font-size: 1rem; font-weight: 800; }
        .mrp-feedback-label.correct { color: #16a34a; }
        .mrp-feedback-label.incorrect { color: #dc2626; }
        .mrp-feedback-points { margin-left: auto; font-family: var(--font-outfit); font-size: 0.85rem; font-weight: 700; color: var(--color-action); }
        .mrp-feedback-text { font-family: var(--font-inter); font-size: 0.875rem; color: var(--color-slate-dark); margin: 0; line-height: 1.6; white-space: pre-line; }
        .mrp-next-btn {
          padding: 0.75rem 1.5rem;
          background: var(--color-slate-dark); color: white;
          border: none; border-radius: 0.75rem;
          font-family: var(--font-outfit); font-size: 0.9rem; font-weight: 700;
          cursor: pointer; transition: background 150ms;
        }
        .mrp-next-btn:hover { background: #0f172a; }
        .mrp-game-footer {
          display: flex; justify-content: space-between;
          font-family: var(--font-inter); font-size: 0.75rem; color: var(--color-slate-mid);
          padding: 0 0.25rem;
        }
        .mrp-game-footer strong { color: var(--color-slate-dark); }
      `}</style>
        </div>
    );
};
