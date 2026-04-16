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
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddLog, setShowAddLog] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  
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
        .select('*, profiles:student_id(id, avatar_url, xp, coins, attendance_streak)')
        .eq('id', studentId)
        .single();
      
      setStudent(studentData);
      
      if (studentData?.student_id) {
        fetchWalletHistory(studentData.student_id);
      }

      const logData = await lessonLogService.listForStudent(studentId);
      setLogs(logData);
    } catch (err) {
      console.error('Error fetching student details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletHistory = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`/api/wallet/history?userId=${userId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      if (res.ok) setTransactions(data.transactions || []);
    } catch (err) {}
  };

  const handleAdjustBalance = async (amount: number, description?: string) => {
    if (!student?.profiles?.id) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/wallet/adjust', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          targetUserId: student.profiles.id,
          amount,
          description
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state
        setStudent((prev: any) => ({
          ...prev,
          profiles: { ...prev.profiles, coins: data.newBalance }
        }));
        fetchWalletHistory(student.profiles.id);
      } else {
        alert('Erro ao atualizar saldo.');
      }
    } catch (err) {
      alert('Erro de conexão.');
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
        topics: JSON.stringify(topicsArray),
        notes: newNotes
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
      setLogs((prev: any[]) => prev.filter(l => l.id !== id));
    } catch (err) {
      alert('Erro ao excluir log.');
    }
  };

  const parseTopics = (topics: string): string[] => {
    try {
      const parsed = JSON.parse(topics);
      return Array.isArray(parsed) ? parsed : [topics];
    } catch (e) {
      return topics ? [topics] : [];
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-mid">Carregando mestre...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Aluno não encontrado.</div>;

  return (
    <>
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
                          {new Date(log.created_at || '').toLocaleDateString('pt-BR')}
                      </div>
                      <button 
                        onClick={() => handleDeleteLog(log.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-border hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {parseTopics(log.topics).map((t, idx) => (
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
                          {Array.from(new Set(logs.flatMap(l => parseTopics(l.topics)))).slice(0, 10).map((t, i) => (
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

              {/* WALLET CONTROL */}
              <h2 className="font-outfit text-xl font-black text-slate-dark flex items-center gap-2 px-2 pt-4">
                <TrendingUp size={20} className="text-brand" /> Central de Economia
              </h2>
              <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white space-y-6 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand/20 blur-3xl rounded-full" />
                  
                  {/* Balance & Quick Actions */}
                  <div className="relative z-10 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                          <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saldo Atual</p>
                              <h3 className="text-3xl font-black font-outfit text-brand-orange flex items-center gap-2">
                                  🪙 {student.profiles?.coins || 0}
                              </h3>
                          </div>
                      </div>

                      <div className="space-y-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Créditos Rapidamente</p>
                          <div className="flex justify-center gap-2">
                              {[10, 25, 50].map(amt => (
                                  <button 
                                      key={amt}
                                      type="button"
                                      onClick={() => handleAdjustBalance(amt, `Bonificação de ${amt} Moedas`)}
                                      className="flex-1 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl font-black text-xs hover:bg-emerald-500 hover:text-white transition-all"
                                  >+{amt}</button>
                              ))}
                          </div>
                      </div>

                      <div className="space-y-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Débitos Rapidamente</p>
                          <div className="flex justify-center gap-2">
                              {[10, 25, 50].map(amt => (
                                  <button 
                                      key={amt}
                                      type="button"
                                      onClick={() => handleAdjustBalance(-amt, `Ajuste de -${amt} Moedas`)}
                                      className="flex-1 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl font-black text-xs hover:bg-rose-500 hover:text-white transition-all"
                                  >-{amt}</button>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* CUSTOM ADJUSTMENT FORM */}
                  <div className="relative z-10 bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ajuste Personalizado</p>
                      
                      <div className="space-y-3">
                          <div>
                            <label className="text-[9px] font-black text-brand uppercase ml-1 mb-1 block">Quantidade de Moedas</label>
                            <input 
                                type="number" 
                                id="custom-coin-amount"
                                placeholder="0"
                                className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-3 text-lg font-black outline-none focus:border-brand text-brand-orange"
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-black text-slate-500 uppercase ml-1 mb-1 block">Motivo do Ajuste</label>
                            <input 
                                type="text" 
                                id="custom-coin-reason"
                                placeholder="Ex: Prêmio de Conversação..."
                                className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-3 text-sm font-bold outline-none focus:border-brand text-slate-200"
                            />
                          </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                          <button 
                              type="button"
                              onClick={() => {
                                  const amtInput = document.getElementById('custom-coin-amount') as HTMLInputElement;
                                  const reasonInput = document.getElementById('custom-coin-reason') as HTMLInputElement;
                                  const amt = parseInt(amtInput.value);
                                  const reason = reasonInput.value;
                                  if (!isNaN(amt)) {
                                    handleAdjustBalance(amt, reason || 'Crédito manual');
                                    amtInput.value = '';
                                    reasonInput.value = '';
                                  }
                              }}
                              className="flex-1 py-3 bg-brand text-white rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-brand/20 active:scale-95"
                          >Aplicar Crédito</button>
                          <button 
                              type="button"
                              onClick={() => {
                                  const amtInput = document.getElementById('custom-coin-amount') as HTMLInputElement;
                                  const reasonInput = document.getElementById('custom-coin-reason') as HTMLInputElement;
                                  const amt = parseInt(amtInput.value);
                                  const reason = reasonInput.value;
                                  if (!isNaN(amt)) {
                                    handleAdjustBalance(-amt, reason || 'Débito manual');
                                    amtInput.value = '';
                                    reasonInput.value = '';
                                  }
                              }}
                              className="flex-1 py-3 bg-slate-700 text-slate-200 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-600 transition-all active:scale-95"
                          >Aplicar Débito</button>
                      </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 relative z-10">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Últimas Movimentações</p>
                        <button 
                          onClick={() => setShowFullHistory(true)}
                          className="text-[10px] font-black text-brand uppercase hover:underline"
                        >Ver Tudo</button>
                      </div>

                      <div className="space-y-2">
                          {transactions.length === 0 ? (
                              <p className="text-[10px] italic text-slate-500">Nenhuma movimentação manual.</p>
                          ) : (
                              transactions.slice(0, 5).map(tx => (
                                  <div key={tx.id} className="flex justify-between items-center text-[10px] bg-white/5 p-2 rounded-lg border border-white/5">
                                      <div className="flex flex-col">
                                          <span className="font-bold text-slate-200">{tx.description}</span>
                                          <span className="text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</span>
                                      </div>
                                      <span className={`font-black ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                                      </span>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>

      {/* FULL HISTORY MODAL */}
      {showFullHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border-2 border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-bounce-in">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="font-outfit text-xl font-black text-white">Histórico de Empenho</h3>
                <p className="text-xs text-slate-400 font-bold uppercase">{student.name}</p>
              </div>
              <button 
                onClick={() => setShowFullHistory(false)}
                className="w-10 h-10 bg-white/5 text-slate-400 rounded-xl flex items-center justify-center hover:bg-white/10 hover:text-white transition-all"
              >✕</button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto ap-scrollbar space-y-3">
              {transactions.map(tx => (
                <div key={tx.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex justify-between items-center group hover:border-brand/30 transition-all">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-100">{tx.description}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                      <Calendar size={12} />
                      {new Date(tx.created_at).toLocaleDateString('pt-BR')} às {new Date(tx.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className={`text-lg font-black ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-center py-10 text-slate-500 font-bold italic">Nenhum registro encontrado.</p>
              )}
            </div>

            <div className="p-6 bg-slate-800/50 border-t border-white/10 text-center">
              <p className="text-[11px] text-slate-400 font-medium">Use este histórico para avaliar a consistência e o empenho do aluno ao longo do tempo.</p>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
          .ap-scrollbar::-webkit-scrollbar { width: 4px; }
          .ap-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
          .ap-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
          .ap-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      ` }} />
    </>
  );
};
