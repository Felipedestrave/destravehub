import React, { useState } from 'react';
import { BookOpen, Target, Layers, ChevronRight, Loader2 } from 'lucide-react';
import { Difficulty, StudyFocus, type GameConfig } from '../../types/escuta';
import { PdfUploadBox } from '../shared/PdfUploadBox';

interface UploadScreenProps {
    onStart: (config: GameConfig) => void;
    isGenerating: boolean;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({ onStart, isGenerating }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [pdfBase64, setPdfBase64] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
    const [focus, setFocus] = useState<StudyFocus>(StudyFocus.CONTEXTUAL);
    const [count, setCount] = useState(5);
    const [customInstructions, setCustomInstructions] = useState('');

    const handleSubmit = () => {
        if (!pdfBase64) return;
        onStart({ pdfBase64, difficulty, count, focus, customInstructions });
    };

    const difficultyOptions = [
        { value: Difficulty.EASY, label: 'N5 — Fácil', color: 'text-emerald-600 border-emerald-300 bg-emerald-50' },
        { value: Difficulty.MEDIUM, label: 'N4 — Médio', color: 'text-amber-600 border-amber-300 bg-amber-50' },
        { value: Difficulty.HARD, label: 'N3 — Avançado', color: 'text-brand border-brand/30 bg-brand/5' },
        { value: Difficulty.MIXED, label: 'Misturado', color: 'text-slate-mid border-slate-border bg-ice' },
    ];

    return (
        <div className="max-w-2xl mx-auto w-full py-8 px-4">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 badge-brand mb-4">
                    <BookOpen size={12} />
                    Destrave a Escuta
                </div>
                <h1 className="font-outfit text-4xl font-extrabold text-slate-dark leading-tight">
                    Geração de <span className="text-brand">Exercícios</span> por IA
                </h1>
                <p className="mt-3 text-slate-mid font-inter">
                    Faça upload do seu material em PDF e a IA criará exercícios de compreensão auditiva em japonês.
                </p>
            </div>

            {/* Upload Area */}
            <PdfUploadBox 
                onFileSelected={(base64, name) => {
                    setPdfBase64(base64);
                    setFileName(name);
                }}
                currentFileName={fileName}
            />

            {/* Config Grid */}
            <div className="card mb-6">
                <h2 className="font-outfit text-lg font-bold text-slate-dark mb-5">Configurações do exercício</h2>

                {/* Difficulty */}
                <div className="mb-6">
                    <label className="font-outfit font-semibold text-sm text-slate-mid uppercase tracking-wide block mb-3">
                        Nível de dificuldade
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {difficultyOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setDifficulty(opt.value)}
                                className={`p-3 rounded-xl border-2 text-sm font-bold font-outfit transition-all duration-150 text-left ${difficulty === opt.value ? opt.color : 'border-slate-border text-slate-mid bg-white hover:border-slate-dark/20'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Focus */}
                <div className="mb-6">
                    <label className="font-outfit font-semibold text-sm text-slate-mid uppercase tracking-wide block mb-3">
                        <Target size={14} className="inline mr-1" />
                        Foco das alternativas
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                        {[StudyFocus.CONTEXTUAL, StudyFocus.LITERAL].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFocus(f)}
                                className={`p-4 rounded-xl border-2 text-sm font-inter text-left transition-all duration-150 ${focus === f
                                        ? 'border-brand bg-brand/5 text-slate-dark'
                                        : 'border-slate-border bg-white text-slate-mid hover:border-brand/30'
                                    }`}
                            >
                                <span className="font-bold font-outfit block mb-0.5">{f}</span>
                                <span className="text-xs text-slate-mid">
                                    {f === StudyFocus.CONTEXTUAL
                                        ? 'Testa se o aluno entendeu a intenção e o contexto da fala'
                                        : 'Testa precisão léxica e gramatical com tradução fiel'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Count */}
                <div>
                    <label className="font-outfit font-semibold text-sm text-slate-mid uppercase tracking-wide block mb-3">
                        <Layers size={14} className="inline mr-1" />
                        Número de questões: <span className="text-brand">{count}</span>
                    </label>
                    <input
                        type="range"
                        min={3}
                        max={15}
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="w-full accent-brand"
                    />
                    <div className="flex justify-between text-xs text-slate-mid mt-1">
                        <span>3</span><span>15</span>
                    </div>
                </div>

                {/* Custom Instructions */}
                <div className="mt-6 pt-6 border-t border-slate-border">
                    <label className="font-outfit font-semibold text-sm text-slate-mid uppercase tracking-wide block mb-3">
                        Instruções Especiais para a IA (Opcional)
                    </label>
                    <textarea
                        value={customInstructions}
                        onChange={(e) => setCustomInstructions(e.target.value)}
                        placeholder="Ex: Use apenas frases inéditas que não aparecem no material didático; use frases curtas; foque em uma partícula específica..."
                        className="w-full border-2 border-slate-border rounded-xl p-4 font-inter text-sm text-slate-dark bg-white outline-none focus:border-brand focus:shadow-[0_0_0_4px_rgba(88,49,126,0.1)] transition-all resize-y h-[100px]"
                    />
                </div>
            </div>

            {/* CTA */}
            <button
                onClick={handleSubmit}
                disabled={!pdfBase64 || isGenerating}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
                {isGenerating ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Gerando exercícios com IA...
                    </>
                ) : (
                    <>
                        Gerar Exercícios
                        <ChevronRight size={20} />
                    </>
                )}
            </button>
        </div>
    );
};
