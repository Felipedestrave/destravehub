import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';

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
