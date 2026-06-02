import React, { useState, useEffect } from 'react';
import { ArrowRight, RotateCcw, Check, SkipForward } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { LegoSentence, LegoBlock, LegoBlockType } from '../../types/lego';
import { shuffleArray } from '../../lib/utils';
import type { BuddyState } from '../buddy/BuddyView';

interface GameScreenProps {
    sentences: LegoSentence[];
    onComplete: (score: number) => void;
    onTriggerBuddy: (state: BuddyState, type?: 'success' | 'error', customMsg?: string) => void;
}

const getBlockColor = (type: LegoBlockType) => {
    switch (type) {
        case 'SUBJECT': return 'bg-brand text-white border-brand-dark';
        case 'OBJECT': return 'bg-brand text-white border-brand-dark';
        case 'VERB': return 'bg-action text-white border-action-dark'; // Laranja
        case 'PARTICLE': return 'bg-purple-200 text-brand border-purple-300'; // Lilás
        case 'TIME': return 'bg-emerald-500 text-white border-emerald-600';
        case 'ADJECTIVE': return 'bg-sky-500 text-white border-sky-600';
        default: return 'bg-slate-200 text-slate-700 border-slate-300';
    }
};

const SortableBlock = ({ block, onClick }: { block: LegoBlock; onClick?: () => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className={`cursor-grab active:cursor-grabbing px-4 py-2 rounded-xl border-b-4 font-outfit font-bold shadow-sm touch-manipulation flex flex-col items-center justify-center min-w-[3rem] ${getBlockColor(block.type)}`}
        >
            <span className="text-lg leading-tight">{block.word}</span>
            {block.romaji && <span className="text-[0.65rem] opacity-75 font-inter mt-0.5 font-normal tracking-wide">({block.romaji})</span>}
        </div>
    );
};

