// -------------------------------------------------------
// Destrave Lego — Type Definitions
// -------------------------------------------------------

export type LegoBlockType = 
    | 'SUBJECT'
    | 'OBJECT'
    | 'VERB'
    | 'PARTICLE'
    | 'TIME'
    | 'ADJECTIVE'
    | 'OTHER';

export interface LegoBlock {
    id: string; // usually a combination of word + index
    word: string;
    romaji: string;
    type: LegoBlockType;
    translation?: string; // opcional, para dica do bloco se necessário
}

export interface LegoSentence {
    id: string;
    original: string;
    translation: string;
    blocks: LegoBlock[];
}

export interface LegoConfig {
    context: string;
    quantity: number;
    pdfBase64?: string;
    customInstructions?: string;
}

export type LegoStatus = 'UPLOAD' | 'LOADING' | 'REVIEW' | 'PLAYING' | 'RESULT' | 'SAVED';
