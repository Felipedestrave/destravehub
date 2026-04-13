import React, { useState, useEffect, useCallback } from 'react';
import { Rotate3d, CheckCircle2, XCircle, Clock, Trophy, ArrowRight, Target, Zap, Rocket, AlertCircle } from 'lucide-react';
import type { Flashcard, SrsDifficulty } from '../../types/flashcards';
import { BuddyView, type BuddyState } from '../buddy/BuddyView';
import { supabase } from '../../lib/supabase';
import { STORE_ITEMS } from '../../lib/store';
import { getBuddyPhrase } from '../../lib/buddy-phrases';
import { MaterialsDrawer } from '../materials/MaterialsDrawer';

interface CardViewerProps {
    cards: Flashcard[];
    onFinish?: (stats: { 
        score: number, 
        total: number, 
        history: any[], 
        timeSpent: number, 
        targetTime: number 
    }) => void;
    senseiWhatsapp?: string | null;
    activityId?: string;
}

export const CardViewer: React.FC<CardViewerProps> = ({ cards, onFinish, senseiWhatsapp, activityId }) => {
    // ESTADOS
    const [status, setStatus] = useState<'SETUP' | 'PLAYING' | 'SUMMARY'>('SETUP');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [history, setHistory] = useState<any[]>([]);
    const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
    
    // BUDDY COMPANION
    const [buddyState, setBuddyState] = useState<BuddyState>('idle');
    const [buddyMessage, setBuddyMessage] = useState<string | null>(null);
    const [buddyAvatarUrl, setBuddyAvatarUrl] = useState<string>('/assets/avatars/tanuki-novato.png');
    const [buddyAvatarId, setBuddyAvatarId] = useState<string | null>(null);

    // Busca o avatar equipado do aluno no perfil
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

    const triggerBuddy = (state: BuddyState, msg?: string) => {
        setBuddyState(state);
        if (msg) setBuddyMessage(msg);
        setTimeout(() => {
            setBuddyState('idle');
            setBuddyMessage(null);
        }, 2000);
    };

    const [targetScore, setTargetScore] = useState(Math.ceil(cards.length * 0.75)); 
    const [targetTimeStr, setTargetTimeStr] = useState('02:00');

    const currentCard = cards[currentIndex];

    // Cronômetro
    useEffect(() => {
        let interval: any;
        if (status === 'PLAYING') {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status]);

    // Atalhos de Teclado
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (status !== 'PLAYING') return;

            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                setIsFlipped(f => !f);
            } 
            else if (isFlipped) {
                if (e.key === '1' || e.code === 'ArrowLeft') {
                    handleNext('wrong');
                } else if (e.key === '2' || e.code === 'ArrowRight') {
                    handleNext('correct');
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFlipped, status, currentIndex]);

    const handleNext = (difficulty: SrsDifficulty) => {
        const isCorrect = difficulty === 'correct';
        if (isCorrect) {
            setCorrectCount(v => v + 1);
            triggerBuddy('success', getBuddyPhrase(buddyAvatarId || null, 'success'));
        } else {
            triggerBuddy('error', getBuddyPhrase(buddyAvatarId || null, 'error'));
        }
        
        // Track history
        setHistory(prev => [...prev, {
            correct: isCorrect,
            card: currentCard,
            timestamp: new Date().toISOString()
        }]);

        setIsFlipped(false);
        setTimeout(() => {
            if (currentIndex + 1 < cards.length) {
                setCurrentIndex(v => v + 1);
            } else {
                setStatus('SUMMARY');
                if (onFinish) {
                    onFinish({
                        score: correctCount + (isCorrect ? 1 : 0),
                        total: cards.length,
                        history: [...history, { correct: isCorrect, card: currentCard }],
                        timeSpent: seconds,
                        targetTime: targetTimeInSeconds()
                    });
                }
            }
        }, 200);
    };

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const targetTimeInSeconds = () => {
        const [m, s] = targetTimeStr.split(':').map(Number);
        return (m * 60) + (s || 0);
    };

    // --- RENDER SETUP ---
    if (status === 'SETUP') {
        return (
            <div className="setup-card animation-bounce-in shadow-2xl bg-white border-2 border-slate-border rounded-[2.5rem] p-10 max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Target size={32} className="text-brand" />
                    </div>
                    <h2 className="font-outfit text-3xl font-black text-slate-dark mb-2">Configurar Missão</h2>
                    <p className="text-slate-mid font-medium">Defina seus alvos estratégicos para este deck.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="setup-field">
                        <label className="field-label"><CheckCircle2 size={16} /> Alvo de Acertos</label>
                        <div className="field-input-wrapper">
                            <input 
                                type="number" 
                                value={targetScore} 
                                onChange={e => setTargetScore(Number(e.target.value))}
                                max={cards.length}
                                min={1}
                            />
                            <span className="input-suffix">de {cards.length}</span>
                        </div>
                    </div>

                    <div className="setup-field">
                        <label className="field-label"><Clock size={16} /> Tempo Alvo</label>
                        <div className="field-input-wrapper">
                            <input 
                                type="text" 
                                value={targetTimeStr} 
                                onChange={e => setTargetTimeStr(e.target.value)}
                                placeholder="mm:ss"
                            />
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setStatus('PLAYING')}
                    className="w-full bg-brand text-white font-outfit font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transform transition-all shadow-xl shadow-brand/20"
                >
                    Iniciar Atividade <Rocket size={22} />
                </button>
            </div>
        );
    }

    // --- RENDER SUMMARY ---
    if (status === 'SUMMARY') {
        const timeLimit = targetTimeInSeconds();
        const scoreReached = correctCount >= targetScore;
        const timeReached = seconds <= timeLimit;
        const isSuccess = scoreReached && timeReached;

        return (
            <div className={`summary-card animation-bounce-in shadow-2xl bg-white border-2 rounded-[2.5rem] p-10 text-center max-w-lg mx-auto relative overflow-hidden ${isSuccess ? 'border-green-500/30 glow-success' : 'border-amber-500/30'}`}>
                {isSuccess && (
                     <div className="confetti-container">
                        {[...Array(30)].map((_, i) => <div key={i} className="confetti" />)}
                     </div>
                )}

                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isSuccess ? 'bg-green-100' : 'bg-amber-100'}`}>
                    {isSuccess ? <Trophy size={48} className="text-green-600 bounce" /> : <Zap size={48} className="text-amber-500 shake" />}
                </div>
                
                <h2 className="font-outfit text-4xl font-black text-slate-dark mb-3">
                    {isSuccess ? 'Missão Cumprida!' : 'Quase Lá!'}
                </h2>
                <div className="h-1 w-20 bg-brand/20 mx-auto mb-6 rounded-full" />
                <p className="text-slate-mid font-semibold mb-10 leading-relaxed px-6">
                    {isSuccess 
                        ? 'Você dominou o tempo e a precisão. Alvos destruídos!' 
                        : 'O tempo ou a precisão escaparam um pouco. Vamos recalibrar?'
                    }
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className={`p-6 rounded-[2rem] border-2 transition-all duration-500 ${timeReached ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <Clock size={20} className={timeReached ? 'text-green-600 mb-2 mx-auto' : 'text-red-600 mb-2 mx-auto'} />
                        <span className="text-[0.65rem] uppercase tracking-widest font-black text-slate-mid block mb-1">Tempo Final</span>
                        <div className={`text-2xl font-black font-outfit ${timeReached ? 'text-green-700' : 'text-red-700'}`}>{formatTime(seconds)}</div>
                        <span className="text-[0.6rem] font-bold opacity-60 italic">Alvo: {targetTimeStr}</span>
                    </div>
                    <div className={`p-6 rounded-[2rem] border-2 transition-all duration-500 ${scoreReached ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <CheckCircle2 size={20} className={scoreReached ? 'text-green-600 mb-2 mx-auto' : 'text-red-600 mb-2 mx-auto'} />
                        <span className="text-[0.65rem] uppercase tracking-widest font-black text-slate-mid block mb-1">Acertos</span>
                        <div className={`text-2xl font-black font-outfit ${scoreReached ? 'text-green-700' : 'text-red-700'}`}>{correctCount}/{cards.length}</div>
                        <span className="text-[0.6rem] font-bold opacity-60 italic">Alvo: {targetScore} acertos</span>
                    </div>
                </div>

                {!isSuccess && (
                    <div className="bg-amber-50 text-amber-700 p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold border border-amber-200 shadow-sm animate-pulse">
                        <AlertCircle size={18} /> A persistência é o segredo da maestria!
                    </div>
                )}
                
                {senseiWhatsapp ? (
                    <a
                        href={`/api/contact/sensei?teacherId=${senseiWhatsapp}&text=${encodeURIComponent(`Oi Sensei! Acabei de completar a missão de Flashcards. Acertei ${correctCount} de ${cards.length} no tempo de ${formatTime(seconds)}. Quero saber mais sobre as aulas! 🃏`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] text-white font-outfit font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transform transition-all shadow-xl shadow-green-500/20 mb-4"
                        style={{ textDecoration: 'none' }}
                    >
                        💬 Falar com o Sensei no WhatsApp
                    </a>
                ) : null}

                <button 
                  onClick={() => window.location.reload()}
                  className={`w-full text-white font-outfit font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transform transition-all shadow-xl shadow-brand/20 ${isSuccess ? 'bg-brand' : 'bg-slate-dark'}`}
                >
                  {isSuccess ? 'Praticar Novamente' : 'Recalibrar Missão'} <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    // --- RENDER PLAYING ---
    if (!currentCard) return null;

    return (
        <div className="card-viewer-host">
            <div className="viewer-header-layout">
                <div className="viewer-progress-header">
                    <div className="flex justify-between items-center mb-1">
                        <span className="p-text">Card {currentIndex + 1} de {cards.length}</span>
                        <div className="flex items-center gap-2">
                             <button 
                                onClick={() => setIsMaterialsOpen(true)}
                                className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-border rounded-lg font-outfit font-bold text-slate-dark hover:bg-ice transition-all text-xs"
                            >
                                📖 Materiais
                            </button>
                            <div className={`timer-badge ${seconds > targetTimeInSeconds() ? 'timer-over' : ''}`}>
                                <Clock size={14} />
                                <span>{formatTime(seconds)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-track">
                        <div className="p-fill" style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} />
                    </div>
                </div>
            </div>

            <div className={`flip-card ${isFlipped ? 'is-flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <div className="card-glass-effect" />
                        <span className="card-side-tag">Japonês</span>
                        <div className="card-content-main">
                            <h1 className="kanji-text">{currentCard.front}</h1>
                            <p className="reading-text">{isFlipped ? '' : 'Virar [Espaço/Enter]'}</p>
                        </div>
                        <div className="card-instruction">
                            <Rotate3d size={16} /> Toque para virar
                        </div>
                    </div>

                    <div className="flip-card-back">
                        <div className="card-glass-effect-dark" />
                        <span className="card-side-tag-white">Significado</span>

                        <div className="card-back-main">
                            <div className="back-reading-white">{currentCard.reading}</div>
                            <h2 className="back-meaning-white">{currentCard.back}</h2>

                            <div className="example-box-dark">
                                <span className="ex-label-white">Exemplo:</span>
                                <p className="ex-jp-white">{currentCard.example}</p>
                                <p className="ex-pt-white">{currentCard.exampleTranslation}</p>
                            </div>
                        </div>

                        <div className="card-instruction-white">
                            Clique para voltar à frente
                        </div>
                    </div>
                </div>
            </div>

            <div className={`srs-actions ${isFlipped ? 'visible' : ''}`}>
                <p className="srs-query font-outfit">Como foi lembrar deste card?</p>
                <div className="srs-buttons">
                    <button onClick={(e) => { e.stopPropagation(); handleNext('wrong'); }} className="srs-btn wrong group">
                        <XCircle size={22} className="group-hover:rotate-12 transition-transform" /> 
                        <span>Errado [1]</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleNext('correct'); }} className="srs-btn correct group">
                        <CheckCircle2 size={22} className="group-hover:scale-125 transition-transform" /> 
                        <span>Certo [2]</span>
                    </button>
                </div>
            </div>

            {/* BUDDY COMPANION — visível apenas durante o jogo */}
            {status === 'PLAYING' && (
                <>
                    <MaterialsDrawer 
                        isOpen={isMaterialsOpen} 
                        onClose={() => setIsMaterialsOpen(false)} 
                        activityId={activityId}
                    />
                    <BuddyView avatarUrl={buddyAvatarUrl} avatarId={buddyAvatarId} state={buddyState} message={buddyMessage} />
                </>
            )}

            <style>{`
        .card-viewer-host {
          max-width: 650px; margin: 0 auto; width: 100%;
          display: flex; flex-direction: column; gap: 2rem; align-items: center;
          animation: fade-in 0.5s ease;
        }
        
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

        /* SETUP STYLES */
        .setup-field { flex: 1; }
        .field-label { font-size: 0.7rem; font-weight: 800; color: var(--color-slate-mid); text-transform: uppercase; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .field-input-wrapper { display: flex; align-items: center; border: 2.5px solid var(--color-slate-border); border-radius: 1.25rem; padding: 0.75rem 1.25rem; transition: all 0.2s; background: white; }
        .field-input-wrapper:focus-within { border-color: var(--color-brand); box-shadow: 0 0 0 4px rgba(88,49,126,0.1); }
        .field-input-wrapper input { border: none; outline: none; background: transparent; font-family: var(--font-outfit); font-size: 1.5rem; font-weight: 800; color: var(--color-slate-dark); width: 100%; }
        .input-suffix { font-size: 0.8rem; font-weight: 700; color: var(--color-slate-mid); white-space: nowrap; }

        /* VIEWER STYLES */
        .viewer-header-layout { width: 100%; }
        .timer-badge { display: flex; align-items: center; gap: 0.4rem; background: rgba(88,49,126,0.06); color: var(--color-brand); padding: 0.4rem 1rem; border-radius: 999px; font-family: var(--font-outfit); font-weight: 800; font-size: 0.85rem; border: 1.5px solid rgba(88,49,126,0.1); transition: all 0.3s; }
        .timer-over { background: #fee2e2; color: #dc2626; border-color: #fecaca; }

        .p-track { height: 10px; background: var(--color-slate-border); border-radius: 999px; overflow: hidden; }
        .p-fill { height: 100%; background: var(--color-brand); border-radius: 999px; transition: width 0.3s ease; box-shadow: 0 0 10px rgba(88,49,126,0.3); }

        .flip-card {
          width: 100%; height: 480px;
          perspective: 1500px; cursor: pointer;
        }
        .flip-card-inner {
          position: relative; width: 100%; height: 100%; text-align: center;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }
        .flip-card.is-flipped .flip-card-inner { transform: rotateY(180deg); }

        .flip-card-front, .flip-card-back {
          position: absolute; width: 100%; height: 100%;
          -webkit-backface-visibility: hidden; backface-visibility: hidden;
          border-radius: 3rem; border: 2.5px solid var(--color-slate-border);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 3rem; box-sizing: border-box; overflow: hidden;
          box-shadow: 0 30px 60px -12px rgba(30,41,59,0.15);
        }

        .flip-card-front { background: white; color: var(--color-slate-dark); }
        .flip-card-back { 
            background: linear-gradient(135deg, #58317e 0%, #311b47 100%); 
            transform: rotateY(180deg);
            border-color: #4c2b6d;
        }

        .kanji-text { font-family: 'Noto Sans JP', sans-serif; font-size: 5rem; font-weight: 900; margin: 0; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.05)); }
        .reading-text { font-size: 1.1rem; color: var(--color-slate-mid); margin-top: 2rem; font-weight: 600; font-family: var(--font-outfit); opacity: 0.7; }

        .back-reading-white { font-family: var(--font-inter); font-size: 1.4rem; color: rgba(255,255,255,0.7); margin-bottom: 0.5rem; letter-spacing: 0.05em; }
        .back-meaning-white { font-family: var(--font-outfit); font-size: 3.5rem; font-weight: 900; color: white; margin: 0 0 1.5rem; filter: drop-shadow(0 5px 20px rgba(0,0,0,0.3)); }

        .example-box-dark {
          background: rgba(255,255,255,0.07); border-radius: 2rem; padding: 2rem; text-align: left; width: 100%;
          border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(15px);
        }
        .ex-label-white { font-size: 0.75rem; font-weight: 900; color: #c4b5fd; text-transform: uppercase; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .ex-jp-white { font-size: 1.2rem; color: white; margin: 0; line-height: 1.6; font-weight: 500; font-family: 'Noto Sans JP', sans-serif; }
        .ex-pt-white { font-size: 1rem; color: rgba(255,255,255,0.5); margin: 0.75rem 0 0; font-family: var(--font-inter); }
        .card-instruction-white { position: absolute; bottom: 2rem; color: rgba(255,255,255,0.3); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }

        /* SRS ACTIONS */
        .srs-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          opacity: 0;
          pointer-events: none;
          transform: translateY(20px);
          transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
          margin-top: 1rem;
        }
        .srs-actions.visible {
          opacity: 1;
          pointer-events: all;
          transform: translateY(0);
        }
        .srs-query {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-slate-mid);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }
        .srs-buttons {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .srs-btn {
          height: 80px;
          border-radius: 2rem;
          border: 2px solid transparent;
          font-family: var(--font-outfit);
          font-weight: 900;
          font-size: 1.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05);
        }
        .srs-btn.wrong {
          background: rgba(255, 95, 133, 0.08);
          border-color: rgba(255, 95, 133, 0.15);
          color: #ff5f85;
        }
        .srs-btn.wrong:hover {
          background: rgba(255, 95, 133, 0.15);
          border-color: #ff5f85;
          transform: translateY(-5px);
          box-shadow: 0 15px 30px -10px rgba(255, 95, 133, 0.4);
        }
        .srs-btn.correct {
          background: rgba(46, 213, 115, 0.08);
          border-color: rgba(46, 213, 115, 0.15);
          color: #2ed573;
        }
        .srs-btn.correct:hover {
          background: rgba(46, 213, 115, 0.15);
          border-color: #2ed573;
          transform: translateY(-5px);
          box-shadow: 0 15px 30px -10px rgba(46, 213, 115, 0.4);
        }

        /* ANIMATIONS & EFFECTS */
        .glow-success { box-shadow: 0 0 50px rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.3) !important; animation: border-pulse 2s infinite; }
        @keyframes border-pulse { 0%, 100% { border-color: rgba(34,197,94,0.3); } 50% { border-color: rgba(34,197,94,0.6); } }
        
        @keyframes bounce-in { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animation-bounce-in { animation: bounce-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

        .confetti-container { position: absolute; inset: 0; pointer-events: none; }
        .confetti { position: absolute; width: 10px; height: 10px; top: -10px; border-radius: 2px; animation: confetti-fall 3s ease-out infinite; }
        .confetti:nth-child(5n) { background: #8b5cf6; } .confetti:nth-child(5n+1) { background: #3b82f6; } 
        .confetti:nth-child(5n+2) { background: #10b981; } .confetti:nth-child(5n+3) { background: #f59e0b; }
        .confetti:nth-child(5n+4) { background: #ec4899; }
        
        @keyframes confetti-fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; left: var(--left, 50%); }
            100% { transform: translateY(500px) rotate(720deg); opacity: 0; left: var(--left-end, 50%); }
        }
        ${[...Array(30)].map((_, i) => `
            .confetti:nth-child(${i+1}) { 
                --left: ${Math.random() * 100}%; 
                --left-end: ${Math.random() * 100 + (Math.random() - 0.5) * 20}%; 
                animation-delay: ${Math.random() * 2}s;
                animation-duration: ${2 + Math.random() * 2}s;
            }
        `).join('')}

        .bounce { animation: bounce 2s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        
        .shake { animation: shake 0.5s infinite; }
        @keyframes shake { 0% { transform: rotate(0); } 25% { transform: rotate(5deg); } 50% { transform: rotate(0); } 75% { transform: rotate(-5deg); } 100% { transform: rotate(0); } }
      `}</style>
        </div>
    );
};
