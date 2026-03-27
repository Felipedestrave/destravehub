import React from 'react';
import { Headphones, Save, Play, X, Check } from 'lucide-react';
import type { Question, GameConfig } from '../../types/escuta';

interface EscutaReviewProps {
    questions: Question[];
    config: GameConfig;
    onSave: (title: string) => void;
    onStartGame: () => void;
    onCancel: () => void;
    isSaving: boolean;
    initialTitle?: string;
}

export const EscutaReview: React.FC<EscutaReviewProps> = ({ 
    questions, 
    config, 
    onSave, 
    onStartGame, 
    onCancel,
    isSaving,
    initialTitle
}) => {
    const [title, setTitle] = React.useState(initialTitle || `Escuta: ${config.difficulty} - ${new Date().toLocaleDateString()}`);

    return (
        <div className="escuta-review-container">
            <header className="escuta-review-header">
                <div className="title-area">
                    <span className="badge-highlight">Refinamento de Áudio</span>
                    <h2 className="title-text">Missão de Escuta pronta! 🎧</h2>
                    <p className="subtitle-text">
                        A IA gerou {questions.length} questões. Salve para seus alunos ou inicie um teste.
                    </p>
                </div>
                <div className="actions-area">
                    <button onClick={onCancel} className="btn-secondary">Descartar</button>
                    <button 
                        onClick={() => onSave(title)} 
                        disabled={isSaving}
                        className="btn-brand"
                    >
                        {isSaving ? <span className="spinner-sm" /> : <Save size={18} />}
                        Salvar Atividade
                    </button>
                    <button onClick={onStartGame} className="btn-action">
                        <Play size={18} fill="currentColor" /> Testar agora
                    </button>
                </div>
            </header>

            <div className="edit-title-card">
                <label className="label-tiny">Nome da Atividade</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="title-input"
                />
            </div>

            <div className="questions-grid">
                {questions.map((q, idx) => (
                    <div key={idx} className="review-card">
                        <div className="card-header">
                            <span className="card-num">#{idx + 1}</span>
                            <span className="card-level">{q.difficulty_level || 'Normal'}</span>
                        </div>
                        <div className="card-body">
                            <h4 className="card-sentence">{q.japanese_sentence}</h4>
                            <p className="card-hint">Dica: {q.hint}</p>
                            <div className="options-list">
                                {q.options.map((opt, oIdx) => (
                                    <div key={oIdx} className={`option-line ${oIdx === q.correct_index ? 'is-correct' : ''}`}>
                                        <span className="opt-marker">{oIdx === q.correct_index ? <Check size={14} /> : <X size={14} />}</span>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .escuta-review-container { max-width: 900px; margin: 2rem auto; animation: slideIn 0.5s ease-out; }
                .escuta-review-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
                .badge-highlight { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 99px; background: rgba(88,49,126,0.1); color: var(--color-brand); font-family: var(--font-outfit); font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
                .title-text { font-family: var(--font-outfit); font-size: 2rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
                .subtitle-text { font-size: 1rem; color: var(--color-slate-mid); margin: 0.25rem 0 0; }
                
                .actions-area { display: flex; gap: 0.75rem; }
                .btn-secondary { padding: 0.75rem 1.25rem; border-radius: 0.8rem; border: 1.5px solid var(--color-slate-border); background: white; font-family: var(--font-outfit); font-weight: 700; color: var(--color-slate-mid); cursor: pointer; transition: 0.2s; }
                .btn-brand { padding: 0.75rem 1.5rem; border-radius: 0.8rem; border: none; background: var(--color-brand); color: white; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-outfit); font-weight: 800; box-shadow: 0 4px 15px rgba(88,49,126,0.2); }
                .btn-action { padding: 0.75rem 1.5rem; border-radius: 0.8rem; border: none; background: var(--color-action); color: white; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-outfit); font-weight: 800; }
                
                .edit-title-card { background: white; border: 1.5px solid var(--color-slate-border); border-radius: 1.25rem; padding: 1.5rem; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.5rem; }
                .label-tiny { font-size: 0.7rem; font-weight: 800; color: var(--color-slate-mid); text-transform: uppercase; letter-spacing: 0.05em; }
                .title-input { border: 1.5px solid var(--color-slate-border); border-radius: 0.6rem; padding: 0.75rem; font-family: var(--font-outfit); font-size: 1.1rem; font-weight: 600; color: var(--color-slate-dark); outline: none; }
                .title-input:focus { border-color: var(--color-brand); }

                .questions-grid { display: grid; gap: 1.25rem; grid-template-columns: 1fr; }
                .review-card { background: white; border: 1.5px solid var(--color-slate-border); border-radius: 1.5rem; overflow: hidden; }
                .card-header { background: var(--color-ice); padding: 0.5rem 1.5rem; display: flex; justify-content: space-between; border-bottom: 1.5px solid var(--color-slate-border); }
                .card-num { font-family: var(--font-outfit); font-weight: 800; color: var(--color-brand); }
                .card-level { font-size: 0.7rem; font-weight: 800; color: var(--color-slate-mid); text-transform: uppercase; }
                .card-body { padding: 1.5rem; }
                .card-sentence { font-family: var(--font-outfit); font-size: 1.2rem; font-weight: 800; margin-bottom: 0.5rem; }
                .card-hint { font-size: 0.85rem; color: var(--color-slate-mid); margin-bottom: 1rem; }
                
                .options-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
                .option-line { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 0.5rem; border-radius: 0.5rem; border: 1px solid var(--color-slate-border); }
                .is-correct { background: #dcfce7; border-color: #22c55e; color: #166534; font-weight: 800; }
                .opt-marker { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }

                .spinner-sm { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};
