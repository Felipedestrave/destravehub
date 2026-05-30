import React from 'react';
import { Save, Play, Check, X, Trash2, Edit3 } from 'lucide-react';
import type { Question, GameConfig } from '../../types/escuta';

interface EscutaReviewProps {
    questions: Question[];
    config: GameConfig;
    onSave: (title: string, editedQuestions: Question[]) => void;
    onStartGame: (editedQuestions: Question[]) => void;
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
    const [editableQuestions, setEditableQuestions] = React.useState<Question[]>(questions);
    const [editingIdx, setEditingIdx] = React.useState<number | null>(null);

    const deleteQuestion = (idx: number) => {
        setEditableQuestions(prev => prev.filter((_, i) => i !== idx));
        if (editingIdx === idx) setEditingIdx(null);
    };

    const updateQuestion = (idx: number, field: keyof Question, value: string | string[] | number) => {
        setEditableQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
    };

    const updateOption = (qIdx: number, oIdx: number, value: string) => {
        setEditableQuestions(prev => prev.map((q, i) => {
            if (i !== qIdx) return q;
            const newOptions = [...q.options];
            newOptions[oIdx] = value;
            return { ...q, options: newOptions };
        }));
    };

    return (
        <div className="esc-rv-container">
            <header className="esc-rv-header">
                <div className="esc-rv-title-area">
                    <span className="esc-rv-badge">Refinamento de Áudio</span>
                    <h2 className="esc-rv-title">Missão de Escuta pronta! 🎧</h2>
                    <p className="esc-rv-subtitle">
                        {editableQuestions.length} questões. Edite, delete ou salve para seus alunos.
                    </p>
                </div>
                <div className="esc-rv-actions">
                    <button onClick={onCancel} className="esc-rv-btn-secondary">Descartar</button>
                    <button
                        onClick={() => onSave(title, editableQuestions)}
                        disabled={isSaving || editableQuestions.length === 0}
                        className="esc-rv-btn-brand"
                    >
                        {isSaving ? <span className="esc-rv-spinner" /> : <Save size={18} />}
                        Salvar Atividade
                    </button>
                    <button
                        onClick={() => onStartGame(editableQuestions)}
                        disabled={editableQuestions.length === 0}
                        className="esc-rv-btn-action"
                    >
                        <Play size={18} fill="currentColor" /> Testar agora
                    </button>
                </div>
            </header>

            <div className="esc-rv-title-card">
                <label className="esc-rv-label">Nome da Atividade</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="esc-rv-input"
                />
            </div>

            <div className="esc-rv-grid">
                {editableQuestions.map((q, idx) => {
                    const isEditing = editingIdx === idx;
                    return (
                        <div key={idx} className={`esc-rv-card ${isEditing ? 'esc-rv-card--editing' : ''}`}>

                            {/* Card Header */}
                            <div className="esc-rv-card-header">
                                <div className="esc-rv-card-header-left">
                                    <span className="esc-rv-num">#{idx + 1}</span>
                                    <span className="esc-rv-level">{q.difficulty_level || 'Normal'}</span>
                                </div>
                                <div className="esc-rv-card-btns">
                                    <button
                                        className={`esc-rv-icon-btn esc-rv-icon-btn--edit ${isEditing ? 'esc-rv-icon-btn--active' : ''}`}
                                        onClick={() => setEditingIdx(isEditing ? null : idx)}
                                        title={isEditing ? 'Concluir edição' : 'Editar questão'}
                                    >
                                        {isEditing ? <Check size={14} /> : <Edit3 size={14} />}
                                    </button>
                                    <button
                                        className="esc-rv-icon-btn esc-rv-icon-btn--delete"
                                        onClick={() => deleteQuestion(idx)}
                                        title="Deletar questão"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="esc-rv-card-body">
                                {/* Frase em japonês */}
                                {isEditing ? (
                                    <textarea
                                        className="esc-rv-field esc-rv-field--bold"
                                        value={q.japanese_sentence}
                                        onChange={e => updateQuestion(idx, 'japanese_sentence', e.target.value)}
                                        rows={2}
                                        placeholder="Frase em japonês"
                                    />
                                ) : (
                                    <h4 className="esc-rv-sentence">{q.japanese_sentence}</h4>
                                )}

                                {/* Dica */}
                                {isEditing ? (
                                    <input
                                        className="esc-rv-field"
                                        value={q.hint}
                                        onChange={e => updateQuestion(idx, 'hint', e.target.value)}
                                        placeholder="Dica para os alunos"
                                    />
                                ) : (
                                    <p className="esc-rv-hint">Dica: {q.hint}</p>
                                )}

                                {/* Alternativas */}
                                <div className="esc-rv-options">
                                    {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} className={`esc-rv-opt ${oIdx === q.correct_index ? 'esc-rv-opt--correct' : ''}`}>
                                            {isEditing ? (
                                                <div className="esc-rv-opt-edit">
                                                    <button
                                                        className={`esc-rv-opt-radio ${oIdx === q.correct_index ? 'esc-rv-opt-radio--active' : ''}`}
                                                        onClick={() => updateQuestion(idx, 'correct_index', oIdx)}
                                                        title="Marcar como correta"
                                                    >
                                                        {oIdx === q.correct_index ? <Check size={11} /> : <span className="esc-rv-opt-dot" />}
                                                    </button>
                                                    <input
                                                        className="esc-rv-opt-input"
                                                        value={opt}
                                                        onChange={e => updateOption(idx, oIdx, e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="esc-rv-opt-marker">
                                                        {oIdx === q.correct_index ? <Check size={14} /> : <X size={14} />}
                                                    </span>
                                                    {opt}
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {editableQuestions.length === 0 && (
                <div className="esc-rv-empty">
                    <p>Todas as questões foram removidas.</p>
                    <button onClick={onCancel} className="esc-rv-btn-secondary">Gerar Novas Questões</button>
                </div>
            )}

            <style>{`
                .esc-rv-container { max-width: 900px; margin: 2rem auto; animation: escRvSlideIn 0.5s ease-out; }

                /* Header */
                .esc-rv-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
                .esc-rv-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 99px; background: rgba(88,49,126,0.1); color: var(--color-brand); font-family: var(--font-outfit); font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
                .esc-rv-title { font-family: var(--font-outfit); font-size: 2rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
                .esc-rv-subtitle { font-size: 1rem; color: var(--color-slate-mid); margin: 0.25rem 0 0; }

                /* Action buttons (header) */
                .esc-rv-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
                .esc-rv-btn-secondary { padding: 0.75rem 1.25rem; border-radius: 0.8rem; border: 1.5px solid var(--color-slate-border); background: white; font-family: var(--font-outfit); font-weight: 700; color: var(--color-slate-mid); cursor: pointer; transition: 0.2s; }
                .esc-rv-btn-brand { padding: 0.75rem 1.5rem; border-radius: 0.8rem; border: none; background: var(--color-brand); color: white; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-outfit); font-weight: 800; box-shadow: 0 4px 15px rgba(88,49,126,0.2); }
                .esc-rv-btn-action { padding: 0.75rem 1.5rem; border-radius: 0.8rem; border: none; background: var(--color-action); color: white; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-outfit); font-weight: 800; }
                .esc-rv-btn-brand:disabled, .esc-rv-btn-action:disabled { opacity: 0.5; cursor: not-allowed; }

                /* Title input */
                .esc-rv-title-card { background: white; border: 1.5px solid var(--color-slate-border); border-radius: 1.25rem; padding: 1.5rem; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.5rem; }
                .esc-rv-label { font-size: 0.7rem; font-weight: 800; color: var(--color-slate-mid); text-transform: uppercase; letter-spacing: 0.05em; }
                .esc-rv-input { border: 1.5px solid var(--color-slate-border); border-radius: 0.6rem; padding: 0.75rem; font-family: var(--font-outfit); font-size: 1.1rem; font-weight: 600; color: var(--color-slate-dark); outline: none; width: 100%; box-sizing: border-box; }
                .esc-rv-input:focus { border-color: var(--color-brand); }

                /* Cards grid */
                .esc-rv-grid { display: grid; gap: 1.25rem; grid-template-columns: 1fr; padding-bottom: 4rem; }
                .esc-rv-card { background: white; border: 1.5px solid var(--color-slate-border); border-radius: 1.5rem; overflow: hidden; transition: border-color 200ms, box-shadow 200ms; }
                .esc-rv-card--editing { border-color: var(--color-brand) !important; box-shadow: 0 0 0 3px rgba(88,49,126,0.12); }

                /* Card header */
                .esc-rv-card-header { background: var(--color-ice); padding: 0.5rem 1.25rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid var(--color-slate-border); }
                .esc-rv-card-header-left { display: flex; align-items: center; gap: 0.75rem; }
                .esc-rv-num { font-family: var(--font-outfit); font-weight: 800; color: var(--color-brand); }
                .esc-rv-level { font-size: 0.7rem; font-weight: 800; color: var(--color-slate-mid); text-transform: uppercase; }

                /* Icon buttons (edit/delete) */
                .esc-rv-card-btns { display: flex; gap: 0.4rem; }
                .esc-rv-icon-btn { width: 30px; height: 30px; border-radius: 0.5rem; border: 1.5px solid var(--color-slate-border); background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 150ms; color: var(--color-slate-mid); }
                .esc-rv-icon-btn--edit:hover, .esc-rv-icon-btn--active { background: var(--color-brand) !important; border-color: var(--color-brand) !important; color: white !important; }
                .esc-rv-icon-btn--delete:hover { background: #fef2f2 !important; border-color: #fca5a5 !important; color: #dc2626 !important; }

                /* Card body */
                .esc-rv-card-body { padding: 1.5rem; }
                .esc-rv-sentence { font-family: var(--font-outfit); font-size: 1.2rem; font-weight: 800; margin: 0 0 0.5rem; color: var(--color-slate-dark); }
                .esc-rv-hint { font-size: 0.85rem; color: var(--color-slate-mid); margin: 0 0 1rem; }

                /* Options */
                .esc-rv-options { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
                .esc-rv-opt { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 0.5rem; border-radius: 0.5rem; border: 1px solid var(--color-slate-border); }
                .esc-rv-opt--correct { background: #dcfce7 !important; border-color: #22c55e !important; color: #166534 !important; font-weight: 800; }
                .esc-rv-opt-marker { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

                /* Edit mode */
                .esc-rv-field { width: 100%; border: 1.5px solid var(--color-slate-border); border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-family: var(--font-outfit); font-size: 0.95rem; color: var(--color-slate-dark); outline: none; background: #fafafa; transition: border-color 150ms; margin-bottom: 0.5rem; box-sizing: border-box; resize: vertical; }
                .esc-rv-field:focus { border-color: var(--color-brand); background: white; }
                .esc-rv-field--bold { font-size: 1rem; font-weight: 700; }
                .esc-rv-opt-edit { display: flex; align-items: center; gap: 0.4rem; width: 100%; }
                .esc-rv-opt-radio { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; border: 2px solid #22c55e; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #166534; transition: background 150ms; }
                .esc-rv-opt-radio--active { background: #22c55e !important; color: white !important; }
                .esc-rv-opt-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-slate-border); display: block; }
                .esc-rv-opt-input { flex: 1; border: 1px solid var(--color-slate-border); border-radius: 0.375rem; padding: 0.25rem 0.5rem; font-size: 0.8rem; outline: none; min-width: 0; }
                .esc-rv-opt-input:focus { border-color: var(--color-brand); }

                /* Empty state */
                .esc-rv-empty { text-align: center; padding: 3rem 1rem; color: var(--color-slate-mid); display: flex; flex-direction: column; align-items: center; gap: 1rem; }

                /* Spinner */
                .esc-rv-spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: escRvSpin 0.8s linear infinite; display: inline-block; }
                @keyframes escRvSpin { to { transform: rotate(360deg); } }
                @keyframes escRvSlideIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};
