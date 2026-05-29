import React from 'react';
import { CheckCircle2, Save, ArrowLeft, Send } from 'lucide-react';
import type { MrpQuestion, MrpConfig } from '../../types/mrp';

interface ReviewScreenProps {
    questions: MrpQuestion[];
    config: MrpConfig;
    onSave: (title: string) => void;
    onStartGame: () => void;
    onCancel: () => void;
    isSaving: boolean;
    initialTitle?: string;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({ 
    questions, 
    config, 
    onSave, 
    onStartGame, 
    onCancel,
    isSaving,
    initialTitle
}) => {
    const [title, setTitle] = React.useState(initialTitle || `MRP: ${config.level} - ${new Date().toLocaleDateString()}`);

    return (
        <div className="mrp-review-container">
            <header className="mrp-review-header">
                <div>
                    <span className="mrp-review-badge">Revisão da IA</span>
                    <h2 className="mrp-review-title">Cenários Gerados</h2>
                    <p className="mrp-review-subtitle">
                        {questions.length} cenários criados. Salve como uma <strong>Atividade</strong> para seus alunos ou jogue agora para testar.
                    </p>
                </div>
                <div className="mrp-review-actions">
                    <button onClick={onCancel} className="mrp-btn-cancel">Descartar</button>
                    <button 
                        onClick={() => onSave(title)} 
                        disabled={isSaving}
                        className="mrp-btn-save"
                    >
                        {isSaving ? <span className="mrp-spinner sm" /> : <Save size={18} />}
                        Salvar na Central
                    </button>
                    <button onClick={onStartGame} className="mrp-btn-play">
                        <Send size={18} /> Iniciar Teste
                    </button>
                </div>
            </header>

            <div className="mrp-title-input-wrapper">
                <label>Título da Atividade</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Diálogo no Restaurante - N5"
                />
            </div>

            <div className="mrp-questions-list">
                {questions.map((q, idx) => (
                    <div key={idx} className="mrp-review-card">
                        <div className="mrp-card-num">#{idx + 1}</div>
                        <div className="mrp-card-content">
                            <h4 className="mrp-card-jp">{q.scenario}</h4>
                            <p className="mrp-card-translation">{q.task}</p>
                            <div className="mrp-card-context">
                                <strong>Dica:</strong> {q.hint || 'Nenhuma dica disponível.'}
                            </div>
                            {q.options && q.options.length > 0 ? (
                                <div className="mrp-options-preview">
                                    {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} className={`mrp-opt-p ${opt === q.correctAnswer ? 'correct' : ''}`}>
                                            {opt} {opt === q.correctAnswer && '✓'}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mrp-options-preview" style={{ gridTemplateColumns: '1fr' }}>
                                    <div className="mrp-opt-p correct" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>Resposta Esperada (Gabarito):</span>
                                        <span style={{ fontSize: '0.95rem' }}>{q.correctAnswer}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .mrp-review-container { width: 100%; animation: fade-in 0.4s ease-out; max-width: 900px; margin: 0 auto; }
                .mrp-review-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; gap: 2rem; }
                .mrp-review-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 999px; background: rgba(14,165,233,0.1); color: #0ea5e9; font-family: var(--font-outfit); font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
                .mrp-review-title { font-family: var(--font-outfit); font-size: 2rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
                .mrp-review-subtitle { font-size: 0.95rem; color: var(--color-slate-mid); margin: 0.25rem 0 0; }
                
                .mrp-review-actions { display: flex; gap: 0.75rem; }
                .mrp-btn-cancel { padding: 0.75rem 1.25rem; border-radius: 0.875rem; border: 1.5px solid var(--color-slate-border); background: white; font-family: var(--font-outfit); font-weight: 700; color: var(--color-slate-mid); cursor: pointer; transition: all 150ms; }
                .mrp-btn-save { padding: 0.75rem 1.5rem; border-radius: 0.875rem; border: none; background: var(--color-brand); color: white; font-family: var(--font-outfit); font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; transition: transform 150ms; box-shadow: 0 4px 12px rgba(88,49,126,0.2); }
                .mrp-btn-play { padding: 0.75rem 1.5rem; border-radius: 0.875rem; border: none; background: var(--color-action); color: white; font-family: var(--font-outfit); font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; transition: transform 150ms; box-shadow: 0 4px 12px rgba(255,127,50,0.2); }
                .mrp-btn-save:hover, .mrp-btn-play:hover { transform: translateY(-2px); filter: brightness(1.1); }

                .mrp-title-input-wrapper { background: white; border: 1.5px solid var(--color-slate-border); border-radius: 1rem; padding: 1.25rem; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.5rem; }
                .mrp-title-input-wrapper label { font-size: 0.75rem; font-weight: 700; color: var(--color-slate-mid); text-transform: uppercase; letter-spacing: 0.05em; }
                .mrp-title-input-wrapper input { border: 1.5px solid var(--color-slate-border); border-radius: 0.625rem; padding: 0.75rem 1rem; font-family: var(--font-outfit); font-size: 1.1rem; font-weight: 600; color: var(--color-slate-dark); outline: none; transition: border-color 150ms; }
                .mrp-title-input-wrapper input:focus { border-color: var(--color-brand); }

                .mrp-questions-list { display: flex; flex-direction: column; gap: 1rem; padding-bottom: 4rem; }
                .mrp-review-card { background: white; border-radius: 1.25rem; border: 1.5px solid var(--color-slate-border); display: flex; overflow: hidden; }
                .mrp-card-num { width: 50px; background: var(--color-ice); display: flex; align-items: center; justify-content: center; font-family: var(--font-outfit); font-weight: 800; color: var(--color-brand); font-size: 1.25rem; border-right: 1.5px solid var(--color-slate-border); }
                .mrp-card-content { padding: 1.5rem; flex: 1; }
                .mrp-card-jp { font-family: var(--font-outfit); font-size: 1.25rem; font-weight: 800; color: var(--color-slate-dark); margin: 0 0 0.25rem; }
                .mrp-card-translation { font-size: 0.95rem; color: var(--color-brand); font-weight: 600; margin-bottom: 1rem; }
                .mrp-card-context { font-size: 0.85rem; color: var(--color-slate-mid); background: var(--color-ice); padding: 0.6rem 0.875rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px dashed var(--color-slate-border); }
                .mrp-options-preview { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
                .mrp-opt-p { font-size: 0.8rem; padding: 0.5rem; border-radius: 0.375rem; border: 1px solid var(--color-slate-border); color: var(--color-slate-mid); }
                .mrp-opt-p.correct { background: #dcfce7; border-color: #22c55e; color: #166534; font-weight: 700; }

                .mrp-spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: mrp-spin 0.7s linear infinite; }
                @keyframes mrp-spin { to { transform: rotate(360deg); } }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};
