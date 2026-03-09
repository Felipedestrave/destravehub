export type LessonItem = {
    id: string;
    type: 'text' | 'image';
    content: string;
    fullScreen?: boolean;
    audioEnabled?: boolean;
    style?: {
        fontSize?: number;
        color?: string;
        bold?: boolean;
        italic?: boolean;
    };
};

export type Point = {
    x: number;
    y: number;
    p?: number; // Pressão (0 a 1)
};

export type DrawingStroke = {
    points: Point[];
    color: string;
    width: number;
    opacity?: number;
    itemId?: string;
};

export type Folder = {
    id: string;
    name: string;
    createdAt: string;
};

export type Lesson = {
    id: string;
    title: string;
    createdAt: string;
    items: LessonItem[];
    strokes: DrawingStroke[];
    folderId?: string;
};

export type DictionaryResult = {
    word: string;
    meaning: string;
    reading: string;
    example: string;
};

export type InteractionType = 'matsuri' | 'rocket' | 'sweat' | 'focus' | 'challenge';

export type ToolType = 'laser' | 'pen' | 'highlighter' | 'dictionary' | 'eraser';

export type VisualEffect = {
    id: string;
    type: InteractionType;
    x: number;
    y: number;
    timestamp: number;
};
