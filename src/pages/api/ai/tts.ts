import type { APIRoute } from 'astro';
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(import.meta.env.GEMINI_API_KEY || '');

export const POST: APIRoute = async ({ request }) => {
    try {
        const { text } = await request.json();

        if (!text) {
            return new Response(JSON.stringify({ error: 'Texto não fornecido' }), { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `Diga pausadamente com pronúncia perfeita em japonês: ${text}` }] }],
            generationConfig: {
                //@ts-ignore - responseModalities é suportado no modelo flash-exp para TTS
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: 'Kore'
                        }
                    }
                },
            }
        });

        const base64Audio = result.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        return new Response(JSON.stringify({ audio: base64Audio }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Erro no TTS Gemini:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
