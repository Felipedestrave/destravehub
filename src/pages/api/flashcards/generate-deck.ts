import type { APIRoute } from 'astro';
import { GoogleGenAI, Type } from '@google/genai';
import type { DeckConfig } from '../../../types/flashcards';

export const POST: APIRoute = async ({ request }) => {
    const geminiKey = import.meta.env.GEMINI_API_KEY;
    if (!geminiKey) {
        return new Response(JSON.stringify({ error: 'Gemini API Key não configurada.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let config: DeckConfig;
    try {
        config = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Payload inválido.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { context, quantity, level } = config;

    if (!context || context.trim().length < 20) {
        return new Response(JSON.stringify({ error: 'Conteúdo da aula muito curto para gerar flashcards.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const prompt = `
    Você é um professor especialista em língua japonesa (JLPT) e designer instrucional.
    Analise o CONTEÚDO DA AULA abaixo e gere exatamente ${quantity} flashcards pedagógicos de alta qualidade.

    CONTEÚDO DA AULA:
    ---
    ${context}
    ---

    Nível alvo: ${level}

    REGRAS OBRIGATÓRIAS:
    1. FRENTE ('front'): A palavra, expressão ou ponto gramatical em japonês (use Kanji quando adequado ao nível ${level}).
    2. LEITURA ('reading'): A leitura em Hiragana/Katakana. Para estruturas gramaticais, coloque a leitura do padrão (ex: "〜てもいいですか").
    3. VERSO ('back'): A tradução direta e clara em português. Seja conciso (max 15 palavras).
    4. EXEMPLO ('example'): Uma frase de exemplo em japonês usando o item do flashcard NO CONTEXTO da aula. OBRIGATÓRIO.
    5. TRADUÇÃO DO EXEMPLO ('exampleTranslation'): Tradução do exemplo para português.
    6. NÍVEL ('level'): Use exatamente "${level}" para todos os cards.
    7. VARIEDADE: Extraia vocabulário, expressões idiomáticas E estruturas gramaticais. Não repita itens.
    8. PEDAGOGIA: Priorize os itens mais úteis e recorrentes do conteúdo apresentado.

    Retorne APENAS um JSON array seguindo o esquema definido. Sem texto adicional.
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro-preview-03-25',
            contents: prompt,
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

        const raw: any[] = JSON.parse(response.text || '[]');
        const cards = raw.map((c, idx) => ({
            ...c,
            id: `card-${idx}-${Date.now()}`,
        }));

        return new Response(JSON.stringify({ cards }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        console.error('[Flashcards] Erro ao gerar deck:', err);
        return new Response(JSON.stringify({ error: 'Falha ao gerar flashcards com a IA.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
