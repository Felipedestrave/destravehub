import React, { useState } from 'react';
import { ChevronDown, Layers, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { JLPTLevel, QuizMode, type MrpConfig } from '../../types/mrp';
import { PdfUploadBox } from '../shared/PdfUploadBox';

interface ConfigScreenProps {
    onSubmit: (config: MrpConfig) => void;
    isLoading: boolean;
}

export const ConfigScreen: React.FC<ConfigScreenProps> = ({ onSubmit, isLoading }) => {
    const [context, setContext] = useState('');
    const [pdfBase64, setPdfBase64] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(10);
    const [level, setLevel] = useState<JLPTLevel>(JLPTLevel.N5);
    const [mode, setMode] = useState<QuizMode>(QuizMode.MULTIPLE_CHOICE);
    const [customInstructions, setCustomInstructions] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pdfBase64 && context.trim().length < 20) {
            alert('Por favor, faça upload de um PDF ou insira um texto com pelo menos 20 caracteres.');
            return;
        }
        onSubmit({ context, pdfBase64: pdfBase64 || undefined, quantity, level, mode, customInstructions });
    };

    return (
        <form onSubmit={handleSubmit} className="mrp-config-form">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 badge-brand mb-4">
                    <Layers size={12} />
                    Destrave MRP
                </div>
                <h1 className="font-outfit text-4xl font-extrabold text-slate-dark leading-tight">
                    Criação de <span className="text-brand">Role Play</span> IA
                </h1>
                <p className="mt-3 text-slate-mid font-inter">
                    Faça upload do seu material em PDF e a IA criará cenários interativos para seus alunos.
                </p>
            </div>

            {/* Multi-input Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                {/* PDF Box */}
                <PdfUploadBox 
                    onFileSelected={(base64, name) => {
                        setPdfBase64(base64);
                        setFileName(name);
                    }}
                    currentFileName={fileName}
                    description="O PDF servirá de base para os cenários da IA" 
                />

                {/* Context Input (Manual) */}
                <div className="card h-full">
                    <div className="flex items-center gap-2 mb-3">
                        <FileText size={16} className="text-slate-mid" />
                        <label className="text-xs font-bold text-slate-mid uppercase tracking-wider">Conteúdo Manual (Opcional)</label>
                    </div>
                    <textarea
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="Se não tiver PDF, cole aqui notas da aula, lista de palavras ou texto de estudo..."
                        className="mrp-textarea h-[120px]"
                    />
                </div>
            </div>

            {/* Custom Instructions */}
            <div className="card w-full">
                <div className="flex items-center gap-2 mb-3">
                    <FileText size={16} className="text-slate-mid" />
                    <label className="text-xs font-bold text-slate-mid uppercase tracking-wider">Instruções Especiais para a IA (Opcional)</label>
                </div>
                <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Ex: Use apenas frases inéditas baseadas no vocabulário; foque em situações cotidianas de compras; crie diálogos curtos..."
                    className="mrp-textarea h-[100px]"
                />
            </div>

            {/* Options Grid */}
            <div className="card space-y-6">
                <h2 className="font-outfit text-lg font-bold text-slate-dark mb-4">Personalização do Treinamento</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Quantity */}
                    <div className="mrp-field">
                        <label className="mrp-label">Quantidade de Questões</label>
                        <div className="mrp-qty-group">
                            {[5, 10, 20].map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => setQuantity(q)}
                                    className={`mrp-qty-btn ${quantity === q ? 'active' : ''}`}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Level */}
                    <div className="mrp-field">
                        <label className="mrp-label">Nível de Dificuldade</label>
                        <div className="mrp-select-wrapper">
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value as JLPTLevel)}
                                className="mrp-select"
                            >
                                <option value={JLPTLevel.N5}>N5 — Básico (Iniciante)</option>
                                <option value={JLPTLevel.N4}>N4 — Intermediário</option>
                                <option value={JLPTLevel.N3}>N3 — Avançado</option>
                                <option value={JLPTLevel.MIXED}>JLPT Misto (N5–N3)</option>
                            </select>
                            <ChevronDown size={16} className="mrp-select-icon" />
                        </div>
                    </div>

                    {/* Mode */}
                    <div className="mrp-field">
                        <label className="mrp-label">Formato de Resposta</label>
                        <div className="mrp-select-wrapper">
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value as QuizMode)}
                                className="mrp-select"
                            >
                                <option value={QuizMode.MULTIPLE_CHOICE}>Múltipla Escolha</option>
                                <option value={QuizMode.DISCURSIVE}>Discursiva (Digitar)</option>
                            </select>
                            <ChevronDown size={16} className="mrp-select-icon" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Scoring (Small and Elegant) */}
            <div className="flex justify-center gap-4 text-[0.7rem] font-bold text-slate-mid/60 uppercase tracking-widest mt-2">
                <span>N5: 2pts</span>
                <span>•</span>
                <span>N4: 4pts</span>
                <span>•</span>
                <span>N3: 6pts</span>
                <span>•</span>
                <span>Hint: -50%</span>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="btn-action w-full py-4 mt-4">
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Gerando cenários com IA...
                    </>
                ) : (
                    <>
                        Iniciar Criação de Missão
                        <ChevronRight size={18} />
                    </>
                )}
            </button>

            <style>{`
        .mrp-config-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 680px;
          width: 100%;
          margin: 0 auto;
        }
        .mrp-config-header { display: flex; flex-direction: column; gap: 0.375rem; }
        .mrp-config-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: rgba(88,49,126,0.1);
          color: var(--color-brand);
          border: 1px solid rgba(88,49,126,0.2);
          border-radius: 999px;
          padding: 0.25rem 0.75rem;
          font-family: var(--font-outfit);
          font-size: 0.75rem;
          font-weight: 700;
          width: fit-content;
          letter-spacing: 0.04em;
        }
        .mrp-config-title {
          font-family: var(--font-outfit);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-slate-dark);
          margin: 0;
        }
        .mrp-config-subtitle {
          font-family: var(--font-inter);
          font-size: 0.9rem;
          color: var(--color-slate-mid);
          margin: 0;
          line-height: 1.5;
        }
        .mrp-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .mrp-field-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mrp-label {
          font-family: var(--font-inter);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-slate-mid);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .mrp-pdf-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: none;
          border: 1px solid var(--color-slate-border);
          border-radius: 0.5rem;
          padding: 0.3rem 0.75rem;
          font-family: var(--font-outfit);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-brand);
          cursor: pointer;
          transition: background 150ms, border-color 150ms;
        }
        .mrp-pdf-btn:hover { background: rgba(88,49,126,0.06); border-color: var(--color-brand); }
        .mrp-pdf-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .mrp-textarea {
          width: 100%;
          border: 1.5px solid var(--color-slate-border);
          border-radius: 0.75rem;
          padding: 0.875rem 1rem;
          font-family: var(--font-inter);
          font-size: 0.9rem;
          color: var(--color-slate-dark);
          background: var(--color-white, #fff);
          resize: vertical;
          transition: border-color 150ms, box-shadow 150ms;
          outline: none;
          box-sizing: border-box;
        }
        .mrp-textarea:focus {
          border-color: var(--color-brand);
          box-shadow: 0 0 0 3px rgba(88,49,126,0.12);
        }
        .mrp-textarea::placeholder { color: var(--color-slate-border); }
        .mrp-options-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        @media (max-width: 600px) {
          .mrp-options-grid { grid-template-columns: 1fr; }
        }
        .mrp-qty-group { display: flex; gap: 0.5rem; }
        .mrp-qty-btn {
          flex: 1;
          padding: 0.55rem 0;
          border-radius: 0.625rem;
          border: 1.5px solid var(--color-slate-border);
          background: transparent;
          font-family: var(--font-outfit);
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-slate-mid);
          cursor: pointer;
          transition: all 150ms;
        }
        .mrp-qty-btn:hover { border-color: var(--color-brand); color: var(--color-brand); }
        .mrp-qty-btn.active {
          background: var(--color-brand);
          border-color: var(--color-brand);
          color: white;
        }
        .mrp-select-wrapper { position: relative; }
        .mrp-select {
          width: 100%;
          appearance: none;
          border: 1.5px solid var(--color-slate-border);
          border-radius: 0.625rem;
          padding: 0.6rem 2rem 0.6rem 0.875rem;
          font-family: var(--font-inter);
          font-size: 0.875rem;
          color: var(--color-slate-dark);
          background: var(--color-white, #fff);
          cursor: pointer;
          outline: none;
          transition: border-color 150ms, box-shadow 150ms;
        }
        .mrp-select:focus { border-color: var(--color-brand); box-shadow: 0 0 0 3px rgba(88,49,126,0.12); }
        .mrp-select-icon {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-slate-mid);
          pointer-events: none;
        }
        .mrp-scoring-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          font-family: var(--font-inter);
          font-size: 0.78rem;
          color: var(--color-slate-mid);
          background: var(--color-ice);
          border: 1px solid var(--color-slate-border);
          border-radius: 0.75rem;
          padding: 0.6rem 1rem;
        }
        .mrp-dot { color: var(--color-slate-border); }
        .mrp-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.9rem 1.5rem;
          background: var(--color-action);
          color: white;
          border: none;
          border-radius: 0.875rem;
          font-family: var(--font-outfit);
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 150ms, transform 100ms, box-shadow 150ms;
          box-shadow: 0 4px 16px rgba(255,127,50,0.25);
          letter-spacing: 0.02em;
        }
        .mrp-submit-btn:hover:not(:disabled) {
          background: #E66A1F;
          box-shadow: 0 6px 20px rgba(255,127,50,0.35);
          transform: translateY(-1px);
        }
        .mrp-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .mrp-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: mrp-spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes mrp-spin { to { transform: rotate(360deg); } }
      `}</style>
        </form>
    );
};
