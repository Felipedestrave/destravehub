import React, { useState, useEffect, useRef } from 'react';
import { 
    Play, 
    Pause, 
    Gauge, 
    Check, 
    X, 
    Lightbulb, 
    HelpCircle, 
    ArrowRight, 
    MapPin, 
    BookOpen, 
    Volume2,
    Compass,
    Sparkles,
    CheckCircle,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BuddyView, type BuddyState } from '../buddy/BuddyView';
import { STORE_ITEMS } from '../../lib/store';
import { getBuddyPhrase } from '../../lib/buddy-phrases';
import { shuffleArray } from '../../lib/utils';

interface Destrave2PlayerProps {
    assignmentId?: string;
    activityId?: string;
    initialExercises: any[];
    initialTitle?: string;
    publicAccess?: boolean;
    senseiWhatsapp?: string | null;
    senseiProfile?: { full_name: string | null; avatar_url: string | null } | null;
}

const getBlockColor = (type: string) => {
    switch (type) {
        case 'SUBJECT': return 'bg-brand text-white border-brand';
        case 'OBJECT': return 'bg-brand text-white border-brand';
        case 'VERB': return 'bg-amber-500 text-white border-amber-600'; // Laranja/Amber
        case 'PARTICLE': return 'bg-sky-100 text-sky-700 border-sky-200'; // Azul claro (seguindo Purple Ban)
        case 'TIME': return 'bg-emerald-500 text-white border-emerald-600';
        case 'ADJECTIVE': return 'bg-blue-500 text-white border-blue-600';
        default: return 'bg-slate-200 text-slate-700 border-slate-300';
    }
};

