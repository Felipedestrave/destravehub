import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, FileText, Check, X, Loader2, BookOpen, Upload, Plus } from 'lucide-react';

interface Material {
    id: string;
    name: string;
    type: string;
}

interface MaterialLinkModalProps {
    activityId: string;
    activityTitle: string;
    onClose: () => void;
}

export const MaterialLinkModal: React.FC<MaterialLinkModalProps> = ({ activityId, activityTitle, onClose }) => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                // 1. Fetch all teacher materials
                const { data: allMaterials, error: matError } = await supabase
                    .from('materials')
                    .select('id, name, type')
                    .eq('teacher_id', session.user.id)
                    .order('name', { ascending: true });

                if (matError) throw matError;
                setMaterials((allMaterials || []).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { numeric: true })));

                // 2. Fetch current links for this activity
                const { data: links, error: linkError } = await supabase
                    .from('activity_materials')
                    .select('material_id')
                    .eq('activity_id', activityId);

                if (linkError) throw linkError;
                const linkedIds = new Set(links?.map(l => l.material_id) || []);
                setSelectedIds(linkedIds);

            } catch (err) {
                console.error('Error fetching materials:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMaterials();
    }, [activityId]);

    const handleToggle = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Delete existing links
            await supabase
                .from('activity_materials')
                .delete()
                .eq('activity_id', activityId);

            // 2. Insert new links
            if (selectedIds.size > 0) {
                const toInsert = Array.from(selectedIds).map(matId => ({
                    activity_id: activityId,
                    material_id: matId
                }));
                const { error } = await supabase.from('activity_materials').insert(toInsert);
                if (error) throw error;
            }

            onClose();
        } finally {
            setSaving(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Sessão expirada");

            const fileExt = file.name.split('.').pop() || '';
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', fileExt);

            const response = await fetch('/api/materials/upload-r2', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro no upload para o R2');
            }

            const newMat = await response.json();

            // 3. UI Update
            setMaterials(prev => [newMat, ...prev]);
            setSelectedIds(prev => new Set([...prev, newMat.id]));
            
            // Limpa o input para novos uploads do mesmo arquivo (se necessário)
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (err: any) {
            console.error('[Upload Error]', err);
            alert('Falha ao subir arquivo: ' + (err.message || 'Erro desconhecido'));
        } finally {
            setUploading(false);
        }
    };

    const filteredMaterials = materials.filter(m => 
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="mlm-overlay" onClick={onClose}>
            <div className="mlm-modal" onClick={e => e.stopPropagation()}>
                <header className="mlm-header">
                    <div>
                        <p className="mlm-pretitle">Materiais de Apoio</p>
                        <h3 className="mlm-title">{activityTitle}</h3>
                    </div>
                    <button className="mlm-close" onClick={onClose}><X size={20} /></button>
                </header>

                <div className="mlm-top-actions">
                    <div className="mlm-search-container">
                        <Search className="mlm-search-icon" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar material..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="mlm-search-input"
                        />
                    </div>
                    
                    <button 
                        className="mlm-btn-upload" 
                        onClick={handleUploadClick}
                        disabled={uploading}
                    >
                        {uploading ? <Loader2 size={16} className="mlm-spinner" /> : <Upload size={16} />}
                        <span>Upload</span>
                    </button>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={onFileChange} 
                        style={{ display: 'none' }} 
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.mp3"
                    />
                </div>

                <div className="mlm-content">
                    {loading ? (
                        <div className="mlm-loading">
                            <Loader2 className="mlm-spinner" size={32} />
                            <p>Carregando seus materiais...</p>
                        </div>
                    ) : filteredMaterials.length === 0 ? (
                        <div className="mlm-empty">
                            <BookOpen size={48} className="mlm-empty-icon" />
                            <p>{search ? 'Nenhum material encontrado para esta busca.' : 'Você ainda não subiu nenhum material.'}</p>
                            {!search && <p className="mlm-empty-sub">Vá em "Materiais" no menu lateral para subir seus arquivos primeiro.</p>}
                        </div>
                    ) : (
                        <div className="mlm-list">
                            {filteredMaterials.map(m => (
                                <div 
                                    key={m.id} 
                                    className={`mlm-item ${selectedIds.has(m.id) ? 'selected' : ''}`}
                                    onClick={() => handleToggle(m.id)}
                                >
                                    <div className="mlm-item-icon">
                                        <FileText size={18} />
                                    </div>
                                    <div className="mlm-item-info">
                                        <span className="mlm-item-name">{m.name}</span>
                                        <span className="mlm-item-type">{m.type.toUpperCase()}</span>
                                    </div>
                                    <div className={`mlm-checkbox ${selectedIds.has(m.id) ? 'checked' : ''}`}>
                                        {selectedIds.has(m.id) && <Check size={14} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <footer className="mlm-footer">
                    <button className="mlm-btn-cancel" onClick={onClose}>Cancelar</button>
                    <button 
                        className="mlm-btn-save" 
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <Loader2 className="mlm-spinner sm" size={16} /> : null}
                        {saving ? 'Salvando...' : `Vincular (${selectedIds.size})`}
                    </button>
                </footer>

                <style>{`
                    .mlm-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1rem; animation: mlm-fadein 0.2s ease; }
                    @keyframes mlm-fadein { from { opacity: 0; } to { opacity: 1; } }
                    .mlm-modal { background: white; border-radius: 1.75rem; width: 100%; max-width: 500px; box-shadow: 0 25px 60px rgba(15,23,42,0.25); overflow: hidden; animation: mlm-slidein 0.25s ease; display: flex; flex-direction: column; max-height: 90vh; }
                    @keyframes mlm-slidein { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                    
                    .mlm-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 1.75rem 1.75rem 1rem; border-bottom: 1px solid #f1f5f9; }
                    .mlm-pretitle { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-brand); margin-bottom: 0.25rem; }
                    .mlm-title { font-family: var(--font-outfit); font-size: 1.5rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; line-height: 1.1; }
                    .mlm-close { background: var(--color-ice); border: none; border-radius: 0.75rem; width: 36px; height: 36px; cursor: pointer; color: var(--color-slate-mid); display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                    .mlm-close:hover { background: #e2e8f0; color: var(--color-slate-dark); }
                    
                    .mlm-search-container { flex: 1; position: relative; }
                    .mlm-search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--color-slate-mid); }
                    .mlm-search-input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.75rem; border: 1.5px solid var(--color-slate-border); border-radius: 1rem; font-family: var(--font-inter); font-size: 0.9rem; outline: none; transition: 0.2s; }
                    .mlm-search-input:focus { border-color: var(--color-brand); box-shadow: 0 0 0 3px rgba(88,49,126,0.1); }

                    .mlm-top-actions { padding: 1rem 1.75rem; display: flex; gap: 0.75rem; align-items: center; border-bottom: 1px solid #f1f5f9; }
                    .mlm-btn-upload {
                        display: flex; align-items: center; gap: 0.6rem; padding: 0.75rem 1.25rem;
                        background: var(--color-ice); border: 1.5px solid var(--color-slate-border);
                        border-radius: 1rem; color: var(--color-brand); font-family: var(--font-outfit);
                        font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: 0.2s;
                    }
                    .mlm-btn-upload:hover { background: white; border-color: var(--color-brand); transform: translateY(-1px); }
                    .mlm-btn-upload:disabled { opacity: 0.6; cursor: not-allowed; }
                    
                    .mlm-content { flex: 1; overflow-y: auto; padding: 0 1.75rem 1.5rem; min-height: 200px; }
                    .mlm-loading, .mlm-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 3rem 1rem; text-align: center; }
                    .mlm-spinner { animation: mlm-spin 1s linear infinite; color: var(--color-brand); }
                    .mlm-spinner.sm { margin-right: 8px; }
                    @keyframes mlm-spin { to { transform: rotate(360deg); } }
                    
                    .mlm-empty-icon { color: var(--color-slate-border); }
                    .mlm-empty p { font-weight: 700; color: var(--color-slate-dark); margin: 0; }
                    .mlm-empty-sub { font-size: 0.85rem; color: var(--color-slate-mid); font-weight: 400 !important; }
                    
                    .mlm-list { display: flex; flex-direction: column; gap: 0.5rem; }
                    .mlm-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; border-radius: 1rem; border: 1.5px solid var(--color-slate-border); cursor: pointer; transition: 0.15s; }
                    .mlm-item:hover { border-color: var(--color-brand); background: rgba(88,49,126,0.02); }
                    .mlm-item.selected { border-color: var(--color-brand); background: rgba(88,49,126,0.05); }
                    
                    .mlm-item-icon { width: 36px; height: 36px; background: var(--color-ice); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--color-brand); }
                    .mlm-item-info { flex: 1; display: flex; flex-direction: column; }
                    .mlm-item-name { font-weight: 700; color: var(--color-slate-dark); font-size: 0.9rem; }
                    .mlm-item-type { font-size: 0.7rem; font-weight: 800; color: var(--color-slate-mid); }
                    
                    .mlm-checkbox { width: 22px; height: 22px; border-radius: 6px; border: 2px solid var(--color-slate-border); display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                    .mlm-checkbox.checked { background: var(--color-brand); border-color: var(--color-brand); color: white; }
                    
                    .mlm-footer { padding: 1.5rem 1.75rem; border-top: 1px solid #f1f5f9; display: flex; gap: 1rem; }
                    .mlm-btn-cancel { flex: 1; padding: 0.875rem; border-radius: 1rem; border: 1.5px solid var(--color-slate-border); background: white; font-family: var(--font-outfit); font-weight: 700; color: var(--color-slate-mid); cursor: pointer; transition: 0.2s; }
                    .mlm-btn-cancel:hover { background: #f8fafc; border-color: #cbd5e1; }
                    .mlm-btn-save { flex: 1.5; padding: 0.875rem; border-radius: 1rem; border: none; background: var(--color-brand); font-family: var(--font-outfit); font-weight: 800; color: white; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
                    .mlm-btn-save:hover { filter: brightness(1.1); transform: scale(1.02); }
                    .mlm-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
                `}</style>
            </div>
        </div>
    );
};
