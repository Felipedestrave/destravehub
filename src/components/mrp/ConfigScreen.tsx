import React, { useState, useRef } from 'react';
import { Upload, ChevronDown, Layers } from 'lucide-react';
import { JLPTLevel, QuizMode, type MrpConfig } from '../../types/mrp';

interface ConfigScreenProps {
    onSubmit: (config: MrpConfig) => void;
    isLoading: boolean;
}

export const ConfigScreen: React.FC<ConfigScreenProps> = ({ onSubmit, isLoading }) => {
    const [context, setContext] = useState('');
    const [quantity, setQuantity] = useState(10);
    const [level, setLevel] = useState<JLPTLevel>(JLPTLevel.N5);
    const [mode, setMode] = useState<QuizMode>(QuizMode.MULTIPLE_CHOICE);
    const [isReadingPdf, setIsReadingPdf] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsReadingPdf(true);
        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
                // @ts-ignore - pdfjsLib from CDN
                const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const strings = content.items.map((item: any) => item.str);
                    fullText += strings.join(' ') + '\n';
                }
                setContext(fullText);
                setIsReadingPdf(false);
            };
            reader.readAsArrayBuffer(file);
        } catch {
            alert('Não foi possível ler o PDF. Tente copiar e colar o texto.');
            setIsReadingPdf(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (context.trim().length < 20) {
            alert('Por favor, insira um texto base com pelo menos 20 caracteres.');
            return;
        }
        onSubmit({ context, quantity, level, mode });
    };

    return (
        <form onSubmit={handleSubmit} className="mrp-config-form">
            {/* Header */}
            <div className="mrp-config-header">
                <div className="mrp-config-badge">
                    <Layers size={14} />
                    <span>Destrave MRP</span>
                </div>
                <h2 className="mrp-config-title">Configurar Treinamento</h2>
                <p className="mrp-config-subtitle">
                    Cole um texto em japonês ou faça upload de um PDF para o MRP gerar seus cenários de role play.
                </p>
            </div>

            {/* Context Input */}
            <div className="mrp-field">
                <div className="mrp-field-label-row">
                    <label className="mrp-label">Contexto Base</label>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isReadingPdf}
                        className="mrp-pdf-btn"
                    >
                        <Upload size={14} />
                        {isReadingPdf ? 'Lendo PDF...' : 'Upload PDF'}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePdfUpload}
                        accept=".pdf"
                        className="hidden"
                    />
                </div>
                <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Cole aqui o texto em japonês ou lição para gerar os cenários do Mini Role Play..."
                    className="mrp-textarea"
                    rows={6}
                />
            </div>

            {/* Options Grid */}
            <div className="mrp-options-grid">
                {/* Quantity */}
                <div className="mrp-field">
                    <label className="mrp-label">Quantidade</label>
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
                    <label className="mrp-label">Nível JLPT</label>
                    <div className="mrp-select-wrapper">
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value as JLPTLevel)}
                            className="mrp-select"
                        >
                            <option value={JLPTLevel.N5}>N5 — Básico</option>
                            <option value={JLPTLevel.N4}>N4 — Intermediário</option>
                            <option value={JLPTLevel.N3}>N3 — Avançado</option>
                            <option value={JLPTLevel.MIXED}>Misto (N5–N3)</option>
                        </select>
                        <ChevronDown size={16} className="mrp-select-icon" />
                    </div>
                </div>

                {/* Mode */}
                <div className="mrp-field">
                    <label className="mrp-label">Modo de Resposta</label>
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

            {/* Info Scoring */}
            <div className="mrp-scoring-info">
                <span>N5 = 2 pts</span>
                <span className="mrp-dot">·</span>
                <span>N4 = 4 pts</span>
                <span className="mrp-dot">·</span>
                <span>N3 = 6 pts</span>
                <span className="mrp-dot">·</span>
                <span>Dica = −50%</span>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="mrp-submit-btn">
                {isLoading ? (
                    <>
                        <span className="mrp-spinner" />
                        Gerando cenários com IA...
                    </>
                ) : (
                    'Iniciar Treinamento MRP →'
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
