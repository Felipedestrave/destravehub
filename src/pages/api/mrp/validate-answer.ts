import type { APIRoute } from 'astro';
import { GoogleGenAI, Type } from '@google/genai';
import type { MrpQuestion } from '../../../types/mrp';

export const POST: APIRoute = async ({ request }) => {
    const geminiKey = import.meta.env.GEMINI_API_KEY;
    if (!geminiKey) {
        return new Response(JSON.stringify({ error: 'Gemini API Key não configurada.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let body: { question: MrpQuestion; userAnswer: string };
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Payload inválido.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { question, userAnswer } = body;

    // Fast-path: character-for-character match (ignoring spaces/punctuation)
    const normalize = (s: string) =>
        s.replace(/[\s\u3000\u3001\u3002,.?!！？]/g, '').trim();

    if (normalize(userAnswer) === normalize(question.correctAnswer)) {
        return new Response(
            JSON.stringify({ isCorrect: true, feedback: 'Excelente! Sua resposta coincide exatamente com o esperado. 🎉' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const prompt = `
    VOCÊ É UM JUIZ DE LÍNGUA JAPONESA (SENSEI).
    Avalie se a resposta do aluno é uma tradução ou frase correta para o cenário abaixo.

    CENÁRIO: ${question.scenario}
    TAREFA: ${question.task}
    RESPOSTA REFERÊNCIA: ${question.correctAnswer}
    RESPOSTA DO ALUNO: ${userAnswer}

    CRITÉRIOS (SEJA JUSTO E LENIENTE):
    1. ACEITE variações gramaticalmente corretas que passem a mesma ideia.
    2. ACEITE a omissão de pronomes (como 'watashi wa') se for natural.
    3. ACEITE Kanji ou Hiragana indistintamente, desde que a leitura esteja correta.
    4. VERIFIQUE a polidez: se o cenário pede algo polido e o aluno usou casual, considere errado ou forneça feedback.
    5. PEQUENOS ERROS: Se for apenas um caractere de diferença mas a estrutura estiver certa, considere a intenção.

    Retorne JSON: { "isCorrect": boolean, "feedback": "Explicação detalhada em português." }
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro-preview-03-25',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isCorrect: { type: Type.BOOLEAN },
                        feedback: { type: Type.STRING },
                    },
                    required: ['isCorrect', 'feedback'],
                },
            },
        });

        const result = JSON.parse(response.text || '{"isCorrect":false,"feedback":"Erro na avaliação."}');

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        console.error('[MRP] Erro ao validar resposta:', err);
        return new Response(
            JSON.stringify({ isCorrect: false, feedback: 'O sistema de avaliação teve um problema. Tente novamente.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
        );
    }
};
