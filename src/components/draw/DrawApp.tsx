import React, { useState, useCallback, useEffect } from 'react';
import {
    Settings, Play, Plus, Loader2, Save, LayoutGrid, ArrowRight, ArrowLeft,
    X, Wifi, WifiOff, Volume2, Edit3, Wand2, ImagePlus, Upload, Trash2, Check
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
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

interface DrawAppProps {
    isReadOnly?: boolean;
    senseiData?: {
        name: string;
        avatar: string;
        whatsapp?: string;
    } | null;
}

export default function DrawApp({ isReadOnly = false, senseiData = null }: DrawAppProps) {
    // --- Estados de Modo e UI ---
    const [isConfigMode, setIsConfigMode] = useState(!isReadOnly);
    const [lessonTitle, setLessonTitle] = useState('Nova Aula de Japonês');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    // --- Estados de Conteúdo ---
    const [textInput, setTextInput] = useState('');
    const [lessonItems, setLessonItems] = useState<LessonItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1.0);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const handleFontSizeChange = useCallback((delta: number) => {
        setFontSizeMultiplier(prev => {
            const next = Math.round((prev + delta) * 10) / 10;
            return Math.min(2.0, Math.max(0.5, next));
        });
    }, []);

    const handleToggleSidebar = useCallback(() => {
        setIsSidebarCollapsed(prev => {
            const next = !prev;
            window.dispatchEvent(new CustomEvent('draw-sidebar-toggle', { detail: { collapsed: next } }));
            return next;
        });
    }, []);

    // --- Initialization & Loading ---
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const idToEdit = params.get('edit');
        const idToPlay = params.get('play');
        
        const finalId = idToEdit || idToPlay;
        if (finalId) {
            setEditId(idToEdit);
            loadLesson(finalId);
            if (idToPlay) setIsConfigMode(false);
        }
    }, []);

    const loadLesson = async (id: string) => {
        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            // No modo read-only (aluno), podemos carregar sem sessão se a API permitir ou se tivermos o token na URL
            // Mas para o Testar Agora do professor, a sessão existirá.
            
            const headers: Record<string, string> = {};
            if (session) headers['Authorization'] = `Bearer ${session.access_token}`;

            const res = await fetch('/api/activities/list', { headers });
            const data = await res.json();
            const lesson = data.activities?.find((a: any) => a.id === id);

            if (lesson && lesson.config) {
                setLessonTitle(lesson.title || 'Nova Aula');
                setLessonItems(lesson.config.items || []);
                setStrokes(lesson.config.strokes || []);
            }
        } catch (err) {
            console.error('Erro ao carregar aula:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Estados de Desenho ---
    const [tool, setTool] = useState<ToolType>('laser');
    const [activeColor, setActiveColor] = useState(THEME_COLORS[0].value);
    const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
    const [laserPos, setLaserPos] = useState({ x: -100, y: -100 });
    const [laserColor, setLaserColor] = useState(THEME_COLORS[0].value);
    const [isLaserVisible, setIsLaserVisible] = useState(false);

    // --- Realtime Sync ---
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('edit') || params.get('play');
        if (!id) return;

        const channel = supabase.channel(`lesson-${id}`, {
            config: { broadcast: { self: false } }
        });

        channel
            .on('broadcast', { event: 'laser' }, ({ payload }) => {
                if (isReadOnly) {
                    setLaserPos(payload.pos);
                    setLaserColor(payload.color); 
                    setIsLaserVisible(true);
                }
            })
            .on('broadcast', { event: 'laser_hide' }, () => {
                if (isReadOnly) setIsLaserVisible(false);
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [isReadOnly]);

    // --- Global Pointer Move (Laser Tracking) ---
    useEffect(() => {
        let lastBroadcast = 0;
        const handlePointerMove = (e: PointerEvent) => {
            if (!isReadOnly && tool === 'laser') {
                const pos = { x: e.clientX, y: e.clientY };
                setLaserPos(pos);
                setIsLaserVisible(true);

                // Throttled broadcast (max 30fps / ~33ms)
                const now = Date.now();
                if (now - lastBroadcast > 33) {
                    const params = new URLSearchParams(window.location.search);
                    const id = params.get('edit') || params.get('play');
                    if (id) {
                        supabase.channel(`lesson-${id}`).send({
                            type: 'broadcast',
                            event: 'laser',
                            payload: { pos, color: activeColor }
                        });
                        lastBroadcast = now;
                    }
                }
            }
        };

        window.addEventListener('pointermove', handlePointerMove);
        return () => window.removeEventListener('pointermove', handlePointerMove);
    }, [isReadOnly, tool]);

    useEffect(() => {
        if (!isReadOnly && tool !== 'laser') {
            setIsLaserVisible(false);
            // Opcional: Broadcast para o aluno sumir com o laser imediatamente
            const params = new URLSearchParams(window.location.search);
            const id = params.get('edit') || params.get('play');
            if (id) {
                supabase.channel(`lesson-${id}`).send({
                    type: 'broadcast',
                    event: 'laser_hide',
                    payload: {}
                });
            }
        }
    }, [tool, isReadOnly]);

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
            const data = await resp.json();
            if (data.audio) {
                // Agora usando audio/wav pois o backend injeta o header WAV
                const audioObj = new Audio(`data:audio/wav;base64,${data.audio}`);
                audioObj.onended = () => setIsPlayingAudio(null);
                await audioObj.play();
            }
        } catch (e) {
            console.error('Erro no TTS:', e);
            setIsPlayingAudio(null);
        }
    };

    const handleGenerateImage = async (item: LessonItem, index: number) => {
        if (generatingId) return;
        setGeneratingId(item.id);
        try {
            const resp = await fetch('/api/ai/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: item.content })
            });
            const data = await resp.json();
            if (data.imageUrl) {
                // Inserir a imagem gerada no PRÓXIMO slide
                const newImageItem: LessonItem = {
                    id: `img-${Date.now()}`,
                    type: 'image',
                    content: data.imageUrl,
                    fullScreen: true
                };
                setLessonItems(prev => {
                    const newList = [...prev];
                    newList.splice(index + 1, 0, newImageItem);
                    return newList;
                });
            }
        } catch (e) {
            console.error('Erro ao gerar imagem:', e);
        } finally {
            setGeneratingId(null);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        try {
            const fileName = `lesson-images/${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage
                .from('materials')
                .upload(fileName, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('materials')
                .getPublicUrl(fileName);

            const newImageItem: LessonItem = {
                id: `img-${Date.now()}`,
                type: 'image',
                content: publicUrl,
                fullScreen: true
            };

            setLessonItems(prev => {
                const newList = [...prev];
                newList.splice(index + 1, 0, newImageItem);
                return newList;
            });
        } catch (err) {
            console.error('Erro no upload:', err);
            alert('Falha ao subir imagem.');
        } finally {
            setIsLoading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleUpdateItemContent = (id: string, newContent: string) => {
        setLessonItems(prev => prev.map(item => 
            item.id === id ? { ...item, content: newContent } : item
        ));
    };

    const handleSave = async () => {
        if (lessonItems.length === 0) return alert('Adicione pelo menos um slide!');
        setIsSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) throw new Error('Não autenticado.');

            const url = editId ? '/api/activities/update' : '/api/activities/save';
            const method = editId ? 'PUT' : 'POST';

            const resp = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: editId,
                    title: lessonTitle,
                    type: 'draw',
                    config: {
                        items: lessonItems,
                        strokes: strokes
                    }
                })
            });

            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || 'Erro ao salvar.');

            alert('Aula salva com sucesso! 🎉');
        } catch (err: any) {
            console.error('Erro ao salvar aula:', err);
            alert(`Erro ao salvar: ${err.message}`);
        } finally {
            setIsSaving(false);
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
            if (e.key === 'Escape' && !isReadOnly) setIsConfigMode(true);
            if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !isReadOnly) {
                e.preventDefault();
                setStrokes(prev => prev.slice(0, -1));
            }
            // Font size shortcuts: Shift+= to grow, Shift+- to shrink
            if (e.shiftKey && e.key === '+') { e.preventDefault(); handleFontSizeChange(0.1); }
            if (e.shiftKey && e.key === '_') { e.preventDefault(); handleFontSizeChange(-0.1); }
            // Sidebar toggle: F key
            if (e.key === 'f' || e.key === 'F') handleToggleSidebar();
            // Atalhos para animações (1-5)
            if (e.key === '1') triggerEffect('matsuri');
            if (e.key === '2') triggerEffect('rocket');
            if (e.key === '3') triggerEffect('sweat');
            if (e.key === '4') triggerEffect('focus');
            if (e.key === '5') triggerEffect('challenge');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isConfigMode, showNext, showPrev, isReadOnly, handleFontSizeChange, handleToggleSidebar]);

    return (
        <div className={`draw-app-container min-h-screen bg-ice text-slate-dark font-hand ${!isConfigMode ? 'presentation-mode' : ''}`}>

            {/* 1. Modo de Configuração (Setup da Aula) */}
            {isConfigMode ? (
                <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 md:space-y-10 animate-fade-in">
                    <header className="flex flex-col xl:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-[24px] md:rounded-[30px] shadow-xl border-b-4 border-slate-border gap-6">
                        <div className="flex items-center gap-4 w-full xl:w-auto">
                            <button 
                                onClick={() => window.location.href = '/dashboard?tab=activities'} 
                                className="p-3 bg-ice text-brand rounded-2xl hover:bg-slate-border transition-all flex-shrink-0"
                                title="Voltar para Biblioteca"
                            >
                                <LayoutGrid className="w-6 h-6" />
                            </button>
                            <input
                                type="text"
                                value={lessonTitle}
                                onChange={(e) => setLessonTitle(e.target.value)}
                                className="text-xl md:text-2xl lg:text-3xl font-bold bg-transparent border-none outline-none focus:ring-0 text-slate-dark w-full"
                                placeholder="Título da Aula"
                            />
                        </div>
                        <div className="flex flex-wrap sm:flex-nowrap gap-3 md:gap-4 w-full xl:w-auto justify-center md:justify-end">
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 sm:flex-none px-4 md:px-6 py-3 bg-brand text-white rounded-2xl font-bold shadow-lg hover:bg-brand-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 flex-shrink-0" />} 
                                <span className="whitespace-nowrap">{isSaving ? 'Salvando...' : 'Salvar'}</span>
                            </button>
                            <button
                                onClick={() => {
                                    if (lessonItems.length === 0) { alert('Adicione slides!'); return; }
                                    setIsConfigMode(false);
                                    // Auto-collapse sidebar on lesson start
                                    setIsSidebarCollapsed(true);
                                    window.dispatchEvent(new CustomEvent('draw-sidebar-toggle', { detail: { collapsed: true } }));
                                }}
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
                                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden flex-1">
                                        <span className="text-xs font-bold text-slate-mid flex-shrink-0">#{idx + 1}</span>
                                        {item.type === 'image' ? (
                                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-border bg-white flex-shrink-0">
                                                <img src={item.content} alt="Slide Preview" className="w-full h-full object-cover" />
                                            </div>
                                        ) : null}
                                        
                                        {editingId === item.id ? (
                                            <input 
                                                autoFocus
                                                className="font-bold text-slate-dark bg-white border-2 border-brand rounded-lg px-2 py-1 w-full outline-none"
                                                value={item.content}
                                                onChange={(e) => handleUpdateItemContent(item.id, e.target.value)}
                                                onBlur={() => setEditingId(null)}
                                                onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                                            />
                                        ) : (
                                            <p className="font-bold text-slate-dark truncate max-w-[150px] sm:max-w-md md:max-w-lg">
                                                {item.content}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 md:gap-2">
                                        {item.type === 'text' && (
                                            <>
                                                <button 
                                                    onClick={() => playTTS(item)}
                                                    className={`p-2 rounded-lg transition-all ${isPlayingAudio === item.content ? 'bg-brand text-white' : 'text-slate-mid hover:bg-white hover:text-brand'}`}
                                                    title="Ouvir Frase"
                                                >
                                                    <Volume2 className={`w-4 h-4 md:w-5 md:h-5 ${isPlayingAudio === item.content ? 'animate-pulse' : ''}`} />
                                                </button>
                                                <button 
                                                    onClick={() => handleGenerateImage(item, idx)}
                                                    disabled={generatingId === item.id}
                                                    className="p-2 text-slate-mid hover:bg-white hover:text-brand rounded-lg transition-all disabled:opacity-50"
                                                    title="Gerar Imagem 3D"
                                                >
                                                    {generatingId === item.id ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Wand2 className="w-4 h-4 md:w-5 md:h-5" />}
                                                </button>
                                            </>
                                        )}
                                        
                                        <button 
                                            onClick={() => document.getElementById(`upload-${item.id}`)?.click()}
                                            className="p-2 text-slate-mid hover:bg-white hover:text-brand rounded-lg transition-all"
                                            title="Upload de Imagem"
                                        >
                                            <Upload className="w-4 h-4 md:w-5 md:h-5" />
                                            <input 
                                                type="file" 
                                                id={`upload-${item.id}`} 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, idx)}
                                            />
                                        </button>

                                        <button 
                                            onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                                            className={`p-2 rounded-lg transition-all ${editingId === item.id ? 'bg-brand text-white' : 'text-slate-mid hover:bg-white hover:text-brand'}`}
                                            title="Editar Texto"
                                        >
                                            {editingId === item.id ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <Edit3 className="w-4 h-4 md:w-5 md:h-5" />}
                                        </button>

                                        <button 
                                            onClick={() => setLessonItems(prev => prev.filter(i => i.id !== item.id))} 
                                            className="p-2 text-slate-mid hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                                            title="Deletar Slide"
                                        >
                                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                    </div>
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

                    {/* Barra de Ferramentas Lateral (Somente para Professores) */}
                    {!isReadOnly && (
                        <DrawToolbar
                            tool={tool}
                            setTool={setTool}
                            activeColor={activeColor}
                            setActiveColor={setActiveColor}
                            onUndo={() => setStrokes(prev => prev.slice(0, -1))}
                            onOpenSettings={() => {
                                setIsConfigMode(true);
                                // Restore sidebar when going back to config
                                setIsSidebarCollapsed(false);
                                window.dispatchEvent(new CustomEvent('draw-sidebar-toggle', { detail: { collapsed: false } }));
                            }}
                            fontSizeMultiplier={fontSizeMultiplier}
                            onFontSizeChange={handleFontSizeChange}
                            isSidebarCollapsed={isSidebarCollapsed}
                            onToggleSidebar={handleToggleSidebar}
                        />
                    )}

                    {/* Controles Rápidos de Efeitos (Direita/Topo) - Somente Professores */}
                    {!isReadOnly && (
                        <div className="fixed top-4 right-4 md:top-1/2 md:right-4 md:-translate-y-1/2 z-[4000] flex flex-row md:flex-col gap-2 md:gap-3 p-2 md:p-3 bg-white/90 backdrop-blur-xl rounded-full md:rounded-[40px] shadow-2xl border-2 md:border-4 border-slate-dark">
                            <button onClick={() => triggerEffect('matsuri')} className="p-1.5 md:p-3 bg-action/10 text-action rounded-full hover:scale-110 transition-all font-bold text-lg md:text-xl" title="Matsuri [1]">🎉</button>
                            <button onClick={() => triggerEffect('rocket')} className="p-1.5 md:p-3 bg-blue-50 text-blue-500 rounded-full hover:scale-110 transition-all font-bold text-lg md:text-xl" title="Sucesso [2]">🚀</button>
                            <button onClick={() => triggerEffect('sweat')} className="p-1.5 md:p-3 bg-blue-50 text-blue-500 rounded-full hover:scale-110 transition-all font-bold text-lg md:text-xl" title="Esforço [3]">💦</button>
                            <button onClick={() => triggerEffect('focus')} className="p-1.5 md:p-3 bg-red-50 text-red-500 rounded-full hover:scale-110 transition-all font-bold text-lg md:text-xl" title="Foco [4]">💢</button>
                            <button onClick={() => triggerEffect('challenge')} className="p-1.5 md:p-3 bg-brand/10 text-brand rounded-full hover:scale-110 transition-all font-bold text-lg md:text-xl" title="Desafio [5]">⚡</button>
                        </div>
                    )}

                    {/* Intervenção do Sensei (Modo Aluno) */}
                    {isReadOnly && senseiData && (
                        <div className="fixed top-6 right-6 z-[5000] animate-fade-in">
                             <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border-2 border-brand flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-light">
                                    <img src={senseiData.avatar} alt={senseiData.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-brand uppercase tracking-tighter">Seu Sensei</p>
                                    <p className="font-bold text-slate-dark leading-tight">{senseiData.name}</p>
                                </div>
                                {senseiData.whatsapp && (
                                    <a 
                                        href={`https://wa.me/${senseiData.whatsapp}`} 
                                        target="_blank" 
                                        className="ml-2 p-2 bg-green-500 text-white rounded-full hover:scale-110 transition-transform"
                                        title="Dúvidas no WhatsApp"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-2.203 0-4.007 1.77-4.007 3.934 0 2.165 1.804 3.934 4.007 3.934 2.203 0 4.008-1.769 4.008-3.934 0-2.165-1.805-3.934-4.008-3.934zm0-2.172c3.42 0 6.208 2.748 6.208 6.106 0 3.359-2.788 6.107-6.208 6.107-3.42 0-6.208-2.748-6.208-6.107 0-3.358 2.788-6.106 6.208-6.106zm7.969 10.021c0 .874-.11 1.748-.328 2.623l1.312.438c.219-.875.328-1.749.328-2.624h-1.312zm-15.938 0c0 .875.109 1.749.328 2.624l-1.312.438c-.219-.875-.328-1.749-.328-2.624h1.312zm7.969 7.979c-2.203 0-4.007-1.77-4.007-3.934h-2.188c0 3.359 2.788 6.107 6.208 6.107 3.42 0 6.208-2.748 6.208-6.107h-2.188c.013 2.164-1.805 3.934-4.013 3.934z"/></svg>
                                    </a>
                                )}
                             </div>
                        </div>
                    )}

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

                    {/* Indicador de Laser (Visível para ambos se houver movimento) */}
                    {isLaserVisible && (
                        <div
                            className="fixed pointer-events-none z-[3500] w-8 h-8 md:w-12 md:h-12 rounded-full blur-[4px] shadow-2xl transition-transform"
                            style={{ 
                                left: laserPos.x, 
                                top: laserPos.y, 
                                transform: 'translate(-50%, -50%)', 
                                backgroundColor: isReadOnly ? laserColor : activeColor, 
                                boxShadow: `0 0 40px ${isReadOnly ? laserColor : activeColor}` 
                            }}
                        />
                    )}

                    {/* Engine de Desenho (Somente para Professores) */}
                    {!isReadOnly && (
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
                        />
                    )}

                    {/* Conteúdo da Lição (Slides) */}
                    <div className="relative z-[1000] min-h-screen pt-24 md:pt-40 px-6 sm:px-12 md:px-24 pb-[60vh] flex flex-col items-start w-full max-w-7xl mx-auto">
                        {lessonItems.map((item, idx) => (
                            <LessonSlide
                                key={item.id}
                                item={item}
                                index={idx}
                                currentIndex={currentIndex}
                                tool={isReadOnly ? 'dictionary' : tool}
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
                        <span className="font-black text-lg md:text-xl tabular-nums">{currentIndex + 1} / {lessonItems.length}</span>
                        <button onClick={showNext} className="hover:text-action transition-colors p-1"><ArrowRight className="w-5 h-5 md:w-6 md:h-6" /></button>
                    </div>
                </div>
            )}

            <style>{`
                .draw-app-container {
                    overflow-x: hidden;
                }
                .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
                .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

                /* Typing animations */
                .animate-typing-word { animation: wordPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
                .animate-typing-cursor { animation: cursorBlink 0.8s step-end infinite; }
                @keyframes wordPop { from { opacity: 0; transform: translateY(8px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

                /* Draw Toolbar: responsive positioning via data attribute */
                @media (min-width: 768px) {
                    [data-sidebar-collapsed="false"] {
                        left: 256px !important;
                        top: 50% !important;
                        transform: translateY(-50%) !important;
                        transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    }
                    [data-sidebar-collapsed="true"] {
                        left: 16px !important;
                        top: 50% !important;
                        transform: translateY(-50%) !important;
                        transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    }
                }
            `}</style>
        </div>
    );
}
