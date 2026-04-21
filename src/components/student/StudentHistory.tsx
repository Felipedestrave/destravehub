import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { lessonLogService, type LessonLog } from '../../lib/lesson-logs';
import { Calendar, BookOpen, Clock, Target, Rocket, ChevronDown, CheckCircle2, AlertCircle, MessageSquare, Star } from 'lucide-react';

interface AssignmentWithActivity {
  id: string;
  status: string;
  completed_at: string;
  result_data: any;
  activities: {
    title: string;
    type: string;
    config: any;
  };
}

export const StudentHistory: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<LessonLog[]>([]);
  const [missions, setMissions] = useState<AssignmentWithActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMission, setExpandedMission] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'logs' | 'missions'>('logs');

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
        // Fetch lesson logs
        const logData = await lessonLogService.listForStudent(studentRecord.id);
        setLogs(logData);

        // Fetch completed missions
        const { data: missionData } = await supabase
            .from('assignments')
            .select('*, activities(title, type, config)')
            .eq('student_id', studentRecord.id)
            .eq('status', 'completed')
            .order('completed_at', { ascending: false });
        
        setMissions((missionData || []).filter(m => m.activities) as AssignmentWithActivity[]);
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
          <p className="text-xs font-bold text-slate-mid uppercase">Missões Realizadas</p>
          <p className="font-outfit text-3xl font-black text-slate-dark">{missions.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'logs' ? 'bg-white text-brand shadow-sm' : 'text-slate-mid hover:text-slate-dark'}`}
        >
          Notas de Aula
        </button>
        <button 
          onClick={() => setActiveTab('missions')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'missions' ? 'bg-white text-brand shadow-sm' : 'text-slate-mid hover:text-slate-dark'}`}
        >
          Minhas Missões
        </button>
      </div>

      {activeTab === 'logs' ? (
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
                            <p className="text-slate-dark text-sm leading-relaxed whitespace-pre-line">{summary}</p>
                          </div>
                        )}
                        {plan && (
                          <div className="p-4 bg-brand/5 rounded-2xl border border-brand/20">
                            <h4 className="text-brand font-black text-[10px] uppercase mb-2 flex items-center gap-1">
                              <Target size={12} /> Plano para a próxima aula
                            </h4>
                            <p className="text-slate-dark text-sm leading-relaxed italic">{plan}</p>
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
      ) : (
        /* Mission History Section */
        <div className="space-y-6">
          <h2 className="font-outfit text-2xl font-black text-slate-dark flex items-center gap-2">
              <Star size={24} className="text-orange-500" /> Missões Concluídas
          </h2>

          {missions.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border-2 border-slate-border border-dashed text-slate-mid">
              Você ainda não completou nenhuma missão. Vamos começar?
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {missions.map(mission => (
                <div key={mission.id} className="bg-white rounded-3xl border-2 border-slate-border overflow-hidden">
                  <div 
                    className="p-6 cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between"
                    onClick={() => setExpandedMission(expandedMission === mission.id ? null : mission.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-ice rounded-2xl flex items-center justify-center text-2xl">
                        {mission.activities.type === 'destrave1' ? '📝' : mission.activities.type === 'escuta' ? '🎧' : '🎭'}
                      </div>
                      <div>
                        <h3 className="font-outfit text-lg font-black text-slate-dark leading-none mb-1">{mission.activities.title}</h3>
                        <p className="text-[10px] font-bold text-slate-mid uppercase tracking-widest">
                          {new Date(mission.completed_at).toLocaleDateString('pt-BR')} • SCORE: {mission.result_data.score}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       {mission.result_data.reviewed_at && (
                         <span className="text-[9px] font-black bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200 uppercase">Sensei Revisou</span>
                       )}
                       <ChevronDown className={`text-slate-mid transition-transform ${expandedMission === mission.id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Feedback Details */}
                  {expandedMission === mission.id && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-border/50 bg-[var(--color-ice)]/30 animate-fade-down">
                      {mission.activities.type === 'destrave1' ? (
                        <div className="space-y-4 py-4">
                          <h4 className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-2">
                             <MessageSquare size={14} /> Feedback do Professor
                          </h4>
                          
                          <div className="space-y-6">
                            {mission.result_data.history?.map((ans: any, idx: number) => {
                              const qConfig = mission.activities.config.questions.find((q: any) => q.id === ans.questionId);
                              return (
                                <div key={ans.questionId} className="bg-white p-5 rounded-2xl border border-slate-border shadow-sm">
                                  <div className="flex justify-between items-start mb-3">
                                    <p className="text-sm font-bold text-slate-dark">Questão {idx + 1}: {qConfig?.question}</p>
                                    <div className="flex items-center gap-2">
                                       {ans.isCorrect ? <CheckCircle2 className="text-green-500" size={18} /> : <AlertCircle className="text-red-500" size={18} />}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-3">
                                    <div className="bg-slate-50 p-3 rounded-xl">
                                      <p className="text-slate-mid font-bold uppercase text-[9px] mb-1">Sua Resposta:</p>
                                      <p className="text-slate-dark italic">{ans.textAnswer || mission.activities.config.questions.find((q:any)=>q.id === ans.questionId)?.options[ans.selectedOptionIndex]}</p>
                                    </div>
                                    <div className="bg-green-50/50 p-3 rounded-xl border border-green-100">
                                      <p className="text-green-700 font-bold uppercase text-[9px] mb-1">Gabarito:</p>
                                      <p className="text-green-800">{qConfig?.expectedAnswer || qConfig?.options[qConfig?.correctOptionIndex]}</p>
                                    </div>
                                  </div>

                                  {ans.teacherComment && (
                                    <div className="mt-3 p-4 bg-orange-50 rounded-xl border border-orange-200 flex gap-3">
                                      <div className="text-lg">👨‍🏫</div>
                                      <div>
                                        <p className="text-[9px] font-black text-orange-700 uppercase mb-1">Nota do Sensei:</p>
                                        <p className="text-sm font-medium text-orange-900 leading-relaxed">{ans.teacherComment}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="p-12 text-center text-slate-mid text-sm italic">
                           Detalhes desta modalidade de missão em breve. Sua nota final foi de {mission.result_data.score}%.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
