import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { MaterialLinkModal } from '../materials/MaterialLinkModal';

interface Activity {
    id: string;
    title: string;
    type: 'flashcards' | 'escuta' | 'mrp' | 'draw' | 'lego';
    created_at: string;
    config: Record<string, any>;
    folder_id: string | null;
    material_count?: { count: number }[];
}

interface Folder {
    id: string;
    name: string;
    parent_id: string | null;
    created_at: string;
}

interface Student {
    id: string;
    name: string;
}

const TYPE_LABELS: Record<string, { icon: string; label: string; color: string }> = {
    flashcards: { icon: '🃏', label: 'Destrave Cards',  color: '#f97316' },
    escuta:     { icon: '🎧', label: 'Destrave a Escuta', color: '#8b5cf6' },
    mrp:        { icon: '🎭', label: 'Destrave MRP',    color: '#0ea5e9' },
    draw:       { icon: '🎨', label: 'Destrave Draw',   color: '#58317e' },
    lego:       { icon: '🧱', label: 'Destrave Lego',   color: '#10b981' },
};

export default function ActivitiesPanel() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // UI State
    const [assigning, setAssigning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [sharingActivity, setSharingActivity] = useState<Activity | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
    const [shareTab, setShareTab] = useState<'platform' | 'experimental' | 'public'>('platform');
    const [experimentalLink, setExperimentalLink] = useState<string | null>(null);
    const [generatingLink, setGeneratingLink] = useState(false);
    const [linkingActivity, setLinkingActivity] = useState<Activity | null>(null);
    
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [movingActivity, setMovingActivity] = useState<Activity | null>(null);

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
                    setActivities((actData.activities ?? []).sort((a: Activity, b: Activity) => a.title.localeCompare(b.title, 'pt-BR', { numeric: true })));
                    if (actData.students) setStudents(actData.students);
                }
            } catch (aErr) {
                setError('Falha de conexão com a biblioteca de missões.');
            }

            // 2. Fetch Folders
            try {
                const foldRes = await fetch('/api/activities/folders/list', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const foldData = await foldRes.json();
                if (foldRes.ok) {
                    setFolders(foldData.folders ?? []);
                }
            } catch (fErr) {}

        } catch (err: any) {
            setError('Um erro fatal impediu o carregamento da central.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Folder Actions
    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        try {
            const res = await fetch('/api/activities/folders/create', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ name: newFolderName, parent_id: currentFolderId })
            });

            if (res.ok) {
                const data = await res.json();
                setFolders(prev => [...prev, data.folder]);
                setNewFolderName('');
                setIsCreatingFolder(false);
                showToast('Pasta criada!');
            } else {
                showToast('Erro ao criar pasta.', 'error');
            }
        } catch (err) {
            showToast('Erro de conexão.', 'error');
        }
    };

    const handleDeleteFolder = async (id: string, name: string) => {
        if (!confirm(`Excluir a pasta "${name}"? Todas as subpastas e atividades dentro dela ficarão "órfãs" (sem pasta).`)) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        try {
            const res = await fetch(`/api/activities/folders/delete?id=${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${session.access_token}` }
            });

            if (res.ok) {
                setFolders(prev => prev.filter(f => f.id !== id));
                // Update activities that were in this folder
                setActivities(prev => prev.map(a => a.folder_id === id ? { ...a, folder_id: null } : a));
                showToast('Pasta excluída.');
            } else {
                showToast('Erro ao excluir pasta.', 'error');
            }
        } catch (err) {
            showToast('Erro de conexão.', 'error');
        }
    };

    const handleMoveToFolder = async (activityId: string, folderId: string | null) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        try {
            const res = await fetch('/api/activities/move', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ activityId, folderId })
            });

            if (res.ok) {
                setActivities(prev => prev.map(a => a.id === activityId ? { ...a, folder_id: folderId } : a));
                showToast('Atividade movida!');
            }
        } catch (err) {}
    };

    // Breadcrumbs Logic
    const getBreadcrumbs = () => {
        const crumbs: { id: string | null; name: string }[] = [{ id: null, name: 'Início' }];
        if (!currentFolderId) return crumbs;

        const path: { id: string; name: string }[] = [];
        let curr: Folder | undefined = folders.find(f => f.id === currentFolderId);
        
        while (curr) {
            path.unshift({ id: curr.id, name: curr.name });
            const pId = curr.parent_id;
            curr = folders.find(f => f.id === pId);
        }

        return [...crumbs, ...path];
    };

    // Drag and Drop Logic
    const onDragStart = (e: React.DragEvent, activityId: string) => {
        e.dataTransfer.setData('activityId', activityId);
    };

    const onDrop = (e: React.DragEvent, targetFolderId: string | null) => {
        e.preventDefault();
        const activityId = e.dataTransfer.getData('activityId');
        if (activityId) {
            handleMoveToFolder(activityId, targetFolderId);
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

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
        
        let baseSub = '';
        if (a.type === 'flashcards') {
            const count = cfg.cards?.length || cfg.cardCount || 0;
            baseSub = `${count} card${count !== 1 ? 's' : ''} • Nível ${cfg.level ?? '—'}`;
        } else if (a.type === 'escuta') {
            const count = cfg.questions?.length || 0;
            baseSub = `${count} ${count !== 1 ? 'questões' : 'questão'}`;
        } else if (a.type === 'mrp') {
            const count = cfg.questions?.length || 0;
            baseSub = `${count} ${count !== 1 ? 'questões' : 'questão'} • Nível ${cfg.level ?? '—'}`;
        } else if (a.type === 'draw') {
            const count = cfg.items?.length || 0;
            baseSub = `${count} slide${count !== 1 ? 's' : ''}`;
        } else if (a.type === 'lego') {
            const count = cfg.quantity || cfg.sentences?.length || 0;
            baseSub = `${count} frase${count !== 1 ? 's' : ''}`;
        }
        
        const matCount = a.material_count?.[0]?.count || 0;
        const matSuffix = matCount > 0 ? ` • 📎 ${matCount}` : '';
        
        return `${baseSub}${matSuffix}`;
    };

    const filteredFolders = searchQuery 
        ? folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : folders.filter(f => f.parent_id === currentFolderId);

    const filteredActivities = searchQuery
        ? activities.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : activities.filter(a => a.folder_id === currentFolderId);

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
            {/* TOOLS HUB */}
            <div className="ap-tools-hub">
                <h3 className="ap-tools-title">🚀 Ferramentas de Criação</h3>
                <p className="ap-tools-subtitle">Crie novas missões diretamente pelas ferramentas abaixo.</p>
                <div className="ap-tools-grid">
                    {[
                        { label: 'Destrave Draw', desc: 'Aulas com slides interativos', emoji: '🎨', color: '#58317e', href: '/draw' },
                        { label: 'Destrave a Escuta', desc: 'Exercícios de compreensão auditiva', emoji: '🎧', color: '#8b5cf6', href: '/dashboard/missions/escuta' },
                        { label: 'Destrave MRP', desc: 'Múltipla escolha e produção textual', emoji: '🎭', color: '#0ea5e9', href: '/dashboard/missions/mrp' },
                        { label: 'Destrave Lego', desc: 'Sintaxe e estrutura', emoji: '🧱', color: '#10b981', href: '/dashboard/missions/lego' },
                        { label: 'Destrave Cards', desc: 'Flashcards de vocabulário e kanji', emoji: '🃏', color: '#f97316', href: '/dashboard/missions/flashcards' },
                        { label: 'Destrave 1.0', desc: 'Lições estruturadas com texto', emoji: '📖', color: '#10b981', href: '/dashboard/missions/destrave1' },
                    ].map(tool => (
                        <a key={tool.label} href={tool.href} className="ap-tool-card" style={{ '--tool-color': tool.color } as any}>
                            <div className="ap-tool-emoji">{tool.emoji}</div>
                            <div className="ap-tool-info">
                                <h4 className="ap-tool-name">{tool.label}</h4>
                                <p className="ap-tool-desc">{tool.desc}</p>
                            </div>
                            <span className="ap-tool-btn">Criar Nova →</span>
                        </a>
                    ))}
                </div>
            </div>

            <div className="ap-divider" />

            <div className="ap-header">
                <div>
                    <h2 className="ap-title">Central de Atividades</h2>
                    <p className="ap-subtitle">Organize suas missões em pastas e atribua aos alunos.</p>
                </div>
                
                <div className="ap-header-actions">
                    <div className="ap-search-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <input 
                            type="text" 
                            placeholder="Buscar missão..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="ap-btn-new-folder" onClick={() => setIsCreatingFolder(true)}>
                        📁 Nova Pasta
                    </button>
                    <span className="ap-count-badge">
                        {searchQuery ? `${filteredActivities.length} encontrados` : `${activities.length} total`}
                    </span>
                </div>
            </div>

            {isCreatingFolder && (
                <div className="ap-folder-modal-overlay" onClick={() => setIsCreatingFolder(false)}>
                    <div className="ap-folder-modal" onClick={e => e.stopPropagation()}>
                        <h3>Criar Nova Pasta</h3>
                        <input 
                            type="text" 
                            placeholder="Nome da pasta" 
                            value={newFolderName}
                            onChange={e => setNewFolderName(e.target.value)}
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                        />
                        <div className="ap-folder-modal-actions">
                            <button className="cancel" onClick={() => setIsCreatingFolder(false)}>Cancelar</button>
                            <button className="confirm" onClick={handleCreateFolder}>Criar Pasta</button>
                        </div>
                    </div>
                </div>
            )}

            {movingActivity && (
                <div className="ap-folder-modal-overlay" onClick={() => setMovingActivity(null)}>
                    <div className="ap-folder-modal" onClick={e => e.stopPropagation()}>
                        <h3>Mover "{movingActivity.title}"</h3>
                        <div className="ap-folder-list" style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                            <button 
                                className={`ap-folder-select-btn ${!movingActivity.folder_id ? 'active' : ''}`}
                                onClick={() => { handleMoveToFolder(movingActivity.id, null); setMovingActivity(null); }}
                                style={{ textAlign: 'left', padding: '0.75rem', borderRadius: '0.5rem', background: !movingActivity.folder_id ? 'var(--color-ice)' : 'white', border: '1px solid var(--color-slate-border)', fontWeight: 'bold' }}
                            >
                                🏠 Início (Raiz)
                            </button>
                            {folders.map(f => (
                                <button 
                                    key={f.id}
                                    className={`ap-folder-select-btn ${movingActivity.folder_id === f.id ? 'active' : ''}`}
                                    onClick={() => { handleMoveToFolder(movingActivity.id, f.id); setMovingActivity(null); }}
                                    style={{ textAlign: 'left', padding: '0.75rem', borderRadius: '0.5rem', background: movingActivity.folder_id === f.id ? 'var(--color-ice)' : 'white', border: '1px solid var(--color-slate-border)' }}
                                >
                                    📁 {f.name}
                                </button>
                            ))}
                        </div>
                        <div className="ap-folder-modal-actions mt-4" style={{ marginTop: '1.5rem' }}>
                            <button className="cancel" style={{ width: '100%' }} onClick={() => setMovingActivity(null)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {!searchQuery && (
                <nav className="ap-breadcrumbs">
                    {getBreadcrumbs().map((crumb, idx) => (
                        <React.Fragment key={crumb.id || 'root'}>
                            <span 
                                className={`ap-breadcrumb-item ${crumb.id === currentFolderId ? 'active' : ''}`}
                                onClick={() => setCurrentFolderId(crumb.id)}
                                onDrop={(e) => onDrop(e, crumb.id)}
                                onDragOver={onDragOver}
                            >
                                {crumb.name}
                            </span>
                            {idx < getBreadcrumbs().length - 1 && <span className="ap-breadcrumb-sep">/</span>}
                        </React.Fragment>
                    ))}
                </nav>
            )}

            {error ? (
                <div className="ap-error-state">
                    <span>⚠️</span>
                    <p>{error}</p>
                    <button onClick={fetchData} className="ap-btn-retry">Tentar novamente</button>
                </div>
            ) : (filteredActivities.length === 0 && filteredFolders.length === 0) ? (
                <div className="ap-empty">
                    <span>📭</span>
                    <p>{searchQuery ? 'Nenhum resultado encontrado.' : 'Esta pasta está vazia.'}</p>
                    {!searchQuery && <p className="ap-empty-sub">Clique em "Nova Pasta" ou mova atividades para cá.</p>}
                </div>
            ) : (
                <div className="ap-grid">
                    {/* FOLDERS GRID */}
                    {filteredFolders.map(f => (
                        <div 
                            key={f.id} 
                            className="ap-folder-card"
                            onClick={() => { setCurrentFolderId(f.id); setSearchQuery(''); }}
                            onDrop={(e) => onDrop(e, f.id)}
                            onDragOver={onDragOver}
                        >
                            <div className="ap-folder-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                            </div>
                            <div className="ap-folder-info">
                                <h3 className="ap-folder-name">{f.name}</h3>
                            </div>
                            <button 
                                className="ap-folder-delete"
                                onClick={(e) => { e.stopPropagation(); handleDeleteFolder(f.id, f.name); }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                    ))}

                    {/* ACTIVITIES GRID */}
                    {filteredActivities.map((a) => {
                        const meta = TYPE_LABELS[a.type] ?? { icon: '📄', label: a.type, color: '#64748b' };
                        return (
                            <div 
                                className="ap-card" 
                                key={a.id}
                                draggable
                                onDragStart={(e) => onDragStart(e, a.id)}
                                style={{ zIndex: activeMenuId === a.id ? 101 : 1 }}
                            >
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
                                                    <button onClick={() => {
                                                        const editPath = a.type === 'draw' ? `/draw?edit=${a.id}` : `/dashboard/missions/${a.type}?edit=${a.id}`;
                                                        window.location.href = editPath;
                                                    }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                        Editar Conteúdo
                                                    </button>
                                                    <button onClick={() => { handleDuplicate(a.id); setActiveMenuId(null); }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                        Duplicar
                                                    </button>
                                                    <button onClick={() => { setLinkingActivity(a); setActiveMenuId(null); }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                                        Vincular Materiais
                                                    </button>
                                                    <button onClick={() => { handleRename(a.id, a.title); setActiveMenuId(null); }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                                        Renomear
                                                    </button>
                                                    {a.folder_id && (
                                                        <button onClick={() => { handleMoveToFolder(a.id, null); setActiveMenuId(null); }}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                                                            Tirar desta pasta
                                                        </button>
                                                    )}
                                                    <button onClick={() => { setMovingActivity(a); setActiveMenuId(null); }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 9l4-4 4 4m-4-4v14"/></svg>
                                                        Mover...
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
                                        onClick={() => {
                                            const playPath = a.type === 'draw' ? `/draw?play=${a.id}&test=true` : `/play/${a.type}/${a.id}?test=true`;
                                            window.location.href = playPath;
                                        }}
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
                                className={`ap-tab-btn ${shareTab === 'public' ? 'active' : ''}`}
                                onClick={() => setShareTab('public')}
                            >
                                Link Público
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

                            {shareTab === 'public' && sharingActivity && (
                                <div className="animation-fade-in">
                                    <p className="ap-modal-instruction">Link para a sua Landing Page pública. Qualquer aluno pode se cadastrar para fazer a missão, sendo capturado como Lead e redirecionado para o seu WhatsApp posteriormente.</p>
                                    
                                    <div className="ap-link-box">
                                        <input className="ap-link-input" readOnly value={`${window.location.origin}/convite/${sharingActivity.id}`} />
                                        <button className="ap-link-copy" onClick={() => copyToClipboard(`${window.location.origin}/convite/${sharingActivity.id}`)}>Copiar</button>
                                    </div>

                                    <p className="ap-link-hint">🚀 Ótimo para usar no seu Instagram, YouTube ou disparos de e-mail!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {/* MATERIAL LINK MODAL */}
            {linkingActivity && (
                <MaterialLinkModal 
                    activityId={linkingActivity.id}
                    activityTitle={linkingActivity.title}
                    onClose={() => setLinkingActivity(null)}
                />
            )}


            {/* TOAST */}
            {toast && (
                <div className={`ap-toast ${toast.type}`}>{toast.msg}</div>
            )}

            <style>{`
                .ap-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 5rem; color: #64748b; }
                .ap-spinner { width: 38px; height: 38px; border: 3px solid #e2e8f0; border-top-color: #58317e; border-radius: 50%; animation: ap-spin 0.7s linear infinite; }
                .ap-spinner.sm { width: 16px; height: 16px; border-width: 2px; }
                @keyframes ap-spin { to { transform: rotate(360deg); } }

                .ap-tools-hub { margin-bottom: 2rem; }
                .ap-tools-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0 0 0.25rem; }
                .ap-tools-subtitle { font-size: 0.9rem; color: #64748b; margin: 0 0 1.25rem; }
                .ap-tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.875rem; }
                .ap-tool-card { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border-radius: 1rem; border: 1.5px solid #e2e8f0; background: white; text-decoration: none; color: inherit; transition: all 0.2s; position: relative; overflow: hidden; }
                .ap-tool-card::before { content: ''; position: absolute; inset: 0; background: var(--tool-color); opacity: 0; transition: opacity 0.2s; }
                .ap-tool-card:hover { border-color: var(--tool-color); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
                .ap-tool-card:hover::before { opacity: 0.04; }
                .ap-tool-emoji { font-size: 2rem; line-height: 1; flex-shrink: 0; position: relative; }
                .ap-tool-info { flex: 1; min-width: 0; position: relative; }
                .ap-tool-name { font-size: 0.9rem; font-weight: 800; color: #0f172a; margin: 0 0 0.15rem; }
                .ap-tool-desc { font-size: 0.75rem; color: #64748b; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .ap-tool-btn { font-size: 0.7rem; font-weight: 800; color: var(--tool-color); white-space: nowrap; position: relative; opacity: 0; transition: opacity 0.2s; }
                .ap-tool-card:hover .ap-tool-btn { opacity: 1; }
                .ap-divider { border: none; border-top: 1.5px solid #e2e8f0; margin: 0 0 2rem; }

                .ap-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap; }
                .ap-title { font-size: 1.875rem; font-weight: 800; color: #0f172a; margin: 0 0 0.25rem; }
                .ap-subtitle { font-size: 1rem; color: #64748b; margin: 0; }
                
                .ap-header-actions { display: flex; align-items: center; gap: 1rem; }
                .ap-search-box { position: relative; display: flex; align-items: center; background: white; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0 1rem; width: 280px; transition: 0.2s; }
                .ap-search-box:focus-within { border-color: #58317e; box-shadow: 0 0 0 3px rgba(88,49,126,0.1); }
                .ap-search-box svg { color: #94a3b8; }
                .ap-search-box input { border: none; background: transparent; padding: 0.75rem 0.5rem; font-size: 0.875rem; outline: none; flex: 1; }
                .ap-btn-new-folder { background: #f8fafc; border: 1.5px solid #e2e8f0; padding: 0.75rem 1.25rem; border-radius: 12px; font-weight: 700; font-size: 0.875rem; color: #1e293b; cursor: pointer; transition: 0.2s; white-space: nowrap; }
                .ap-btn-new-folder:hover { background: #f1f5f9; border-color: #cbd5e1; }

                .ap-count-badge { padding: 0.4rem 1rem; background: #f5f3ff; color: #58317e; border-radius: 999px; font-weight: 800; font-size: 0.85rem; white-space: nowrap; }

                .ap-breadcrumbs { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-weight: 700; font-size: 0.95rem; color: #64748b; }
                .ap-breadcrumb-item { cursor: pointer; padding: 0.25rem 0.5rem; border-radius: 6px; transition: 0.2s; }
                .ap-breadcrumb-item:hover { color: #58317e; background: #f5f3ff; }
                .ap-breadcrumb-item.active { color: #0f172a; cursor: default; }
                .ap-breadcrumb-item.active:hover { background: transparent; }
                .ap-breadcrumb-sep { color: #cbd5e1; }

                .ap-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 5rem 2rem; text-align: center; }
                .ap-empty span { font-size: 3.5rem; }
                .ap-empty p { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; }
                .ap-empty-sub { font-size: 0.9rem; color: #64748b; max-width: 380px; line-height: 1.6; }

                .ap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }

                /* FOLDER CARD */
                .ap-folder-card { background: white; border: 1.5px solid #e2e8f0; border-radius: 1.25rem; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: 0.2s; position: relative; }
                .ap-folder-card:hover { border-color: #58317e; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                .ap-folder-icon { color: #58317e; }
                .ap-folder-name { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0; }
                .ap-folder-delete { position: absolute; top: 0.5rem; right: 0.5rem; width: 24px; height: 24px; border-radius: 6px; border: none; background: transparent; color: #94a3b8; display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; }
                .ap-folder-card:hover .ap-folder-delete { opacity: 1; }
                .ap-folder-delete:hover { background: #fee2e2; color: #ef4444; }

                .ap-card { background: white; border: 1.5px solid #e2e8f0; border-radius: 1.5rem; padding: 1.75rem; display: flex; flex-direction: column; gap: 0.5rem; transition: transform 200ms, box-shadow 200ms; position: relative; cursor: grab; }
                .ap-card:active { cursor: grabbing; }
                .ap-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(30,41,59,0.08); border-color: #cbd5e1; }

                .ap-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
                .ap-type-pill { padding: 0.35rem 0.8rem; border-radius: 999px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.02em; }
                
                .ap-menu-container { position: relative; }
                .ap-action-btn.dots { width: 32px; height: 32px; border-radius: 10px; background: #f8fafc; border: none; color: #64748b; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
                .ap-action-btn.dots:hover, .ap-action-btn.dots.active { background: #58317e; color: white; }
                
                .ap-menu-backdrop { position: fixed; inset: 0; z-index: 50; }
                .ap-dropdown-menu { position: absolute; top: calc(100% + 8px); right: 0; width: 220px; background: white; border: 1.5px solid #e2e8f0; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 60; padding: 0.5rem; overflow: hidden; animation: menuShow 0.2s ease-out; }
                @keyframes menuShow { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                
                .ap-dropdown-menu button { width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border: none; background: none; border-radius: 0.6rem; font-weight: 600; font-size: 0.875rem; color: #0f172a; cursor: pointer; text-align: left; transition: 0.15s; }
                .ap-dropdown-menu button:hover { background: #f5f3ff; color: #58317e; }
                .ap-dropdown-menu button.delete { color: #dc2626; }
                .ap-dropdown-menu button.delete:hover { background: #fee2e2; }
                .ap-menu-divider { height: 1.5px; background: #e2e8f0; margin: 0.4rem; }

                .ap-card-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.2; }
                .ap-card-sub { font-size: 0.85rem; color: #64748b; margin-bottom: 1rem; }

                .ap-card-footer { margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
                .ap-btn-preview { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 0.875rem; color: #1e293b; font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: 0.2s; }
                .ap-btn-preview:hover { background: white; border-color: #58317e; color: #58317e; }
                .ap-btn-share-main { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; background: #58317e; border: none; border-radius: 0.875rem; color: white; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: 0.2s; }
                .ap-btn-share-main:hover { filter: brightness(1.1); transform: scale(1.02); }

                /* FOLDER MODAL */
                .ap-folder-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; animation: ap-fadein 0.2s ease; }
                .ap-folder-modal { background: white; border-radius: 1.5rem; padding: 2rem; width: 100%; max-width: 400px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
                .ap-folder-modal h3 { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0 0 1rem; }
                .ap-folder-modal input { width: 100%; padding: 0.875rem; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 1rem; outline: none; transition: 0.2s; margin-bottom: 1.5rem; }
                .ap-folder-modal input:focus { border-color: #58317e; }
                .ap-folder-modal-actions { display: flex; gap: 0.75rem; }
                .ap-folder-modal-actions button { flex: 1; padding: 0.875rem; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; }
                .ap-folder-modal-actions .cancel { background: #f8fafc; border: 1.5px solid #e2e8f0; color: #64748b; }
                .ap-folder-modal-actions .confirm { background: #58317e; border: none; color: white; }
                .ap-folder-modal-actions button:hover { opacity: 0.9; }

                /* MODAL */
                .ap-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; animation: ap-fadein 0.2s ease; }
                @keyframes ap-fadein { from { opacity: 0; } to { opacity: 1; } }
                .ap-modal { background: white; border-radius: 1.75rem; width: 100%; max-width: 480px; box-shadow: 0 25px 60px rgba(15,23,42,0.25); overflow: hidden; animation: ap-slidein 0.25s ease; }
                @keyframes ap-slidein { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

                .ap-modal-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 1.75rem 1.75rem 1rem; }
                .ap-modal-pretitle { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #58317e; margin-bottom: 0.25rem; }
                .ap-modal-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.1; }
                .ap-modal-close { background: #f8fafc; border: none; border-radius: 0.75rem; width: 36px; height: 36px; cursor: pointer; font-size: 0.9rem; color: #64748b; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .ap-modal-close:hover { background: #e2e8f0; color: #0f172a; }

                .ap-tabs { display: flex; margin: 0 1.75rem; padding: 0.4rem; background: #f8fafc; border-radius: 1rem; gap: 0.4rem; }
                .ap-tab-btn { flex: 1; padding: 0.6rem; border: none; background: transparent; border-radius: 0.75rem; font-weight: 700; font-size: 0.85rem; color: #64748b; cursor: pointer; transition: 0.2s; }
                .ap-tab-btn.active { background: white; color: #58317e; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

                .ap-tab-content { padding: 1.5rem 1.75rem; }
                .ap-modal-instruction { font-size: 0.95rem; color: #64748b; margin-bottom: 1rem; line-height: 1.5; }

                .ap-student-list { list-style: none; margin: 0; padding: 0; max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; padding-right: 0.5rem; }
                .ap-student-item { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; border-radius: 1rem; border: 1.5px solid #e2e8f0; cursor: pointer; transition: 0.15s; }
                .ap-student-item:hover { border-color: #58317e; background: rgba(88,49,126,0.02); }
                .ap-student-item.selected { border-color: #58317e; background: rgba(88,49,126,0.05); }
                .ap-student-avatar { width: 38px; height: 38px; border-radius: 12px; background: #58317e; color: white; font-weight: 800; display: flex; align-items: center; justify-content: center; }
                .ap-student-name { font-weight: 700; color: #0f172a; font-size: 0.95rem; flex: 1; }
                .ap-checkbox { width: 22px; height: 22px; border-radius: 6px; border: 2px solid #e2e8f0; display: flex; align-items: center; justify-content: center; }
                .ap-checkbox.checked { background: #58317e; border-color: #58317e; }

                .ap-link-box { background: white; border: 2px solid #e2e8f0; border-radius: 1rem; padding: 0.5rem; display: flex; gap: 0.5rem; margin: 1.5rem 0; }
                .ap-link-input { border: none; background: transparent; padding: 0.5rem; flex: 1; font-size: 0.85rem; color: #0f172a; outline: none; min-width: 0; }
                .ap-link-copy { padding: 0.6rem 1.25rem; background: #58317e; color: white; border: none; border-radius: 0.6rem; font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: 0.2s; }

                .ap-modal-footer { display: flex; gap: 1rem; padding-top: 1.5rem; border-top: 1.5px solid #e2e8f0; margin-top: 1rem; }
                .ap-btn-cancel { flex: 1; padding: 0.875rem; background: #f8fafc; color: #64748b; border: none; border-radius: 1rem; font-weight: 700; cursor: pointer; }
                .ap-btn-confirm { flex: 1.5; padding: 0.875rem; background: #58317e; color: white; border: none; border-radius: 1rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .ap-btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

                .ap-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); padding: 1rem 2rem; border-radius: 999px; background: #0f172a; color: white; font-weight: 800; font-size: 0.9rem; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 10000; animation: toastUp 0.3s ease-out; }
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
