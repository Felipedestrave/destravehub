import type { APIRoute } from 'astro';
import { GoogleGenAI, Type } from "@google/genai";

const geminiKey = import.meta.env.GEMINI_API_KEY || '';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { word } = await request.json();

        if (!word) {
            return new Response(JSON.stringify({ error: 'Palavra não fornecida' }), { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey: geminiKey });

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: { parts: [{ text: `Traduza e analise a palavra ou frase japonesa: "${word}".` }] },
            config: {
                systemInstruction: "Você é um dicionário Japonês-Português profissional. Retorne APENAS um objeto JSON com as propriedades solicitadas.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        word: { type: Type.STRING },
                        meaning: { type: Type.STRING },
                        reading: { type: Type.STRING },
                        example: { type: Type.STRING },
                    },
                    required: ["word", "meaning", "reading", "example"]
                }
            }
        });

        return new Response(result.text, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Erro no dicionário IA:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
