// ============================================
// TYPES: Destrave a Escuta
// ============================================

export enum Difficulty {
    EASY = 'Fácil',
    MEDIUM = 'Intermediário',
    HARD = 'Avançado',
    MIXED = 'Misturado',
}

export enum StudyFocus {
    LITERAL = 'Tradução Fiel',
    CONTEXTUAL = 'Entender a Essência',
}

export interface Question {
    japanese_sentence: string;
    romaji?: string;
    options: string[];
    correct_index: number;
    hint: string;
    explanation?: string;
    context_name?: string;
    difficulty_level?: Difficulty;
}

export interface GeneratedData {
    question: Question;
    audioBase64: string;
    actualDifficulty?: Difficulty;
}

export interface HistoryItem {
    correct: boolean;
    points: number;
    questionData: GeneratedData;
    userAnswer: number | null;
    usedHint: boolean;
}

export interface GameConfig {
    pdfBase64: string;
    difficulty: Difficulty;
    count: number;
    focus: StudyFocus;
    customInstructions?: string;
}

export interface GameResult {
    score: number;
    total: number;
    history: HistoryItem[];
}

export type GameStatus = 'UPLOAD' | 'GENERATING' | 'REVIEW' | 'PLAYING' | 'RESULT' | 'SAVED';

export const POINTS_CONFIG: Record<Difficulty, number> = {
    [Difficulty.EASY]: 2,
    [Difficulty.MEDIUM]: 4,
    [Difficulty.HARD]: 6,
    [Difficulty.MIXED]: 0,
};
