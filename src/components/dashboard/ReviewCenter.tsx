import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckCircle, Clock, MessageSquare, ChevronRight, Search, Filter, AlertCircle, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Destrave1UserAnswer, ReviewStatus } from '../../types/destrave1';

interface ReviewAssignment {
  id: string;
  student_id: string;
  completed_at: string;
  result_data: any;
  activities: {
    title: string;
    type: string;
    config: any;
  };
  students: {
    name: string;
  };
}

export const ReviewCenter: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<ReviewAssignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<ReviewAssignment | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [filter, setFilter] = useState<'pending' | 'reviewed' | 'all'>('pending');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('assignments')
        .select('id, student_id, completed_at, result_data, activities(title, type, config), students(name)')
        .eq('status', 'completed')
        .eq('activities.type', 'destrave1')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      
      // Filtrar no JS para garantir que ignoramos nulos do join
      setAssignments((data || []).filter(a => a.activities) as ReviewAssignment[]);
    } catch (err: any) {
      toast.error('Erro ao carregar revisões: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPendingCount = (assignment: ReviewAssignment) => {
    const history = assignment.result_data?.history || [];
    return history.filter((a: any) => a.reviewStatus === 'pending_review').length;
  };

  const filteredMissions = assignments.filter(a => {
    const pending = getPendingCount(a);
    if (filter === 'pending') return pending > 0;
    if (filter === 'reviewed') return pending === 0;
    return true;
  });

  const handleUpdateReview = (questionId: string, status: ReviewStatus, comment: string, isCorrect: boolean) => {
    if (!selectedAssignment) return;

    const newHistory = selectedAssignment.result_data.history.map((h: Destrave1UserAnswer) => {
      if (h.questionId === questionId) {
        return { ...h, reviewStatus: status, teacherComment: comment, isCorrect };
      }
      return h;
    });

    setSelectedAssignment({
      ...selectedAssignment,
      result_data: { ...selectedAssignment.result_data, history: newHistory }
    });
  };

  const saveReview = async () => {
    if (!selectedAssignment) return;
    
    try {
      setIsSaving(true);
      const newScore = selectedAssignment.result_data.history.filter((h: any) => h.isCorrect).length;
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/missions/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          assignmentId: selectedAssignment.id,
          history: selectedAssignment.result_data.history,
          score: Math.round((newScore / selectedAssignment.result_data.history.length) * 100)
        })
      });

      if (!response.ok) throw new Error('Erro ao salvar review');

      toast.success('Revisão salva com sucesso!');
      fetchAssignments(); // Atualiza lista
      setSelectedAssignment(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center animate-pulse text-[var(--color-slate-mid)]">Carregando central de revisão...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-6 flex flex-col gap-6">
      {!selectedAssignment ? (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-[var(--color-slate-border)] shadow-sm">
            <div>
              <h1 className="text-2xl font-black font-outfit text-[var(--color-slate-dark)]">Central de Revisão 📝</h1>
              <p className="text-sm text-[var(--color-slate-mid)]">Avalie as respostas discursivas dos seus alunos e dê feedbacks personalizados.</p>
            </div>
            
            <div className="flex bg-[var(--color-ice)] p-1 rounded-xl border border-[var(--color-slate-border)]">
              {(['pending', 'reviewed', 'all'] as const).map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-white text-[var(--color-brand)] shadow-sm' : 'text-[var(--color-slate-mid)] opacity-60'}`}
                >
                  {f === 'pending' ? 'Pendentes' : f === 'reviewed' ? 'Revisados' : 'Todos'}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          {filteredMissions.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-[var(--color-slate-border)] p-20 text-center flex flex-col items-center gap-4">
               <div className="w-16 h-16 bg-[var(--color-ice)] rounded-full flex items-center justify-center text-3xl">☕</div>
               <h3 className="font-bold text-lg text-[var(--color-slate-dark)]">Tudo limpo por aqui!</h3>
               <p className="text-[var(--color-slate-mid)] max-w-xs mx-auto">Não há missões pendentes de revisão com o filtro atual.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMissions.map((item) => {
                const pending = getPendingCount(item);
                return (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedAssignment(item)}
                    className="group bg-white border border-[var(--color-slate-border)] rounded-2xl p-5 hover:border-[var(--color-brand)] hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                  >
                    {pending > 0 && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-sm animate-pulse">
                        {pending} PENDENTE{pending > 1 ? 'S' : ''}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 bg-[var(--color-ice)] rounded-xl flex items-center justify-center text-xl">
                         {pending > 0 ? '📝' : '✅'}
                       </div>
                       <div>
                         <h4 className="font-bold text-[var(--color-slate-dark)] truncate max-w-[180px]">{item.students?.name}</h4>
                         <p className="text-[10px] text-[var(--color-slate-mid)] font-bold uppercase tracking-wider">
                           {new Date(item.completed_at).toLocaleDateString('pt-BR')} às {new Date(item.completed_at).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit'})}
                         </p>
                       </div>
                    </div>

                    <div className="bg-[var(--color-ice)] p-3 rounded-xl mb-4 border border-transparent group-hover:border-[var(--color-brand)]/20 transition-colors">
                      <p className="text-xs font-bold text-[var(--color-slate-mid)] mb-1 uppercase tracking-tighter">Atividade</p>
                      <p className="text-sm font-bold text-[var(--color-slate-dark)] line-clamp-1">{item.activities.title}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold">
                       <span className="text-[var(--color-slate-mid)]">Score Atual: <span className="text-[var(--color-brand)]">{item.result_data.score}%</span></span>
                       <span className="flex items-center gap-1 text-[var(--color-brand)] opacity-0 group-hover:opacity-100 transition-opacity">
                         Revisar <ChevronRight size={14} />
                       </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Detailed Review View */
        <div className="flex flex-col gap-6 animate-fade-up">
           <button 
             onClick={() => setSelectedAssignment(null)}
             className="self-start flex items-center gap-2 text-sm font-bold text-[var(--color-slate-mid)] hover:text-[var(--color-brand)] transition-colors"
           >
             <ChevronRight size={16} className="rotate-180" /> Voltar para a lista
           </button>

           <div className="bg-white rounded-3xl border border-[var(--color-slate-border)] shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
              {/* Sidebar do Detalhe */}
              <div className="w-full md:w-80 bg-[var(--color-ice)] p-8 border-r border-[var(--color-slate-border)] flex flex-col gap-6">
                 <div className="flex flex-col items-center text-center gap-3">
                   <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center text-4xl">👨‍🎓</div>
                   <div>
                     <h2 className="text-xl font-black font-outfit text-[var(--color-slate-dark)]">{selectedAssignment.students.name}</h2>
                     <p className="text-[10px] font-bold text-[var(--color-slate-mid)] uppercase tracking-widest">Aluno(a)</p>
                   </div>
                 </div>

                 <div className="space-y-4 mt-4">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-[var(--color-slate-border)]">
                      <h4 className="text-[10px] font-black text-[var(--color-slate-mid)] uppercase mb-1">Missão</h4>
                      <p className="text-sm font-bold text-[var(--color-slate-dark)]">{selectedAssignment.activities.title}</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-[var(--color-slate-border)]">
                      <h4 className="text-[10px] font-black text-[var(--color-slate-mid)] uppercase mb-1">Score Calculado</h4>
                      <p className="text-2xl font-black text-[var(--color-brand)]">
                        {Math.round((selectedAssignment.result_data.history.filter((h: any) => h.isCorrect).length / selectedAssignment.result_data.history.length) * 100)}%
                      </p>
                    </div>
                 </div>

                 <button 
                   onClick={saveReview}
                   disabled={isSaving}
                   className="mt-auto w-full bg-[var(--color-brand)] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--color-action)] transition-all shadow-lg shadow-[var(--color-brand)]/20 disabled:opacity-50"
                 >
                   {isSaving ? 'Salvando...' : <><Save size={18} /> Finalizar Revisão</>}
                 </button>
              </div>

              {/* Área de Scrutiny (Revisão uma por uma) */}
              <div className="flex-1 p-8 overflow-y-auto max-h-[800px] custom-scrollbar">
                 <h3 className="text-lg font-black text-[var(--color-slate-dark)] mb-6 flex items-center gap-2">
                   <AlertCircle size={20} className="text-[var(--color-brand)]" /> Itens de Resposta
                 </h3>

                 <div className="flex flex-col gap-8">
                    {selectedAssignment.result_data.history.map((answer: Destrave1UserAnswer, idx: number) => {
                       const question = (selectedAssignment.activities.config.questions as any[]).find(q => q.id === answer.questionId);
                       if (!question) return null;

                       return (
                         <div key={answer.questionId} className={`p-6 rounded-2xl border-2 transition-all ${answer.reviewStatus === 'pending_review' ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/[0.02]' : 'border-[var(--color-slate-border)] bg-white opacity-80'}`}>
                            <div className="flex items-start justify-between gap-4 mb-4">
                               <div className="flex items-center gap-2">
                                  <span className="w-7 h-7 bg-[var(--color-slate-dark)] text-white text-xs font-black rounded-lg flex items-center justify-center">{idx + 1}</span>
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${answer.questionType === 'multiple_choice' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {answer.questionType === 'multiple_choice' ? 'Múltipla Escolha' : 'Discursiva'}
                                  </span>
                               </div>
                               {answer.reviewStatus !== 'pending_review' && (
                                 <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                   <CheckCircle size={12} /> REVISADO
                                 </span>
                               )}
                            </div>

                            <p className="text-lg font-medium text-[var(--color-slate-dark)] mb-6">{question.question}</p>

                            {answer.questionType === 'multiple_choice' ? (
                              <div className="bg-[var(--color-ice)] p-4 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-[var(--color-slate-mid)]">O aluno marcou:</span>
                                  <span className={`font-bold ${answer.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                    {question.options[answer.selectedOptionIndex || 0]}
                                  </span>
                                </div>
                                {!answer.isCorrect && (
                                   <div className="flex items-center gap-2 text-sm border-t border-[var(--color-slate-border)]/50 pt-2">
                                      <span className="text-[var(--color-slate-mid)]">Correta seria:</span>
                                      <span className="font-bold text-green-600">{question.options[question.correctOptionIndex]}</span>
                                   </div>
                                )}
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                 <div className="p-4 bg-white border border-[var(--color-slate-border)] rounded-xl">
                                    <h5 className="text-[10px] font-black text-[var(--color-slate-mid)] uppercase mb-2">Resposta do Aluno:</h5>
                                    <p className="text-sm font-medium italic">"{answer.textAnswer}"</p>
                                    <div className="mt-3 flex items-center gap-2">
                                       <span className="text-[10px] font-bold text-[var(--color-slate-mid)]">Autoavaliação:</span>
                                       <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${answer.autoEvaluation === 'correct' ? 'bg-green-50 text-green-600 border-green-200' : answer.autoEvaluation === 'close' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                         {answer.autoEvaluation === 'correct' ? 'ACERTEI' : answer.autoEvaluation === 'close' ? 'CHEGUEI PERTO' : 'ERREI'}
                                       </span>
                                    </div>
                                 </div>
                                 <div className="p-4 bg-[var(--color-ice)] border border-[var(--color-brand)]/20 rounded-xl relative overflow-hidden">
                                     <div className="absolute top-0 right-0 bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-[8px] font-black px-2 py-0.5 rounded-bl shadow-sm">SENSEI GABARITO</div>
                                     <h5 className="text-[10px] font-black text-[var(--color-brand)] uppercase mb-2">Esperado:</h5>
                                     <p className="text-sm font-bold text-[var(--color-slate-dark)]">{question.expectedAnswer}</p>
                                 </div>
                              </div>
                            )}

                            {/* Actions for Review */}
                            <div className="border-t border-[var(--color-slate-border)] pt-6 mt-4">
                               <div className="flex flex-col md:flex-row gap-6">
                                  <div className="flex-1">
                                     <label className="text-[10px] font-black text-[var(--color-slate-mid)] uppercase mb-2 block tracking-widest">Feedback / Comentário (Opcional)</label>
                                     <input 
                                       type="text" 
                                       placeholder="Ex: Muito bom, mas cuidado com a conjugação do verbo..."
                                       value={answer.teacherComment || ''}
                                       onChange={(e) => handleUpdateReview(answer.questionId, answer.reviewStatus || 'approved', e.target.value, answer.isCorrect)}
                                       className="w-full bg-[var(--color-ice)] border border-[var(--color-slate-border)] p-3 rounded-xl text-sm focus:outline-none focus:border-[var(--color-brand)]"
                                     />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                     <label className="text-[10px] font-black text-[var(--color-slate-mid)] uppercase mb-2 block tracking-widest">Veredito Final</label>
                                     <div className="flex gap-2">
                                        <button 
                                          onClick={() => handleUpdateReview(answer.questionId, 'approved', answer.teacherComment || '', true)}
                                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${answer.isCorrect && answer.reviewStatus !== 'pending_review' ? 'bg-green-600 text-white border-green-600 shadow-md transform scale-105' : 'bg-white text-green-600 border-green-600 hover:bg-green-50'}`}
                                        >
                                          <CheckCircle size={14} /> Correto
                                        </button>
                                        <button 
                                          onClick={() => handleUpdateReview(answer.questionId, 'rejected', answer.teacherComment || '', false)}
                                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${!answer.isCorrect && answer.reviewStatus !== 'pending_review' ? 'bg-red-600 text-white border-red-600 shadow-md transform scale-105' : 'bg-white text-red-600 border-red-600 hover:bg-red-50'}`}
                                        >
                                          <AlertCircle size={14} /> Incorreto
                                        </button>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                       );
                    })}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Grid Background Decoration */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>
    </div>
  );
};
