import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface Material {
  id: string;
  name: string;
  file_path: string;
  type: string;
  created_at: string | null;
  student_id: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activityId?: string;
}

import './MaterialsDrawer.css';

export const MaterialsDrawer: React.FC<Props> = ({ isOpen, onClose, activityId }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchMaterials();
    }
  }, [isOpen, activityId]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      const isTeacher = profile?.role === 'teacher';
      const userId = session.user.id;

      let actualTeacherId = userId;
      let studentInternalId: string | null = null;
      
      if (!isTeacher) {
        const { data: studentRecord } = await supabase
          .from('students')
          .select('id, teacher_id')
          .eq('student_id', userId)
          .single();
        if (studentRecord) {
          actualTeacherId = studentRecord.teacher_id;
          studentInternalId = studentRecord.id;
        }
      }

      // 1. Buscar IDs vinculados na nova tabela de junção
      let linkedIds: string[] = [];
      if (activityId) {
          const { data: links } = await supabase
              .from('activity_materials')
              .select('material_id')
              .eq('activity_id', activityId);
          linkedIds = links?.map(l => l.material_id) || [];
      }

      let query = supabase
        .from('materials')
        .select('*')
        .eq('teacher_id', actualTeacherId)
        .order('created_at', { ascending: false });

      // Filtro de Aluno (se não for professor)
      if (!isTeacher && studentInternalId) {
        query = query.or(`student_id.eq.${studentInternalId},student_id.is.null`);
      }

      // NOVO: Filtro de Atividade (Contexto)
      if (activityId) {
        const orConditions = [`activity_id.eq.${activityId}`, `activity_id.is.null`];
        if (linkedIds.length > 0) {
            orConditions.push(`id.in.(${linkedIds.map(id => `"${id}"`).join(',')})`);
        }
        query = query.or(orConditions.join(','));
      } else {
        query = query.is('activity_id', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      setMaterials(data || []);
    } catch (err) {
      console.error('Erro ao buscar materiais na drawer:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from('materials').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="drawer-overlay"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="drawer-content"
          >
            <div className="drawer-header">
              <h2 className="drawer-title">Materiais de Apoio</h2>
              <button onClick={onClose} className="close-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="drawer-body">
              {loading ? (
                <div className="drawer-loading">Buscando materiais...</div>
              ) : materials.length === 0 ? (
                <div className="drawer-empty">
                  Nenhum material de apoio disponível para esta missão.
                </div>
              ) : (
                <div className="drawer-list">
                  {materials.map(m => (
                    <a 
                      key={m.id} 
                      href={getPublicUrl(m.file_path)} 
                      target="_blank" 
                      className="drawer-item"
                    >
                      <div className="item-icon">
                        {m.type === 'pdf' ? '📄' : '🖼️'}
                      </div>
                      <div className="item-info">
                        <span className="item-name">{m.name}</span>
                        <span className="item-type">{m.type.toUpperCase()}</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}

    </AnimatePresence>
  );
};
