import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

interface Activity {
    id: string;
    title: string;
    type: 'flashcards' | 'escuta' | 'mrp';
    created_at: string;
    config: Record<string, any>;
}

interface Student {
    id: string;
    name: string;
}

const TYPE_LABELS: Record<string, { icon: string; label: string; color: string }> = {
    flashcards: { icon: '🃏', label: 'Destrave Cards',  color: '#f97316' },
    escuta:     { icon: '🎧', label: 'Destrave a Escuta', color: '#8b5cf6' },
    mrp:        { icon: '🎭', label: 'Destrave MRP',    color: '#0ea5e9' },
};

export default function ActivitiesPanel() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
    const [assigning, setAssigning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [sharingActivity, setSharingActivity] = useState<Activity | null>(null);
    const [shareTab, setShareTab] = useState<'platform' | 'experimental'>('platform');
    const [experimentalLink, setExperimentalLink] = useState<string | null>(null);
    const [generatingLink, setGeneratingLink] = useState(false);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                console.warn('[ActivitiesPanel] No session found.');
                setLoading(false);
                return;
            }
            
            const token = session.access_token;

            // 1. Fetch Activities
            try {
                const actRes = await fetch('/api/activities/list', { 
                    headers: { Authorization: `Bearer ${token}` } 
                });
                const actData = await actRes.json();
                
                if (!actRes.ok) {
                    setError(actData.error || 'Erro ao carregar atividades do servidor.');
                } else {
                    setActivities(actData.activities ?? []);
                }
            } catch (aErr) {
                setError('Falha de conexão com a biblioteca de missões.');
            }

            // 2. Fetch Students
            try {
                const { data: stuData, error: stuErr } = await supabase
                    .from('students')
                    .select('id, name')
                    .eq('teacher_id', session.user.id)
                    .order('name');
                
                if (!stuErr) {
                    setStudents(stuData ?? []);
                }
            } catch (sErr) {}

        } catch (err: any) {
            setError('Um erro fatal impediu o carregamento da central.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const closeModal = () => {
        setSharingActivity(null);
        setSelectedStudents(new Set());
        setExperimentalLink(null);
        setShareTab('platform');
    };

    const generateExperimentalLink = async () => {
        if (!sharingActivity) return;
        setGeneratingLink(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch('/api/activities/share-experimental', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ activityId: sharingActivity.id })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            
            setExperimentalLink(`${window.location.origin}/share/${data.uuid}`);
        } catch (err: any) {
            showToast(err.message || 'Erro ao gerar link experimental', 'error');
        } finally {
            setGeneratingLink(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('Link copiado!');
    };

    const toggleStudent = (id: string) => {
        setSelectedStudents(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleAssign = async () => {
        if (!sharingActivity || selectedStudents.size === 0) return;
        setAssigning(true);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { 
            showToast('Sessão expirada. Faça login novamente.', 'error');
            setAssigning(false); 
            return; 
        }

        try {
            const res = await fetch('/api/activities/assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    activityId: sharingActivity.id,
                    studentIds: Array.from(selectedStudents),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.error || 'Erro ao atribuir atividade.', 'error');
            } else if (data.assigned > 0) {
                showToast(`✅ Enviado para ${data.assigned} aluno(s)!`);
                closeModal();
            } else {
                showToast(data.message || 'Estes alunos já receberam esta missão.', 'error');
                closeModal();
            }
        } catch (err: any) {
            showToast('Erro de conexão ao atribuir.', 'error');
        } finally {
            setAssigning(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Tem certeza que deseja excluir "${title}"? Esta ação é permanente.`)) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        try {
            const res = await fetch(`/api/activities/delete?id=${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${session.access_token}` },
            });

            if (res.ok) {
                setActivities(prev => prev.filter(a => a.id !== id));
                showToast('Atividade excluída com sucesso.');
            } else {
                showToast('Erro ao excluir atividade.', 'error');
            }
        } catch (err) {
            showToast('Erro de rede ao excluir.', 'error');
        }
    };

    const handleDuplicate = async (id: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        try {
            const res = await fetch('/api/activities/duplicate', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}` 
                },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                const data = await res.json();
                setActivities(prev => [data.activity, ...prev]);
                showToast('Atividade duplicada!');
            } else {
                showToast('Erro ao duplicar atividade.', 'error');
            }
        } catch (err) {
            showToast('Erro de rede ao duplicar.', 'error');
        }
    };

    const handleRename = async (id: string, currentTitle: string) => {
        const newTitle = prompt('Novo título para a atividade:', currentTitle);
        if (!newTitle || newTitle === currentTitle) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        try {
            const res = await fetch('/api/activities/update', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}` 
                },
                body: JSON.stringify({ id, title: newTitle }),
            });

            if (res.ok) {
                const data = await res.json();
                setActivities(prev => prev.map(a => a.id === id ? data.activity : a));
                showToast('Título atualizado.');
            } else {
                showToast('Erro ao renomear.', 'error');
            }
        } catch (err) {
            showToast('Erro de rede.', 'error');
        }
    };

    const getSubtitle = (a: Activity) => {
        const cfg = a.config;
        if (!cfg) return '0 itens';
        if (a.type === 'flashcards') {
            const count = cfg.cards?.length || cfg.cardCount || 0;
            return `${count} card${count !== 1 ? 's' : ''} • Nível ${cfg.level ?? '—'}`;
        }
        if (a.type === 'escuta') {
            const count = cfg.questions?.length || 0;
            return `${count} questão${count !== 1 ? 'ões' : 'ão'}`;
        }
        if (a.type === 'mrp') {
            const count = cfg.questions?.length || 0;
            return `${count} questão${count !== 1 ? 'ões' : 'ão'} • Nível ${cfg.level ?? '—'}`;
        }
        return '';
    };

    if (loading) {
        return (
            <div className="ap-loading">
                <div className="ap-spinner" />
                <p>Carregando atividades...</p>
            </div>
        );
    }

    return (
        <>
            <div className="ap-header">
                <div>
                    <h2 className="ap-title">Central de Atividades</h2>
                    <p className="ap-subtitle">Todas as missões que você gerou. Atribua aos alunos conforme necessário.</p>
                </div>
                <span className="ap-count-badge">{activities.length} atividade{activities.length !== 1 ? 's' : ''}</span>
            </div>

            {error ? (
                <div className="ap-error-state">
                    <span>⚠️</span>
                    <p>{error}</p>
                    <button onClick={fetchData} className="ap-btn-retry">Tentar novamente</button>
                </div>
            ) : activities.length === 0 ? (
                <div className="ap-empty">
                    <span>📭</span>
                    <p>Nenhuma atividade salva ainda.</p>
                    <p className="ap-empty-sub">Gere um deck de flashcards, uma missão de escuta ou um MRP e clique em "Salvar".</p>
                </div>
            ) : (
                <div className="ap-grid">
                    {activities.map((a) => {
                        const meta = TYPE_LABELS[a.type] ?? { icon: '📄', label: a.type, color: '#64748b' };
                        return (
                            <div className="ap-card" key={a.id}>
                                <div className="ap-card-top">
                                    <span className="ap-type-pill" style={{ background: `${meta.color}18`, color: meta.color }}>
                                        {meta.icon} {meta.label}
                                    </span>
                                    
                                    <div className="ap-menu-container">
                                        <button 
                                            className={`ap-action-btn dots ${activeMenuId === a.id ? 'active' : ''}`} 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenuId(activeMenuId === a.id ? null : a.id);
                                            }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                                        </button>
                                        
                                        {activeMenuId === a.id && (
                                            <>
                                                <div className="ap-menu-backdrop" onClick={() => setActiveMenuId(null)} />
                                                <div className="ap-dropdown-menu">
                                                    <button onClick={() => window.location.href=`/dashboard/missions/${a.type}?edit=${a.id}`}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                        Editar Conteúdo
                                                    </button>
                                                    <button onClick={() => { handleDuplicate(a.id); setActiveMenuId(null); }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                        Duplicar
                                                    </button>
                                                    <button onClick={() => { handleRename(a.id, a.title); setActiveMenuId(null); }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                                        Renomear
                                                    </button>
                                                    <div className="ap-menu-divider" />
                                                    <button className="delete" onClick={() => { handleDelete(a.id, a.title); setActiveMenuId(null); }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                                        Excluir Definitivamente
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                <h3 className="ap-card-title">{a.title || 'Sem título'}</h3>
                                <p className="ap-card-sub">{getSubtitle(a)}</p>
                                
                                <div className="ap-card-footer">
                                    <button 
                                        className="ap-btn-preview" 
                                        title="Rodar no próprio navegador"
                                        onClick={() => window.location.href=`/play/${a.type}/${a.id}?test=true`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 3l14 9-14 9V3z"/></svg>
                                        Testar agora
                                    </button>
                                    <button 
                                        className="ap-btn-share-main" 
                                        onClick={() => setSharingActivity(a)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                                        Compartilhar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}


            {/* SHARE MODAL */}
            {sharingActivity && (
                <div className="ap-modal-overlay" onClick={closeModal}>
                    <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
                        <header className="ap-modal-header">
                            <div>
                                <p className="ap-modal-pretitle">Compartilhar Missão</p>
                                <h3 className="ap-modal-title">{sharingActivity?.title}</h3>
                            </div>
                            <button className="ap-modal-close" onClick={closeModal}>✕</button>
                        </header>

                        <div className="ap-tabs">
                            <button 
                                className={`ap-tab-btn ${shareTab === 'platform' ? 'active' : ''}`}
                                onClick={() => setShareTab('platform')}
                            >
                                Na plataforma
                            </button>
                            <button 
                                className={`ap-tab-btn ${shareTab === 'experimental' ? 'active' : ''}`}
                                onClick={() => setShareTab('experimental')}
                            >
                                Link Experimental
                            </button>
                        </div>

                        <div className="ap-tab-content">
                            {shareTab === 'platform' && (
                                <div className="animation-fade-in">
                                    <p className="ap-modal-instruction">Selecione os alunos que receberão esta atividade no portal:</p>
                                    
                                    {students.length === 0 ? (
                                        <p className="ap-no-students">Nenhum aluno cadastrado ainda.</p>
                                    ) : (
                                        <ul className="ap-student-list">
                                            {students.map((s) => (
                                                <li
                                                    key={s.id}
                                                    className={`ap-student-item ${selectedStudents.has(s.id) ? 'selected' : ''}`}
                                                    onClick={() => toggleStudent(s.id)}
                                                >
                                                    <div className="ap-student-avatar">{(s.name || 'U').charAt(0).toUpperCase()}</div>
                                                    <span className="ap-student-name">{s.name || 'Usuário'}</span>
                                                    <div className={`ap-checkbox ${selectedStudents.has(s.id) ? 'checked' : ''}`}>
                                                        {selectedStudents.has(s.id) && (
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <footer className="ap-modal-footer">
                                        <button className="ap-btn-cancel" onClick={closeModal}>Cancelar</button>
                                        <button
                                            className="ap-btn-confirm"
                                            disabled={selectedStudents.size === 0 || assigning}
                                            onClick={handleAssign}
                                        >
                                            {assigning ? <span className="ap-spinner sm" /> : null}
                                            {assigning ? 'Atribuindo...' : `Atribuir (${selectedStudents.size})`}
                                        </button>
                                    </footer>
                                </div>
                            )}

                            {shareTab === 'experimental' && (
                                <div className="animation-fade-in">
                                    <p className="ap-modal-instruction">Gere um link público para um aluno experimental. O link será de uso único.</p>
                                    
                                    {!experimentalLink ? (
                                        <button 
                                            className="ap-btn-confirm w-full mb-4"
                                            onClick={generateExperimentalLink}
                                            disabled={generatingLink}
                                        >
                                            {generatingLink ? <span className="ap-spinner sm mr-2" /> : '🔗 '}
                                            {generatingLink ? 'Gerando...' : 'Gerar Link de Uso Único'}
                                        </button>
                                    ) : (
                                        <div className="ap-link-box">
                                            <input className="ap-link-input" readOnly value={experimentalLink} />
                                            <button className="ap-link-copy" onClick={() => copyToClipboard(experimentalLink)}>Copiar</button>
                                        </div>
                                    )}

                                    <p className="ap-link-hint">⚠️ Atenção: Assim que o aluno concluir o exercício, o link expirará automaticamente.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {/* TOAST */}
            {toast && (
                <div className={`ap-toast ${toast.type}`}>{toast.msg}</div>
            )}

            <style>{`
                .ap-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 5rem; color: var(--color-slate-mid); }
                .ap-spinner { width: 38px; height: 38px; border: 3px solid var(--color-slate-border); border-top-color: var(--color-brand); border-radius: 50%; animation: ap-spin 0.7s linear infinite; }
                .ap-spinner.sm { width: 16px; height: 16px; border-width: 2px; }
                @keyframes ap-spin { to { transform: rotate(360deg); } }

                .ap-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap; }
                .ap-title { font-family: var(--font-outfit); font-size: 1.875rem; font-weight: 800; color: var(--color-slate-dark); margin: 0 0 0.25rem; }
                .ap-subtitle { font-size: 1rem; color: var(--color-slate-mid); margin: 0; }
                .ap-count-badge { padding: 0.4rem 1rem; background: var(--color-ice); color: var(--color-brand); border-radius: 999px; font-family: var(--font-outfit); font-weight: 800; font-size: 0.85rem; white-space: nowrap; align-self: center; }

                .ap-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 5rem 2rem; text-align: center; }
                .ap-empty span { font-size: 3.5rem; }
                .ap-empty p { font-family: var(--font-outfit); font-size: 1.1rem; font-weight: 700; color: var(--color-slate-dark); margin: 0; }
                .ap-empty-sub { font-size: 0.9rem; color: var(--color-slate-mid); max-width: 380px; line-height: 1.6; }

                .ap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }

                .ap-card { background: white; border: 1.5px solid var(--color-slate-border); border-radius: 1.5rem; padding: 1.75rem; display: flex; flex-direction: column; gap: 0.5rem; transition: transform 200ms, box-shadow 200ms; position: relative; }
                .ap-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(30,41,59,0.08); border-color: #cbd5e1; }

                .ap-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
                .ap-type-pill { padding: 0.35rem 0.8rem; border-radius: 999px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.02em; }
                
                .ap-menu-container { position: relative; }
                .ap-action-btn.dots { width: 32px; height: 32px; border-radius: 10px; background: var(--color-ice); border: none; color: var(--color-slate-mid); cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
                .ap-action-btn.dots:hover, .ap-action-btn.dots.active { background: var(--color-brand); color: white; }
                
                .ap-menu-backdrop { position: fixed; inset: 0; z-index: 50; }
                .ap-dropdown-menu { position: absolute; top: calc(100% + 8px); right: 0; width: 220px; background: white; border: 1.5px solid var(--color-slate-border); border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 60; padding: 0.5rem; overflow: hidden; animation: menuShow 0.2s ease-out; }
                @keyframes menuShow { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                
                .ap-dropdown-menu button { width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border: none; background: none; border-radius: 0.6rem; font-family: var(--font-outfit); font-weight: 600; font-size: 0.875rem; color: var(--color-slate-dark); cursor: pointer; text-align: left; transition: 0.15s; }
                .ap-dropdown-menu button:hover { background: var(--color-ice); color: var(--color-brand); }
                .ap-dropdown-menu button.delete { color: #dc2626; }
                .ap-dropdown-menu button.delete:hover { background: #fee2e2; }
                .ap-menu-divider { height: 1.5px; background: var(--color-slate-border); margin: 0.4rem; }

                .ap-card-title { font-family: var(--font-outfit); font-size: 1.25rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; line-height: 1.2; }
                .ap-card-sub { font-size: 0.85rem; color: var(--color-slate-mid); margin-bottom: 1rem; }

                .ap-card-footer { margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
                .ap-btn-preview { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; background: var(--color-ice); border: 1.5px solid var(--color-slate-border); border-radius: 0.875rem; color: var(--color-slate-dark); font-family: var(--font-outfit); font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: 0.2s; }
                .ap-btn-preview:hover { background: white; border-color: var(--color-brand); color: var(--color-brand); }
                .ap-btn-share-main { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; background: var(--color-brand); border: none; border-radius: 0.875rem; color: white; font-family: var(--font-outfit); font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: 0.2s; }
                .ap-btn-share-main:hover { filter: brightness(1.1); transform: scale(1.02); }

                /* MODAL */
                .ap-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; animation: ap-fadein 0.2s ease; }
                @keyframes ap-fadein { from { opacity: 0; } to { opacity: 1; } }
                .ap-modal { background: white; border-radius: 1.75rem; width: 100%; max-width: 480px; box-shadow: 0 25px 60px rgba(15,23,42,0.25); overflow: hidden; animation: ap-slidein 0.25s ease; }
                @keyframes ap-slidein { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

                .ap-modal-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 1.75rem 1.75rem 1rem; }
                .ap-modal-pretitle { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-brand); margin-bottom: 0.25rem; }
                .ap-modal-title { font-family: var(--font-outfit); font-size: 1.5rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; line-height: 1.1; }
                .ap-modal-close { background: var(--color-ice); border: none; border-radius: 0.75rem; width: 36px; height: 36px; cursor: pointer; font-size: 0.9rem; color: var(--color-slate-mid); display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .ap-modal-close:hover { background: #e2e8f0; color: var(--color-slate-dark); }

                .ap-tabs { display: flex; margin: 0 1.75rem; padding: 0.4rem; background: var(--color-ice); border-radius: 1rem; gap: 0.4rem; }
                .ap-tab-btn { flex: 1; padding: 0.6rem; border: none; background: transparent; border-radius: 0.75rem; font-family: var(--font-outfit); font-weight: 700; font-size: 0.85rem; color: var(--color-slate-mid); cursor: pointer; transition: 0.2s; }
                .ap-tab-btn.active { background: white; color: var(--color-brand); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

                .ap-tab-content { padding: 1.5rem 1.75rem; }
                .ap-modal-instruction { font-size: 0.95rem; color: var(--color-slate-mid); margin-bottom: 1rem; line-height: 1.5; }

                .ap-student-list { list-style: none; margin: 0; padding: 0; max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; padding-right: 0.5rem; }
                .ap-student-item { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; border-radius: 1rem; border: 1.5px solid var(--color-slate-border); cursor: pointer; transition: 0.15s; }
                .ap-student-item:hover { border-color: var(--color-brand); background: rgba(88,49,126,0.02); }
                .ap-student-item.selected { border-color: var(--color-brand); background: rgba(88,49,126,0.05); }
                .ap-student-avatar { width: 38px; height: 38px; border-radius: 12px; background: var(--color-brand); color: white; font-family: var(--font-outfit); font-weight: 800; display: flex; align-items: center; justify-content: center; }
                .ap-student-name { font-weight: 700; color: var(--color-slate-dark); font-size: 0.95rem; flex: 1; }
                .ap-checkbox { width: 22px; height: 22px; border-radius: 6px; border: 2px solid var(--color-slate-border); display: flex; align-items: center; justify-content: center; }
                .ap-checkbox.checked { background: var(--color-brand); border-color: var(--color-brand); }

                .ap-link-box { background: white; border: 2px solid var(--color-slate-border); border-radius: 1rem; padding: 0.5rem; display: flex; gap: 0.5rem; margin: 1.5rem 0; }
                .ap-link-input { border: none; background: transparent; padding: 0.5rem; flex: 1; font-family: var(--font-inter); font-size: 0.85rem; color: var(--color-slate-dark); outline: none; min-width: 0; }
                .ap-link-copy { padding: 0.6rem 1.25rem; background: var(--color-action); color: white; border: none; border-radius: 0.6rem; font-family: var(--font-outfit); font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: 0.2s; }
                .ap-link-copy:hover { filter: brightness(1.1); transform: scale(1.05); }
                .ap-link-hint { font-size: 0.8rem; color: var(--color-slate-mid); font-style: italic; line-height: 1.4; }

                .ap-modal-footer { display: flex; gap: 1rem; padding-top: 1.5rem; border-top: 1.5px solid var(--color-slate-border); margin-top: 1rem; }
                .ap-btn-cancel { flex: 1; padding: 0.875rem; background: var(--color-ice); color: var(--color-slate-mid); border: none; border-radius: 1rem; font-family: var(--font-outfit); font-weight: 700; cursor: pointer; }
                .ap-btn-confirm { flex: 1.5; padding: 0.875rem; background: var(--color-brand); color: white; border: none; border-radius: 1rem; font-family: var(--font-outfit); font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .ap-btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

                .ap-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); padding: 1rem 2rem; border-radius: 999px; background: #0f172a; color: white; font-family: var(--font-outfit); font-weight: 800; font-size: 0.9rem; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 10000; animation: toastUp 0.3s ease-out; }
                @keyframes toastUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }

                .ap-error-state { padding: 4rem 2rem; text-align: center; background: #fff1f2; border: 1.5px dashed #fecaca; border-radius: 2rem; }
                .ap-btn-retry { margin-top: 1.5rem; padding: 0.75rem 2rem; background: #e11d48; color: white; border: none; border-radius: 1rem; font-weight: 800; cursor: pointer; }

                @media (max-width: 640px) {
                    .ap-grid { grid-template-columns: 1fr; }
                    .ap-modal { border-radius: 1.75rem 1.75rem 0 0; align-self: flex-end; }
                    .ap-modal-overlay { align-items: flex-end; }
                }
            `}</style>
        </>
    );
}
