import React, { useState } from 'react';
import { Layers, FileText, ChevronRight, Loader2 } from 'lucide-react';
import type { LegoConfig } from '../../types/lego';

interface UploadScreenProps {
    onSubmit: (config: LegoConfig) => void;
    isLoading: boolean;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({ onSubmit, isLoading }) => {
    const [context, setContext] = useState('');
    const [quantity, setQuantity] = useState(10);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfBase64, setPdfBase64] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPdfFile(file);
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = (event.target?.result as string).split(',')[1];
            setPdfBase64(base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pdfBase64 && context.trim().length < 5) {
            alert('Por favor, insira um texto com pelo menos 5 caracteres ou faça upload de um PDF.');
            return;
        }
        onSubmit({ context, quantity, pdfBase64 });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl w-full mx-auto">
            {/* Header */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 badge-brand mb-4">
                    <Layers size={12} />
                    Destrave Lego
                </div>
                <h1 className="font-outfit text-4xl font-extrabold text-slate-dark leading-tight">
                    Construtor Sintático <span className="text-brand">Lego</span>
                </h1>
                <p className="mt-3 text-slate-mid font-inter">
                    Insira um tema ou vocabulário e a IA gerará blocos gramaticais para o aluno montar.
                </p>
            </div>

            {/* Context Input (Manual) */}
            <div className="card h-full">
                <div className="flex items-center gap-2 mb-3">
                    <FileText size={16} className="text-slate-mid" />
                    <label className="text-xs font-bold text-slate-mid uppercase tracking-wider">Conteúdo Base</label>
                </div>
                <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Cole aqui o vocabulário, contexto ou tema (Ex: Rotina Matinal)..."
                    className="w-full border-[1.5px] border-slate-border rounded-xl p-4 font-inter text-[0.9rem] text-slate-dark bg-white outline-none focus:border-brand focus:shadow-[0_0_0_3px_rgba(88,49,126,0.12)] transition-all resize-y h-[120px]"
                />
            </div>

            {/* File Input (PDF) */}
            <div className="card h-full">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <FileText size={16} className="text-slate-mid" />
                        <label className="text-xs font-bold text-slate-mid uppercase tracking-wider">PDF do Material (Opcional)</label>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <input 
                        type="file" 
                        accept="application/pdf" 
                        onChange={handleFileChange} 
                        className="text-sm text-slate-mid file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 transition-colors"
                    />
                    {pdfFile && <span className="text-xs text-brand font-bold bg-brand/10 px-2 py-1 rounded-md">PDF Carregado!</span>}
                </div>
            </div>

            {/* Options Grid */}
            <div className="card space-y-4">
                <h2 className="font-outfit text-lg font-bold text-slate-dark mb-2">Personalização</h2>
                
                <div className="flex flex-col gap-2">
                    <label className="font-inter text-[0.8rem] font-semibold text-slate-mid tracking-wider uppercase">
                        Quantidade de Frases
                    </label>
                    <div className="flex gap-2">
                        {[5, 10, 20].map((q) => (
                            <button
                                key={q}
                                type="button"
                                onClick={() => setQuantity(q)}
                                className={`flex-1 py-2 rounded-[0.625rem] border-[1.5px] border-slate-border font-outfit text-[0.9rem] font-bold text-slate-mid transition-all ${
                                    quantity === q ? 'bg-brand border-brand text-white' : 'hover:border-brand hover:text-brand bg-transparent'
                                }`}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="btn-action w-full py-4 mt-2 flex items-center justify-center gap-2">
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Quebrando blocos gramaticais...
                    </>
                ) : (
                    <>
                        Iniciar Criação de Missão
                        <ChevronRight size={18} />
                    </>
                )}
            </button>
        </form>
    );
};