export const GameScreen: React.FC<GameScreenProps> = ({ sentences, onComplete, onTriggerBuddy }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [available, setAvailable] = useState<LegoBlock[]>([]);
    const [board, setBoard] = useState<LegoBlock[]>([]);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [status, setStatus] = useState<'playing' | 'correct' | 'revealed'>('playing');

    const currentSentence = sentences[currentIndex];

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (currentSentence) {
            setAvailable(shuffleArray([...currentSentence.blocks]));
            setBoard([]);
            setAttempts(0);
            setStatus('playing');
        }
    }, [currentSentence]);

    if (!currentSentence) return null;

    const moveToBoard = (block: LegoBlock) => {
        if (status !== 'playing') return;
        setAvailable(prev => prev.filter(b => b.id !== block.id));
        setBoard(prev => [...prev, block]);
    };

    const moveToAvailable = (block: LegoBlock) => {
        if (status !== 'playing') return;
        setBoard(prev => prev.filter(b => b.id !== block.id));
        setAvailable(prev => [...prev, block]);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        if (status !== 'playing') return;
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setBoard((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleRevealAnswer = () => {
        setBoard([...currentSentence.blocks]);
        setAvailable([]);
        onTriggerBuddy('error', undefined, 'Aqui está a resposta correta! Vamos continuar praticando.');
        setStatus('revealed');
    };

    const handleNext = () => {
        if (currentIndex + 1 < sentences.length) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete(score);
        }
    };

    const handleVerify = () => {
        if (board.length !== currentSentence.blocks.length) {
            onTriggerBuddy('error', undefined, 'Use todas as peças para montar a frase!');
            return;
        }

        const isCorrect = board.every((b, i) => b.id === currentSentence.blocks[i].id);

        if (isCorrect) {
            const points = attempts === 0 ? 20 : (attempts === 1 ? 10 : 5);
            setScore(prev => prev + points);
            onTriggerBuddy('success', 'success');
            setStatus('correct');
        } else {
            setAttempts(prev => prev + 1);
            
            // Analyze error (e.g. verb not at the end)
            const lastBlock = board[board.length - 1];
            let errorMsg = 'Ops, a ordem não está certa.';
            if (lastBlock.type !== 'VERB' && currentSentence.blocks[currentSentence.blocks.length - 1].type === 'VERB') {
                errorMsg = 'Lembre-se: em japonês, o verbo (laranja) geralmente fica no final da frase!';
            } else if (board.some((b, i) => b.type === 'PARTICLE' && i === 0)) {
                errorMsg = 'Uma partícula (lilás) quase nunca começa a frase. Ela serve para colar palavras!';
            }
            
            onTriggerBuddy('error', undefined, errorMsg);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 animate-[fade-in_0.4s_ease-out]">
            {/* Header / Progress */}
            <div className="flex justify-between items-center bg-white px-5 py-3 rounded-2xl border-[1.5px] border-slate-border shadow-sm">
                <div className="font-outfit font-extrabold text-slate-dark text-lg">
                    Desafio <span className="text-brand">{currentIndex + 1}</span> / {sentences.length}
                </div>
                <div className="text-sm font-bold text-slate-mid">
                    Tradução Alvo
                </div>
            </div>

            {/* Target Translation */}
            <div className="text-center bg-ice rounded-2xl p-6 border border-dashed border-slate-border">
                <h3 className="font-inter text-xl font-semibold text-brand m-0">"{currentSentence.translation}"</h3>
            </div>

            {/* Board (Dropzone) */}
            <div className="bg-white rounded-2xl border-2 border-slate-border min-h-[120px] p-4 flex flex-wrap content-start gap-2 shadow-inner">
                {board.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-outfit font-bold text-lg">
                        Toque nas peças para montar aqui
                    </div>
                )}
                
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={board.map(b => b.id)} strategy={horizontalListSortingStrategy}>
                        {board.map(block => (
                            <SortableBlock key={block.id} block={block} onClick={() => moveToAvailable(block)} />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            {/* Available Blocks */}
            <div className="bg-slate-50 rounded-2xl border-[1.5px] border-slate-200 min-h-[120px] p-4 flex flex-wrap content-start gap-2 justify-center">
                {available.map(block => (
                    <button
                        key={block.id}
                        onClick={() => moveToBoard(block)}
                        className={`px-4 py-2 rounded-xl border-b-4 font-outfit font-bold shadow-sm transition-transform hover:-translate-y-1 active:translate-y-0 flex flex-col items-center justify-center ${getBlockColor(block.type)}`}
                    >
                        <span className="text-lg leading-tight">{block.word}</span>
                        {block.romaji && <span className="text-[0.65rem] opacity-75 font-inter mt-0.5 font-normal tracking-wide">({block.romaji})</span>}
                    </button>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-4">
                {status === 'playing' ? (
                    <>
                        <button
                            onClick={() => { setAvailable(shuffleArray([...currentSentence.blocks])); setBoard([]); }}
                            className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-mid font-outfit font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                        >
                            <RotateCcw size={20} />
                            Resetar
                        </button>
                        
                        {attempts >= 2 && (
                            <button
                                onClick={handleRevealAnswer}
                                className="flex-[0.8] py-4 rounded-2xl bg-amber-100 text-amber-700 font-outfit font-bold text-lg flex items-center justify-center gap-2 hover:bg-amber-200 transition-colors px-2"
                                title="Mostrar Resposta"
                            >
                                <SkipForward size={20} />
                                <span className="hidden sm:inline">Pular</span>
                            </button>
                        )}

                        <button
                            onClick={handleVerify}
                            className="flex-[2] py-4 rounded-2xl bg-action text-white font-outfit font-extrabold text-lg flex items-center justify-center gap-2 hover:brightness-110 shadow-md shadow-action/20 transition-all active:scale-95"
                        >
                            <Check size={20} />
                            Verificar
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleNext}
                        className="w-full py-4 rounded-2xl bg-brand text-white font-outfit font-extrabold text-lg flex items-center justify-center gap-2 hover:brightness-110 shadow-md shadow-brand/20 transition-all active:scale-95"
                    >
                        {currentIndex + 1 < sentences.length ? (
                            <>Próximo <ArrowRight size={20} /></>
                        ) : (
                            <>Finalizar <Check size={20} /></>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};