export const Destrave2Player: React.FC<Destrave2PlayerProps> = ({
    assignmentId,
    activityId,
    initialExercises,
    initialTitle,
    publicAccess,
    senseiWhatsapp,
    senseiProfile,
}) => {
    // Game progression
    const [exercises, setExercises] = useState<any[]>(() => {
        return initialExercises ? shuffleArray([...initialExercises]) : [];
    });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [status, setStatus] = useState<'PLAYING' | 'RESULT' | 'SAVING'>('PLAYING');
    const [score, setScore] = useState(0);
    const [history, setHistory] = useState<any[]>([]);

    // Shared Buddy Companion
    const [buddyState, setBuddyState] = useState<BuddyState>('idle');
    const [buddyMessage, setBuddyMessage] = useState<string | null>(null);
    const [buddyAvatarUrl, setBuddyAvatarUrl] = useState<string>('/assets/avatars/tanuki-novato.png');
    const [buddyAvatarId, setBuddyAvatarId] = useState<string | null>(null);

    // Gamification results
    const [rewards, setRewards] = useState<any>(null);

    // Active exercise
    const currentEx = exercises[currentIndex];

    // ---- ESCUTA SUB-GAME STATES ----
    const [escutaIsPlaying, setEscutaIsPlaying] = useState(false);
    const [escutaShowHint, setEscutaShowHint] = useState(false);
    const [escutaSelectedIdx, setEscutaSelectedIdx] = useState<number | null>(null);
    const [escutaSpeed, setEscutaSpeed] = useState(1.0);
    const [escutaShuffledOptions, setEscutaShuffledOptions] = useState<{ text: string, originalIndex: number }[]>([]);
    const [escutaIsAnswered, setEscutaIsAnswered] = useState(false);

    // Audio Refs for Escuta
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);

    // ---- LEGO SUB-GAME STATES ----
    const [legoAvailable, setLegoAvailable] = useState<any[]>([]);
    const [legoBoard, setLegoBoard] = useState<any[]>([]);
    const [legoAttempts, setLegoAttempts] = useState(0);
    const [legoStatus, setLegoStatus] = useState<'playing' | 'correct' | 'revealed'>('playing');

    // ---- MRP SUB-GAME STATES ----
    const [mrpShowHint, setMrpShowHint] = useState(false);
    const [mrpSelectedIdx, setMrpSelectedIdx] = useState<number | null>(null);
    const [mrpIsAnswered, setMrpIsAnswered] = useState(false);
    const [mrpShuffledOptions, setMrpShuffledOptions] = useState<{ text: string, originalIndex: number }[]>([]);

    // Load Equipped Buddy
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

    const triggerBuddy = (newState: BuddyState, msg?: string) => {
        setBuddyState(newState);
        if (msg) setBuddyMessage(msg);
        setTimeout(() => {
            setBuddyState('idle');
            setBuddyMessage(null);
        }, 3500);
    };

    // Triggered when currentEx changes (loads sub-game setups)
    useEffect(() => {
        if (!currentEx) return;

        // Reset sub-game states
        setEscutaShowHint(false);
        setEscutaSelectedIdx(null);
        setEscutaIsAnswered(false);
        setEscutaIsPlaying(false);
        stopEscutaAudio();

        setLegoBoard([]);
        setLegoAttempts(0);
        setLegoStatus('playing');

        setMrpShowHint(false);
        setMrpSelectedIdx(null);
        setMrpIsAnswered(false);

        // Load specific sub-game items
        if (currentEx.type === 'escuta') {
            setupEscutaAudio(currentEx.data.audioBase64);
            if (currentEx.data.options) {
                const opts = currentEx.data.options.map((opt: string, idx: number) => ({ text: opt, originalIndex: idx }));
                setEscutaShuffledOptions([...opts].sort(() => Math.random() - 0.5));
            }
        } else if (currentEx.type === 'lego') {
            if (currentEx.data.blocks) {
                setLegoAvailable(shuffleArray([...currentEx.data.blocks]));
            }
        } else if (currentEx.type === 'mrp') {
            if (currentEx.data.options) {
                const opts = currentEx.data.options.map((opt: string, idx: number) => ({ text: opt, originalIndex: idx }));
                setMrpShuffledOptions([...opts].sort(() => Math.random() - 0.5));
            }
        }
    }, [currentIndex]);

    // Cleanup Audio on Unmount
    useEffect(() => {
        return () => stopEscutaAudio();
    }, []);

    // Speed change listener
    useEffect(() => {
        if (sourceRef.current) {
            sourceRef.current.playbackRate.value = escutaSpeed;
        }
    }, [escutaSpeed]);

    // Decoding base64 PCM for Escuta
    const decodePCM = (base64: string, ctx: AudioContext): AudioBuffer => {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const int16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768;
        const buffer = ctx.createBuffer(1, float32.length, 24000);
        buffer.copyToChannel(float32, 0);
        return buffer;
    };

    const setupEscutaAudio = async (base64?: string) => {
        if (!base64) return;
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }
            audioBufferRef.current = decodePCM(base64, audioContextRef.current);
            playEscutaAudio();
        } catch (err) {
            console.error('Erro ao setup áudio Escuta:', err);
        }
    };

    const playEscutaAudio = async () => {
        if (!audioContextRef.current || !audioBufferRef.current) return;
        if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
        if (sourceRef.current) {
            try { sourceRef.current.stop(); } catch (_) {}
        }
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;
        source.playbackRate.value = escutaSpeed;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setEscutaIsPlaying(false);
        sourceRef.current = source;
        source.start(0);
        setEscutaIsPlaying(true);
    };

    const stopEscutaAudio = () => {
        if (sourceRef.current) {
            try { sourceRef.current.stop(); } catch (_) {}
            sourceRef.current = null;
        }
        setEscutaIsPlaying(false);
    };

    // ---- INTERACTIVE ACTIONS ----

    // Escuta Select Option
    const handleEscutaAnswer = (shuffledIdx: number) => {
        if (escutaIsAnswered) return;
        setEscutaSelectedIdx(shuffledIdx);
        setEscutaIsAnswered(true);

        const originalIdx = escutaShuffledOptions[shuffledIdx].originalIndex;
        const isCorrect = originalIdx === currentEx.data.correct_index;
        const pointsAwarded = isCorrect ? (escutaShowHint ? 10 : 20) : 0;

        setScore(prev => prev + pointsAwarded);
        setHistory(prev => [...prev, {
            type: 'escuta',
            correct: isCorrect,
            points: pointsAwarded,
            usedHint: escutaShowHint
        }]);

        if (isCorrect) {
            triggerBuddy('success', getBuddyPhrase(buddyAvatarId, 'success'));
        } else {
            triggerBuddy('error', getBuddyPhrase(buddyAvatarId, 'error'));
        }
    };

    // Lego Moves Click-based
    const moveBlockToBoard = (block: any) => {
        if (legoStatus !== 'playing') return;
        setLegoAvailable(prev => prev.filter(b => b.id !== block.id));
        setLegoBoard(prev => [...prev, block]);
    };

    const moveBlockToAvailable = (block: any) => {
        if (legoStatus !== 'playing') return;
        setLegoBoard(prev => prev.filter(b => b.id !== block.id));
        setLegoAvailable(prev => [...prev, block]);
    };

    const handleLegoVerify = () => {
        if (legoBoard.length !== currentEx.data.blocks.length) {
            triggerBuddy('error', 'Use todas as peças para construir a frase!');
            return;
        }

        const isCorrect = legoBoard.every((b, i) => b.id === currentEx.data.blocks[i].id);

        if (isCorrect) {
            const pointsAwarded = legoAttempts === 0 ? 20 : (legoAttempts === 1 ? 10 : 5);
            setScore(prev => prev + pointsAwarded);
            setHistory(prev => [...prev, {
                type: 'lego',
                correct: true,
                points: pointsAwarded,
                usedHint: false
            }]);
            setLegoStatus('correct');
            triggerBuddy('success', getBuddyPhrase(buddyAvatarId, 'success'));
        } else {
            setLegoAttempts(prev => prev + 1);
            
            // Helpful tip based on mistakes
            const lastBlock = legoBoard[legoBoard.length - 1];
            let errorMsg = 'Oops, a ordem não está certa.';
            if (lastBlock.type !== 'VERB' && currentEx.data.blocks[currentEx.data.blocks.length - 1].type === 'VERB') {
                errorMsg = 'Lembre-se: em japonês, o verbo geralmente fica no final da frase!';
            } else if (legoBoard.some((b, i) => b.type === 'PARTICLE' && i === 0)) {
                errorMsg = 'Uma partícula quase nunca começa a frase. Tente colar palavras com ela!';
            }
            
            triggerBuddy('error', errorMsg);
        }
    };

    const handleLegoSkip = () => {
        setLegoBoard([...currentEx.data.blocks]);
        setLegoAvailable([]);
        setLegoStatus('revealed');
        setHistory(prev => [...prev, {
            type: 'lego',
            correct: false,
            points: 0,
            usedHint: true
        }]);
        triggerBuddy('error', 'Sem problemas, vamos continuar praticando!');
    };

    // MRP Select Option
    const handleMrpAnswer = (shuffledIdx: number) => {
        if (mrpIsAnswered) return;
        setMrpSelectedIdx(shuffledIdx);
        setMrpIsAnswered(true);

        const chosenOption = mrpShuffledOptions[shuffledIdx].text;
        const isCorrect = chosenOption === currentEx.data.correctAnswer;
        const pointsAwarded = isCorrect ? (mrpShowHint ? Math.floor(currentEx.data.points / 2) : currentEx.data.points) : 0;

        setScore(prev => prev + pointsAwarded);
        setHistory(prev => [...prev, {
            type: 'mrp',
            correct: isCorrect,
            points: pointsAwarded,
            usedHint: mrpShowHint
        }]);

        if (isCorrect) {
            triggerBuddy('success', getBuddyPhrase(buddyAvatarId, 'success'));
        } else {
            triggerBuddy('error', getBuddyPhrase(buddyAvatarId, 'error'));
        }
    };

    // Go to next exercise or finalize
    const handleNextQuestion = () => {
        stopEscutaAudio();
        if (currentIndex + 1 < exercises.length) {
            setCurrentIndex(prev => prev + 1);
        } else {
            handleFinalizeMission();
        }
    };

    const handleFinalizeMission = async () => {
        setStatus('SAVING');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            
            if (!token || !assignmentId) {
                // If professor testing or public access without assignment
                setStatus('RESULT');
                return;
            }

            const res = await fetch('/api/missions/save-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    assignmentId,
                    score,
                    totalQuestions: exercises.length,
                    history: history,
                    title: initialTitle || 'Missão Híbrida 2.0'
                }),
            });

            if (!res.ok) throw new Error('Erro ao salvar resultados da missão híbrida.');
            const data = await res.json();
            
            if (data.rewards) {
                setRewards(data.rewards);
            }
            setStatus('RESULT');
        } catch (err: any) {
            console.error('[Finalize Error]', err);
            alert(`Falha ao salvar pontuação: ${err.message}`);
            setStatus('RESULT');
        }
    };

    return (
        <div className="w-full min-h-[60vh] flex flex-col justify-between select-none">
            
            {status === 'SAVING' && (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                    <Loader2 size={44} className="animate-spin text-brand mb-4" />
                    <p className="font-outfit font-extrabold text-slate-dark text-xl">Sincronizando conquistas com o Sensei...</p>
                </div>
            )}

            {status === 'PLAYING' && currentEx && (
                <div className="space-y-6">
                    {/* Progress Header */}
                    <div className="bg-white border-2 border-slate-border rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <a 
                                href="/dashboard" 
                                className="p-2 border-2 border-slate-border hover:border-brand rounded-xl text-slate-mid hover:text-brand transition-all"
                            >
                                <ArrowLeft size={16} />
                            </a>
                            <div>
                                <h3 className="font-outfit font-extrabold text-slate-dark text-lg leading-tight">
                                    Missão Híbrida ⚡
                                </h3>
                                <p className="text-xs text-slate-mid font-semibold">Exercício {currentIndex + 1} de {exercises.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-outfit font-black text-2xl text-action">{score} pts</span>
                            <div className="hidden md:block w-36 h-3.5 bg-slate-border border border-white shadow-inner rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-brand transition-all duration-300 ease-out"
                                    style={{ width: `${((currentIndex) / exercises.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Progress bar mobile */}
                    <div className="md:hidden w-full h-2 bg-slate-border rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-brand transition-all duration-300"
                            style={{ width: `${((currentIndex) / exercises.length) * 100}%` }}
                        />
                    </div>

                    {/* Sub-Games Display Router */}

                    {/* ESCUTA LAYOUT */}
                    {currentEx.type === 'escuta' && (
                        <div className="space-y-6">
                            {/* Listening Card */}
                            <div className="bg-white border-2 border-slate-border rounded-3xl p-8 shadow-sm text-center relative overflow-hidden flex flex-col items-center gap-4">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold font-outfit uppercase tracking-wider">
                                    Cenário: {currentEx.data.context_name}
                                </span>
                                
                                <button
                                    onClick={() => escutaIsPlaying ? stopEscutaAudio() : playEscutaAudio()}
                                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                                        escutaIsPlaying ? 'bg-action text-white' : 'bg-brand text-white'
                                    }`}
                                >
                                    {escutaIsPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
                                </button>
                                <p className="text-xs font-bold text-slate-mid">
                                    {escutaIsPlaying ? 'Ouvindo áudio nativo...' : 'Clique para ouvir o áudio'}
                                </p>

                                {/* Speed selectors */}
                                <div className="flex gap-1.5 p-1 bg-ice rounded-xl border border-slate-border text-xs font-bold">
                                    <span className="self-center px-2 text-[10px] text-slate-mid uppercase tracking-wide">Velocidade:</span>
                                    {[0.8, 1.0, 1.2].map(speed => (
                                        <button
                                            key={speed}
                                            onClick={() => setEscutaSpeed(speed)}
                                            className={`px-3 py-1 rounded-lg transition-all ${
                                                escutaSpeed === speed ? 'bg-brand text-white' : 'text-slate-mid hover:bg-white'
                                            }`}
                                        >
                                            {speed}x
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Options Grid */}
                            <div className="space-y-3">
                                <h4 className="font-outfit font-extrabold text-slate-dark text-lg px-1">O que foi dito em português?</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {escutaShuffledOptions.map((opt, idx) => {
                                        let btnStyle = 'bg-white border-slate-border text-slate-dark hover:border-brand/40 hover:bg-brand/5';
                                        if (escutaIsAnswered) {
                                            if (opt.originalIndex === currentEx.data.correct_index) {
                                                btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                                            } else if (escutaSelectedIdx === idx) {
                                                btnStyle = 'bg-red-50 border-red-400 text-red-800 opacity-80';
                                            } else {
                                                btnStyle = 'bg-white border-slate-border text-slate-mid opacity-40';
                                            }
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                disabled={escutaIsAnswered}
                                                onClick={() => handleEscutaAnswer(idx)}
                                                className={`p-4 rounded-2xl border-2 text-left font-inter font-semibold transition-all w-full flex items-center justify-between ${btnStyle}`}
                                            >
                                                <span>{opt.text}</span>
                                                {escutaIsAnswered && opt.originalIndex === currentEx.data.correct_index && <Check size={18} className="text-emerald-600" />}
                                                {escutaIsAnswered && escutaSelectedIdx === idx && opt.originalIndex !== currentEx.data.correct_index && <X size={18} className="text-red-500" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Dica & Explanations */}
                            {!escutaIsAnswered ? (
                                <div className="flex justify-center">
                                    {!escutaShowHint ? (
                                        <button 
                                            onClick={() => setEscutaShowHint(true)}
                                            className="text-xs font-bold text-slate-mid hover:text-brand flex items-center gap-1.5 transition-colors"
                                        >
                                            <Lightbulb size={14} /> Pedir dica (-50% pontos)
                                        </button>
                                    ) : (
                                        <div className="w-full p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-sm font-medium flex items-start gap-2.5">
                                            <HelpCircle size={18} className="shrink-0 mt-0.5" />
                                            <span>{currentEx.data.hint}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={`p-5 rounded-2xl border-2 space-y-4 ${
                                    escutaShuffledOptions[escutaSelectedIdx!].originalIndex === currentEx.data.correct_index
                                        ? 'bg-emerald-50/50 border-emerald-100'
                                        : 'bg-red-50/50 border-red-100'
                                }`}>
                                    <div className="bg-white border border-slate-border rounded-xl p-4 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-mid uppercase tracking-widest block">Frase</span>
                                        <p className="font-outfit font-extrabold text-2xl text-slate-dark">{currentEx.data.japanese_sentence}</p>
                                        <p className="text-sm font-semibold text-slate-mid italic">{currentEx.data.romaji}</p>
                                    </div>
                                    {currentEx.data.explanation && (
                                        <p className="text-sm font-medium text-slate-dark">
                                            <strong>Explicação:</strong> {currentEx.data.explanation}
                                        </p>
                                    )}
                                    <button
                                        onClick={handleNextQuestion}
                                        className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-outfit font-bold flex items-center justify-center gap-2 transition-all"
                                    >
                                        Próxima Questão
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* LEGO LAYOUT */}
                    {currentEx.type === 'lego' && (
                        <div className="space-y-6">
                            {/* Translation header */}
                            <div className="bg-white border-2 border-slate-border rounded-3xl p-8 shadow-sm text-center">
                                <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-extrabold rounded-lg uppercase tracking-wider block w-max mx-auto mb-3">
                                    Monte a Frase
                                </span>
                                <h3 className="font-outfit font-extrabold text-2xl md:text-3xl text-brand">
                                    "{currentEx.data.translation}"
                                </h3>
                            </div>

                            {/* Board Dropzone */}
                            <div className="bg-white border-2 border-slate-border rounded-3xl p-6 min-h-[160px] md:min-h-[180px] flex flex-wrap gap-3 md:gap-4 content-start shadow-inner">
                                {legoBoard.length === 0 && (
                                    <p className="w-full text-center py-8 text-slate-300 font-outfit font-bold text-xl md:text-2xl">
                                        Toque nas peças abaixo para organizar a frase
                                    </p>
                                )}
                                {legoBoard.map((block, idx) => (
                                    <button
                                        key={block.id || idx}
                                        disabled={legoStatus !== 'playing'}
                                        onClick={() => moveBlockToAvailable(block)}
                                        className={`px-6 py-3 md:px-7 md:py-3.5 rounded-xl border-b-4 font-outfit font-bold shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 flex flex-col items-center justify-center min-w-[4.5rem] md:min-w-[5rem] ${getBlockColor(block.type)}`}
                                    >
                                        <span className="text-2xl md:text-3xl leading-tight">{block.word}</span>
                                        {block.romaji && <span className="text-xs md:text-sm opacity-90 font-inter mt-0.5 font-semibold tracking-wide">({block.romaji})</span>}
                                    </button>
                                ))}
                            </div>

                            {/* Available block shelf */}
                            {legoStatus === 'playing' && (
                                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 min-h-[160px] md:min-h-[180px] flex flex-wrap justify-center gap-3 md:gap-4 content-start">
                                    {legoAvailable.map((block, idx) => (
                                        <button
                                            key={block.id || idx}
                                            onClick={() => moveBlockToBoard(block)}
                                            className={`px-6 py-3 md:px-7 md:py-3.5 rounded-xl border-b-4 font-outfit font-bold shadow-sm hover:-translate-y-0.5 transition-transform active:translate-y-0 flex flex-col items-center justify-center min-w-[4.5rem] md:min-w-[5rem] ${getBlockColor(block.type)}`}
                                        >
                                            <span className="text-2xl md:text-3xl leading-tight">{block.word}</span>
                                            {block.romaji && <span className="text-xs md:text-sm opacity-90 font-inter mt-0.5 font-semibold tracking-wide">({block.romaji})</span>}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Feedback panel */}
                            {legoStatus !== 'playing' && (
                                <div className={`p-5 rounded-2xl border-2 space-y-4 ${
                                    legoStatus === 'correct' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'
                                }`}>
                                    <h4 className={`font-outfit font-extrabold text-lg ${legoStatus === 'correct' ? 'text-emerald-700' : 'text-amber-800'}`}>
                                        {legoStatus === 'correct' ? '✓ Frase Montada com Sucesso!' : '⚡ Frase Revelada'}
                                    </h4>
                                    <div className="bg-white border border-slate-border rounded-xl p-4">
                                        <p className="text-[10px] font-bold text-slate-mid uppercase tracking-widest mb-1">Frase Alvo</p>
                                        <p className="font-outfit font-extrabold text-2xl text-slate-dark mb-1">{currentEx.data.original}</p>
                                        <p className="text-sm font-semibold text-slate-mid italic">
                                            {currentEx.data.blocks.map((b: any) => b.romaji).join(' ')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleNextQuestion}
                                        className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-outfit font-bold flex items-center justify-center gap-2 transition-all"
                                    >
                                        Próxima Questão
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Actions bar */}
                            {legoStatus === 'playing' && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setLegoAvailable(shuffleArray([...currentEx.data.blocks]));
                                            setLegoBoard([]);
                                        }}
                                        className="flex-1 py-3 border-2 border-slate-border hover:border-slate-dark text-slate-mid hover:text-slate-dark font-outfit font-bold rounded-xl transition-all"
                                    >
                                        Resetar
                                    </button>
                                    {legoAttempts >= 2 && (
                                        <button
                                            onClick={handleLegoSkip}
                                            className="flex-1 py-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-outfit font-bold rounded-xl transition-all"
                                        >
                                            Pular / Revelar
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLegoVerify}
                                        disabled={legoBoard.length === 0}
                                        className="flex-[2] py-3 bg-brand hover:bg-brand/90 disabled:opacity-50 text-white font-outfit font-extrabold rounded-xl shadow-md transition-all"
                                    >
                                        Verificar Ordem
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MRP LAYOUT */}
                    {currentEx.type === 'mrp' && (
                        <div className="space-y-6">
                            {/* Dialogue Scenario Card */}
                            <div className="bg-white border-2 border-slate-border rounded-3xl p-6 shadow-sm space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                                        <Compass size={20} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-0.5">Cenário</span>
                                        <p className="font-inter text-slate-dark font-semibold leading-relaxed">{currentEx.data.scenario}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 border-t border-slate-border pt-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-0.5">Sua Tarefa</span>
                                        <p className="font-inter text-slate-dark italic leading-relaxed">{currentEx.data.task}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Options speaking */}
                            <div className="space-y-3">
                                <h4 className="font-outfit font-extrabold text-slate-dark text-lg px-1">Qual é a melhor resposta socialmente?</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {mrpShuffledOptions.map((opt, idx) => {
                                        let btnStyle = 'bg-white border-slate-border text-slate-dark hover:border-brand/40 hover:bg-brand/5';
                                        if (mrpIsAnswered) {
                                            if (opt.text === currentEx.data.correctAnswer) {
                                                btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                                            } else if (mrpSelectedIdx === idx) {
                                                btnStyle = 'bg-red-50 border-red-400 text-red-800 opacity-80';
                                            } else {
                                                btnStyle = 'bg-white border-slate-border text-slate-mid opacity-40';
                                            }
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                disabled={mrpIsAnswered}
                                                onClick={() => handleMrpAnswer(idx)}
                                                className={`p-4 rounded-2xl border-2 text-left font-inter font-semibold transition-all w-full flex items-center justify-between ${btnStyle}`}
                                            >
                                                <span>{opt.text}</span>
                                                {mrpIsAnswered && opt.text === currentEx.data.correctAnswer && <Check size={18} className="text-emerald-600" />}
                                                {mrpIsAnswered && mrpSelectedIdx === idx && opt.text !== currentEx.data.correctAnswer && <X size={18} className="text-red-500" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Hint & Explanations */}
                            {!mrpIsAnswered ? (
                                <div className="flex justify-center">
                                    {!mrpShowHint ? (
                                        <button 
                                            onClick={() => setMrpShowHint(true)}
                                            className="text-xs font-bold text-slate-mid hover:text-brand flex items-center gap-1.5 transition-colors"
                                        >
                                            <Lightbulb size={14} /> Pedir dica (-50% pontos)
                                        </button>
                                    ) : (
                                        <div className="w-full p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-sm font-medium flex items-start gap-2.5">
                                            <HelpCircle size={18} className="shrink-0 mt-0.5" />
                                            <span>{currentEx.data.hint}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={`p-5 rounded-2xl border-2 space-y-4 ${
                                    mrpShuffledOptions[mrpSelectedIdx!].text === currentEx.data.correctAnswer
                                        ? 'bg-emerald-50/50 border-emerald-100'
                                        : 'bg-red-50/50 border-red-100'
                                }`}>
                                    <h4 className={`font-outfit font-extrabold text-lg ${
                                        mrpShuffledOptions[mrpSelectedIdx!].text === currentEx.data.correctAnswer ? 'text-emerald-700' : 'text-red-600'
                                    }`}>
                                        {mrpShuffledOptions[mrpSelectedIdx!].text === currentEx.data.correctAnswer ? '✓ Correto!' : '✗ Incorreto'}
                                    </h4>
                                    {currentEx.data.explanation && (
                                        <p className="text-sm font-medium text-slate-dark">
                                            <strong>Explicação do Sensei:</strong> {currentEx.data.explanation}
                                        </p>
                                    )}
                                    <button
                                        onClick={handleNextQuestion}
                                        className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-outfit font-bold flex items-center justify-center gap-2 transition-all"
                                    >
                                        Próxima Questão
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {status === 'RESULT' && (
                <div className="max-w-xl mx-auto py-10 text-center animate-[fade-in_0.4s_ease-out]">
                    <div className="bg-white border-2 border-slate-border rounded-3xl p-8 shadow-xl space-y-6">
                        <div className="w-20 h-20 bg-brand text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                            <Sparkles size={40} className="animate-pulse" />
                        </div>
                        
                        <div>
                            <h2 className="font-outfit text-3xl font-extrabold text-slate-dark leading-tight">Missão Cumprida! 🎉</h2>
                            <p className="text-slate-mid text-sm font-semibold mt-1">Playlist híbrida completada com sucesso!</p>
                        </div>

                        {/* Gamification Box */}
                        <div className="bg-ice border-2 border-slate-border rounded-2xl p-5 flex items-center justify-around gap-4 max-w-sm mx-auto">
                            <div className="text-center">
                                <span className="text-[10px] font-bold text-slate-mid uppercase tracking-widest block">Pontuação</span>
                                <span className="font-outfit font-black text-3xl text-action">{score} pts</span>
                            </div>
                            <div className="w-[1px] h-10 bg-slate-border" />
                            {rewards ? (
                                <>
                                    <div className="text-center">
                                        <span className="text-[10px] font-bold text-slate-mid uppercase tracking-widest block">XP Ganho</span>
                                        <span className="font-outfit font-black text-3xl text-emerald-600">+{rewards.xpGain} XP</span>
                                    </div>
                                    <div className="w-[1px] h-10 bg-slate-border" />
                                    <div className="text-center">
                                        <span className="text-[10px] font-bold text-slate-mid uppercase tracking-widest block">Moedas</span>
                                        <span className="font-outfit font-black text-3xl text-amber-500">+{rewards.coinsGain} DC</span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <span className="text-[10px] font-bold text-slate-mid uppercase tracking-widest block">Resultado</span>
                                    <span className="font-outfit font-black text-xl text-slate-dark">Modo Teste</span>
                                </div>
                            )}
                        </div>

                        {/* History metrics */}
                        <div className="space-y-2 text-left max-w-sm mx-auto pt-2">
                            <h4 className="font-outfit font-extrabold text-sm text-slate-dark">Desempenho detalhado:</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: 'Escuta', key: 'escuta', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
                                    { label: 'Lego', key: 'lego', color: 'bg-amber-50 border-amber-100 text-amber-700' },
                                    { label: 'MRP', key: 'mrp', color: 'bg-blue-50 border-blue-100 text-blue-700' }
                                ].map(gameType => {
                                    const items = history.filter(h => h.type === gameType.key);
                                    const correct = items.filter(i => i.correct).length;
                                    
                                    if (items.length === 0) return null;
                                    
                                    return (
                                        <div key={gameType.key} className={`p-2.5 rounded-xl border text-center ${gameType.color}`}>
                                            <span className="text-[9px] font-extrabold uppercase tracking-wide block">{gameType.label}</span>
                                            <span className="font-outfit font-black text-sm">{correct}/{items.length} ok</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                            <a 
                                href="/dashboard" 
                                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-outfit font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                            >
                                Retornar ao Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Buddy View Component (Visible during gameplay) */}
            {status === 'PLAYING' && (
                <BuddyView 
                    avatarUrl={buddyAvatarUrl} 
                    avatarId={buddyAvatarId} 
                    state={buddyState} 
                    message={buddyMessage} 
                />
            )}
        </div>
    );
};
