import type { APIRoute } from 'astro';
import { GoogleGenAI, Type } from '@google/genai';

export const GET: APIRoute = async () => {
    const geminiKey = import.meta.env.GEMINI_API_KEY;

    if (!geminiKey) {
        return new Response(JSON.stringify({
            status: 'FAIL',
            error: 'GEMINI_API_KEY não encontrada no ambiente.',
            keyPresent: false,
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const keyPreview = `${geminiKey.slice(0, 8)}...${geminiKey.slice(-4)}`;

    try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: 'Responda apenas: OK' }] }],
        });

        return new Response(JSON.stringify({
            status: 'OK',
            keyPresent: true,
            keyPreview,
            modelResponse: result.text,
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (err: any) {
        return new Response(JSON.stringify({
            status: 'FAIL',
            keyPresent: true,
            keyPreview,
            error: err.message,
            errorCode: err.status || err.code || 'unknown',
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};

// POST: tests the exact same call as generate-deck.ts
export const POST: APIRoute = async () => {
    const geminiKey = import.meta.env.GEMINI_API_KEY;
    if (!geminiKey) {
        return new Response(JSON.stringify({ status: 'FAIL', error: 'Key not found' }), { status: 500 });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const parts: any[] = [{ text: 'Gere exatamente 1 flashcard de japonês com front, reading, back, example, exampleTranslation e level.' }];

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts }],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            front: { type: Type.STRING },
                            reading: { type: Type.STRING },
                            back: { type: Type.STRING },
                            example: { type: Type.STRING },
                            exampleTranslation: { type: Type.STRING },
                            level: { type: Type.STRING },
                        },
                        required: ['front', 'reading', 'back', 'example', 'exampleTranslation', 'level'],
                    },
                },
            },
        });

        const text = result.text;
        if (!text) throw new Error('IA retornou resposta vazia.');

        const parsed = JSON.parse(text);
        return new Response(JSON.stringify({ status: 'OK', cards: parsed }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({
            status: 'FAIL',
            error: err.message,
            stack: err.stack?.split('\n').slice(0, 5),
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
