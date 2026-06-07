import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  word: string;
  romaji: string;
  meaning: string;
  options: Option[];
}

interface KanaExercisesProps {
  module: 'hiragana' | 'katakana';
  lessonId: number;
  lessonName: string;
  onComplete: (score: number) => void;
  onCancel: () => void;
}

export function KanaExercises({ module, lessonId, lessonName, onComplete, onCancel }: KanaExercisesProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeStarted] = useState<number>(Date.now());

  useEffect(() => {
    async function loadExercises() {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || '';
        
        const res = await fetch(`/api/kana/generate-exercises?module=${module}&lessonId=${lessonId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setQuestions(data.questions || []);
      } catch (err: any) {
        console.error('[Exercises Load Error]:', err);
        toast.error('Erro ao conectar com o Sensei IA. Tente novamente.');
        onCancel();
      } finally {
        setLoading(false);
      }
    }

    loadExercises();
  }, [module, lessonId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-[var(--color-slate-border)] rounded-2xl shadow-sm min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-brand)] mb-4"></div>
        <p className="font-bold text-[var(--color-slate-dark)]">Gerando exercícios com Inteligência Artificial...</p>
        <p className="text-xs text-[var(--color-slate-mid)] mt-1">O Sensei está escolhendo palavras usando apenas o que você aprendeu!</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-[var(--color-slate-border)] rounded-2xl shadow-sm text-center min-h-[400px]">
        <span className="text-4xl mb-3">⚠️</span>
        <p className="font-bold text-[var(--color-slate-dark)]">Não foi possível carregar as questões.</p>
        <p className="text-xs text-[var(--color-slate-mid)] mt-1">Tente novamente em alguns instantes.</p>
        <button
          onClick={onCancel}
          className="mt-6 px-5 py-2.5 bg-[var(--color-brand)] text-white font-bold rounded-xl hover:bg-[var(--color-action)] transition-colors shadow-sm text-sm"
        >
          Voltar às Lições
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOptionIndex(index);
  };

  const handleVerifyAnswer = () => {
    if (selectedOptionIndex === null || isAnswered) return;

    const correct = currentQuestion.options[selectedOptionIndex].isCorrect;
    if (correct) {
      setScore(prev => prev + 1);
      toast.success('Excelente! Resposta correta.');
    } else {
      toast.error('Que pena, resposta incorreta.');
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
    } else {
      // Completed all 10 questions!
      const timeSpent = Math.round((Date.now() - timeStarted) / 1000);
      onComplete(score);
    }
  };

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--color-slate-border)] flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[var(--color-brand)] uppercase tracking-wider">{lessonName}</span>
            <span className="text-lg font-bold text-[var(--color-slate-dark)]">Prática de Leitura 📖</span>
          </div>
          <span className="text-sm font-bold text-[var(--color-slate-mid)]">
            Questão {currentIndex + 1} de {questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[var(--color-ice)] h-3 rounded-full overflow-hidden border border-[var(--color-slate-border)]">
          <div
            className="bg-[var(--color-brand)] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-slate-border)] flex flex-col items-center gap-8 min-h-[360px] relative">
        <div className="text-center flex flex-col gap-2">
          <span className="text-xs font-bold text-[var(--color-slate-mid)] uppercase tracking-widest">Qual a leitura e tradução correta?</span>
          <h2 className="text-5xl md:text-6xl font-black font-outfit text-[var(--color-slate-dark)] tracking-wide my-4 select-none">
            {currentQuestion.word}
          </h2>
        </div>

        {/* Alternatives Grid */}
        <div className="w-full flex flex-col gap-3">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "border-[var(--color-slate-border)] hover:border-[var(--color-brand)] hover:bg-[var(--color-ice)] text-[var(--color-slate-dark)]";

            if (isAnswered) {
              if (option.isCorrect) {
                // Correct option (Always green highlight after verification)
                btnClass = "border-green-500 bg-green-50 text-green-700 font-bold shadow-inner";
              } else if (selectedOptionIndex === idx) {
                // Selected option was incorrect
                btnClass = "border-red-500 bg-red-50 text-red-700 font-bold shadow-inner";
              } else {
                // Other options (Disabled look)
                btnClass = "border-[var(--color-slate-border)] opacity-40 text-[var(--color-slate-mid)] cursor-not-allowed";
              }
            } else if (selectedOptionIndex === idx) {
              // Option selected before verification
              btnClass = "border-[var(--color-brand)] bg-[var(--color-brand)]/5 text-[var(--color-brand)] font-bold ring-2 ring-[var(--color-brand)]/20";
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center shadow-sm ${btnClass}`}
              >
                <span>{option.text}</span>
                {isAnswered && option.isCorrect && (
                  <span className="text-green-600 text-lg">✓</span>
                )}
                {isAnswered && !option.isCorrect && selectedOptionIndex === idx && (
                  <span className="text-red-600 text-lg">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="w-full flex gap-3 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-[var(--color-ice)] text-[var(--color-slate-mid)] hover:text-[var(--color-slate-dark)] font-bold rounded-xl border border-[var(--color-slate-border)] hover:bg-slate-100 transition-colors shadow-sm text-sm"
          >
            Sair do Treino
          </button>

          {!isAnswered ? (
            <button
              disabled={selectedOptionIndex === null}
              onClick={handleVerifyAnswer}
              className="flex-1 py-3 bg-[var(--color-brand)] text-white font-bold rounded-xl hover:bg-[var(--color-action)] transition-colors disabled:opacity-50 shadow-sm text-sm"
            >
              Verificar Resposta
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-[var(--color-brand)] text-white font-bold rounded-xl hover:bg-[var(--color-action)] transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
            >
              <span>{currentIndex + 1 === questions.length ? 'Finalizar' : 'Próxima'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
