// src/types/destrave1.ts

export type QuestionType = 'multiple_choice' | 'discursive';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: string[];
  correctOptionIndex: number; // 0 a N
}

export interface DiscursiveQuestion extends BaseQuestion {
  type: 'discursive';
  expectedAnswer: string;
}

export type Destrave1Question = MultipleChoiceQuestion | DiscursiveQuestion;

export interface Destrave1Config {
  title?: string;
  questions: Destrave1Question[];
}

export type AutoEvaluationStatus = 'correct' | 'close' | 'wrong';
export type ReviewStatus = 'pending_review' | 'approved' | 'rejected' | 'adjusted';

export interface Destrave1UserAnswer {
  questionId: string;
  questionType: QuestionType;
  
  // Para múltipla escolha
  selectedOptionIndex?: number;
  
  // Para discursiva
  textAnswer?: string;
  autoEvaluation?: AutoEvaluationStatus;
  
  // Comum para ambos
  isCorrect: boolean; 
  reviewStatus?: ReviewStatus;
  teacherComment?: string;
  answeredAt: string;
}

export interface Destrave1Result {
  totalQuestions: number;
  correctAnswers: number;
  isPartial: boolean; // Se true, o aluno fez autoavaliação mas o professor ainda pode mudar
  answers: Destrave1UserAnswer[];
  startedAt: string;
  completedAt: string;
}
