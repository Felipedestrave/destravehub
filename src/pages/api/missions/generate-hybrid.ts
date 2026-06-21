import type { APIRoute } from 'astro';
import { GoogleGenAI, Type, Modality } from '@google/genai';

const isRetryable = (error: unknown): boolean => {
    const msg = error instanceof Error ? error.message : '';
    return msg.includes('429') || msg.includes('503') || msg.includes('UNAVAILABLE');
};

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
    try {
        return await fn();
    } catch (error: unknown) {
        if (retries > 0 && isRetryable(error)) {
            await new Promise((r) => setTimeout(r, delay));
            return withRetry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};

const getVoiceForContext = (context?: string): string => {
    const ctx = (context || '').toLowerCase();
    if (ctx.includes('hospital') || ctx.includes('trabalho') || ctx.includes('escritório')) return 'Zephyr';
    if (ctx.includes('escola') || ctx.includes('amigo') || ctx.includes('casa') || ctx.includes('festa')) return 'Puck';
    if (ctx.includes('loja') || ctx.includes('restaurante') || ctx.includes('aeroporto')) return 'Kore';
    if (ctx.includes('avô') || ctx.includes('avó') || ctx.includes('história') || ctx.includes('sério')) return 'Charon';
    if (ctx.includes('esporte') || ctx.includes('emergência')) return 'Fenrir';
    return 'Kore';
};

const getDifficultyPrompt = (difficulty: string): string => {
    switch (difficulty) {
        case 'N5':
            return 'Nível JLPT N5 (Básico). Use apenas gramática, partículas básicas e vocabulário fundamental de N5. Frases simples e diretas.';
        case 'N4':
            return 'Nível JLPT N4 (Elementar). Use gramática de N4 (formas Te, Ta, Nai, potencial básico, expressões condicionais). Vocabulário cotidiano.';
        case 'N3':
            return 'Nível JLPT N3 (Intermediário). Use gramática de N3 (conjunções complexas, expressões de opinião, estruturas intermediárias). Sem Keigo.';
        case 'mixed':
        case 'Misturado':
            return 'Mistura equilibrada de níveis N5, N4 e N3. Varie a dificuldade de forma balanceada entre as questões.';
        default:
            return 'Nível JLPT N5.';
    }
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const apiKey = import.meta.env.GEMINI_API_KEY;
        if (!apiKey) return new Response(JSON.stringify({ error: 'GEMINI_API_KEY não configurada.' }), { status: 500 });

        const body = await request.json();
        const { pdfBase64, difficulty, count } = body;

        if (!pdfBase64 || !difficulty || !count) {
            return new Response(JSON.stringify({ error: 'pdfBase64, difficulty e count são obrigatórios.' }), { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey });
        const difficultyDescription = getDifficultyPrompt(difficulty);

        const prompt = `
      Você é um Sensei de japonês e especialista em JLPT.
      Analise o material didático em PDF fornecido.
      Crie exatamente ${count} exercícios variados baseados no vocabulário e contexto do PDF.
      
      Você deve distribuir esses exercícios entre os seguintes tipos de forma equilibrada:
      1. 'escuta': Exercício de audição contendo uma frase em japonês com tradução/opções.
      2. 'lego': Exercício de construção de frase (sintaxe), no qual a frase japonesa é dividida em blocos lógicos.
      3. 'mrp': Exercício de Mini Role Play com cenário social e opções de fala.
      
      REGRAS GERAIS:
      - Dificuldade: ${difficultyDescription}
      - Mantenha um tom divertido e pedagógico.
      - Para o tipo 'escuta', crie 4 opções em português (apenas uma correta), forneça um romaji e uma dica.
      - Para o tipo 'lego', divida a frase original em blocos com tipos adequados ('SUBJECT', 'OBJECT', 'VERB', 'PARTICLE', 'TIME', 'ADJECTIVE', 'OTHER') e forneça traduções individuais dos blocos se possível.
      - Para o tipo 'mrp', descreva um cenário e tarefa social reais (como fazer compras ou pedir ajuda), e dê 4 opções de fala em japonês acompanhadas de romaji entre parênteses, por exemplo: "これをください (Kore o kudasai)".
      
      Retorne os dados estritamente estruturados de acordo com o esquema definido.
    `;

        const response = await withRetry(() =>
            ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } },
                        { text: prompt },
                    ],
                },
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING, enum: ['escuta', 'lego', 'mrp'] },
                                escuta: {
                                    type: Type.OBJECT,
                                    properties: {
                                        japanese_sentence: { type: Type.STRING },
                                        romaji: { type: Type.STRING },
                                        options: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
                                        correct_index: { type: Type.INTEGER },
                                        hint: { type: Type.STRING },
                                        explanation: { type: Type.STRING },
                                        context_name: { type: Type.STRING },
                                        difficulty_level: { type: Type.STRING },
                                    },
                                    required: ['japanese_sentence', 'romaji', 'options', 'correct_index', 'hint', 'context_name'],
                                },
                                lego: {
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
                                mrp: {
                                    type: Type.OBJECT,
                                    properties: {
                                        scenario: { type: Type.STRING },
                                        task: { type: Type.STRING },
                                        hint: { type: Type.STRING },
                                        options: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
                                        correctAnswer: { type: Type.STRING },
                                        explanation: { type: Type.STRING },
                                        level: { type: Type.STRING },
                                        points: { type: Type.NUMBER },
                                    },
                                    required: ['scenario', 'task', 'hint', 'options', 'correctAnswer', 'explanation', 'level', 'points'],
                                },
                            },
                            required: ['type'],
                        },
                    },
                },
            })
        );

        const text = response.text;
        if (!text) throw new Error('A IA não retornou nenhum texto.');

        const rawQuestions = JSON.parse(text.trim());

        // Map and validate the questions into standardized HybridExercise format
        const exercises = rawQuestions.map((item: any, idx: number) => {
            const id = `q-${idx}`;
            if (item.type === 'escuta') {
                return {
                    id,
                    type: 'escuta',
                    data: {
                        ...item.escuta,
                        difficulty_level: item.escuta.difficulty_level || difficulty,
                    },
                };
            } else if (item.type === 'lego') {
                return {
                    id,
                    type: 'lego',
                    data: {
                        id: `lego-${idx}`,
                        original: item.lego.original,
                        translation: item.lego.translation,
                        blocks: item.lego.blocks.map((b: any, bIdx: number) => ({
                            id: `b-${idx}-${bIdx}`,
                            word: b.word,
                            romaji: b.romaji || '',
                            type: b.type,
                            translation: b.translation || '',
                        })),
                    },
                };
            } else if (item.type === 'mrp') {
                return {
                    id,
                    type: 'mrp',
                    data: {
                        id: idx + 1,
                        ...item.mrp,
                    },
                };
            }
            throw new Error(`Tipo de exercício desconhecido: ${item.type}`);
        });

        // Now, trigger TTS in parallel for all 'escuta' type questions
        const audioPromises = exercises.map(async (ex: any) => {
            if (ex.type === 'escuta') {
                try {
                    const voiceName = getVoiceForContext(ex.data.context_name);
                    const actingPrompt = `
            Atue como um falante nativo de japonês.
            Cenário: ${ex.data.context_name || 'Geral'}.
            Nível: ${ex.data.difficulty_level || difficulty}.
            Instrução: Fale de forma extremamente natural para este cenário, respeitando pausas e entonação adequada.
            Frase: ${ex.data.japanese_sentence}
          `;

                    const audioResponse = await withRetry(() =>
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

                    const audioData = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                    if (audioData) {
                        ex.data.audioBase64 = audioData;
                    }
                } catch (audioErr) {
                    console.error(`Erro ao gerar áudio TTS para frase: ${ex.data.japanese_sentence}`, audioErr);
                    // Do not block the whole generation if a single audio call fails, but set it as empty
                    ex.data.audioBase64 = '';
                }
            }
        });

        await Promise.all(audioPromises);

        return new Response(JSON.stringify({ exercises }), { status: 200 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        console.error('[generate-hybrid] ERRO COMPLETO:', err);
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
};
