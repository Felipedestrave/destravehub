import React, { useState } from 'react';
import { Sparkles, FileText, ChevronRight, Loader2, Type } from 'lucide-react';
import { JLPTCardLevel, type DeckConfig } from '../../types/flashcards';
import { PdfUploadBox } from '../shared/PdfUploadBox';

interface DeckGeneratorProps {
  onGenerate: (config: DeckConfig) => void;
  isLoading: boolean;
}

export const DeckGenerator: React.FC<DeckGeneratorProps> = ({ onGenerate, isLoading }) => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [level, setLevel] = useState<JLPTCardLevel>(JLPTCardLevel.N5);
  const [quantity, setQuantity] = useState(15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Dê um nome ao seu deck.");
    if (!pdfBase64 && context.trim().length < 20) return alert("Por favor, faça upload de um PDF ou insira um texto para gerar os cards.");

    onGenerate({ title, context, pdfBase64: pdfBase64 || undefined, level, quantity });
  };

  return (
    <div className="flash-generator-container">
      <div className="flash-generator-card">
        {/* Header */}
        <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 badge-brand mb-4">
                <Sparkles size={12} />
                Destrave Cards IA
            </div>
            <h1 className="font-outfit text-4xl font-extrabold text-slate-dark leading-tight">
                Criação de <span className="text-brand">Flashdecks</span> IA
            </h1>
            <p className="mt-3 text-slate-mid font-inter">
                Seu material de aula vira cards interativos em segundos.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="flash-form">
          <div className="flash-field mb-4">
            <label className="flash-label">
              <Type size={14} /> Nome da Atividade (Deck)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Vocabulário Aula 4 - Restaurante"
              className="flash-input"
              required
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
            <PdfUploadBox 
                onFileSelected={(base64, name) => {
                    setPdfBase64(base64);
                    setFileName(name);
                }}
                currentFileName={fileName}
                description="Use o PDF da sua aula como fonte" 
            />

            <div className="p-4 border-2 border-slate-border border-dashed rounded-[1.5rem] bg-ice/30">
                <div className="flex items-center gap-2 mb-2">
                    <FileText size={14} className="text-slate-mid" />
                    <label className="text-[0.65rem] font-bold text-slate-mid uppercase tracking-widest">Texto Manual (Opcional)</label>
                </div>
                <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Se não tiver PDF, cole aqui a lista de palavras ou frases da aula..."
                    className="flash-textarea min-h-[110px]"
                />
            </div>
          </div>

          <div className="flash-config-grid">
            <div className="flash-field">
              <label className="flash-label">Nível de Dificuldade</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as JLPTCardLevel)}
                className="flash-select"
              >
                <option value={JLPTCardLevel.N5}>N5 - Iniciante</option>
                <option value={JLPTCardLevel.N4}>N4 - Intermediário</option>
                <option value={JLPTCardLevel.N3}>N3 - Avançado</option>
              </select>
            </div>

            <div className="flash-field">
              <label className="flash-label">Quantidade de Cards</label>
              <div className="flash-qty-selector">
                {[10, 15, 20].map(q => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(q)}
                    className={`flash-qty-btn ${quantity === q ? 'active' : ''}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-action w-full py-4 mt-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Sintonizando IA...
              </>
            ) : (
              <>
                Gerar Deck com Gemini
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        .flash-generator-container {
          max-width: 720px;
          margin: 0 auto;
          width: 100%;
        }
        .flash-generator-card {
          background: white;
          border-radius: 1.5rem;
          border: 1.5px solid var(--color-slate-border);
          padding: 2.5rem;
          box-shadow: 0 10px 40px -10px rgba(30,41,59,0.08);
        }
        .flash-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .flash-label {
          font-family: var(--font-inter);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-slate-mid);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .flash-input, .flash-textarea, .flash-select {
          width: 100%;
          border: 1.5px solid var(--color-slate-border);
          border-radius: 0.75rem;
          padding: 0.875rem 1rem;
          font-family: var(--font-inter);
          font-size: 1rem;
          color: var(--color-slate-dark);
          transition: all 150ms ease;
          outline: none;
          box-sizing: border-box;
        }
        .flash-input:focus, .flash-textarea:focus, .flash-select:focus {
          border-color: var(--color-brand);
          box-shadow: 0 0 0 4px rgba(88,49,126,0.1);
        }
        .flash-config-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 1.25rem;
        }
        @media (max-width: 600px) {
          .flash-config-grid { grid-template-columns: 1fr; }
        }
        .flash-qty-selector {
          display: flex;
          gap: 0.5rem;
        }
        .flash-qty-btn {
          flex: 1;
          padding: 0.8rem;
          border-radius: 0.75rem;
          border: 1.5px solid var(--color-slate-border);
          background: white;
          font-family: var(--font-outfit);
          font-weight: 700;
          color: var(--color-slate-mid);
          cursor: pointer;
          transition: all 150ms ease;
        }
        .flash-qty-btn.active {
          background: var(--color-brand);
          color: white;
          border-color: var(--color-brand);
        }
      `}</style>
    </div>
  );
};
