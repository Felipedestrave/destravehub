import React, { useState, useEffect, useRef } from 'react';
import {
    Play, Pause, HelpCircle, Check, X, ArrowRight,
    Lightbulb, Gauge, MapPin,
} from 'lucide-react';
import type { GeneratedData } from '../../types/escuta';
import { Difficulty } from '../../types/escuta';

interface GameScreenProps {
    data: GeneratedData;
    onAnswer: (index: number, usedHint: boolean) => void;
    onNext: () => void;
    isAnswered: boolean;
    scoreAdjustment: number | null;
}

export const GameScreen: React.FC<GameScreenProps> = ({
    data, onAnswer, onNext, isAnswered, scoreAdjustment,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [shuffledOptions, setShuffledOptions] = useState<{ text: string, originalIndex: number }[]>([]);

    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);

    useEffect(() => {
        setShowHint(false);
        setSelectedIdx(null);

        const setup = async () => {
            stopAudio();
            audioBufferRef.current = null;
            try {
                if (!audioContextRef.current) {
                    audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({ sampleRate: 24000 });
                }
                if (audioContextRef.current.state === 'suspended') {
                    await audioContextRef.current.resume();
                }
                audioBufferRef.current = decodePCM(data.audioBase64, audioContextRef.current);
                playAudio();
            } catch (err) {
                console.error('Erro ao configurar áudio:', err);
            }
        };

        setup();

        // Shuffling options
        if (data.question.options) {
            const optsWithIndex = data.question.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
            // Using a simple shuffle since we don't have access to lib/utils here directly without import
            // But actually, we can just sort random
            const shuffled = [...optsWithIndex].sort(() => Math.random() - 0.5);
            setShuffledOptions(shuffled);
        }

        return () => stopAudio();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (sourceRef.current) sourceRef.current.playbackRate.value = playbackSpeed;
    }, [playbackSpeed]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying]);

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

    const playAudio = async () => {
        if (!audioContextRef.current || !audioBufferRef.current) return;
        if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
        if (sourceRef.current) { try { sourceRef.current.stop(); } catch (_) { } }
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;
        source.playbackRate.value = playbackSpeed;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsPlaying(false);
        sourceRef.current = source;
        source.start(0);
        setIsPlaying(true);
    };

    const stopAudio = () => {
        if (sourceRef.current) { try { sourceRef.current.stop(); } catch (_) { } sourceRef.current = null; }
        setIsPlaying(false);
    };

    const togglePlay = () => (isPlaying ? stopAudio() : playAudio());

    const handleOption = (shuffledIdx: number) => {
        if (isAnswered) return;
        setSelectedIdx(shuffledIdx);
        const originalIdx = shuffledOptions[shuffledIdx].originalIndex;
        onAnswer(originalIdx, showHint);
    };

    const getOptionStyle = (idx: number): string => {
        const base = 'p-4 rounded-2xl text-left font-inter font-medium transition-all duration-200 border-2 w-full';
        if (!isAnswered) {
            return `${base} ${selectedIdx === idx
                    ? 'bg-brand/8 border-brand text-slate-dark shadow-md'
                    : 'bg-white border-slate-border text-slate-dark hover:border-brand/40 hover:bg-brand/4'
                }`;
        }
        const originalIdx = shuffledOptions[idx].originalIndex;
        if (originalIdx === data.question.correct_index) return `${base} bg-emerald-50 border-emerald-400 text-emerald-800`;
        if (selectedIdx === idx) return `${base} bg-red-50 border-red-400 text-red-800 opacity-80`;
        return `${base} bg-white border-slate-border text-slate-mid opacity-40`;
    };

    const getDifficultyStyle = (diff?: Difficulty): string => {
        switch (diff) {
            case Difficulty.EASY: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case Difficulty.MEDIUM: return 'bg-amber-50 text-amber-700 border-amber-200';
            case Difficulty.HARD: return 'bg-brand/8 text-brand border-brand/20';
            default: return 'bg-ice text-slate-mid border-slate-border';
        }
    };

    const speeds = [0.8, 0.9, 1.0, 1.2];
    const isCorrect = selectedIdx !== null && shuffledOptions[selectedIdx]?.originalIndex === data.question.correct_index;

    return (
        <div className="max-w-2xl mx-auto w-full py-6 px-4">
            {/* Meta Tags */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-outfit uppercase tracking-wider border ${getDifficultyStyle(data.actualDifficulty)}`}>
                    Nível {data.actualDifficulty}
                </span>
                {data.question.context_name && (
                    <span className="inline-flex items-center gap-1.5 badge-neutral">
                        <MapPin size={10} className="text-action" />
                        {data.question.context_name}
                    </span>
                )}
            </div>

            {/* Audio Player Card */}
            <div className="card mb-6 flex flex-col items-center gap-5 relative overflow-hidden">
                {/* Decorative accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand via-brand/60 to-action rounded-t-3xl" />

                {/* Play Button */}
                <button
                    onClick={togglePlay}
                    className={`mt-2 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 font-bold shadow-lg ${isPlaying
                            ? 'bg-action text-white scale-95 shadow-action/30'
                            : 'bg-brand text-white hover:scale-105 hover:shadow-brand/30'
                        }`}
                    style={{ boxShadow: isPlaying ? '0 8px 24px -4px rgba(255,127,50,0.4)' : '0 8px 24px -4px rgba(88,49,126,0.35)' }}
                >
                    {isPlaying ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" className="ml-1" />}
                </button>

                <p className="text-slate-mid text-sm font-inter">
                    {isPlaying ? 'Ouvindo...' : 'Toque para ouvir · Espaço atalho'}
                </p>

                {/* Speed Control */}
                <div className="flex items-center gap-1 bg-ice p-1.5 rounded-xl border border-slate-border">
                    <Gauge size={14} className="text-slate-mid ml-1" />
                    {speeds.map((s) => (
                        <button
                            key={s}
                            onClick={() => setPlaybackSpeed(s)}
                            className={`px-3 py-1 text-xs font-bold font-outfit rounded-lg transition-all ${playbackSpeed === s
                                    ? 'bg-brand text-white shadow'
                                    : 'text-slate-mid hover:text-slate-dark hover:bg-white'
                                }`}
                        >
                            {s}x
                        </button>
                    ))}
                </div>
            </div>

            {/* Options */}
            <div className="mb-6">
                <h3 className="font-outfit font-bold text-slate-dark text-xl mb-4">O que foi dito?</h3>
                <div className="flex flex-col gap-3">
                    {shuffledOptions.map((opt, idx) => (
                        <button
                            key={idx}
                            disabled={isAnswered}
                            onClick={() => handleOption(idx)}
                            className={getOptionStyle(idx)}
                        >
                            <div className="flex items-center justify-between">
                                <span>{opt.text}</span>
                                {isAnswered && opt.originalIndex === data.question.correct_index && (
                                    <Check size={18} className="text-emerald-600 shrink-0" />
                                )}
                                {isAnswered && selectedIdx === idx && opt.originalIndex !== data.question.correct_index && (
                                    <X size={18} className="text-red-500 shrink-0" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Hint + Next */}
            <div className="flex items-center justify-between gap-4 mb-4">
                {!isAnswered ? (
                    <button
                        onClick={() => setShowHint(true)}
                        disabled={showHint}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold font-outfit transition-all border-2 ${showHint
                                ? 'bg-action/10 text-action border-action/30 cursor-default'
                                : 'bg-white text-action border-slate-border hover:border-action/40'
                            }`}
                    >
                        <Lightbulb size={16} />
                        {showHint ? 'Dica ativada' : 'Pedir dica'}
                    </button>
                ) : <div />}

                {isAnswered && (
                    <button
                        onClick={onNext}
                        className="btn-action ml-auto flex items-center gap-2"
                    >
                        Próxima <ArrowRight size={18} />
                    </button>
                )}
            </div>

            {/* Hint Box */}
            {showHint && !isAnswered && (
                <div className="p-4 bg-action/5 border-2 border-action/20 rounded-2xl text-action/90 text-sm flex items-start gap-3">
                    <HelpCircle size={18} className="shrink-0 mt-0.5" />
                    <p className="font-inter">{data.question.hint}</p>
                </div>
            )}

            {/* Result Panel */}
            {isAnswered && (
                <div className={`mt-4 p-6 rounded-2xl border-2 ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                    }`}>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className={`font-outfit font-bold text-xl ${isCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
                            {isCorrect ? '✓ Correto!' : '✗ Incorreto'}
                        </h4>
                        {scoreAdjustment !== null && (
                            <span className={`font-outfit font-black text-2xl ${scoreAdjustment > 0 ? 'text-emerald-600' : 'text-slate-mid'}`}>
                                {scoreAdjustment > 0 ? `+${scoreAdjustment}` : '+0'}
                            </span>
                        )}
                    </div>

                    {/* Transcription */}
                    <div className="bg-white p-4 rounded-xl mb-4 border border-slate-border">
                        <p className="text-xs font-outfit uppercase tracking-widest text-slate-mid mb-2">Transcrição</p>
                        <p className="font-jp text-2xl text-slate-dark leading-relaxed mb-1">{data.question.japanese_sentence}</p>
                        {data.question.romaji && (
                            <p className="font-inter text-sm text-slate-mid italic">{data.question.romaji}</p>
                        )}
                    </div>

                    {/* Explanation */}
                    {data.question.explanation && (
                        <p className="font-inter text-sm text-slate-dark leading-relaxed">
                            <span className="font-bold text-slate-dark">Explicação: </span>
                            {data.question.explanation}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};
