import React, { useState } from 'react';
import { Trash2, Plus, CheckCircle2, AlertCircle, Edit3, Save } from 'lucide-react';
import type { Flashcard, FlashDeck } from '../../types/flashcards';

interface ReviewStudioProps {
    deck: FlashDeck;
    onApprove: (finalDeck: FlashDeck) => void;
    onCancel: () => void;
    isSaving: boolean;
}

export const ReviewStudio: React.FC<ReviewStudioProps> = ({ deck, onApprove, onCancel, isSaving }) => {
    const [cards, setCards] = useState<Flashcard[]>(deck.cards);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleUpdateCard = (id: string, updates: Partial<Flashcard>) => {
        setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const handleDeleteCard = (id: string) => {
        setCards(prev => prev.filter(c => c.id !== id));
    };

    const handleAddCard = () => {
        const newCard: Flashcard = {
            id: `manual-${Date.now()}`,
            front: '',
            reading: '',
            back: '',
            example: '',
            exampleTranslation: '',
            level: deck.level
        };
        setCards(prev => [newCard, ...prev]);
        setEditingId(newCard.id);
    };

    return (
        <div className="review-studio-container">
            <header className="review-header">
                <div className="review-header-info">
                    <span className="review-badge">Modo de Revisão</span>
                    <h2>{deck.title}</h2>
                    <p>{cards.length} cards extraídos pela IA. Revise e aprove para seu aluno.</p>
                </div>
                <div className="review-actions">
                    <button onClick={onCancel} className="btn-cancel">Descartar</button>
                    <button
                        onClick={() => onApprove({ ...deck, cards })}
                        disabled={isSaving || cards.length === 0}
                        className="btn-approve"
                    >
                        {isSaving ? <div className="flash-spinner" /> : <><CheckCircle2 size={18} /> Aprovar e Salvar</>}
                    </button>
                </div>
            </header>

            <div className="review-grid">
                <button className="add-card-dash" onClick={handleAddCard}>
                    <Plus size={32} />
                    <span>Novo Card Manual</span>
                </button>

                {cards.map((card) => (
                    <div key={card.id} className={`card-editor ${editingId === card.id ? 'is-editing' : ''}`}>
                        {editingId === card.id ? (
                            <div className="editor-fields">
                                <input
                                    placeholder="Frente (Japonês)"
                                    value={card.front}
                                    onChange={e => handleUpdateCard(card.id, { front: e.target.value })}
                                />
                                <input
                                    placeholder="Leitura (Hiragana)"
                                    value={card.reading}
                                    onChange={e => handleUpdateCard(card.id, { reading: e.target.value })}
                                />
                                <input
                                    placeholder="Verso (Português)"
                                    value={card.back}
                                    onChange={e => handleUpdateCard(card.id, { back: e.target.value })}
                                />
                                <textarea
                                    placeholder="Exemplo de frase..."
                                    value={card.example}
                                    onChange={e => handleUpdateCard(card.id, { example: e.target.value })}
                                />
                                <button className="done-btn" onClick={() => setEditingId(null)}>
                                    <Save size={14} /> Concluir Edição
                                </button>
                            </div>
                        ) : (
                            <div className="card-preview">
                                <div className="card-front-preview">
                                    <span className="p-badge">FRENTE</span>
                                    <div className="p-main">{card.front}</div>
                                    <div className="p-reading">({card.reading})</div>
                                </div>
                                <div className="card-divider" />
                                <div className="card-back-preview">
                                    <span className="p-badge">VERSO</span>
                                    <div className="p-meaning">{card.back}</div>
                                    <div className="p-example italic">"{card.example}"</div>
                                </div>
                                <div className="card-actions-hover">
                                    <button onClick={() => setEditingId(card.id)} className="a-btn edit"><Edit3 size={16} /></button>
                                    <button onClick={() => handleDeleteCard(card.id)} className="a-btn del"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <style>{`
        .review-studio-container { width: 100%; animation: fade-in 0.4s ease-out; }
        .review-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 2.5rem; gap: 2rem;
        }
        .review-badge {
          display: inline-block; padding: 0.25rem 0.75rem; border-radius: 999px;
          background: rgba(255,127,50,0.1); color: var(--color-action);
          font-family: var(--font-outfit); font-weight: 800; font-size: 0.7rem;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem;
        }
        .review-header h2 { font-family: var(--font-outfit); font-size: 2rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
        .review-header p { font-size: 0.95rem; color: var(--color-slate-mid); margin: 0.25rem 0 0; }
        
        .review-actions { display: flex; gap: 1rem; }
        .btn-cancel {
          padding: 0.75rem 1.5rem; border-radius: 0.875rem; border: 1.5px solid var(--color-slate-border);
          background: white; font-family: var(--font-outfit); font-weight: 700; color: var(--color-slate-mid);
          cursor: pointer; transition: all 150ms;
        }
        .btn-cancel:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
        
        .btn-approve {
          padding: 0.75rem 1.75rem; border-radius: 0.875rem; border: none;
          background: var(--color-brand); color: white; font-family: var(--font-outfit); font-weight: 800;
          cursor: pointer; display: flex; align-items: center; gap: 0.75rem;
          transition: transform 150ms, filter 150ms;
          box-shadow: 0 4px 15px rgba(88,49,126,0.25);
        }
        .btn-approve:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .btn-approve:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .review-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem; padding-bottom: 5rem;
        }
        
        .add-card-dash {
          height: 220px; border: 2.5px dashed var(--color-slate-border); border-radius: 1.25rem;
          background: transparent; color: var(--color-slate-mid); cursor: pointer;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 1rem; transition: all 150ms; font-family: var(--font-outfit); font-weight: 700;
        }
        .add-card-dash:hover { border-color: var(--color-brand); color: var(--color-brand); background: rgba(88,49,126,0.02); }

        .card-editor {
          height: 220px; background: white; border-radius: 1.25rem; border: 1.5px solid var(--color-slate-border);
          position: relative; transition: all 200ms ease; overflow: hidden;
        }
        .card-editor:hover { border-color: var(--color-brand); transform: translateY(-3px); box-shadow: 0 8px 30px rgba(30,41,59,0.08); }
        .card-editor.is-editing { height: auto; min-height: 220px; border-color: var(--color-brand); z-index: 10; }

        .card-preview { height: 100%; display: flex; flex-direction: column; padding: 1.25rem; }
        .p-badge { font-size: 0.6rem; font-weight: 900; color: var(--color-slate-border); letter-spacing: 0.1em; margin-bottom: 0.25rem; }
        .p-main { font-family: var(--font-outfit); font-size: 1.4rem; font-weight: 800; color: var(--color-slate-dark); }
        .p-reading { font-size: 0.85rem; color: var(--color-slate-mid); margin-top: -0.1rem; }
        .card-divider { height: 1.5px; background: var(--color-slate-border); margin: 1rem 0; width: 40px; }
        .p-meaning { font-weight: 700; color: var(--color-brand); font-size: 1.1rem; margin-bottom: 0.25rem; }
        .p-example { font-size: 0.75rem; color: var(--color-slate-mid); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        .card-actions-hover {
          position: absolute; top: 0.75rem; right: 0.75rem; display: flex; gap: 0.4rem;
          opacity: 0; transform: translateX(10px); transition: all 200ms;
        }
        .card-editor:hover .card-actions-hover { opacity: 1; transform: translateX(0); }
        .a-btn {
          width: 32px; height: 32px; border-radius: 0.625rem; border: none;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          transition: background 150ms;
        }
        .a-btn.edit { background: var(--color-ice); color: var(--color-slate-dark); }
        .a-btn.edit:hover { background: #e2e8f0; }
        .a-btn.del { background: #fef2f2; color: #dc2626; }
        .a-btn.del:hover { background: #fee2e2; }

        .editor-fields { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .editor-fields input, .editor-fields textarea {
          width: 100%; border: 1.5px solid var(--color-slate-border); border-radius: 0.5rem;
          padding: 0.5rem 0.75rem; font-family: var(--font-inter); font-size: 0.9rem; outline: none; box-sizing: border-box;
        }
        .editor-fields input:focus, .editor-fields textarea:focus { border-color: var(--color-brand); }
        .done-btn {
          background: var(--color-brand); color: white; border: none; border-radius: 0.5rem;
          padding: 0.6rem; font-family: var(--font-outfit); font-weight: 700; font-size: 0.8rem;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </div>
    );
};
