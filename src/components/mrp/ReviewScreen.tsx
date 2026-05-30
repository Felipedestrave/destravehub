import React from 'react';
import { CheckCircle2, Save, Send, Trash2, Edit3, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { MrpQuestion, MrpConfig } from '../../types/mrp';

interface ReviewScreenProps {
    questions: MrpQuestion[];
    config: MrpConfig;
    onSave: (title: string, editedQuestions: MrpQuestion[]) => void;
    onStartGame: (editedQuestions: MrpQuestion[]) => void;
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
    const [editableQuestions, setEditableQuestions] = React.useState<MrpQuestion[]>(questions);
    const [editingIdx, setEditingIdx] = React.useState<number | null>(null);
    const [expandedIdx, setExpandedIdx] = React.useState<number | null>(null);

    const deleteQuestion = (idx: number) => {
        setEditableQuestions(prev => prev.filter((_, i) => i !== idx));
        if (editingIdx === idx) setEditingIdx(null);
        if (expandedIdx === idx) setExpandedIdx(null);
    };

    const updateQuestion = (idx: number, field: keyof MrpQuestion, value: string) => {
        setEditableQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
    };

    const updateOption = (qIdx: number, oIdx: number, value: string) => {
        setEditableQuestions(prev => prev.map((q, i) => {
            if (i !== qIdx || !q.options) return q;
            const newOptions = [...q.options];
            newOptions[oIdx] = value;
            const newCorrect = q.options[oIdx] === q.correctAnswer ? value : q.correctAnswer;
            return { ...q, options: newOptions, correctAnswer: newCorrect };
        }));
    };

    const setCorrectOption = (qIdx: number, value: string) => {
        setEditableQuestions(prev => prev.map((q, i) =>
            i === qIdx ? { ...q, correctAnswer: value } : q
        ));
    };

    return (
        <div className="mrp-review-container">
            <header className="mrp-review-header">
                <div>
                    <span className="mrp-review-badge">Revisão da IA</span>
                    <h2 className="mrp-review-title">Cenários Gerados</h2>
                    <p className="mrp-review-subtitle">
                        {editableQuestions.length} cenários. Edite, delete ou salve como uma <strong>Atividade</strong>.
                    </p>
                </div>
                <div className="mrp-review-actions">
                    <button onClick={onCancel} className="mrp-btn-cancel">Descartar</button>
                    <button
                        onClick={() => onSave(title, editableQuestions)}
                        disabled={isSaving || editableQuestions.length === 0}
                        className="mrp-btn-save"
                    >
                        {isSaving ? <span className="mrp-spinner sm" /> : <Save size={18} />}
                        Salvar na Central
                    </button>
                    <button onClick={() => onStartGame(editableQuestions)} disabled={editableQuestions.length === 0} className="mrp-btn-play">
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
                {editableQuestions.map((q, idx) => {
                    const isEditing = editingIdx === idx;
                    const isExpanded = expandedIdx === idx;

                    return (
                        <div key={idx} className={`mrp-review-card ${isEditing ? 'is-editing' : ''}`}>
                            <div className="mrp-card-num">#{idx + 1}</div>
                            <div className="mrp-card-content">
                                {/* Scenario */}
                                {isEditing ? (
                                    <textarea
                                        className="mrp-edit-input mrp-edit-textarea bold"
                                        value={q.scenario}
                                        onChange={e => updateQuestion(idx, 'scenario', e.target.value)}
                                        rows={2}
                                        placeholder="Cenário / Situação"
                                    />
                                ) : (
                                    <h4 className="mrp-card-jp">{q.scenario}</h4>
                                )}

                                {/* Task */}
                                {isEditing ? (
                                    <input
                                        className="mrp-edit-input brand"
                                        value={q.task}
                                        onChange={e => updateQuestion(idx, 'task', e.target.value)}
                                        placeholder="Instrução / Tarefa"
                                    />
                                ) : (
                                    <p className="mrp-card-translation">{q.task}</p>
                                )}

                                {/* Hint */}
                                <div className="mrp-card-context">
                                    {isEditing ? (
                                        <input
                                            className="mrp-edit-input"
                                            value={q.hint || ''}
                                            onChange={e => updateQuestion(idx, 'hint', e.target.value)}
                                            placeholder="Dica"
                                        />
                                    ) : (
                                        <><strong>Dica:</strong> {q.hint || 'Nenhuma dica disponível.'}</>
                                    )}
                                </div>

                                {/* Options / Answer */}
                                {q.options && q.options.length > 0 ? (
                                    <div className="mrp-options-preview">
                                        {q.options.map((opt, oIdx) => (
                                            <div key={oIdx} className={`mrp-opt-p ${opt === q.correctAnswer ? 'correct' : ''}`}>
                                                {isEditing ? (
                                                    <div className="mrp-opt-edit-row">
                                                        <button
                                                            className={`mrp-opt-correct-btn ${opt === q.correctAnswer ? 'active' : ''}`}
                                                            onClick={() => setCorrectOption(idx, opt)}
                                                            title="Marcar como correta"
                                                        >
                                                            {opt === q.correctAnswer ? <Check size={12} /> : <span className="mrp-opt-dot" />}
                                                        </button>
                                                        <input
                                                            className="mrp-opt-input"
                                                            value={opt}
                                                            onChange={e => updateOption(idx, oIdx, e.target.value)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <>{opt} {opt === q.correctAnswer && '✓'}</>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mrp-options-preview" style={{ gridTemplateColumns: '1fr' }}>
                                        <div className="mrp-opt-p correct" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>Resposta Esperada (Gabarito):</span>
                                            {isEditing ? (
                                                <input
                                                    className="mrp-edit-input"
                                                    value={q.correctAnswer}
                                                    onChange={e => updateQuestion(idx, 'correctAnswer', e.target.value)}
                                                />
                                            ) : (
                                                <span style={{ fontSize: '0.95rem' }}>{q.correctAnswer}</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card Actions */}
                            <div className="mrp-card-actions">
                                <button
                                    className={`mrp-action-btn edit ${isEditing ? 'active' : ''}`}
                                    onClick={() => setEditingIdx(isEditing ? null : idx)}
                                    title={isEditing ? 'Concluir edição' : 'Editar cenário'}
                                >
                                    {isEditing ? <Check size={15} /> : <Edit3 size={15} />}
                                </button>
                                <button
                                    className="mrp-action-btn delete"
                                    onClick={() => deleteQuestion(idx)}
                                    title="Deletar cenário"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {editableQuestions.length === 0 && (
                <div className="mrp-empty-state">
                    <p>Todos os cenários foram removidos.</p>
                    <button onClick={onCancel} className="mrp-btn-cancel">Gerar Novos Cenários</button>
                </div>
            )}

            <style>{`
                .mrp-review-container { width: 100%; animation: fade-in 0.4s ease-out; max-width: 900px; margin: 0 auto; }
                .mrp-review-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; gap: 2rem; flex-wrap: wrap; }
                .mrp-review-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 999px; background: rgba(14,165,233,0.1); color: #0ea5e9; font-family: var(--font-outfit); font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
                .mrp-review-title { font-family: var(--font-outfit); font-size: 2rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
                .mrp-review-subtitle { font-size: 0.95rem; color: var(--color-slate-mid); margin: 0.25rem 0 0; }
                
                .mrp-review-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
                .mrp-btn-cancel { padding: 0.75rem 1.25rem; border-radius: 0.875rem; border: 1.5px solid var(--color-slate-border); background: white; font-family: var(--font-outfit); font-weight: 700; color: var(--color-slate-mid); cursor: pointer; transition: all 150ms; }
                .mrp-btn-save { padding: 0.75rem 1.5rem; border-radius: 0.875rem; border: none; background: var(--color-brand); color: white; font-family: var(--font-outfit); font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; transition: transform 150ms; box-shadow: 0 4px 12px rgba(88,49,126,0.2); }
                .mrp-btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
                .mrp-btn-play { padding: 0.75rem 1.5rem; border-radius: 0.875rem; border: none; background: var(--color-action); color: white; font-family: var(--font-outfit); font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; transition: transform 150ms; box-shadow: 0 4px 12px rgba(255,127,50,0.2); }
                .mrp-btn-play:disabled { opacity: 0.5; cursor: not-allowed; }
                .mrp-btn-save:hover:not(:disabled), .mrp-btn-play:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }

                .mrp-title-input-wrapper { background: white; border: 1.5px solid var(--color-slate-border); border-radius: 1rem; padding: 1.25rem; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.5rem; }
                .mrp-title-input-wrapper label { font-size: 0.75rem; font-weight: 700; color: var(--color-slate-mid); text-transform: uppercase; letter-spacing: 0.05em; }
                .mrp-title-input-wrapper input { border: 1.5px solid var(--color-slate-border); border-radius: 0.625rem; padding: 0.75rem 1rem; font-family: var(--font-outfit); font-size: 1.1rem; font-weight: 600; color: var(--color-slate-dark); outline: none; transition: border-color 150ms; }
                .mrp-title-input-wrapper input:focus { border-color: var(--color-brand); }

                .mrp-questions-list { display: flex; flex-direction: column; gap: 1rem; padding-bottom: 4rem; }
                .mrp-review-card { background: white; border-radius: 1.25rem; border: 1.5px solid var(--color-slate-border); display: flex; overflow: visible; transition: border-color 200ms, box-shadow 200ms; position: relative; }
                .mrp-review-card.is-editing { border-color: var(--color-brand); box-shadow: 0 0 0 3px rgba(88,49,126,0.1); }
                .mrp-card-num { width: 50px; min-width: 50px; background: var(--color-ice); display: flex; align-items: center; justify-content: center; font-family: var(--font-outfit); font-weight: 800; color: var(--color-brand); font-size: 1.25rem; border-right: 1.5px solid var(--color-slate-border); border-radius: 1.25rem 0 0 1.25rem; }
                .mrp-card-content { padding: 1.25rem 1.5rem; flex: 1; min-width: 0; }
                .mrp-card-jp { font-family: var(--font-outfit); font-size: 1.15rem; font-weight: 800; color: var(--color-slate-dark); margin: 0 0 0.25rem; }
                .mrp-card-translation { font-size: 0.95rem; color: var(--color-brand); font-weight: 600; margin-bottom: 0.75rem; }
                .mrp-card-context { font-size: 0.85rem; color: var(--color-slate-mid); background: var(--color-ice); padding: 0.6rem 0.875rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px dashed var(--color-slate-border); }
                .mrp-options-preview { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
                .mrp-opt-p { font-size: 0.8rem; padding: 0.5rem; border-radius: 0.375rem; border: 1px solid var(--color-slate-border); color: var(--color-slate-mid); }
                .mrp-opt-p.correct { background: #dcfce7; border-color: #22c55e; color: #166534; font-weight: 700; }

                /* Edit inputs */
                .mrp-edit-input { width: 100%; border: 1.5px solid var(--color-slate-border); border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-family: var(--font-outfit); font-size: 0.95rem; color: var(--color-slate-dark); outline: none; background: #fafafa; transition: border-color 150ms; margin-bottom: 0.5rem; box-sizing: border-box; }
                .mrp-edit-input:focus { border-color: var(--color-brand); background: white; }
                .mrp-edit-input.bold { font-size: 1rem; font-weight: 700; }
                .mrp-edit-input.brand { color: var(--color-brand); font-weight: 600; }
                .mrp-edit-textarea { resize: vertical; min-height: 64px; }

                /* Option edit row */
                .mrp-opt-edit-row { display: flex; align-items: center; gap: 0.5rem; }
                .mrp-opt-correct-btn { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; border: 2px solid #22c55e; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #166534; transition: background 150ms; }
                .mrp-opt-correct-btn.active { background: #22c55e; color: white; }
                .mrp-opt-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-slate-border); display: block; }
                .mrp-opt-input { flex: 1; border: 1px solid var(--color-slate-border); border-radius: 0.375rem; padding: 0.25rem 0.5rem; font-size: 0.8rem; outline: none; min-width: 0; }
                .mrp-opt-input:focus { border-color: var(--color-brand); }

                /* Card action buttons */
                .mrp-card-actions { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.75rem 0.75rem 0.75rem 0; justify-content: flex-start; }
                .mrp-action-btn { width: 32px; height: 32px; border-radius: 0.5rem; border: 1.5px solid var(--color-slate-border); background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 150ms; color: var(--color-slate-mid); }
                .mrp-action-btn.edit:hover, .mrp-action-btn.edit.active { background: var(--color-brand); border-color: var(--color-brand); color: white; }
                .mrp-action-btn.delete:hover { background: #fef2f2; border-color: #fca5a5; color: #dc2626; }

                /* Empty state */
                .mrp-empty-state { text-align: center; padding: 3rem 1rem; color: var(--color-slate-mid); display: flex; flex-direction: column; align-items: center; gap: 1rem; }

                .mrp-spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: mrp-spin 0.7s linear infinite; }
                @keyframes mrp-spin { to { transform: rotate(360deg); } }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};
