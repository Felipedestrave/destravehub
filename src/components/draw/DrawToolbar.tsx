import React from 'react';
import {
    MousePointer2, Pen, Highlighter, Eraser,
    BookOpen, Undo2, Settings
} from 'lucide-react';
import type { ToolType } from './types.ts';

const THEME_COLORS = [
    { name: 'Roxo', value: '#7c3aed' },
    { name: 'Laranja', value: '#f97316' },
    { name: 'Vermelho', value: '#ef4444' },
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Verde', value: '#10b981' }
];

interface DrawToolbarProps {
    tool: ToolType;
    setTool: (tool: ToolType) => void;
    activeColor: string;
    setActiveColor: (color: string) => void;
    onUndo: () => void;
    onOpenSettings: () => void;
}

export const DrawToolbar: React.FC<DrawToolbarProps> = ({
    tool, setTool, activeColor, setActiveColor, onUndo, onOpenSettings
}) => {
    return (
        <div className="fixed bottom-[88px] md:bottom-auto left-1/2 -translate-x-1/2 md:left-[280px] md:translate-x-0 md:top-1/2 md:-translate-y-1/2 z-[4000] flex flex-row md:flex-col items-center gap-2 md:gap-3 p-2 md:p-4 bg-white/95 backdrop-blur-xl rounded-[24px] md:rounded-[40px] shadow-2xl border-2 md:border-4 border-slate-900 max-w-[95vw] md:max-h-[90vh] overflow-x-auto md:overflow-y-auto no-scrollbar">
            <button
                onClick={() => setTool('laser')}
                className={`p-2 md:p-4 rounded-[16px] md:rounded-[24px] transition-all ${tool === 'laser' ? 'bg-slate-900 text-white shadow-lg scale-110' : 'text-slate-600 hover:bg-slate-100'}`}
                title="Laser Pointer"
            >
                <MousePointer2 className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
                onClick={() => setTool('pen')}
                className={`p-4 rounded-[24px] transition-all ${tool === 'pen' ? 'bg-slate-900 text-white shadow-lg scale-110' : 'text-slate-600 hover:bg-slate-100'}`}
                title="Caneta N5"
            >
                <Pen className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
                onClick={() => setTool('highlighter')}
                className={`p-2 md:p-4 rounded-[16px] md:rounded-[24px] transition-all ${tool === 'highlighter' ? 'bg-slate-900 text-white shadow-lg scale-110' : 'text-slate-600 hover:bg-slate-100'}`}
                title="Marca-texto"
            >
                <Highlighter className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
                onClick={() => setTool('eraser')}
                className={`p-2 md:p-4 rounded-[16px] md:rounded-[24px] transition-all ${tool === 'eraser' ? 'bg-slate-900 text-white shadow-lg scale-110' : 'text-slate-600 hover:bg-slate-100'}`}
                title="Borracha"
            >
                <Eraser className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
                onClick={() => setTool('dictionary')}
                className={`p-4 rounded-[24px] transition-all ${tool === 'dictionary' ? 'bg-slate-900 text-white shadow-lg scale-110' : 'text-slate-600 hover:bg-slate-100'}`}
                title="Dicionário IA"
            >
                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div className="w-8 md:w-10 h-px bg-slate-200 my-1" />

            <button
                onClick={onUndo}
                className="p-2 md:p-3 rounded-[12px] md:rounded-[18px] text-slate-600 hover:bg-slate-100 hover:text-orange-500 transition-all"
                title="Desfazer (Ctrl+Z)"
            >
                <Undo2 className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div className="flex flex-col gap-1.5 md:gap-2 py-2">
                {THEME_COLORS.map(c => (
                    <button
                        key={c.value}
                        onClick={() => setActiveColor(c.value)}
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 transition-all hover:scale-125 ${activeColor === c.value ? 'scale-125 border-slate-900 shadow-md ring-2 ring-slate-200' : 'border-transparent'}`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                    />
                ))}
            </div>

            <button
                onClick={onOpenSettings}
                className="p-2 md:p-4 text-slate-300 hover:text-purple-600 transition-colors"
                title="Configurações da Aula"
            >
                <Settings className="w-5 h-5 md:w-6 md:h-6" />
            </button>
        </div>
    );
};
