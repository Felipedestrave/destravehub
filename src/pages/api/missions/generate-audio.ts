import type { APIRoute } from 'astro';
import { GoogleGenAI, Modality } from '@google/genai';

// Maps context name to TTS voice for naturalness
const getVoiceForContext = (context?: string): string => {
    const ctx = (context || '').toLowerCase();
    if (ctx.includes('hospital') || ctx.includes('trabalho') || ctx.includes('escritório')) return 'Zephyr';
    if (ctx.includes('escola') || ctx.includes('amigo') || ctx.includes('casa') || ctx.includes('festa')) return 'Puck';
    if (ctx.includes('loja') || ctx.includes('restaurante') || ctx.includes('aeroporto')) return 'Kore';
    if (ctx.includes('avô') || ctx.includes('avó') || ctx.includes('história') || ctx.includes('sério')) return 'Charon';
    if (ctx.includes('esporte') || ctx.includes('emergência')) return 'Fenrir';
    return 'Kore';
};

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
    try {
        return await fn();
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : '';
        const isRateLimit = msg.includes('429');
        if (retries > 0 && isRateLimit) {
            await new Promise((r) => setTimeout(r, delay));
            return withRetry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const apiKey = import.meta.env.GEMINI_API_KEY;
        if (!apiKey) return new Response(JSON.stringify({ error: 'GEMINI_API_KEY não configurada.' }), { status: 500 });

        const body = await request.json();
        const { text, contextName, difficulty } = body;

        if (!text) return new Response(JSON.stringify({ error: 'text é obrigatório.' }), { status: 400 });

        const ai = new GoogleGenAI({ apiKey });
        const voiceName = getVoiceForContext(contextName);

        const actingPrompt = `
      Atue como um falante nativo de japonês.
      Cenário: ${contextName || 'Geral'}.
      Nível: ${difficulty || 'N5'}.
      Instrução: Fale de forma extremamente natural para este cenário, respeitando pausas (ma) e entonação emocional adequada.
      Frase: ${text}
    `;

        const response = await withRetry(() =>
            ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-tts',
                contents: { parts: [{ text: actingPrompt }] },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName },
                        },
                    },
                },
            })
        );

        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioData) throw new Error('Falha ao gerar áudio.');

        return new Response(JSON.stringify({ audioBase64: audioData }), { status: 200 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
};
