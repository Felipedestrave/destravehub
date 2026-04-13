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
      const { data: studentRecord } = await supabase
        .from('students')
        .select('id')
        .eq('student_id', session.user.id)
        .single();

      if (studentRecord) {
        const logData = await lessonLogService.listForStudent(studentRecord.id);
        setLogs(logData);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
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
              {logs.map(log => (
                <div key={log.id} className="relative sm:pl-20">
                  {/* Timeline dot */}
                  <div className="absolute left-[29px] top-2 w-3 h-3 rounded-full bg-brand border-4 border-white shadow-sm z-10 hidden sm:block" />
                  
                  <div className="bg-white rounded-2xl border-2 border-slate-border p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-slate-mid text-xs font-bold mb-4">
                        <Calendar size={14} />
                        {new Date(log.date).toLocaleDateString('pt-BR')}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {log.topics.map((t, idx) => (
                        <span key={idx} className="bg-brand/5 text-brand text-[10px] uppercase font-black px-2 py-1 rounded border border-brand/10">
                          {t}
                        </span>
                      ))}
                    </div>

                    {log.notes && (
                      <div className="p-4 bg-ice rounded-xl border border-slate-border/50">
                        <p className="text-slate-dark text-sm leading-relaxed">
                          {log.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
