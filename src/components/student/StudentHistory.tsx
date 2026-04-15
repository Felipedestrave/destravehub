import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { lessonLogService, type LessonLog } from '../../lib/lesson-logs';
import { Calendar, BookOpen, Clock, Target, Rocket } from 'lucide-react';

export const StudentHistory: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<LessonLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Get profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setProfile(profileData);

      // 2. Find student record to get ID
      const { data: studentRecord, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('student_id', session.user.id)
        .single();

      if (studentError) {
        console.warn('Student record not found for this user:', studentError);
        return;
      }

      if (studentRecord) {
        const logData = await lessonLogService.listForStudent(studentRecord.id);
        console.log('Logs found for student:', logData.length);
        setLogs(logData);
      }
    } catch (err: any) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseNotes = (notes: string | null) => {
    if (!notes) return { summary: '', engagement: '', plan: '' };
    try {
      if (notes.startsWith('{')) {
        const parsed = JSON.parse(notes);
        return {
          summary: parsed.general_notes || '',
          engagement: parsed.engagement || '',
          plan: parsed.next_class_plan || ''
        };
      }
      return { summary: notes, engagement: '', plan: '' };
    } catch {
      return { summary: notes, engagement: '', plan: '' };
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-mid">Recuperando memórias...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border-2 border-slate-border p-6 shadow-sm border-b-4 border-b-brand">
          <Rocket className="text-brand mb-2" size={24} />
          <p className="text-xs font-bold text-slate-mid uppercase">XP Total</p>
          <p className="font-outfit text-3xl font-black text-slate-dark">{profile?.xp || 0}</p>
        </div>
        <div className="bg-white rounded-3xl border-2 border-slate-border p-6 shadow-sm border-b-4 border-b-blue-500">
          <Clock className="text-blue-500 mb-2" size={24} />
          <p className="text-xs font-bold text-slate-mid uppercase">Aulas Concluídas</p>
          <p className="font-outfit text-3xl font-black text-slate-dark">{profile?.attendance_streak || 0}</p>
        </div>
        <div className="bg-white rounded-3xl border-2 border-slate-border p-6 shadow-sm border-b-4 border-b-green-500">
          <Target className="text-green-500 mb-2" size={24} />
          <p className="text-xs font-bold text-slate-mid uppercase">Nível Atual</p>
          <p className="font-outfit text-3xl font-black text-slate-dark">{profile?.role === 'student' ? 'Gakusei' : 'Sensei'}</p>
        </div>
      </div>

      {/* Lesson Logs */}
      <div className="space-y-6">
        <h2 className="font-outfit text-2xl font-black text-slate-dark flex items-center gap-2">
            <BookOpen size={24} className="text-brand" /> Registro do Sensei
        </h2>

        {logs.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border-2 border-slate-border border-dashed text-slate-mid">
            Seu professor ainda não registrou notas de aula. Continue praticando!
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-100 hidden sm:block" />
            
            <div className="space-y-8">
              {logs.map(log => {
                const { summary, engagement, plan } = parseNotes(log.notes);
                return (
                  <div key={log.id} className="relative sm:pl-20">
                    {/* Timeline dot */}
                    <div className="absolute left-[29px] top-2 w-3 h-3 rounded-full bg-brand border-4 border-white shadow-sm z-10 hidden sm:block" />
                    
                    <div className="bg-white rounded-3xl border-2 border-slate-border p-6 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-slate-mid text-xs font-bold">
                            <Calendar size={14} />
                            {new Date(log.created_at).toLocaleDateString('pt-BR')}
                        </div>
                        {engagement && (
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                             engagement === 'alto' ? 'bg-green-100 text-green-700' :
                             engagement === 'médio' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            Engajamento {engagement}
                          </span>
                        )}
                      </div>

                      <h3 className="font-outfit text-xl font-black text-slate-dark mb-2">{log.topics}</h3>

                      {summary && (
                        <div className="p-4 bg-ice rounded-2xl border border-slate-border/50 mb-4">
                          <p className="text-slate-dark text-sm leading-relaxed whitespace-pre-line">
                            {summary}
                          </p>
                        </div>
                      )}

                      {plan && (
                        <div className="p-4 bg-brand/5 rounded-2xl border border-brand/20">
                          <h4 className="text-brand font-black text-[10px] uppercase mb-2 flex items-center gap-1">
                            <Target size={12} /> Plano para a próxima aula
                          </h4>
                          <p className="text-slate-dark text-sm leading-relaxed italic">
                            {plan}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
