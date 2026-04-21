import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Destrave1Question, Destrave1UserAnswer, AutoEvaluationStatus } from '../../types/destrave1';
import { BuddyView } from '../buddy/BuddyView';
import { ResultScreen } from '../escuta/ResultScreen';

interface Destrave1PlayerProps {
  questions: Destrave1Question[];
  assignmentId?: string;
  activityTitle?: string;
  publicAccess?: boolean;
}

export const Destrave1Player: React.FC<Destrave1PlayerProps> = ({ questions, assignmentId, activityTitle, publicAccess = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Destrave1UserAnswer[]>([]);
  const [gameResult, setGameResult] = useState<any>(null);
  const [rewards, setRewards] = useState<any>(null);
  
  // State for Discursive question flow
  const [discursiveText, setDiscursiveText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false); // True when revealing the expected answer

  // Buddy state
  const [buddyStatus, setBuddyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const currentQuestion = questions[currentIndex];
  const isFinished = currentIndex >= questions.length && questions.length > 0;

  const currentScore = answers.filter(a => a.isCorrect).length;

  const handleMultipleChoice = (selectedIndex: number) => {
    if (currentQuestion.type !== 'multiple_choice') return;

    const isCorrect = selectedIndex === currentQuestion.correctOptionIndex;
    
    // Animate buddy
    setBuddyStatus(isCorrect ? 'success' : 'error');

    // Save answer
    const newAnswer: Destrave1UserAnswer = {
      questionId: currentQuestion.id,
      questionType: 'multiple_choice',
      selectedOptionIndex: selectedIndex,
      isCorrect,
      answeredAt: new Date().toISOString()
    };
    
    const newAnswersList = [...answers, newAnswer];
    setAnswers(newAnswersList);

    // Timeout to let buddy finish animating and move to next
    setTimeout(() => {
      setBuddyStatus('idle');
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        finishGame(newAnswersList);
      }
    }, 2000);
  };

  const handleDiscursiveSubmitText = () => {
    if (!discursiveText.trim()) return;
    setIsEvaluating(true);
  };

  const handleDiscursiveSelfEvaluation = (evalStatus: AutoEvaluationStatus) => {
    if (currentQuestion.type !== 'discursive') return;

    let isLineCorrect = false;
    if (evalStatus === 'correct' || evalStatus === 'close') {
      isLineCorrect = true;
      setBuddyStatus('success');
    } else {
      setBuddyStatus('error');
    }

    const newAnswer: Destrave1UserAnswer = {
      questionId: currentQuestion.id,
      questionType: 'discursive',
      textAnswer: discursiveText,
      autoEvaluation: evalStatus,
      isCorrect: isLineCorrect, // Initial credit given if student marks correct/close
      reviewStatus: 'pending_review', // Needs teacher review
      answeredAt: new Date().toISOString()
    };

    const newAnswersList = [...answers, newAnswer];
    setAnswers(newAnswersList);

    setTimeout(() => {
      setBuddyStatus('idle');
      setDiscursiveText('');
      setIsEvaluating(false);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        finishGame(newAnswersList);
      }
    }, 2000);
  };

  const finishGame = async (finalAnswers: Destrave1UserAnswer[]) => {
    try {
      const finalScore = finalAnswers.filter(a => a.isCorrect).length;
      const stats = {
        score: finalScore,
        total: questions.length,
        history: finalAnswers,
        timeSpent: 0,
        targetTime: 0
      };

      setGameResult(stats);

      if (!assignmentId) {
        console.log('No assignmentId, skipping result save');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        console.log('No session token, skipping result save');
        return;
      }

      const res = await fetch('/api/missions/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          assignmentId,
          score: finalScore,
          totalQuestions: questions.length,
          history: finalAnswers,
          timeSpent: 0,
          targetTime: 0,
          title: activityTitle || 'Destrave 1.0'
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.rewards) {
          setRewards(data.rewards);
        }
      }
    } catch (err) {
      console.error('Failed to save result', err);
    }
  };

  if (questions.length === 0) {
    return <div className="p-10 text-center">Nenhuma questão encontrada para esta atividade.</div>;
  }

  if (gameResult) {
    return (
      <ResultScreen
        result={gameResult}
        hideActions={true}
        rewards={rewards}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto pb-10">
      {/* Esquerda: Questão */}
      <div className="flex-1 flex flex-col gap-6 animate-fade-in">
        {/* Cabeçalho */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-slate-border)] flex items-center justify-between">
            <h2 className="text-xl font-bold font-outfit text-[var(--color-slate-dark)]">
              {activityTitle || 'Atividade'}
            </h2>
            <div className="bg-[var(--color-ice)] text-[var(--color-brand)] font-bold px-4 py-2 rounded-xl text-sm">
              Progresso: {currentIndex + 1} / {questions.length}
            </div>
        </div>

        {/* Corpo da Questão */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-slate-border)] min-h-[300px] flex flex-col relative overflow-hidden">
           
           {/* Bloqueio de tela enquanto Buddy anima */}
           {buddyStatus !== 'idle' && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10"></div>
           )}

           <h3 className="text-sm font-bold text-[var(--color-slate-mid)] mb-4 uppercase tracking-wider">
             {currentQuestion.type === 'multiple_choice' ? 'Múltipla Escolha' : 'Questão Discursiva'}
           </h3>

           <p className="text-xl md:text-2xl font-medium text-[var(--color-slate-dark)] leading-relaxed mb-8">
             {currentQuestion.question}
           </p>

           {/* Alternativas (Múltipla Escolha) */}
           {currentQuestion.type === 'multiple_choice' && (
             <div className="flex flex-col gap-3 mt-auto">
               {currentQuestion.options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => handleMultipleChoice(i)}
                    className="text-left w-full p-4 rounded-xl border-2 border-[var(--color-slate-border)] hover:border-[var(--color-brand)] hover:bg-[var(--color-ice)] transition-all font-medium text-[var(--color-slate-dark)] shadow-sm"
                  >
                    {opt}
                  </button>
               ))}
             </div>
           )}

           {/* Fluxo Discursivo */}
           {currentQuestion.type === 'discursive' && (
             <div className="flex flex-col gap-4 mt-auto">
               {!isEvaluating ? (
                 <>
                   <textarea 
                     className="w-full p-4 rounded-xl border border-[var(--color-slate-border)] focus:border-[var(--color-brand)] bg-[var(--color-ice)] min-h-[120px] resize-y outline-none"
                     placeholder="Escreva sua resposta aqui..."
                     value={discursiveText}
                     onChange={(e) => setDiscursiveText(e.target.value)}
                   />
                   <button 
                     onClick={handleDiscursiveSubmitText}
                     disabled={!discursiveText.trim()}
                     className="w-full bg-[var(--color-brand)] text-white font-bold py-4 rounded-xl hover:bg-[var(--color-action)] transition-colors disabled:opacity-50"
                   >
                     Revelar Gabarito
                   </button>
                 </>
               ) : (
                 <div className="animate-fade-up flex flex-col gap-6">
                   <div className="p-5 rounded-xl border-2 border-dashed border-[var(--color-brand)] bg-[var(--color-brand)]/5">
                      <h4 className="text-xs font-bold text-[var(--color-brand)] mb-2 uppercase">Gabarito do Sensei:</h4>
                      <p className="text-lg text-[var(--color-slate-dark)] font-medium">
                        {currentQuestion.expectedAnswer}
                      </p>
                   </div>
                   
                   <div className="text-center">
                     <p className="font-bold text-[var(--color-slate-mid)] mb-3">Seja honesto(a), como você foi?</p>
                     <div className="grid grid-cols-3 gap-3">
                        <button 
                          onClick={() => handleDiscursiveSelfEvaluation('correct')}
                          className="flex flex-col items-center justify-center p-3 rounded-xl bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors gap-1"
                        >
                          <span className="text-2xl">🟢</span>
                          <span className="font-bold text-sm">Acertei</span>
                        </button>
                        <button 
                          onClick={() => handleDiscursiveSelfEvaluation('close')}
                          className="flex flex-col items-center justify-center p-3 rounded-xl bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-100 transition-colors gap-1"
                        >
                          <span className="text-2xl">🟡</span>
                          <span className="font-bold text-sm">Cheguei perto</span>
                        </button>
                        <button 
                          onClick={() => handleDiscursiveSelfEvaluation('wrong')}
                          className="flex flex-col items-center justify-center p-3 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors gap-1"
                        >
                          <span className="text-2xl">🔴</span>
                          <span className="font-bold text-sm">Errei</span>
                        </button>
                     </div>
                   </div>
                 </div>
               )}
             </div>
           )}

        </div>
      </div>

      {/* Direita: Buddy */}
      <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
         <div className="bg-[var(--color-brand)] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[340px]">
           
           <div className="absolute top-4 right-4 bg-white/20 text-white font-bold px-3 py-1 rounded-full text-sm">
             <span className="text-yellow-300">★</span> {currentScore} Acertos
           </div>

           <BuddyView status={buddyStatus} size="large" />
           
           <div className="mt-6 text-center z-10 w-full relative">
             {buddyStatus === 'idle' && currentQuestion.type === 'discursive' && !isEvaluating && (
               <div className="bg-white text-[var(--color-slate-dark)] font-medium p-3 rounded-xl rounded-tl-none shadow-sm text-sm mx-auto animate-fade-in relative">
                  Pense bem! Quando terminar, vamos comparar com a resposta do Sensei!
                  <svg className="absolute top-0 right-full h-4 text-white" viewBox="0 0 10 10" preserveAspectRatio="none"><polygon fill="currentColor" points="10,0 10,10 0,10"></polygon></svg>
               </div>
             )}
             {buddyStatus === 'idle' && currentQuestion.type === 'multiple_choice' && (
               <div className="bg-white text-[var(--color-slate-dark)] font-medium p-3 rounded-xl rounded-tl-none shadow-sm text-sm mx-auto animate-fade-in relative">
                  Qual será a opção certa? Marque aí!
                  <svg className="absolute top-0 right-full h-4 text-white" viewBox="0 0 10 10" preserveAspectRatio="none"><polygon fill="currentColor" points="10,0 10,10 0,10"></polygon></svg>
               </div>
             )}
             {isEvaluating && buddyStatus === 'idle' && (
               <div className="bg-white text-[var(--color-slate-dark)] font-medium p-3 rounded-xl rounded-tl-none shadow-sm text-sm mx-auto animate-fade-in relative">
                  Avalie com sinceridade. O Sensei também vai corrigir lá pelo lado dele depois!
                  <svg className="absolute top-0 right-full h-4 text-white" viewBox="0 0 10 10" preserveAspectRatio="none"><polygon fill="currentColor" points="10,0 10,10 0,10"></polygon></svg>
               </div>
             )}
           </div>
         </div>
      </div>
    
    </div>
  );
};
