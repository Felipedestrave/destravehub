// -------------------------------------------------------
// Destrave MRP — Type Definitions
// -------------------------------------------------------

export enum JLPTLevel {
    N5 = 'N5',
    N4 = 'N4',
    N3 = 'N3',
    MIXED = 'Misto',
}

export enum QuizMode {
    MULTIPLE_CHOICE = 'Múltipla Escolha',
    DISCURSIVE = 'Discursiva (Digitar)',
}

export interface MrpQuestion {
    id: number;
    scenario: string;
    task: string;
    hint: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    level: JLPTLevel;
    points: number;
}

export interface MrpConfig {
    context: string;
    quantity: number;
    level: JLPTLevel;
    mode: QuizMode;
}

export interface MrpUserAnswer {
    questionId: number;
    answer: string;
    usedHint: boolean;
    isCorrect: boolean;
    scoreEarned: number;
    feedback?: string;
}

export type MrpStatus = 'CONFIG' | 'LOADING' | 'PLAYING' | 'RESULTS';
