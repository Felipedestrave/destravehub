import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const PROFICIENCY_LEVELS = [
    'Iniciante',
    'Básico',
    'Intermediário',
    'Avançado'
];

const LANGUAGES = [
    'Japonês',
    'Inglês',
    'Espanhol',
    'Francês',
    'Alemão',
    'Italiano',
    'Outro'
];

export default function AddStudentForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        language: 'Japonês',
        level: 'Iniciante',
        notes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Sessão expirada. Faça login novamente.');

            const response = await fetch('/api/admin/create-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    language: formData.language,
                    level: formData.level,
                    metadata: { notes: formData.notes }
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao criar aluno.');
            }

            // Success redirect
            const params = new URLSearchParams({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            window.location.href = `/dashboard/students/success?${params.toString()}`;

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-student-form">
            <div className="form-card">
                <div className="form-section">
                    <h3 className="section-title">Credenciais de Acesso</h3>
                    <p className="section-desc">Essas informações serão usadas pelo aluno para entrar na plataforma.</p>

                    <div className="field-group">
                        <label className="field-label">Nome Completo *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="field-input"
                            placeholder="Ex: Yuki Tanaka"
                        />
                    </div>

                    <div className="field-grid">
                        <div className="field-group">
                            <label className="field-label">E-mail *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="field-input"
                                placeholder="aluno@email.com"
                            />
                        </div>
                        <div className="field-group">
                            <label className="field-label">Senha Inicial *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="field-input"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-divider" />

                <div className="form-section">
                    <h3 className="section-title">Perfil Pedagógico</h3>
                    <p className="section-desc">Defina o foco e o nível atual do aluno.</p>

                    <div className="field-grid">
                        <div className="field-group">
                            <label className="field-label">Idioma</label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="field-input"
                            >
                                {LANGUAGES.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field-group">
                            <label className="field-label">Nível de Proficiência</label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="field-input"
                            >
                                {PROFICIENCY_LEVELS.map(lvl => (
                                    <option key={lvl} value={lvl}>{lvl}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="field-group">
                        <label className="field-label">Notas Internas (Opcional)</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="field-input textarea"
                            placeholder="Ex: Aluno focado em conversação para viagem."
                            rows={3}
                        />
                    </div>
                </div>

                {error && (
                    <div className="form-error">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="btn-ghost"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn-action"
                        disabled={loading}
                    >
                        {loading ? 'Criando Conta...' : 'Cadastrar Aluno'}
                    </button>
                </div>
            </div>

            <style>{`
                .add-student-form {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .form-card {
                    background: white;
                    border: 1px solid var(--color-slate-border);
                    border-radius: 1.5rem;
                    padding: 2.5rem;
                    box-shadow: var(--shadow-card);
                }
                .form-section {
                    margin-bottom: 2rem;
                }
                .section-title {
                    font-family: var(--font-outfit);
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--color-brand);
                    margin: 0 0 0.25rem;
                }
                .section-desc {
                    font-size: 0.875rem;
                    color: var(--color-slate-mid);
                    margin-bottom: 1.5rem;
                }
                .form-divider {
                    height: 1px;
                    background: var(--color-slate-border);
                    margin: 2rem 0;
                }
                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-bottom: 1.25rem;
                }
                .field-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.25rem;
                }
                .field-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--color-slate-dark);
                }
                .field-input {
                    padding: 0.75rem 1rem;
                    border-radius: 0.75rem;
                    border: 1px solid var(--color-slate-border);
                    background: var(--color-ice);
                    color: var(--color-slate-dark);
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .field-input:focus {
                    border-color: var(--color-brand);
                    box-shadow: 0 0 0 4px rgba(88, 49, 126, 0.1);
                }
                .field-input.textarea {
                    resize: vertical;
                    min-height: 80px;
                }
                .form-error {
                    background: #FEF2F2;
                    border: 1px solid #FEE2E2;
                    color: #B91C1C;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                
                @media (max-width: 640px) {
                    .field-grid {
                        grid-template-columns: 1fr;
                    }
                    .form-card {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </form>
    );
}
