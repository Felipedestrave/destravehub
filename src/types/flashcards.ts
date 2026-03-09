// -------------------------------------------------------
// Destrave Flashcards — Type Definitions
// -------------------------------------------------------

export interface Flashcard {
    id: string;          // UUID local (não persiste)
    front: string;       // Palavra/frase em japonês (Kanji/Kana)
    reading: string;     // Furigana / Romaji
    back: string;        // Tradução em português
    example: string;     // Frase de exemplo em japonês do contexto da aula
    exampleTranslation: string; // Tradução do exemplo
    level: JLPTCardLevel;
}

export enum JLPTCardLevel {
    N5 = 'N5',
    N4 = 'N4',
    N3 = 'N3',
}

export interface FlashDeck {
    title: string;
    level: JLPTCardLevel;
    cards: Flashcard[];
}

export interface DeckConfig {
    context: string;
    title: string;
    level: JLPTCardLevel;
    quantity: number;
}

// SRS feedback options (for student view)
export type SrsDifficulty = 'easy' | 'medium' | 'hard';

export type FlashcardStatus = 'GENERATE' | 'LOADING' | 'REVIEW' | 'SAVED';
