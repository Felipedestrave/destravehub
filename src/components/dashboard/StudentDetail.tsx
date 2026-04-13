import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { lessonLogService, type LessonLog } from '../../lib/lesson-logs';
import { Calendar, BookOpen, Plus, Trash2, TrendingUp, Award, Clock } from 'lucide-react';

interface Props {
  studentId: string;
}

export const StudentDetail: React.FC<Props> = ({ studentId }) => {
  const [student, setStudent] = useState<any>(null);
  const [logs, setLogs] = useState<LessonLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddLog, setShowAddLog] = useState(false);
  
  // Form state
  const [newTopics, setNewTopics] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: studentData } = await supabase
        .from('students')
        .select('*, profiles:student_id(avatar_url, xp, coins, attendance_streak)')
        .eq('id', studentId)
        .single();
      
      setStudent(studentData);
      const logData = await lessonLogService.listForStudent(studentId);
      setLogs(logData);
    } catch (err) {
      console.error('Error fetching student details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const topicsArray = newTopics.split(',').map(t => t.trim()).filter(Boolean);
      
      await lessonLogService.create({
        student_id: studentId,
        teacher_id: session.user.id,
        topics: topicsArray,
        notes: newNotes,
        date: new Date().toISOString()
      });

      setNewTopics("");
      setNewNotes("");
      setShowAddLog(false);
      fetchData(); // Refresh list
    } catch (err) {
      alert('Erro ao salvar log.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm('Deseja excluir este log?')) return;
    try {
      await lessonLogService.delete(id);
      setLogs(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      alert('Erro ao excluir log.');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-mid">Carregando mestre...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Aluno não encontrado.</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* --- Header / Summary --- */}
      <div className="bg-white rounded-3xl border-2 border-slate-border p-6 shadow-xl flex flex-col md:flex-row gap-6 items-center">
        <div className="w-24 h-24 bg-brand rounded-2xl flex items-center justify-center text-3xl text-white font-black shadow-lg">
          {student.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-outfit text-3xl font-black text-slate-dark">{student.name}</h1>
          <p className="text-slate-mid font-bold flex items-center justify-center md:justify-start gap-2">
            <span className={`px-2 py-1 rounded bg-slate-100 text-xs border border-slate-200`}>
                {student.level || 'N5'}
            </span>
            • {student.language || 'Japonês'}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-ice px-4 py-2 rounded-2xl border border-slate-border text-center min-w-[80px]">
            <TrendingUp size={16} className="mx-auto text-brand mb-1" />
            <span className="block text-xs font-bold text-slate-mid uppercase">XP</span>
            <span className="block font-outfit font-black text-slate-dark">{student.profiles?.xp || 0}</span>
          </div>
          <div className="bg-ice px-4 py-2 rounded-2xl border border-slate-border text-center min-w-[80px]">
            <Clock size={16} className="mx-auto text-blue-500 mb-1" />
            <span className="block text-xs font-bold text-slate-mid uppercase">Aulas</span>
            <span className="block font-outfit font-black text-slate-dark">{student.profiles?.attendance_streak || 0}</span>
          </div>
        </div>
      </div>

      {/* --- Evolution Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lesson Logs Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="font-outfit text-xl font-black text-slate-dark flex items-center gap-2">
              <BookOpen size={20} className="text-brand" /> Registro do Sensei
            </h2>
            <button 
              onClick={() => setShowAddLog(!showAddLog)}
              className="px-4 py-2 bg-brand text-white rounded-xl font-outfit font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Plus size={16} /> Novo Log
            </button>
          </div>

          {showAddLog && (
            <form onSubmit={handleAddLog} className="bg-white border-2 border-brand/20 rounded-2xl p-6 shadow-lg animate-bounce-in space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-mid uppercase mb-1">Tópicos Abordados (separados por vírgula)</label>
                <input 
                  type="text" 
                  value={newTopics}
                  onChange={(e) => setNewTopics(e.target.value)}
                  placeholder="ex: Verbo Taberu, Kanji de Água, Partículas..."
                  className="w-full border-2 border-slate-border rounded-xl p-3 outline-none focus:border-brand font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-mid uppercase mb-1">Notas Pedagógicas / Próximos Passos</label>
                <textarea 
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full border-2 border-slate-border rounded-xl p-3 outline-none focus:border-brand font-medium h-24 resize-none"
                  placeholder="O aluno teve dificuldade com..."
                />
              </div>
              <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowAddLog(false)} className="px-5 py-2 text-slate-mid font-bold hover:text-slate-dark transition-colors">Cancelar</button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-brand text-white rounded-xl font-outfit font-bold hover:opacity-90 transition-opacity">
                    {isSubmitting ? 'Salvando...' : 'Salvar Log'}
                  </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {logs.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border-2 border-slate-border border-dashed text-slate-mid">
                Nenhum log de aula registrado ainda. Comece hoje!
              </div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="bg-white rounded-2xl border border-slate-border p-5 shadow-sm group hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand/30" />
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-slate-mid text-xs font-bold">
                        <Calendar size={14} />
                        {new Date(log.date).toLocaleDateString('pt-BR')}
                    </div>
                    <button 
                      onClick={() => handleDeleteLog(log.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-border hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {log.topics.map((t, idx) => (
                      <span key={idx} className="bg-brand/5 text-brand text-[10px] uppercase font-black px-2 py-0.5 rounded border border-brand/10">
                        {t}
                      </span>
                    ))}
                  </div>

                  {log.notes && (
                    <p className="text-slate-dark text-sm leading-relaxed bg-ice p-3 rounded-xl border border-slate-border/50">
                      {log.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats / Evolution Card */}
        <div className="space-y-4">
            <h2 className="font-outfit text-xl font-black text-slate-dark flex items-center gap-2 px-2">
              <Award size={20} className="text-brand" /> Visão Geral
            </h2>
            <div className="bg-white rounded-3xl border-2 border-slate-border p-6 shadow-sm space-y-6">
                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-mid uppercase">Desempenho Geral</p>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-border">
                        <div className="h-full bg-brand" style={{ width: '65%' }} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-mid text-right italic">Baseado em XP acumulada</p>
                </div>

                <div className="space-y-3">
                     <p className="text-xs font-bold text-slate-mid uppercase">Histórico de Tópicos</p>
                     <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(logs.flatMap(l => l.topics))).slice(0, 10).map((t, i) => (
                           <span key={i} className="text-[10px] font-bold text-slate-dark bg-slate-100 py-1 px-2 rounded-lg border border-slate-border">
                                {t}
                           </span>
                        ))}
                        {logs.length === 0 && <span className="text-xs italic text-slate-mid">Sem dados ainda</span>}
                     </div>
                </div>

                <div className="p-4 bg-ice rounded-2xl border border-slate-border/50">
                    <p className="text-xs font-bold text-brand uppercase mb-1">Dica do Sensei</p>
                    <p className="text-xs text-slate-mid leading-relaxed">
                        Este aluno está demonstrando consistência. Considere introduzir novos cards de N4.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
