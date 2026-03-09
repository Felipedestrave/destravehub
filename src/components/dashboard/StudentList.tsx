import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import type { Tables } from '../../types/supabase';

type Student = Tables<'students'>;

// ─────────────────────────────────────────────
// Main component: StudentList
// ─────────────────────────────────────────────
export default function StudentList() {
    const [students, setStudents] = useState<Student[]>([]);
    const [teacherId, setTeacherId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

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
                <div className="students-grid">
                    {students.map((student) => (
                        <div key={student.id} className="student-card">
                            <div className="student-avatar">
                                {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="student-info">
                                <p className="student-name">{student.name}</p>
                                <p className="student-meta">
                                    {student.student_id ? '✅ Conta oficial' : '🔗 Link único'}
                                    {student.language && ` • 🗣️ ${student.language}`}
                                </p>
                            </div>
                            <span
                                className="student-level"
                                style={{ borderColor: levelColor[student.level ?? 'Iniciante'] ?? '#64748B', color: levelColor[student.level ?? 'Iniciante'] ?? '#64748B' }}
                            >
                                {student.level ?? 'Iniciante'}
                            </span>
                        </div>
                    ))}
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

                @media (prefers-reduced-motion: reduce) {
                    .students-spinner { animation: none; }
                    .student-card:hover { transform: none; }
                }
            `}</style>
        </>
    );
}
