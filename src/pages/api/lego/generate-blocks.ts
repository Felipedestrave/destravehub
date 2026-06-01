import type { APIRoute } from 'astro';
import { GoogleGenAI, Type } from '@google/genai';
import type { LegoConfig } from '../../../types/lego';

const isRetryable = (error: any): boolean => {
    const msg = error?.message || '';
    return msg.includes('429') || msg.includes('503') || msg.includes('UNAVAILABLE');
};

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
    try {
        return await fn();
    } catch (error: any) {
        if (retries > 0 && isRetryable(error)) {
            await new Promise((r) => setTimeout(r, delay));
            return withRetry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};

export const POST: APIRoute = async ({ request }) => {
    const geminiKey = import.meta.env.GEMINI_API_KEY;
    if (!geminiKey) {
        return new Response(JSON.stringify({ error: 'Gemini API Key não configurada.' }), { status: 500 });
    }

    let config: LegoConfig;
    try {
        config = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Payload inválido.' }), { status: 400 });
    }

    const { context, quantity, pdfBase64 } = config;

    if (!pdfBase64 && (!context || context.trim().length < 5)) {
        return new Response(JSON.stringify({ error: 'Forneça um texto base, tema, ou um PDF válido.' }), { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const prompt = `
    Aja como um Professor de Japonês (Sensei).
    Sua missão é criar ${quantity} frases em japonês baseadas ${pdfBase64 ? 'no documento anexo' : `no seguinte tema ou vocabulário: "${context}"`}.
    ${context && pdfBase64 ? `Use o documento anexo e priorize o seguinte foco/tema adicional: "${context}".` : ''}
    
    REGRAS DO SENSEI:
    1. CONTEXTO: Crie frases úteis e naturais.
    2. PARSE SINTÁTICO: Você deve quebrar cada frase em blocos lógicos gramaticais.
       Tipos permitidos para cada bloco: 'SUBJECT', 'OBJECT', 'VERB', 'PARTICLE', 'TIME', 'ADJECTIVE', 'OTHER'.
    3. ROMAJI: Para cada bloco, forneça a leitura em romaji.
    4. TRADUÇÃO: Forneça a tradução da frase completa para o português.
    
    Retorne um JSON contendo EXATAMENTE ${quantity} objetos no array principal.
    `;

    try {
        const parts: any[] = [{ text: prompt }];
        if (pdfBase64) {
            parts.push({
                inlineData: {
                    data: pdfBase64,
                    mimeType: 'application/pdf',
                },
            });
        }

        const result = await withRetry(() => 
            ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts }],
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                original: { type: Type.STRING },
                                translation: { type: Type.STRING },
                                blocks: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            word: { type: Type.STRING },
                                            romaji: { type: Type.STRING },
                                            type: { type: Type.STRING, enum: ['SUBJECT', 'OBJECT', 'VERB', 'PARTICLE', 'TIME', 'ADJECTIVE', 'OTHER'] },
                                            translation: { type: Type.STRING }
                                        },
                                        required: ['word', 'romaji', 'type']
                                    }
                                }
                            },
                            required: ['original', 'translation', 'blocks'],
                        },
                    },
                },
            })
        );

        const text = result.text;
        if (!text) throw new Error('IA retornou resposta vazia.');

        const raw = JSON.parse(text);
        
        // Generate IDs
        const sentences = raw.map((s: any, idx: number) => ({
            id: 's' + idx,
            original: s.original,
            translation: s.translation,
            blocks: s.blocks.map((b: any, bIdx: number) => ({
                id: 'b' + idx + '-' + bIdx,
                word: b.word,
                romaji: b.romaji || '',
                type: b.type,
                translation: b.translation || ''
            }))
        }));

        return new Response(JSON.stringify({ sentences }), { status: 200 });
    } catch (err: any) {
        console.error('[Lego Generation Error]:', err);
        return new Response(JSON.stringify({ error: 'Erro ao gerar treinamento: ' + err.message }), { status: 500 });
    }
};
