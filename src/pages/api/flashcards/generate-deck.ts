import type { APIRoute } from 'astro';
import { GoogleGenAI, Type } from '@google/genai';
import type { DeckConfig } from '../../../types/flashcards';

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

    let config: DeckConfig;
    try {
        config = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Payload inválido.' }), { status: 400 });
    }

    const { context, title, level, quantity, pdfBase64 } = config;

    if (!pdfBase64 && (!context || context.trim().length < 20)) {
        return new Response(JSON.stringify({ error: 'Forneça um PDF ou um texto base de pelos menos 20 caracteres.' }), { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const prompt = `
    Você é um Professor de Japonês (Sensei) especialista em JLPT (${level}) e Aprendizado Espaçado (SRS).
    Gere exatamente ${quantity} flashcards pedagógicos de alta qualidade baseados no material fornecido.
    
    TÍTULO DO DECK: "${title}"
    NÍVEL ALVO: ${level}

    FONTES DE CONTEÚDO:
    1. Se houver um PDF, use-o como fonte primária para extrair vocabulário, kanjis e gramática.
    2. Se houver texto manual ("${context}"), integre os pontos principais.

    REGRAS OBRIGATÓRIAS PARA OS CARDS:
    1. FRENTE ('front'): Palavra ou gramática em japonês acompanhada da sua transcrição em Romaji entre parênteses. (Ex: 食べる (taberu)). NÃO use macrons (ā, ō), use alfabetos planos (aa, ou).
    2. LEITURA ('reading'): Leitura em Hiragana/Katakana.
    3. VERSO ('back'): Tradução clara em português.
    4. EXEMPLO ('example'): Frase de exemplo em japonês acompanhada da sua transcrição em Romaji entre parênteses. (Ex: 寿司を食べる (sushi o taberu)). NÃO use macrons.
    5. TRADUÇÃO DO EXEMPLO ('exampleTranslation'): Tradução da frase de exemplo em português.
    6. NÍVEL ('level'): Use exatamente "${level}".
    7. VARIEDADE: Mescle vocabulário e padrões gramaticais.

    Retorne APENAS um JSON array contendo os ${quantity} objetos.
    `;

    try {
        const parts: any[] = [{ text: prompt }];
        if (pdfBase64) {
            parts.push({ inlineData: { mimeType: 'application/pdf', data: pdfBase64 } });
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
            })
        );

        const text = result.text;
        if (!text) throw new Error('IA retornou resposta vazia.');

        const raw: any[] = JSON.parse(text);
        const cards = raw.map((c, idx) => ({
            ...c,
            id: `card-${idx}-${Date.now()}`,
        }));

        return new Response(JSON.stringify({ cards }), { status: 200 });
    } catch (err: any) {
        console.error('[Deck Generation Error]:', err);
        return new Response(JSON.stringify({ error: 'Erro ao gerar deck: ' + err.message }), { status: 500 });
    }
};
