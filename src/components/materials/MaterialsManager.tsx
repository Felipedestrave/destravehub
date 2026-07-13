import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string | null;
}

interface Material {
  id: string;
  name: string;
  file_path: string;
  type: string;
  created_at: string | null;
  student_id: string | null;
  activity_id: string | null;
  folder_id: string | null;
  activities: { title: string } | null;
}

interface Activity {
  id: string;
  title: string;
}

interface Student {
  id: string;
  name: string;
}

interface Props {
  teacherId: string;
  isTeacher: boolean;
}

import './MaterialsManager.css';

export const MaterialsManager: React.FC<Props> = () => {
  const [user, setUser] = useState<any>(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [currentTeacherId, setCurrentTeacherId] = useState<string>('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('private');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de Compartilhamento e Modal
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  const [sharingMaterial, setSharingMaterial] = useState<Material | null>(null);
  const [sharingStudentSearch, setSharingStudentSearch] = useState('');
  const [sharingConfirming, setSharingConfirming] = useState(false);

  // Estados de Ordenação e Busca Semântica do Aluno
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [semanticSearchQuery, setSemanticSearchQuery] = useState('');
  const [isSearchingSemantically, setIsSearchingSemantically] = useState(false);
  const [semanticResults, setSemanticResults] = useState<string[] | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      const userIsTeacher = profile?.role === 'teacher';
      const userId = session.user.id;

      let actualTeacherId = userId;
      if (!userIsTeacher) {
        // Find teacher_id for the student
        const { data: studentProfile } = await supabase
          .from('students')
          .select('teacher_id')
          .eq('student_id', userId)
          .single();
        if (studentProfile) actualTeacherId = studentProfile.teacher_id;
      }

      setIsTeacher(userIsTeacher);
      setUser(session.user);
      setCurrentTeacherId(actualTeacherId);

      // Re-fetch using determined roles
      fetchMaterials(userId, userIsTeacher, actualTeacherId);
      if (userIsTeacher) {
        fetchStudents(actualTeacherId);
      }
    };
    init();
  }, []);

  const fetchMaterials = async (userId: string, userIsTeacher: boolean, actualTeacherId: string) => {
    try {
      setLoading(true);
      
      // Fetch Folders
      let folderQuery = supabase
        .from('materials_folders')
        .select('*')
        .eq('teacher_id', actualTeacherId)
        .order('name');
      
      const { data: folderData, error: folderError } = await folderQuery;
      if (folderError) throw folderError;
      setFolders(folderData || []);

      // Fetch Materials
      let query = supabase
        .from('materials')
        .select('*, activities(title)')
        .order('name', { ascending: true });

      if (userIsTeacher) {
        query = query.eq('teacher_id', userId);
      } else {
        const { data: studentInfo } = await supabase
          .from('students')
          .select('id')
          .eq('student_id', userId)
          .single();

        if (studentInfo) {
          // 1. Get IDs of activities assigned to this student
          const { data: assignments } = await supabase
            .from('assignments')
            .select('activity_id')
            .eq('student_id', studentInfo.id);
          
          const assignedIds = assignments?.map(a => a.activity_id) || [];

          // 2. Get IDs of materials linked via junction table
          let linkedIds: string[] = [];
          if (assignedIds.length > 0) {
            const { data: links } = await supabase
              .from('activity_materials')
              .select('material_id')
              .in('activity_id', assignedIds);
            linkedIds = links?.map(l => l.material_id) || [];
          }

          // 3. Build OR filter: Direct share OR Linked to activity OR Assigned in junction
          let orConditions = [`student_id.eq.${studentInfo.id}`];
          if (assignedIds.length > 0) {
            orConditions.push(`activity_id.in.(${assignedIds.join(',')})`);
          }
          if (linkedIds.length > 0) {
            orConditions.push(`id.in.(${linkedIds.map(id => `"${id}"`).join(',')})`);
          }

          query = query.or(orConditions.join(','))
                       .eq('teacher_id', actualTeacherId);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setMaterials((data || []).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { numeric: true })));
    } catch (err) {
      console.error('Erro ao buscar materiais:', err);
      toast.error('Não foi possível carregar os materiais.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (tId: string) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, name')
        .eq('teacher_id', tId);
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('O arquivo deve ter no máximo 10MB.');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('materials')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('materials')
        .insert({
          name: file.name,
          file_path: filePath,
          teacher_id: user.id,
          student_id: selectedStudent === 'private' ? null : selectedStudent,
          folder_id: currentFolderId,
          type: fileExt?.toLowerCase() === 'pdf' ? 'pdf' : 'image'
        });

      if (dbError) throw dbError;

      toast.success('Material enviado com sucesso!');
      fetchMaterials(user.id, isTeacher, currentTeacherId);
    } catch (err) {
      console.error('Erro no upload:', err);
      toast.error('Falha ao enviar arquivo.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pasta? Arquivos dentro dela ficarão sem pasta.')) return;
    try {
      const { error } = await supabase
        .from('materials_folders')
        .delete()
        .eq('id', folderId);
      if (error) throw error;
      toast.success('Pasta excluída.');
      setFolders(folders.filter(f => f.id !== folderId));
      if (currentFolderId === folderId) setCurrentFolderId(null);
    } catch (err) {
      console.error('Erro ao deletar pasta:', err);
      toast.error('Houve um erro ao excluir a pasta.');
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const { data, error } = await supabase
        .from('materials_folders')
        .insert({
          name: newFolderName,
          teacher_id: user.id,
          parent_id: currentFolderId
        })
        .select()
        .single();

      if (error) throw error;
      setFolders([data, ...folders]);
      setNewFolderName('');
      setIsCreatingFolder(false);
      toast.success('Pasta criada!');
    } catch (err) {
      console.error('Erro ao criar pasta:', err);
      toast.error('Houve um erro ao criar a pasta.');
    }
  };

  const handleMoveToFolder = async (materialId: string, folderId: string | null) => {
    try {
      const { error } = await supabase
        .from('materials')
        .update({ folder_id: folderId })
        .eq('id', materialId);
      
      if (error) throw error;
      
      setMaterials(materials.map(m => 
        m.id === materialId ? { ...m, folder_id: folderId } : m
      ));
      toast.success('Material movido!');
    } catch (err) {
      console.error('Erro ao mover material:', err);
      toast.error('Não foi possível mover o material.');
    }
  };

  const getBreadcrumbs = () => {
    const crumbs: { id: string | null; name: string }[] = [{ id: null, name: 'Início' }];
    if (!currentFolderId) return crumbs;

    const path: { id: string; name: string }[] = [];
    let curr: Folder | undefined = folders.find(f => f.id === currentFolderId);
    
    while (curr) {
      path.unshift({ id: curr.id, name: curr.name });
      const parentId = curr.parent_id;
      curr = folders.find(f => f.id === parentId);
    }

    return [...crumbs, ...path];
  };

  const handleDelete = async (material: Material) => {
    if (!confirm('Tem certeza que deseja excluir este material?')) return;
    try {
      // 1. Verificar se existem outras linhas que apontam para o mesmo file_path
      const { count, error: countError } = await supabase
        .from('materials')
        .select('*', { count: 'exact', head: true })
        .eq('file_path', material.file_path);
      
      if (countError) throw countError;

      // 2. Se for a única referência, excluir o arquivo do storage
      if (count && count <= 1) {
        const { error: storageError } = await supabase.storage
          .from('materials')
          .remove([material.file_path]);

        if (storageError && !(storageError as any).message?.includes('Object not found')) {
          throw storageError;
        }
      }

      // 3. Deletar do banco de dados
      const { error: dbError } = await supabase
        .from('materials')
        .delete()
        .eq('id', material.id);

      if (dbError) throw dbError;

      toast.success('Material excluído.');
      setMaterials(materials.filter(m => m.id !== material.id));
    } catch (err) {
      console.error('Erro ao deletar:', err);
      toast.error('Erro ao excluir material.');
    }
  };

  const handleShareMaterial = async (studentId: string) => {
    if (!sharingMaterial) return;
    setSharingConfirming(true);
    try {
      // 1. Verificar se já está compartilhado com este aluno
      const { data: existing, error: existError } = await supabase
        .from('materials')
        .select('id')
        .eq('file_path', sharingMaterial.file_path)
        .eq('student_id', studentId)
        .maybeSingle();

      if (existError) throw existError;

      if (existing) {
        toast.error('Este arquivo já está compartilhado com este aluno.');
        setSharingConfirming(false);
        return;
      }

      // 2. Inserir novo registro de material para o aluno
      const { error: insertError } = await supabase
        .from('materials')
        .insert({
          name: sharingMaterial.name,
          file_path: sharingMaterial.file_path,
          type: sharingMaterial.type,
          teacher_id: currentTeacherId || user.id,
          student_id: studentId,
          folder_id: null
        });

      if (insertError) throw insertError;

      toast.success(`Material compartilhado com sucesso!`);
      setIsSharingModalOpen(false);
      
      // Recarregar os materiais para atualizar a visualização dos badges
      fetchMaterials(user.id, isTeacher, currentTeacherId);
    } catch (err) {
      console.error('Erro ao compartilhar material:', err);
      toast.error('Não foi possível compartilhar o material.');
    } finally {
      setSharingConfirming(false);
    }
  };

  const handleSemanticSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!semanticSearchQuery.trim()) return;

    setIsSearchingSemantically(true);
    try {
      const response = await fetch('/api/materials/semantic-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: semanticSearchQuery,
          materials: materials
        })
      });

      if (!response.ok) {
        throw new Error('Falha na busca semântica');
      }

      const data = await response.json();
      const results: { id: string; score: number }[] = data.results || [];
      
      setSemanticResults(results.map(r => r.id));
      toast.success('Busca semântica concluída!');
    } catch (err) {
      console.error('Erro na busca semântica:', err);
      toast.error('Erro ao realizar busca semântica.');
    } finally {
      setIsSearchingSemantically(false);
    }
  };

  const onDragStart = (e: React.DragEvent, materialId: string) => {
    e.dataTransfer.setData('materialId', materialId);
  };

  const onDrop = (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    const materialId = e.dataTransfer.getData('materialId');
    if (materialId) {
      handleMoveToFolder(materialId, targetFolderId);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const filteredFolders = folders.filter(f => f.parent_id === currentFolderId);
  
  // Lógica de Ordenação e Filtro Semântico
  let displayedMaterials = materials.filter(m => m.folder_id === currentFolderId);
  
  if (!isTeacher && semanticResults !== null) {
    displayedMaterials = materials
      .filter(m => semanticResults.includes(m.id))
      .sort((a, b) => semanticResults.indexOf(a.id) - semanticResults.indexOf(b.id));
  } else {
    displayedMaterials = displayedMaterials.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA; // Descrescente (mais recente primeiro)
      } else {
        return a.name.localeCompare(b.name, 'pt-BR', { numeric: true });
      }
    });
  }

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from('materials').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="materials-container">
      <header className="materials-header">
        <h2 className="materials-title">
          {isTeacher ? 'Gerenciador de Materiais' : 'Meus Materiais de Apoio'}
        </h2>
        
        {isTeacher && (
          <div className="materials-actions">
            <button 
              className="folder-btn"
              onClick={() => setIsCreatingFolder(true)}
            >
              📁 Nova Pasta
            </button>

            <select 
              value={selectedStudent} 
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="student-select"
            >
              <option value="private">🔒 Apenas Eu (Privado)</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>👤 Para: {s.name}</option>
              ))}
            </select>
            
            <button 
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Enviando...' : 'Subir Arquivo'}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleUpload} 
              style={{ display: 'none' }}
              accept=".pdf,image/*"
            />
          </div>
        )}
      </header>

      {/* Barra de Filtros e Busca Semântica */}
      <div className="materials-filter-bar">
        <div className="filter-group">
          <label htmlFor="sort-select" className="filter-label">Ordenar por:</label>
          <select 
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
            className="filter-select"
          >
            <option value="name">Alfabeto (A-Z)</option>
            <option value="date">Data de Compartilhamento</option>
          </select>
        </div>

        {!isTeacher && (
          <form onSubmit={handleSemanticSearch} className="semantic-search-form">
            <input 
              type="text" 
              placeholder="Busca Semântica por IA (ex: comida japonesa, gramática)..." 
              value={semanticSearchQuery}
              onChange={(e) => {
                setSemanticSearchQuery(e.target.value);
                if (!e.target.value.trim()) {
                  setSemanticResults(null);
                }
              }}
              className="semantic-search-input"
            />
            <button 
              type="submit" 
              className="semantic-search-btn"
              disabled={isSearchingSemantically || !semanticSearchQuery.trim()}
            >
              {isSearchingSemantically ? 'Buscando...' : 'Buscar com IA 🤖'}
            </button>
            {semanticResults !== null && (
              <button 
                type="button" 
                onClick={() => {
                  setSemanticSearchQuery('');
                  setSemanticResults(null);
                }}
                className="clear-search-btn"
              >
                Limpar
              </button>
            )}
          </form>
        )}
      </div>

      {isCreatingFolder && (
        <div className="folder-creation-modal">
          <input 
            type="text" 
            placeholder="Nome da pasta..." 
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="folder-input"
            autoFocus
          />
          <button onClick={handleCreateFolder}>Criar</button>
          <button onClick={() => setIsCreatingFolder(false)}>Cancelar</button>
        </div>
      )}

      <nav className="materials-breadcrumb">
        {getBreadcrumbs().map((crumb, idx) => (
          <React.Fragment key={crumb.id || 'root'}>
            <span 
              className={`breadcrumb-item ${crumb.id === currentFolderId ? 'active' : ''}`}
              onClick={() => setCurrentFolderId(crumb.id)}
              onDrop={(e) => onDrop(e, crumb.id)}
              onDragOver={onDragOver}
            >
              {crumb.name}
            </span>
            {idx < getBreadcrumbs().length - 1 && <span className="breadcrumb-separator">/</span>}
          </React.Fragment>
        ))}
      </nav>

      {loading ? (
        <div className="loading-state">Carregando materiais...</div>
      ) : ((semanticResults === null ? filteredFolders.length : 0) === 0 && displayedMaterials.length === 0) ? (
        <div className="empty-state">
          {semanticResults !== null ? 'Nenhum material encontrado na busca semântica.' : 'Esta pasta está vazia.'}
        </div>
      ) : (
        <div className="materials-grid">
          {semanticResults === null && filteredFolders.map(folder => (
            <div 
              key={folder.id} 
              className="folder-card"
              onClick={() => setCurrentFolderId(folder.id)}
              onDrop={(e) => onDrop(e, folder.id)}
              onDragOver={onDragOver}
            >
              <div className="folder-icon">📁</div>
              <div className="folder-info">
                <h3>{folder.name}</h3>
              </div>
              {isTeacher && (
                <button 
                  className="delete-folder-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder.id);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {displayedMaterials.map(material => {
            const isShared = material.student_id !== null || materials.some(m => m.file_path === material.file_path && m.student_id !== null);
            return (
              <div 
                key={material.id} 
                className="material-card"
                draggable={isTeacher}
                onDragStart={(e) => onDragStart(e, material.id)}
              >
                <div className="material-icon">
                  {material.type === 'pdf' ? '📄' : '🖼️'}
                </div>
                <div className="material-info">
                  <h3>{material.name}</h3>
                  <div className="material-meta">
                    {material.activities?.title && (
                      <span className="mission-badge">📎 {material.activities.title}</span>
                    )}
                    {isShared ? (
                      <span className="student-badge shared">👤 Compartilhado</span>
                    ) : (
                      <span className="student-badge private">🔒 Privado</span>
                    )}
                  </div>
                </div>
                <div className="material-actions-row">
                  <a 
                    href={getPublicUrl(material.file_path)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="view-btn"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    Ver
                  </a>
                  {isTeacher && (
                    <button 
                      className="share-btn"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => {
                        setSharingMaterial(material);
                        setSharingStudentSearch('');
                        setIsSharingModalOpen(true);
                      }}
                    >
                      Compartilhar
                    </button>
                  )}
                  <button 
                    className="delete-btn"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => handleDelete(material)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Compartilhamento */}
      {isSharingModalOpen && sharingMaterial && (
        <div className="share-modal-overlay" onClick={() => setIsSharingModalOpen(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <header className="share-modal-header">
              <h3>Compartilhar Material</h3>
              <button className="close-btn" onClick={() => setIsSharingModalOpen(false)}>×</button>
            </header>
            
            <div className="share-modal-body">
              <p className="share-file-name">
                Arquivo: <strong>{sharingMaterial.name}</strong>
              </p>
              
              <div className="share-search-box">
                <input 
                  type="text" 
                  placeholder="Buscar aluno por nome..." 
                  value={sharingStudentSearch}
                  onChange={(e) => setSharingStudentSearch(e.target.value)}
                  className="share-search-input"
                />
              </div>
              
              <div className="share-students-list">
                {students
                  .filter(s => (s.name || '').toLowerCase().includes(sharingStudentSearch.toLowerCase()))
                  .map(student => (
                    <div key={student.id} className="share-student-item">
                      <div className="student-avatar-box">👤</div>
                      <span className="student-name">{student.name}</span>
                      <button 
                        className="share-confirm-btn"
                        onClick={() => handleShareMaterial(student.id)}
                        disabled={sharingConfirming}
                      >
                        Compartilhar
                      </button>
                    </div>
                  ))}
                {students.filter(s => (s.name || '').toLowerCase().includes(sharingStudentSearch.toLowerCase())).length === 0 && (
                  <div className="share-empty-students">Nenhum aluno encontrado.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
