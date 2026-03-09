import React, { useState, useEffect } from 'react';
import { Volume2, Edit3 } from 'lucide-react';
import type { LessonItem, ToolType } from './types.ts';

interface LessonSlideProps {
    item: LessonItem;
    index: number;
    currentIndex: number;
    tool: ToolType;
    fontSizeMultiplier: number;
    onWordClick: (word: string) => void;
    onPlayAudio: (item: LessonItem) => void;
    onEditItem: (item: LessonItem) => void;
    isPlaying?: boolean;
}

const WordRevealEffect: React.FC<{
    text: string;
    onWordClick: (word: string) => void;
    tool: ToolType;
    fontSizeMultiplier: number;
    isVisible: boolean;
}> = ({ text, onWordClick, tool, fontSizeMultiplier, isVisible }) => {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        if (isVisible) {
            setVisibleCount(0);
            const interval = setInterval(() => {
                setVisibleCount(prev => {
                    if (prev >= words.length) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 150);
            return () => clearInterval(interval);
        } else {
            setVisibleCount(0);
        }
    }, [text, isVisible]);

    return (
        <div
            className="flex flex-wrap justify-start gap-x-3 md:gap-x-4 gap-y-2 relative leading-tight"
            style={{ fontSize: `clamp(24px, 5vw, ${52 * fontSizeMultiplier}px)` }}
        >
            {words.slice(0, visibleCount).map((word, wIdx) => (
                <span
                    key={wIdx}
                    onClick={(e) => {
                        if (tool === 'dictionary') {
                            e.stopPropagation();
                            onWordClick(word);
                        }
                    }}
                    className={`inline-block py-0.5 md:py-1 px-1.5 md:px-2 rounded-lg md:rounded-xl transition-all select-none animate-typing-word 
            ${tool === 'dictionary' ? 'bg-blue-50 text-blue-700 cursor-help ring-1 md:ring-2 ring-blue-200 pointer-events-auto shadow-sm border-b-2 md:border-b-4 border-blue-200' : 'text-slate-800'}`}
                >
                    {word}
                </span>
            ))}
            {isVisible && visibleCount < words.length && (
                <span className="inline-block w-0.5 md:w-1 bg-purple-500 ml-1 animate-typing-cursor h-[1em]" />
            )}
        </div>
    );
};

export const LessonSlide: React.FC<LessonSlideProps> = ({
    item, index, currentIndex, tool, fontSizeMultiplier,
    onWordClick, onPlayAudio, onEditItem, isPlaying
}) => {
    const isVisible = index <= currentIndex;

    return (
        <div
            id={`slide-${item.id}`}
            className={`w-full group/item mb-8 md:mb-12 transition-all duration-700 transform 
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}
        >
            {item.type === 'text' ? (
                <div className="relative flex-1 text-left flex items-start gap-3 md:gap-6">
                    <div className="flex-1">
                        <WordRevealEffect
                            text={item.content}
                            onWordClick={onWordClick}
                            tool={tool}
                            fontSizeMultiplier={fontSizeMultiplier}
                            isVisible={isVisible}
                        />
                    </div>
                    <div className={`flex flex-col gap-2 transition-opacity pointer-events-auto ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                            onClick={() => onPlayAudio(item)}
                            className={`p-2.5 md:p-4 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 
                ${isPlaying ? 'bg-orange-500 text-white animate-pulse' : 'bg-blue-600 text-white'}`}
                            title="Ouvir Pronúncia"
                        >
                            <Volume2 className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <button
                            onClick={() => onEditItem(item)}
                            className="p-2.5 md:p-4 bg-white text-purple-600 rounded-full shadow-lg opacity-0 group-hover/item:opacity-100 transition-opacity hover:scale-110 border border-slate-100"
                            title="Editar Slide"
                        >
                            <Edit3 className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full rounded-[24px] md:rounded-[40px] overflow-hidden shadow-xl border-4 md:border-8 border-white transform transition-transform group-hover/item:scale-[1.01]">
                    <img src={item.content} className="w-full block" alt="Conteúdo da lição" />
                </div>
            )}
        </div>
    );
};
