import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import type { Tables } from '../../types/supabase';
import { MoreVertical, Edit2, Trash2, Link as LinkIcon, X, CheckCircle2, TrendingUp } from 'lucide-react';

type Student = Tables<'students'>;

// ─────────────────────────────────────────────
// Main component: StudentList
// ─────────────────────────────────────────────
export default function StudentList() {
    const [students, setStudents] = useState<Student[]>([]);
    const [teacherId, setTeacherId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Dropdown state
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Modal state
    const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

    // Form states (Edit)
    const [editName, setEditName] = useState('');
    const [editLanguage, setEditLanguage] = useState('');
    const [editLevel, setEditLevel] = useState('');

    // Handle clicking outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchStudents = useCallback(async (tid: string) => {
        const { data } = await supabase
            .from('students')
            .select('*')
            .eq('teacher_id', tid)
            .order('created_at', { ascending: false });
        setStudents(data ?? []);
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) { window.location.href = '/auth/login'; return; }
            setTeacherId(session.user.id);
            fetchStudents(session.user.id).finally(() => setLoading(false));
        });
    }, [fetchStudents]);

    const handleStudentAdded = (student: Student) => {
        setStudents((prev) => [student, ...prev]);
    };

    const openEditModal = (student: Student) => {
        setStudentToEdit(student);
        setEditName(student.name);
        setEditLanguage(student.language ?? 'Japonês');
        setEditLevel(student.level ?? 'Iniciante');
        setActiveDropdown(null);
    };

    const handleUpdateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentToEdit) return;

        const { data, error } = await supabase
            .from('students')
            .update({ name: editName, language: editLanguage, level: editLevel })
            .eq('id', studentToEdit.id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar aluno:', error);
            alert('Não foi possível atualizar o aluno.');
            return;
        }

        setStudents(prev => prev.map(s => s.id === data.id ? data : s));
        setStudentToEdit(null);
    };

    const openDeleteModal = (student: Student) => {
        setStudentToDelete(student);
        setActiveDropdown(null);
    };

    const handleDeleteStudent = async () => {
        if (!studentToDelete) return;

        // Na prática, deleta os assignments vinculados primeiro ou o cascade faz isso
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', studentToDelete.id);

        if (error) {
            console.error('Erro ao excluir aluno:', error);
            alert('Não foi possível excluir. O aluno pode estar vinculado a atividades.');
            return;
        }

        setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
        setStudentToDelete(null);
    };

    const copyLink = (uuid: string | null) => {
        if (!uuid) return;
        const url = `${window.location.origin}/play/experimental/${uuid}`;
        navigator.clipboard.writeText(url);
        alert('Link copiado para a área de transferência!');
        setActiveDropdown(null);
    };

    const levelColor: Record<string, string> = {
        // Old JLPT
        N5: '#64748B', N4: '#22C55E', N3: '#3B82F6', N2: '#F59E0B', N1: '#EF4444',
        // Generic (New)
        'Iniciante': '#64748B',
        'Básico': '#22C55E',
        'Intermediário': '#3B82F6',
        'Avançado': '#EF4444'
    };

    if (loading) {
        return (
            <div className="students-loading">
                <div className="students-spinner" />
                <p>Carregando alunos…</p>
            </div>
        );
    }

    return (
        <>
            {/* Header row */}
            <div className="students-header">
                <div>
                    <h1 className="students-title">Seus Alunos</h1>
                    <p className="students-subtitle">
                        {students.length === 0
                            ? 'Nenhum aluno cadastrado ainda.'
                            : `${students.length} aluno${students.length > 1 ? 's' : ''} cadastrado${students.length > 1 ? 's' : ''}.`}
                    </p>
                </div>
                <a
                    href="/dashboard/students/new"
                    id="add-student-btn"
                    className="btn-action"
                    style={{ textDecoration: 'none' }}
                >
                    + Novo Aluno
                </a>
            </div>

            {/* Stats row */}
            <div className="stats-row">
                <div className="stat-card">
                    <p className="stat-label">Total de Alunos</p>
                    <p className="stat-value" style={{ color: 'var(--color-brand)' }}>{students.length}</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Contas Ativas</p>
                    <p className="stat-value" style={{ color: 'var(--color-brand)' }}>
                        {students.filter((s) => s.student_id).length}
                    </p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Experimentais</p>
                    <p className="stat-value" style={{ color: 'var(--color-slate-mid)' }}>
                        {students.filter((s) => s.experimental_uuid).length}
                    </p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Foco Atual</p>
                    <p className="stat-value" style={{ color: '#22C55E', fontSize: '1.25rem', display: 'flex', alignItems: 'center' }}>
                        {students.length > 0 ? students[0]?.language ?? 'Japonês' : '—'}
                    </p>
                </div>
            </div>

            {/* List or empty state */}
            {students.length === 0 ? (
                <div className="students-empty">
                    <div className="empty-icon">👥</div>
                    <h3 className="empty-title">Nenhum aluno cadastrado</h3>
                    <p className="empty-desc">
                        Registre seus primeiros alunos para começar a enviar missões interativas.
                    </p>
                    <a href="/dashboard/students/new" className="btn-action" style={{ textDecoration: 'none' }}>
                        Registrar Primeiro Aluno
                    </a>
                </div>
            ) : (
                <div className="students-grid" ref={dropdownRef}>
                    {students.map((student) => (
                        <div key={student.id} className="student-card">
                            <div className="student-avatar">
                                {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="student-info">
                                <p className="student-name">{student.name}</p>
                                <p className="student-meta flex items-center gap-1">
                                    {student.student_id ? '✅ Conta oficial' : '🔗 Link único'}
                                    {student.language && ` • 🗣️ ${student.language}`}
                                </p>
                            </div>
                            <span
                                className="student-level hidden sm:inline-flex"
                                style={{ borderColor: levelColor[student.level ?? 'Iniciante'] ?? '#64748B', color: levelColor[student.level ?? 'Iniciante'] ?? '#64748B' }}
                            >
                                {student.level ?? 'Iniciante'}
                            </span>
                            
                            {/* Kebab Menu */}
                            <div className="action-menu-container">
                                <button 
                                    className="kebab-btn"
                                    onClick={() => setActiveDropdown(activeDropdown === student.id ? null : student.id)}
                                >
                                    <MoreVertical size={20} className="text-slate-400 hover:text-brand" />
                                </button>
                                
                                {activeDropdown === student.id && (
                                    <div className="dropdown-panel animation-fade-in shadow-xl">
                                        <a href={`/dashboard/students/${student.id}`} className="dropdown-item">
                                            <TrendingUp size={16} /> Ver Perfil
                                        </a>
                                        <a href={`/dashboard/students/new?edit=${student.id}`} className="dropdown-item">
                                            <Edit2 size={16} /> Editar Aluno
                                        </a>
                                        {!student.student_id && student.experimental_uuid && (
                                            <button onClick={() => copyLink(student.experimental_uuid)} className="dropdown-item">
                                                <LinkIcon size={16} /> Copiar Link
                                            </button>
                                        )}
                                        <div className="dropdown-divider" />
                                        <button onClick={() => openDeleteModal(student)} className="dropdown-item danger">
                                            <Trash2 size={16} /> Excluir
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAIS DE CRUD */}
            {studentToEdit && (
                <div className="modal-overlay">
                    <div className="modal-content animation-bounce-in max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-outfit text-2xl font-black text-slate-dark">Editar Aluno</h2>
                            <button onClick={() => setStudentToEdit(null)} className="text-slate-400 hover:text-slate-dark">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateStudent} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-mid uppercase mb-2">Nome do Aluno</label>
                                <input 
                                    type="text" 
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full border-2 border-slate-200 rounded-xl p-3 font-outfit font-bold outline-none focus:border-brand"
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-mid uppercase mb-2">Foco/Idioma</label>
                                    <select 
                                        value={editLanguage}
                                        onChange={(e) => setEditLanguage(e.target.value)}
                                        className="w-full border-2 border-slate-200 rounded-xl p-3 font-outfit font-bold outline-none focus:border-brand"
                                    >
                                        <option value="Japonês">Japonês</option>
                                        <option value="Inglês">Inglês</option>
                                        <option value="Espanhol">Espanhol</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-mid uppercase mb-2">Nível</label>
                                    <select 
                                        value={editLevel}
                                        onChange={(e) => setEditLevel(e.target.value)}
                                        className="w-full border-2 border-slate-200 rounded-xl p-3 font-outfit font-bold outline-none focus:border-brand"
                                    >
                                        <option value="Iniciante">Iniciante</option>
                                        <option value="Básico">Básico</option>
                                        <option value="Intermediário">Intermediário</option>
                                        <option value="Avançado">Avançado</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="mt-4 w-full bg-brand text-white font-outfit font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:opacity-90 transition-all">
                                <CheckCircle2 size={20} /> Salvar Alterações
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {studentToDelete && (
                <div className="modal-overlay">
                    <div className="modal-content animation-bounce-in max-w-sm w-full text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} className="text-red-500" />
                        </div>
                        <h2 className="font-outfit text-2xl font-black text-slate-dark mb-2">Excluir Aluno?</h2>
                        <p className="text-slate-mid text-sm mb-6">
                            Você tem certeza que deseja excluir <b>{studentToDelete.name}</b>? O histórico de missões deste aluno não poderá ser recuperado.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setStudentToDelete(null)}
                                className="flex-1 border-2 border-slate-200 text-slate-dark font-outfit font-bold py-3 rounded-xl hover:bg-slate-50 transition-all"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleDeleteStudent}
                                className="flex-1 bg-red-500 text-white font-outfit font-bold py-3 rounded-xl hover:bg-red-600 transition-all"
                            >
                                Sim, Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .students-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    min-height: 300px;
                    color: var(--color-slate-mid);
                }
                .students-spinner {
                    width: 40px; height: 40px;
                    border: 3px solid var(--color-slate-border);
                    border-top-color: var(--color-brand);
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .students-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .students-title {
                    font-family: var(--font-outfit);
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--color-slate-dark);
                    margin: 0 0 0.25rem;
                }
                .students-subtitle {
                    font-size: 0.875rem;
                    color: var(--color-slate-mid);
                    margin: 0;
                }

                /* Stats */
                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .stat-card {
                    background: white;
                    border: 1px solid var(--color-slate-border);
                    border-radius: 1rem;
                    padding: 1.25rem 1.5rem;
                    box-shadow: var(--shadow-card);
                }
                .stat-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--color-slate-mid);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin: 0 0 0.5rem;
                }
                .stat-value {
                    font-family: var(--font-outfit);
                    font-size: 2rem;
                    font-weight: 800;
                    margin: 0;
                    line-height: 1;
                }

                /* Student grid */
                .students-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .student-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: white;
                    border: 1px solid var(--color-slate-border);
                    border-radius: 1rem;
                    padding: 1rem 1.25rem;
                    box-shadow: var(--shadow-card);
                    transition: box-shadow 150ms ease, transform 150ms ease;
                }
                .student-card:hover {
                    box-shadow: var(--shadow-hover);
                    transform: translateY(-2px);
                }
                .student-avatar {
                    width: 44px; height: 44px;
                    border-radius: 12px;
                    background-color: var(--color-brand);
                    color: white;
                    font-family: var(--font-outfit);
                    font-weight: 800;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .student-info {
                    flex: 1;
                    min-width: 0;
                }
                .student-name {
                    font-family: var(--font-outfit);
                    font-weight: 700;
                    font-size: 0.95rem;
                    color: var(--color-slate-dark);
                    margin: 0 0 0.2rem;
                }
                .student-meta {
                    font-size: 0.78rem;
                    color: var(--color-slate-mid);
                    margin: 0;
                }
                .student-level {
                    font-family: var(--font-outfit);
                    font-weight: 800;
                    font-size: 0.8rem;
                    padding: 0.3rem 0.75rem;
                    border: 2px solid;
                    border-radius: 8px;
                    flex-shrink: 0;
                }

                /* Empty state */
                .students-empty {
                    background: white;
                    border: 2px dashed var(--color-slate-border);
                    border-radius: 1.5rem;
                    padding: 4rem 2rem;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }
                .empty-icon { font-size: 3rem; }
                .empty-title {
                    font-family: var(--font-outfit);
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: var(--color-slate-dark);
                    margin: 0;
                }
                .empty-desc {
                    color: var(--color-slate-mid);
                    font-size: 0.9rem;
                    max-width: 360px;
                    margin: 0;
                }
                
                /* Kebab Menu & Dropdown */
                .action-menu-container {
                    position: relative;
                    margin-left: 0.5rem;
                }
                .kebab-btn {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .kebab-btn:hover {
                    background: rgba(88, 49, 126, 0.05);
                }
                .dropdown-panel {
                    position: absolute;
                    right: 0;
                    top: calc(100% + 5px);
                    background: white;
                    border: 1px solid var(--color-slate-border);
                    border-radius: 1rem;
                    padding: 0.5rem;
                    min-width: 180px;
                    z-index: 50;
                    transform-origin: top right;
                }
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: none;
                    background: transparent;
                    font-family: var(--font-inter);
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: var(--color-slate-dark);
                    cursor: pointer;
                    border-radius: 0.5rem;
                    text-align: left;
                    transition: all 0.15s;
                }
                .dropdown-item:hover {
                    background: rgba(88, 49, 126, 0.05);
                    color: var(--color-brand);
                }
                .dropdown-item.danger {
                    color: #ef4444;
                }
                .dropdown-item.danger:hover {
                    background: #fef2f2;
                }
                .dropdown-divider {
                    height: 1px;
                    background: var(--color-slate-border);
                    margin: 0.25rem 0;
                }

                /* Modais */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(4px);
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                .modal-content {
                    background: white;
                    border-radius: 2rem;
                    padding: 2.5rem;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                }
                
                .animation-fade-in { animation: fade-in 0.2s ease forwards; }
                @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                
                .animation-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                @keyframes bounce-in { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

                @media (prefers-reduced-motion: reduce) {
                    .students-spinner { animation: none; }
                    .student-card:hover { transform: none; }
                }
            `}</style>
        </>
    );
}
