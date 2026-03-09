import type { APIRoute } from 'astro';
import { GoogleGenAI, SchemaType } from "@google/genai";

const genAI = new GoogleGenAI(import.meta.env.GEMINI_API_KEY || '');

export const POST: APIRoute = async ({ request }) => {
    try {
        const { word } = await request.json();

        if (!word) {
            return new Response(JSON.stringify({ error: 'Palavra não fornecida' }), { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite-preview-02-05", // Usando o modelo mais recente e performático
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        word: { type: SchemaType.STRING },
                        meaning: { type: SchemaType.STRING },
                        reading: { type: SchemaType.STRING },
                        example: { type: SchemaType.STRING },
                    },
                    required: ["word", "meaning", "reading", "example"]
                }
            }
        });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `Traduza e analise a palavra ou frase japonesa: "${word}".` }] }],
            systemInstruction: "Você é um dicionário Japonês-Português profissional. Retorne APENAS um objeto JSON com as propriedades solicitadas."
        });

        return new Response(result.response.text(), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Erro no dicionário IA:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
