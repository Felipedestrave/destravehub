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

export const MaterialsManager: React.FC = () => {
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
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        .order('created_at', { ascending: false });

      if (userIsTeacher) {
        query = query.eq('teacher_id', userId);
      } else {
        const { data: studentInfo } = await supabase
          .from('students')
          .select('id')
          .eq('student_id', userId)
          .single();

        if (studentInfo) {
          query = query.or(`student_id.eq.${studentInfo.id},student_id.is.null`)
                       .eq('teacher_id', actualTeacherId);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setMaterials(data || []);
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
          student_id: selectedStudent === 'all' ? null : selectedStudent,
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
      const { error: storageError } = await supabase.storage
        .from('materials')
        .remove([material.file_path]);

      if (storageError) throw storageError;

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
  const filteredMaterials = materials.filter(m => m.folder_id === currentFolderId);

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
              <option value="all">Para todos os alunos</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>Exclusivo: {s.name}</option>
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
      ) : (filteredFolders.length === 0 && filteredMaterials.length === 0) ? (
        <div className="empty-state">
          Esta pasta está vazia.
        </div>
      ) : (
        <div className="materials-grid">
          {filteredFolders.map(folder => (
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

          {filteredMaterials.map(material => (
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
                  {material.student_id && (
                    <span className="student-badge">👤 Privado</span>
                  )}
                </div>
              </div>
              <div className="material-actions-row">
                <a 
                  href={getPublicUrl(material.file_path)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="view-btn"
                >
                  Ver
                </a>
                {isTeacher && (
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(material)}
                  >
                    Excluir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
