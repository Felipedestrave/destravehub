import React, { useState } from 'react';
import { Rotate3d, CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import type { Flashcard, SrsDifficulty } from '../../types/flashcards';

interface CardViewerProps {
    cards: Flashcard[];
    onFinish?: () => void;
}

export const CardViewer: React.FC<CardViewerProps> = ({ cards, onFinish }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [viewedCount, setViewedCount] = useState(0);

    const currentCard = cards[currentIndex];

    const handleNext = (difficulty: SrsDifficulty) => {
        setIsFlipped(false);
        setTimeout(() => {
            if (currentIndex + 1 < cards.length) {
                setCurrentIndex(v => v + 1);
                setViewedCount(v => v + 1);
            } else {
                onFinish?.();
            }
        }, 200);
    };

    if (!currentCard) return null;

    return (
        <div className="card-viewer-host">
            {/* Progress Bar */}
            <div className="viewer-progress-header">
                <span className="p-text">Card {currentIndex + 1} de {cards.length}</span>
                <div className="p-track">
                    <div className="p-fill" style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} />
                </div>
            </div>

            <div className={`flip-card ${isFlipped ? 'is-flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                <div className="flip-card-inner">
                    {/* FRENTE */}
                    <div className="flip-card-front">
                        <div className="card-glass-effect" />
                        <span className="card-side-tag">Japonês</span>
                        <div className="card-content-main">
                            <h1 className="kanji-text">{currentCard.front}</h1>
                            <p className="reading-text">{isFlipped ? '' : 'Clique para ver a leitura'}</p>
                        </div>
                        <div className="card-instruction">
                            <Rotate3d size={16} /> Toque para virar
                        </div>
                    </div>

                    {/* VERSO */}
                    <div className="flip-card-back">
                        <div className="card-glass-effect" />
                        <span className="card-side-tag back">Significado</span>

                        <div className="card-back-main">
                            <div className="back-reading">{currentCard.reading}</div>
                            <h2 className="back-meaning">{currentCard.back}</h2>

                            <div className="example-box">
                                <span className="ex-label">Exemplo:</span>
                                <p className="ex-jp">{currentCard.example}</p>
                                <p className="ex-pt">{currentCard.exampleTranslation}</p>
                            </div>
                        </div>

                        <div className="card-instruction">
                            Clique para ver a frente
                        </div>
                    </div>
                </div>
            </div>

            {/* SRS Actions (Apenas mostrado se estiver virado) */}
            <div className={`srs-actions ${isFlipped ? 'visible' : ''}`}>
                <p className="srs-query">Como foi lembrar deste card?</p>
                <div className="srs-buttons">
                    <button onClick={(e) => { e.stopPropagation(); handleNext('hard'); }} className="srs-btn hard">
                        <XCircle size={18} /> Difícil
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleNext('medium'); }} className="srs-btn medium">
                        <HelpCircle size={18} /> Médio
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleNext('easy'); }} className="srs-btn easy">
                        <CheckCircle2 size={18} /> Fácil
                    </button>
                </div>
            </div>

            <style>{`
        .card-viewer-host {
          max-width: 500px; margin: 0 auto; width: 100%;
          display: flex; flex-direction: column; gap: 2rem; align-items: center;
        }
        .viewer-progress-header { width: 100%; display: flex; flex-direction: column; gap: 0.5rem; }
        .p-text { font-family: var(--font-inter); font-size: 0.8rem; font-weight: 700; color: var(--color-slate-mid); text-transform: uppercase; }
        .p-track { height: 6px; background: var(--color-slate-border); border-radius: 999px; overflow: hidden; }
        .p-fill { height: 100%; background: var(--color-brand); border-radius: 999px; transition: width 0.3s ease; }

        .flip-card {
          background-color: transparent; width: 100%; height: 380px;
          perspective: 1000px; cursor: pointer;
        }
        .flip-card-inner {
          position: relative; width: 100%; height: 100%; text-align: center;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .flip-card.is-flipped .flip-card-inner { transform: rotateY(180deg); }

        .flip-card-front, .flip-card-back {
          position: absolute; width: 100%; height: 100%;
          -webkit-backface-visibility: hidden; backface-visibility: hidden;
          border-radius: 2rem; border: 2px solid var(--color-slate-border);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 2rem; box-sizing: border-box; overflow: hidden;
          box-shadow: 0 15px 35px rgba(30,41,59,0.1);
        }

        .flip-card-front { background-color: white; color: var(--color-slate-dark); }
        .flip-card-back { background-color: var(--color-ice); transform: rotateY(180deg); }

        .card-glass-effect {
          position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%);
          pointer-events: none;
        }

        .card-side-tag {
          position: absolute; top: 1.5rem; left: 1.5rem;
          font-family: var(--font-outfit); font-size: 0.7rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-slate-mid);
        }
        .card-side-tag.back { color: var(--color-brand); }

        .kanji-text { font-family: 'Noto Sans JP', sans-serif; font-size: 3.5rem; font-weight: 800; margin: 0; }
        .reading-text { font-size: 0.9rem; color: var(--color-slate-mid); margin-top: 1rem; opacity: 0.6; }

        .back-reading { font-family: var(--font-inter); font-size: 1.1rem; color: var(--color-slate-mid); margin-bottom: 0.25rem; }
        .back-meaning { font-family: var(--font-outfit); font-size: 2rem; font-weight: 800; color: var(--color-brand); margin: 0 0 1.5rem; }

        .example-box {
          background: white; border-radius: 1rem; padding: 1.25rem; text-align: left; width: 100%;
          border: 1px solid var(--color-slate-border);
        }
        .ex-label { font-size: 0.65rem; font-weight: 800; color: var(--color-brand); text-transform: uppercase; margin-bottom: 0.5rem; display: block; }
        .ex-jp { font-size: 0.95rem; color: var(--color-slate-dark); margin: 0; line-height: 1.5; font-weight: 500; }
        .ex-pt { font-size: 0.85rem; color: var(--color-slate-mid); margin: 0.25rem 0 0; }

        .card-instruction {
          position: absolute; bottom: 1.5rem; color: var(--color-slate-mid);
          font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;
        }

        .srs-actions {
          width: 100%; display: flex; flex-direction: column; align-items: center; gap: 1rem;
          opacity: 0; transform: translateY(10px); pointer-events: none; transition: all 0.4s ease;
        }
        .srs-actions.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
        
        .srs-query { font-size: 0.95rem; font-weight: 700; color: var(--color-slate-dark); margin: 0; }
        .srs-buttons { display: flex; gap: 0.75rem; width: 100%; }
        .srs-btn {
          flex: 1; padding: 0.875rem; border-radius: 1rem; border: 1.5px solid var(--color-slate-border);
          background: white; font-family: var(--font-outfit); font-weight: 700; font-size: 0.85rem;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: all 150ms;
        }
        .srs-btn.hard:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }
        .srs-btn.medium:hover { border-color: #f59e0b; color: #f59e0b; background: #fffbeb; }
        .srs-btn.easy:hover { border-color: #22c55e; color: #22c55e; background: #f0fdf4; }
      `}</style>
        </div>
    );
};
