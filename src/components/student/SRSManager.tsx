import React, { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { notificationService } from '../../lib/notifications';
import { toast } from 'react-hot-toast';

export const SRSManager: React.FC = () => {
  useEffect(() => {
    checkForDueRevisions();
  }, []);

  const checkForDueRevisions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 0. Buscar o ID interno do aluno vinculado ao usuário logado
      const { data: studentRecord } = await supabase
        .from('students')
        .select('id')
        .eq('student_id', session.user.id)
        .maybeSingle();

      if (!studentRecord) return;

      // 1. Buscar missões com cronograma SRS pendente APENAS para este aluno
      const { data: assignments, error } = await supabase
        .from('assignments')
        .select('id, result_data, activities(title)')
        .eq('student_id', studentRecord.id)
        .eq('status', 'completed')
        .not('result_data', 'is', null);

      if (error) throw error;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      for (const assignment of (assignments || [])) {
        const data = assignment.result_data as any;
        if (!data.repetition || !Array.isArray(data.repetition)) continue;

        let needsUpdate = false;
        const updatedRepetition = [...data.repetition];

        for (let i = 0; i < updatedRepetition.length; i++) {
          const milestone = updatedRepetition[i];
          const scheduled = new Date(milestone.scheduledDate);
          const scheduledDay = new Date(scheduled.getFullYear(), scheduled.getMonth(), scheduled.getDate());

          const lastNotified = milestone.lastNotifiedAt ? new Date(milestone.lastNotifiedAt) : null;
          const isAlreadyNotifiedToday = lastNotified && 
            lastNotified.toDateString() === now.toDateString();

          // Se o dia chegou ou passou, e ainda está pendente e não notificado HOJE
          if (milestone.status === 'pending' && today >= scheduledDay && !isAlreadyNotifiedToday) {
            
            // Enviar Notificação Interna
            await notificationService.sendNotification(
                session.user.id,
                'Revisão Disponível! 📚',
                `A sua revisão da missão "${(assignment.activities as any)?.title}" está disponível hoje. Ganhe moedas extras ao refazer agora!`,
                'assignment',
                `/dashboard/missions/destrave1?assignment=${assignment.id}` // Link para a missão
            );

            toast('Revisão disponível! Verifique seu sininho.', { icon: '🔔' });

            // Marcar como notificado com data
            updatedRepetition[i].notified = true;
            updatedRepetition[i].lastNotifiedAt = now.toISOString();
            needsUpdate = true;
          }
        }

        if (needsUpdate) {
          // Atualizar o banco para não repetir a notificação
          await supabase
            .from('assignments')
            .update({ result_data: { ...data, repetition: updatedRepetition } })
            .eq('id', assignment.id);
        }
      }
    } catch (err) {
      console.error('[SRSManager] Error checking revisions:', err);
    }
  };

  return null; // Componente invisível
};
