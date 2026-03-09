import React, { useState, useRef } from 'react';
import { Sparkles, Upload, Type, BarChart, FileText } from 'lucide-react';
import { JLPTCardLevel, type DeckConfig } from '../../types/flashcards';

interface DeckGeneratorProps {
  onGenerate: (config: DeckConfig) => void;
  isLoading: boolean;
}

export const DeckGenerator: React.FC<DeckGeneratorProps> = ({ onGenerate, isLoading }) => {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [level, setLevel] = useState<JLPTCardLevel>(JLPTCardLevel.N5);
  const [quantity, setQuantity] = useState(15);
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
        // @ts-ignore - pdfjsLib loaded via CDN in parent layout
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
    } catch (error) {
      alert("Erro ao ler PDF. Tente copiar e colar o texto.");
      setIsReadingPdf(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Dê um nome ao seu deck.");
    if (context.trim().length < 20) return alert("Conteúdo insuficiente para gerar cards.");

    onGenerate({ title, context, level, quantity });
  };

  return (
    <div className="flash-generator-container">
      <div className="flash-generator-card">
        <header className="flash-generator-header">
          <div className="flash-generator-icon-wrap">
            <Sparkles className="flash-sparkles-icon" size={24} />
          </div>
          <div className="flash-header-text">
            <h2>Gerador de Destrave Cards IA</h2>
            <p>Transforme o material da aula em um deck interativo para o aluno.</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flash-form">
          <div className="flash-field">
            <label className="flash-label">
              <Type size={14} /> Nome do Deck
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

          <div className="flash-field">
            <div className="flash-label-row">
              <label className="flash-label">
                <FileText size={14} /> Conteúdo da Aula (Contexto)
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isReadingPdf}
                className="flash-pdf-link"
              >
                <Upload size={14} />
                {isReadingPdf ? 'Lendo...' : 'Carregar PDF'}
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
              placeholder="Cole as notas da aula, lista de palavras ou texto de estudo..."
              className="flash-textarea"
              rows={8}
            />
          </div>

          <div className="flash-config-grid">
            <div className="flash-field">
              <label className="flash-label">
                <BarChart size={14} /> Nível JLPT
              </label>
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
            className="flash-generate-btn"
          >
            {isLoading ? (
              <>
                <div className="flash-spinner" />
                Sintonizando IA...
              </>
            ) : (
              <>Gerar Deck com Gemini</>
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
        .flash-generator-header {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
          align-items: center;
        }
        .flash-generator-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 1rem;
          background: linear-gradient(135deg, var(--color-brand), #7c3aed);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .flash-header-text h2 {
          font-family: var(--font-outfit);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-slate-dark);
          margin: 0;
        }
        .flash-header-text p {
          font-size: 0.9rem;
          color: var(--color-slate-mid);
          margin-top: 0.25rem;
        }
        .flash-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .flash-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .flash-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
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
        .flash-pdf-link {
          background: none;
          border: none;
          color: var(--color-brand);
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
        }
        .flash-pdf-link:hover { text-decoration: underline; }
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
        .flash-generate-btn {
          margin-top: 1rem;
          padding: 1rem;
          background: var(--color-action);
          color: white;
          border: none;
          border-radius: 0.875rem;
          font-family: var(--font-outfit);
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          transition: transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275), filter 150ms;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }
        .flash-generate-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
        }
        .flash-generate-btn:active { transform: translateY(0); }
        .flash-generate-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        
        .flash-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
