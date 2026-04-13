import { supabase } from './supabase';

export interface LessonLog {
  id: string;
  teacher_id: string;
  student_id: string;
  topics: string[];
  notes: string | null;
  date: string;
  created_at: string;
}

export const lessonLogService = {
  async listForStudent(studentId: string): Promise<LessonLog[]> {
    const { data, error } = await supabase
      .from('lesson_logs')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching lesson logs:', error);
      return [];
    }
    return data as LessonLog[];
  },

  async create(log: Omit<LessonLog, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('lesson_logs')
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return data as LessonLog;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('lesson_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
