import React, { useState, useEffect } from 'react';
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

const COUNTRIES = [
    { code: '+55', name: 'Brasil 🇧🇷', mask: '(99) 99999-9999' },
    { code: '+81', name: 'Japão 🇯🇵', mask: '99 9999-9999' }
];

interface Props {
    editId?: string | null;
}

export default function AddStudentForm({ editId }: Props) {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!editId);
    const [error, setError] = useState<string | null>(null);
    const [country, setCountry] = useState(COUNTRIES[0]);
    const [whatsappInput, setWhatsappInput] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        language: 'Japonês',
        level: 'Iniciante',
        notes: '',
        billing_type: 'mensalidade' as 'mensalidade' | 'pacote' | 'avulsa',
        billing_amount: '',
        billing_currency: 'BRL',
        billing_day: '',
        billing_package_size: '4',
        billing_package_start_date: new Date().toISOString().split('T')[0],
    });

    // --- Fetch Data for Editing ---
    useEffect(() => {
        if (!editId) return;

        const fetchStudent = async () => {
            try {
                const { data: student, error: sError } = await supabase
                    .from('students')
                    .select('*, profiles!student_id(whatsapp)')
                    .eq('id', editId)
                    .single();

                if (sError) throw sError;

                if (student) {
                    setFormData({
                        name: student.name,
                        email: '',
                        password: '',
                        language: student.language || 'Japonês',
                        level: student.level || 'Iniciante',
                        notes: (student.metadata as any)?.notes || '',
                        billing_type: student.billing_type || 'mensalidade',
                        billing_amount: student.billing_amount ? String(student.billing_amount) : '',
                        billing_currency: student.billing_currency || 'BRL',
                        billing_day: student.billing_day ? String(student.billing_day) : '',
                        billing_package_size: student.billing_package_size ? String(student.billing_package_size) : '4',
                    });

                    const fullWpp = (student.profiles as any)?.whatsapp || '';
                    if (fullWpp) {
                        if (fullWpp.startsWith('+81')) {
                            setCountry(COUNTRIES[1]);
                            setWhatsappInput(fullWpp.replace('+81', ''));
                        } else if (fullWpp.startsWith('+55')) {
                            setCountry(COUNTRIES[0]);
                            setWhatsappInput(fullWpp.replace('+55', ''));
                        } else {
                            setWhatsappInput(fullWpp);
                        }
                    }
                }
            } catch (err: any) {
                console.error('Error fetching student:', err);
                setError('Erro ao carregar dados do aluno.');
            } finally {
                setFetching(false);
            }
        };

        fetchStudent();
    }, [editId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, ''); // Only numbers
        
        // Simple BR Mask logic
        if (country.code === '+55') {
            if (val.length > 11) val = val.substring(0, 11);
            // Optional: apply visual mask here if desired
        } else if (country.code === '+81') {
            if (val.length > 11) val = val.substring(0, 11);
        }
        
        setWhatsappInput(val);
    };

    const formatDisplayPhone = (val: string) => {
        if (!val) return '';
        if (country.code === '+55') {
            // (99) 99999-9999
            let m = val.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
            if (!m) return val;
            return (!m[2] ? m[1] : `(${m[1]}) ${m[2]}` + (m[3] ? `-${m[3]}` : ''));
        }
        if (country.code === '+81') {
            // 99 9999 9999
            let m = val.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);
            if (!m) return val;
            return m[1] + (m[2] ? ` ${m[2]}` : '') + (m[3] ? ` ${m[3]}` : '');
        }
        return val;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Sessão expirada. Faça login novamente.');

            const fullWhatsapp = whatsappInput ? `${country.code}${whatsappInput}` : null;
            
            const endpoint = editId ? '/api/admin/update-student' : '/api/admin/create-student';
            
            const payload = {
                id: editId,
                name: formData.name,
                email: formData.email,
                password: formData.password || undefined,
                language: formData.language,
                level: formData.level,
                whatsapp: fullWhatsapp,
                metadata: { notes: formData.notes },
                billing_type: formData.billing_type,
                billing_amount: formData.billing_amount ? parseFloat(formData.billing_amount) : null,
                billing_currency: formData.billing_currency,
                billing_day: formData.billing_day ? parseInt(formData.billing_day) : null,
                billing_package_size: formData.billing_package_size ? parseInt(formData.billing_package_size) : null,
                billing_package_start_date: formData.billing_package_start_date || null,
            };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao processar solicitação.');
            }

            if (editId) {
                // Success redirect for edit
                window.location.href = '/dashboard';
            } else {
                // Success redirect for create
                const params = new URLSearchParams({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                window.location.href = `/dashboard/students/success?${params.toString()}`;
            }

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="text-center py-20 text-slate-mid animate-pulse">Carregando dados do aluno...</div>;
    }

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
                            <label className="field-label">{editId ? 'Nova Senha (deixe vazio para manter)' : 'Senha Inicial *'}</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!editId}
                                className="field-input"
                                placeholder={editId ? "Opcional" : "Mínimo 6 caracteres"}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-divider" />

                <div className="form-section">
                    <h3 className="section-title">Perfil Pedagógico & Contato</h3>
                    <p className="section-desc">Defina o foco, o nível e o contato para notificações.</p>

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
                        <label className="field-label">WhatsApp para Notificações</label>
                        <div className="whatsapp-input-container">
                            <select 
                                className="country-selector"
                                value={country.code}
                                onChange={(e) => {
                                    const c = COUNTRIES.find(c => c.code === e.target.value);
                                    if (c) setCountry(c);
                                }}
                            >
                                {COUNTRIES.map(c => (
                                    <option key={c.code} value={c.code}>{c.name}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={formatDisplayPhone(whatsappInput)}
                                onChange={handleWhatsappChange}
                                className="field-input wpp-field"
                                placeholder={country.mask}
                            />
                        </div>
                        <p className="field-hint">Usado para enviar lembretes de aula e novidades.</p>
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

                <div className="form-divider" />

                {/* === CONTRATO FINANCEIRO === */}
                <div className="form-section">
                    <h3 className="section-title">Contrato Financeiro</h3>
                    <p className="section-desc">Defina como e quanto este aluno paga. Isso alimenta o painel financeiro.</p>

                    <div className="field-group">
                        <label className="field-label">Tipo de Cobrança *</label>
                        <select
                            name="billing_type"
                            value={formData.billing_type}
                            onChange={handleChange}
                            className="field-input"
                        >
                            <option value="mensalidade">🗓️ Mensalidade (Vencimento mensal fixo)</option>
                            <option value="pacote">📦 Pacote de Aulas (Ex: 4, 8 ou 12 aulas)</option>
                            <option value="avulsa">⚡ Aula Avulsa (Sem recorrência)</option>
                        </select>
                    </div>

                    <div className="field-grid">
                        <div className="field-group">
                            <label className="field-label">Valor Acordado</label>
                            <div className="amount-input-row">
                                <select
                                    name="billing_currency"
                                    value={formData.billing_currency}
                                    onChange={handleChange}
                                    className="currency-selector"
                                >
                                    <option value="BRL">R$ (BRL)</option>
                                    <option value="JPY">¥ (JPY)</option>
                                    <option value="USD">$ (USD)</option>
                                    <option value="EUR">€ (EUR)</option>
                                </select>
                                <input
                                    type="number"
                                    name="billing_amount"
                                    value={formData.billing_amount}
                                    onChange={handleChange}
                                    className="field-input amount-field"
                                    placeholder="0,00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        {formData.billing_type === 'mensalidade' && (
                            <div className="field-group">
                                <label className="field-label">Dia do Vencimento</label>
                                <input
                                    type="number"
                                    name="billing_day"
                                    value={formData.billing_day}
                                    onChange={handleChange}
                                    className="field-input"
                                    placeholder="Ex: 5"
                                    min="1"
                                    max="28"
                                />
                                <p className="field-hint">Entre 1 e 28 para evitar problemas em fevereiro.</p>
                            </div>
                        )}

                        {formData.billing_type === 'pacote' && (
                            <div className="field-grid">
                                <div className="field-group">
                                    <label className="field-label">Tamanho do Pacote</label>
                                    <select
                                        name="billing_package_size"
                                        value={formData.billing_package_size}
                                        onChange={handleChange}
                                        className="field-input"
                                    >
                                        <option value="4">4 aulas</option>
                                        <option value="8">8 aulas</option>
                                        <option value="12">12 aulas</option>
                                        <option value="16">16 aulas</option>
                                    </select>
                                </div>
                                <div className="field-group">
                                    <label className="field-label">Data de Início do Ciclo</label>
                                    <input
                                        type="date"
                                        name="billing_package_start_date"
                                        value={formData.billing_package_start_date}
                                        onChange={handleChange}
                                        className="field-input"
                                    />
                                    <p className="field-hint">A contagem de aulas começa a partir desta data.</p>
                                </div>
                            </div>
                        )}
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
                        {loading ? 'Processando...' : (editId ? 'Salvar Alterações' : 'Cadastrar Aluno')}
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
                    width: 100%;
                }
                .field-input:focus {
                    border-color: var(--color-brand);
                    box-shadow: 0 0 0 4px rgba(88, 49, 126, 0.1);
                }
                .field-input.textarea {
                    resize: vertical;
                    min-height: 80px;
                }
                
                .whatsapp-input-container {
                    display: flex;
                    gap: 0.5rem;
                }
                .country-selector {
                    padding: 0.75rem;
                    border-radius: 0.75rem;
                    border: 1px solid var(--color-slate-border);
                    background: var(--color-ice);
                    font-weight: 600;
                    font-size: 0.85rem;
                    outline: none;
                }
                .wpp-field {
                    flex: 1;
                }
                .field-hint {
                    font-size: 0.7rem;
                    color: var(--color-slate-mid);
                    font-weight: 500;
                    margin-top: -0.25rem;
                }

                .amount-input-row {
                    display: flex;
                    gap: 0.5rem;
                }
                .currency-selector {
                    width: 120px;
                    padding: 0.75rem;
                    border-radius: 0.75rem;
                    border: 1px solid var(--color-slate-border);
                    background: var(--color-ice);
                    font-weight: 600;
                    font-size: 0.85rem;
                    outline: none;
                }
                .amount-field {
                    flex: 1;
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
                    .whatsapp-input-container {
                        flex-direction: column;
                    }
                    .country-selector {
                        width: 100%;
                    }
                }
            `}</style>
        </form>
    );
}
