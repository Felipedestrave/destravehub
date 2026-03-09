import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    Settings, Play, Plus, Loader2, Save, LayoutGrid, ArrowRight, ArrowLeft,
    X, Wifi, WifiOff, Volume2, Edit3, Wand2
} from 'lucide-react';
import { DrawCanvas } from './DrawCanvas.tsx';
import { DrawToolbar } from './DrawToolbar.tsx';
import { ParticleStage } from './ParticleStage.tsx';
import { LessonSlide } from './LessonSlide.tsx';
import type {
    LessonItem, DrawingStroke, DictionaryResult,
    InteractionType, ToolType, VisualEffect, Lesson
} from './types.ts';

const THEME_COLORS = [
    { name: 'Roxo', value: '#7c3aed' },
    { name: 'Laranja', value: '#f97316' },
    { name: 'Vermelho', value: '#ef4444' },
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Verde', value: '#10b981' }
];

export default function DrawApp() {
    // --- Estados de Modo e UI ---
    const [isConfigMode, setIsConfigMode] = useState(true);
    const [lessonTitle, setLessonTitle] = useState('Nova Aula de Japonês');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // --- Estados de Conteúdo ---
    const [textInput, setTextInput] = useState('');
    const [lessonItems, setLessonItems] = useState<LessonItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1.0);

    // --- Estados de Desenho ---
    const [tool, setTool] = useState<ToolType>('laser');
    const [activeColor, setActiveColor] = useState(THEME_COLORS[0].value);
    const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
    const [laserPos, setLaserPos] = useState({ x: -100, y: -100 });

    // --- Estados de IA e Efeitos ---
    const [dictionary, setDictionary] = useState<DictionaryResult | null>(null);
    const [isSearchingDict, setIsSearchingDict] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
    const [visualEffects, setVisualEffects] = useState<VisualEffect[]>([]);

    // --- Handlers de Navegação ---
    const showNext = useCallback(() => {
        if (currentIndex < lessonItems.length - 1) {
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);
            setTimeout(() => {
                const el = document.getElementById(`slide-${lessonItems[nextIdx].id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
        }
    }, [currentIndex, lessonItems]);

    const showPrev = useCallback(() => {
        if (currentIndex >= 0) {
            const prevIdx = currentIndex - 1;
            setCurrentIndex(prevIdx);
            setTimeout(() => {
                if (prevIdx === -1) window.scrollTo({ top: 0, behavior: 'smooth' });
                else {
                    const el = document.getElementById(`slide-${lessonItems[prevIdx].id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 50);
        }
    }, [currentIndex, lessonItems]);

    // --- Handlers de IA (Chamando Astro Endpoints) ---
    const handleWordClick = async (word: string) => {
        if (isSearchingDict) return;
        setIsSearchingDict(true);
        try {
            const resp = await fetch('/api/ai/dictionary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word })
            });
            const data = await resp.json();
            if (data.error) throw new Error(data.error);
            setDictionary(data);
        } catch (e) {
            console.error('Erro no dicionário:', e);
        } finally {
            setIsSearchingDict(false);
        }
    };

    const playTTS = async (item: LessonItem) => {
        if (isPlayingAudio) return;
        setIsPlayingAudio(item.content);
        try {
            const resp = await fetch('/api/ai/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: item.content })
            });
            const { audio } = await resp.json();
            if (audio) {
                const audioObj = new Audio(`data:audio/mp3;base64,${audio}`);
                audioObj.onended = () => setIsPlayingAudio(null);
                await audioObj.play();
            }
        } catch (e) {
            console.error('Erro no TTS:', e);
            setIsPlayingAudio(null);
        }
    };

    // --- Handlers de Efeitos ---
    const triggerEffect = (type: InteractionType) => {
        const newEffect: VisualEffect = {
            id: Math.random().toString(36).substring(2, 9),
            type,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            timestamp: Date.now()
        };
        setVisualEffects(prev => [...prev, newEffect]);
    };

    // --- Keyboard Shortcuts ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isConfigMode) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') showNext();
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') showPrev();
            if (e.key === 'Escape') setIsConfigMode(true);
            if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                setStrokes(prev => prev.slice(0, -1));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isConfigMode, showNext, showPrev]);

    return (
        <div className={`draw-app-container min-h-screen bg-ice text-slate-dark ${!isConfigMode ? 'presentation-mode' : ''}`}>

            {/* 1. Modo de Configuração (Setup da Aula) */}
            {isConfigMode ? (
                <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 md:space-y-10 animate-fade-in">
                    <header className="flex flex-col xl:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[24px] md:rounded-[30px] shadow-xl border-b-4 border-slate-border gap-6">
                        <div className="flex items-center gap-4 w-full xl:w-auto">
                            <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-ice text-brand rounded-2xl hover:bg-slate-border transition-all flex-shrink-0">
                                <LayoutGrid className="w-6 h-6" />
                            </button>
                            <input
                                type="text"
                                value={lessonTitle}
                                onChange={(e) => setLessonTitle(e.target.value)}
                                className="text-xl md:text-2xl lg:text-3xl font-bold bg-transparent border-none outline-none focus:ring-0 text-slate-dark w-full font-outfit"
                                placeholder="Título da Aula"
                            />
                        </div>
                        <div className="flex flex-wrap sm:flex-nowrap gap-3 md:gap-4 w-full xl:w-auto justify-center md:justify-end">
                            <button className="flex-1 sm:flex-none px-4 md:px-6 py-3 bg-brand text-white rounded-2xl font-bold shadow-lg hover:bg-brand-hover transition-all flex items-center justify-center gap-2">
                                <Save className="w-4 h-4 flex-shrink-0" /> <span className="whitespace-nowrap">Salvar</span>
                            </button>
                            <button
                                onClick={() => lessonItems.length > 0 ? setIsConfigMode(false) : alert('Adicione slides!')}
                                className="flex-1 sm:flex-none px-4 md:px-8 py-3 bg-action text-white rounded-2xl font-bold shadow-btn hover:bg-action-hover transition-all flex items-center justify-center gap-2"
                            >
                                <Play className="w-4 h-4 fill-white flex-shrink-0" /> <span className="whitespace-nowrap">Iniciar Aula</span>
                            </button>
                        </div>
                    </header>

                    <main className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-2xl space-y-8 border-b-[8px] md:border-b-[12px] border-slate-border">
                        <div className="space-y-4">
                            <label className="text-xs font-black text-slate-mid uppercase tracking-widest">Criar Novos Slides</label>
                            <textarea
                                className="w-full h-32 p-4 md:p-6 bg-ice border-2 border-transparent focus:border-lilac rounded-[20px] md:rounded-[24px] outline-none text-base md:text-lg transition-all"
                                placeholder="Cole aqui suas frases em japonês (uma por linha)..."
                                value={textInput}
                                onChange={e => setTextInput(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    const lines = textInput.split('\n').filter(l => l.trim() !== '');
                                    setLessonItems(prev => [...prev, ...lines.map((l, i) => ({
                                        id: `text-${Date.now()}-${i}`,
                                        type: 'text' as const,
                                        content: l.trim()
                                    }))]);
                                    setTextInput('');
                                }}
                                className="w-full bg-brand text-white py-4 rounded-[16px] md:rounded-[20px] font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Adicionar Conteúdo
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:gap-4 overflow-hidden">
                            {lessonItems.map((item, idx) => (
                                <div key={item.id} className="group flex items-center justify-between p-3 md:p-4 bg-ice rounded-xl md:rounded-2xl border border-slate-border hover:border-brand transition-all">
                                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                        <span className="text-xs font-bold text-slate-mid flex-shrink-0">#{idx + 1}</span>
                                        <p className="font-bold text-slate-dark truncate max-w-[150px] sm:max-w-md md:max-w-lg">{item.content}</p>
                                    </div>
                                    <button onClick={() => setLessonItems(prev => prev.filter(i => i.id !== item.id))} className="text-slate-mid hover:text-red-500 p-2 flex-shrink-0">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            ) : (
                /* 2. Modo Apresentação (The Stage) */
                <div className="relative min-h-screen">

                    {/* Camada de Efeitos */}
                    <ParticleStage effects={visualEffects} />

                    {/* Barra de Ferramentas Lateral */}
                    <DrawToolbar
                        tool={tool}
                        setTool={setTool}
                        activeColor={activeColor}
                        setActiveColor={setActiveColor}
                        onUndo={() => setStrokes(prev => prev.slice(0, -1))}
                        onOpenSettings={() => setIsConfigMode(true)}
                    />

                    {/* Controles Rápidos de Efeitos (Direita) - Ocultos em telas muito pequenas ou reposicionados */}
                    <div className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-[4000] flex flex-col gap-2 md:gap-3 p-2 md:p-3 bg-white/90 backdrop-blur-xl rounded-[30px] md:rounded-[40px] shadow-2xl border-2 md:border-4 border-slate-dark">
                        <button onClick={() => triggerEffect('matsuri')} className="p-2 md:p-3 bg-action/10 text-action rounded-full hover:scale-110 transition-all font-bold text-sm md:text-base">🎉</button>
                        <button onClick={() => triggerEffect('rocket')} className="p-2 md:p-3 bg-blue-50 text-blue-500 rounded-full hover:scale-110 transition-all font-bold text-sm md:text-base">🚀</button>
                        <button onClick={() => triggerEffect('focus')} className="p-2 md:p-3 bg-red-50 text-red-500 rounded-full hover:scale-110 transition-all font-bold text-sm md:text-base">💢</button>
                        <button onClick={() => triggerEffect('challenge')} className="p-2 md:p-3 bg-brand/10 text-brand rounded-full hover:scale-110 transition-all font-bold text-sm md:text-base">⚡</button>
                    </div>

                    {/* Dicionário IA Popup */}
                    {dictionary && (
                        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white z-[6000] shadow-2xl border-l-[4px] md:border-l-[6px] border-brand p-6 md:p-8 animate-slide-in overflow-y-auto">
                            <button onClick={() => setDictionary(null)} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-ice rounded-full"><X /></button>
                            <div className="mt-8 space-y-4 md:space-y-6 font-outfit">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-dark">{dictionary.word}</h2>
                                <p className="text-lg md:text-xl text-brand font-medium">【 {dictionary.reading} 】</p>
                                <div className="p-4 md:p-5 bg-ice rounded-2xl">
                                    <h4 className="text-[10px] md:text-xs font-black text-slate-mid uppercase mb-2">Significado</h4>
                                    <p className="text-base md:text-lg">{dictionary.meaning}</p>
                                </div>
                                <div className="p-4 md:p-5 bg-ice rounded-2xl italic border-l-4 border-action">
                                    <h4 className="text-[10px] md:text-xs font-black text-slate-mid uppercase mb-2">Exemplo</h4>
                                    <p className="text-base md:text-lg">"{dictionary.example}"</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Indicador de Laser */}
                    {tool === 'laser' && (
                        <div
                            className="fixed pointer-events-none z-[3500] w-8 h-8 md:w-12 md:h-12 rounded-full blur-[4px] shadow-2xl transition-transform"
                            style={{ left: laserPos.x, top: laserPos.y, transform: 'translate(-50%, -50%)', backgroundColor: activeColor, boxShadow: `0 0 40px ${activeColor}` }}
                        />
                    )}

                    {/* Engine de Desenho */}
                    <DrawCanvas
                        tool={tool}
                        activeColor={activeColor}
                        strokes={strokes}
                        onStrokeComplete={(s) => setStrokes(prev => [...prev, s])}
                        onEraserAction={(x, y) => {
                            const scrollY = window.scrollY;
                            setStrokes(prev => prev.filter(s => !s.points.some(p => {
                                let offsetY = 0;
                                if (s.itemId) {
                                    const el = document.getElementById(`slide-${s.itemId}`);
                                    if (el) offsetY = el.getBoundingClientRect().top + scrollY;
                                }
                                return Math.hypot(p.x - x, p.y + offsetY - (y + scrollY)) < 30;
                            })));
                        }}
                        onLaserMove={(x, y) => setLaserPos({ x, y })}
                    />

                    {/* Conteúdo da Lição (Slides) */}
                    <div className="relative z-[1000] min-h-screen pt-24 md:pt-40 px-6 sm:px-12 md:px-24 pb-[60vh] flex flex-col items-start w-full max-w-7xl mx-auto">
                        {lessonItems.map((item, idx) => (
                            <LessonSlide
                                key={item.id}
                                item={item}
                                index={idx}
                                currentIndex={currentIndex}
                                tool={tool}
                                fontSizeMultiplier={fontSizeMultiplier}
                                onWordClick={handleWordClick}
                                onPlayAudio={playTTS}
                                onEditItem={() => { }}
                                isPlaying={isPlayingAudio === item.content}
                            />
                        ))}
                    </div>

                    {/* Navegação Inferior */}
                    <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-[4000] flex items-center gap-4 md:gap-8 bg-slate-dark/95 text-white px-6 md:px-10 py-3 md:py-5 rounded-full shadow-2xl border border-white/20 backdrop-blur-md">
                        <button onClick={showPrev} className="hover:text-action transition-colors p-1"><ArrowLeft className="w-5 h-5 md:w-6 md:h-6" /></button>
                        <span className="font-black text-lg md:text-xl font-outfit tabular-nums">{currentIndex + 1} / {lessonItems.length}</span>
                        <button onClick={showNext} className="hover:text-action transition-colors p-1"><ArrowRight className="w-5 h-5 md:w-6 md:h-6" /></button>
                    </div>
                </div>
            )}

            {/* Estilos Auxiliares */}
            <style>{`
        .draw-app-container {
          overflow-x: hidden;
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
        </div>
    );
}
