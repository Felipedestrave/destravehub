import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { 
  Destrave1Question, 
  MultipleChoiceQuestion, 
  DiscursiveQuestion, 
  QuestionType 
} from '../../types/destrave1';
import { toast } from 'react-hot-toast';

interface Destrave1EditorProps {
  initialQuestions?: Destrave1Question[];
  editingId?: string;
  initialTitle?: string;
}

export const Destrave1Editor: React.FC<Destrave1EditorProps> = ({
  initialQuestions = [],
  editingId,
  initialTitle = ''
}) => {
  const [title, setTitle] = useState(initialTitle || 'Nova Atividade Clássica');
  const [activeTab, setActiveTab] = useState<'multiple_choice' | 'discursive'>('multiple_choice');
  const [questions, setQuestions] = useState<Destrave1Question[]>(
    initialQuestions.length > 0 ? initialQuestions : [
      { id: crypto.randomUUID(), type: 'multiple_choice', question: '', options: ['', ''], correctOptionIndex: 0 } as MultipleChoiceQuestion
    ]
  );
  const [isSaving, setIsSaving] = useState(false);

  const getFilteredQuestions = (type: QuestionType) => questions.filter(q => q.type === type);

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: Destrave1Question = type === 'multiple_choice'
      ? { id: crypto.randomUUID(), type: 'multiple_choice', question: '', options: ['', ''], correctOptionIndex: 0 }
      : { id: crypto.randomUUID(), type: 'discursive', question: '', expectedAnswer: '' };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Destrave1Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } as Destrave1Question : q));
  };

  const saveActivity = async () => {
    try {
      setIsSaving(true);
      // Validations
      if (!title.trim()) {
        toast.error('O título não pode estar vazio.');
        return;
      }

      const hasEmptyMC = getFilteredQuestions('multiple_choice').some(q => 
        !q.question.trim() || (q as MultipleChoiceQuestion).options.some(opt => !opt.trim())
      );
      if (hasEmptyMC) {
        toast.error('Preencha todos os campos das questões de múltipla escolha.');
        return;
      }

      const hasEmptyDisc = getFilteredQuestions('discursive').some(q => 
        !q.question.trim() || !(q as DiscursiveQuestion).expectedAnswer.trim()
      );
      if (hasEmptyDisc) {
        toast.error('Preencha os enunciados e gabaritos das questões discursivas.');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autenticado");

      const payload = {
        title,
        type: 'destrave1',
        config: { questions },
        ...(editingId ? { id: editingId } : { teacher_id: session.user.id })
      };

      const endpoint = editingId ? '/api/activities/update' : '/api/activities/save';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}` 
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Falha ao salvar atividade.');

      toast.success(editingId ? 'Atividade atualizada com sucesso!' : 'Nova atividade criada!');
      if (!editingId) {
        setTimeout(() => window.location.href = '/dashboard/activities', 1500);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Erro ao salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in pb-20">
      {/* Top Banner (Header) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-slate-border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-2/3">
           <label className="text-xs font-bold text-[var(--color-slate-mid)] mb-1 block uppercase tracking-wider">Título do Pacote</label>
           <input 
             type="text"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             placeholder="Ex: Aula 11 - Vocabulário e Interpretação"
             className="w-full text-xl font-bold bg-transparent border-b-2 border-transparent hover:border-[var(--color-slate-border)] focus:border-[var(--color-brand)] outline-none transition-colors px-1 py-1"
           />
        </div>
        <button 
          onClick={saveActivity} 
          disabled={isSaving}
          className="bg-[var(--color-brand)] text-white font-bold py-3 px-6 rounded-xl hover:bg-[var(--color-action)] transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap min-w-40 justify-center shadow-lg shadow-[var(--color-brand)]/20"
        >
          {isSaving ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full shadow-none hidden"></span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          )}
          {isSaving ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Criar Atividade')}
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border border-[var(--color-slate-border)] overflow-x-auto scroller-hide">
        <button 
          onClick={() => setActiveTab('multiple_choice')}
          className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm text-center transition-colors whitespace-nowrap ${activeTab === 'multiple_choice' ? 'bg-[var(--color-brand)] text-white shadow-sm' : 'text-[var(--color-slate-mid)] hover:bg-[var(--color-ice)]'}`}
        >
          Múltipla Escolha <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">{getFilteredQuestions('multiple_choice').length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('discursive')}
          className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm text-center transition-colors whitespace-nowrap ${activeTab === 'discursive' ? 'bg-[var(--color-brand)] text-white shadow-sm' : 'text-[var(--color-slate-mid)] hover:bg-[var(--color-ice)]'}`}
        >
          Discursivas <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">{getFilteredQuestions('discursive').length}</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-slate-border)] p-6 min-h-[400px]">
        {activeTab === 'multiple_choice' && (
          <div className="flex flex-col gap-8 animate-fade-in">
             <div className="border-b border-[var(--color-slate-border)] pb-4">
                 <h2 className="text-lg font-bold text-[var(--color-slate-dark)]">Questões de Múltipla Escolha</h2>
                 <p className="text-sm text-[var(--color-slate-mid)]">O aluno escolherá a resposta correta e terá validação na hora.</p>
             </div>

             {getFilteredQuestions('multiple_choice').length === 0 && (
                <div className="text-center py-10 text-[var(--color-slate-mid)]">Nenhuma questão de múltipla escolha criada ainda.</div>
             )}

             {getFilteredQuestions('multiple_choice').map((q, index) => {
               const mcQ = q as MultipleChoiceQuestion;
               return (
                 <div key={mcQ.id} className="flex flex-col gap-4 p-5 rounded-xl border border-[var(--color-slate-border)] bg-[var(--color-ice)] relative group transition-all focus-within:border-[var(--color-brand)] focus-within:shadow-sm">
                    <button onClick={() => handleRemoveQuestion(mcQ.id)} className="absolute top-4 right-4 text-[var(--color-slate-mid)] hover:text-red-500 transition-colors" title="Remover Questão">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                    <div>
                      <label className="text-xs font-bold text-[var(--color-slate-mid)] block mb-2">Questão {index + 1}</label>
                      <textarea 
                        value={mcQ.question}
                        onChange={(e) => updateQuestion(mcQ.id, { question: e.target.value })}
                        placeholder="Digite o enunciado da questão aqui..."
                        className="w-full bg-white border border-[var(--color-slate-border)] p-3 rounded-xl focus:outline-none focus:border-[var(--color-brand)] resize-y min-h-[80px]"
                      />
                    </div>
                    
                    <div className="pl-4 border-l-2 border-[var(--color-slate-border)] flex flex-col gap-3">
                       <label className="text-xs font-bold text-[var(--color-slate-mid)] block mb-1">Opções (Marque no Círculo a Correta)</label>
                       {mcQ.options.map((opt, optIndex) => (
                           <div key={optIndex} className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${mcQ.correctOptionIndex === optIndex ? 'bg-[var(--color-brand)]/5 border-[var(--color-brand)]' : 'bg-white border-[var(--color-slate-border)]'}`}>
                              <button 
                                onClick={() => updateQuestion(mcQ.id, { correctOptionIndex: optIndex })}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${mcQ.correctOptionIndex === optIndex ? 'border-[var(--color-brand)] bg-[var(--color-brand)]' : 'border-[#CBD5E1] bg-white'}`}
                              >
                                 {mcQ.correctOptionIndex === optIndex && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                              </button>
                              <input 
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                   const newOpts = [...mcQ.options];
                                   newOpts[optIndex] = e.target.value;
                                   updateQuestion(mcQ.id, { options: newOpts });
                                }}
                                placeholder={`Opção ${optIndex + 1}`}
                                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-[#94A3B8]"
                              />
                              {(mcQ.options.length > 2) && (
                                <button 
                                   onClick={() => {
                                      const newOpts = mcQ.options.filter((_, i) => i !== optIndex);
                                      // Fix correct index if removed
                                      let newCorrect = mcQ.correctOptionIndex;
                                      if (optIndex === mcQ.correctOptionIndex) newCorrect = 0;
                                      else if (optIndex < mcQ.correctOptionIndex) newCorrect--;
                                      updateQuestion(mcQ.id, { options: newOpts, correctOptionIndex: newCorrect });
                                   }}
                                   className="text-[#94A3B8] hover:text-red-500 p-1"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                              )}
                           </div>
                       ))}
                       {mcQ.options.length < 5 && (
                         <button 
                            onClick={() => updateQuestion(mcQ.id, { options: [...mcQ.options, ''] })}
                            className="self-start text-sm font-semibold text-[var(--color-brand)] flex items-center gap-1 mt-1 hover:text-[var(--color-action)]"
                         >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Adicionar Opção
                         </button>
                       )}
                    </div>
                 </div>
               );
             })}

             <button 
                onClick={() => handleAddQuestion('multiple_choice')}
                className="w-full py-4 rounded-xl border-2 border-dashed border-[var(--color-slate-border)] text-[var(--color-slate-mid)] font-bold hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand)]/5 transition-colors flex items-center justify-center gap-2"
             >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Nova Questão de Múltipla Escolha
             </button>
          </div>
        )}

        {activeTab === 'discursive' && (
          <div className="flex flex-col gap-8 animate-fade-in">
             <div className="border-b border-[var(--color-slate-border)] pb-4">
                 <h2 className="text-lg font-bold text-[var(--color-slate-dark)]">Questões Discursivas</h2>
                 <p className="text-sm text-[var(--color-slate-mid)]">O aluno digita texto livre, você insere o gabarito. Ele irá comparar e se autoavaliar de maneira híbrida.</p>
             </div>

             {getFilteredQuestions('discursive').length === 0 && (
                <div className="text-center py-10 text-[var(--color-slate-mid)]">Nenhuma questão discursiva criada ainda.</div>
             )}

             {getFilteredQuestions('discursive').map((q, index) => {
               const discQ = q as DiscursiveQuestion;
               return (
                 <div key={discQ.id} className="flex flex-col gap-4 p-5 rounded-xl border border-[var(--color-slate-border)] bg-[var(--color-ice)] relative group transition-all focus-within:border-[var(--color-brand)] focus-within:shadow-sm">
                    <button onClick={() => handleRemoveQuestion(discQ.id)} className="absolute top-4 right-4 text-[var(--color-slate-mid)] hover:text-red-500 transition-colors" title="Remover Questão">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                    
                    <div className="flex items-start gap-4">
                      <div className="mt-8 font-black text-2xl text-[var(--color-slate-border)]">{index + 1}.</div>
                      <div className="flex-1 flex flex-col gap-4">
                        <div>
                          <label className="text-xs font-bold text-[var(--color-slate-mid)] block mb-1">Enunciado</label>
                          <textarea 
                            value={discQ.question}
                            onChange={(e) => updateQuestion(discQ.id, { question: e.target.value })}
                            placeholder="Digite o enunciado da questão discursiva aqui..."
                            className="w-full bg-white border border-[var(--color-slate-border)] p-3 rounded-xl focus:outline-none focus:border-[var(--color-brand)] resize-y min-h-[70px]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[var(--color-brand)] block mb-1">Gabarito (Resposta Esperada)</label>
                          <textarea 
                            value={discQ.expectedAnswer}
                            onChange={(e) => updateQuestion(discQ.id, { expectedAnswer: e.target.value })}
                            placeholder="Ex: A princesa salvou o herói na montanha."
                            className="w-full bg-white/50 border border-[var(--color-brand)]/30 focus:bg-white p-3 rounded-xl focus:outline-none focus:border-[var(--color-brand)] resize-none h-[60px] text-sm"
                          />
                        </div>
                      </div>
                    </div>
                 </div>
               );
             })}

             <button 
                onClick={() => handleAddQuestion('discursive')}
                className="w-full py-4 rounded-xl border-2 border-dashed border-[var(--color-slate-border)] text-[var(--color-slate-mid)] font-bold hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand)]/5 transition-colors flex items-center justify-center gap-2"
             >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Nova Questão Discursiva
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
