import { GoogleGenAI, Type } from '@google/genai';

const withRetry = async (fn, retries = 3, delay = 2e3) => {
  try {
    return await fn();
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    const isRateLimit = msg.includes("429");
    if (retries > 0 && isRateLimit) {
      await new Promise((r) => setTimeout(r, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};
const getDifficultyPrompt = (difficulty) => {
  switch (difficulty) {
    case "Fácil":
      return "Nível JLPT N5 (Básico). Use apenas gramática e vocabulário fundamental de N5. Frases simples e diretas.";
    case "Intermediário":
      return "Nível JLPT N4 (Elementar). Use gramática de N4 (formas Te, Ta, Nai, potencial básico). Vocabulário cotidiano.";
    case "Avançado":
      return "Nível JLPT N3 (Intermediário). Use gramática de N3 (conjunções complexas, expressões de opinião). Sem Keigo.";
    case "Misturado":
      return "Mistura equilibrada de N5, N4 e N3. Varie a dificuldade entre questões.";
    default:
      return "Nível JLPT N5.";
  }
};
const POST = async ({ request }) => {
  try {
    const apiKey = "AIzaSyBfZOsc5MIfxo2Trc3YOKELWPM3eA_0gic";
    if (!apiKey) ;
    const body = await request.json();
    const { pdfBase64, difficulty, count, focus } = body;
    if (!pdfBase64 || !difficulty || !count) {
      return new Response(JSON.stringify({ error: "pdfBase64, difficulty e count são obrigatórios." }), { status: 400 });
    }
    const ai = new GoogleGenAI({ apiKey });
    const difficultyDescription = getDifficultyPrompt(difficulty);
    const focusInstruction = focus === "Tradução Fiel" ? "As 4 opções em português devem ser TRADUÇÕES COMPLETAS e fiéis da frase. Teste precisão léxica e gramatical." : "As 4 opções devem focar na ESSÊNCIA ou INTENÇÃO da fala. Teste se o aluno entendeu o contexto comunicativo.";
    const prompt = `
      Você é um professor de japonês (Sensei) especialista em JLPT.
      Analise o material didático em PDF fornecido.
      Crie exatamente ${count} exercícios de compreensão auditiva (Listening) baseados no vocabulário do PDF.

      REGRAS:
      1. Dificuldade: ${difficultyDescription}
      2. Foco das alternativas: ${focusInstruction}
      3. Diversidade: Cada questão com cenário diferente (restaurante, aeroporto, escola, hospital, etc).
      4. Registro: Varie entre polido (Desu-Masu) e casual. NUNCA use Keigo.
      5. Estrutura: Situações de vida real usando vocabulário do PDF.

      Cada objeto deve conter:
      - japanese_sentence: A frase em japonês (Kanji/Kana).
      - romaji: Transcrição fonética.
      - options: 4 opções em Português (apenas uma correta).
      - correct_index: Índice da correta (0-3).
      - hint: Dica sutil em português.
      - explanation: Por que esta frase foi escolhida.
      - context_name: Nome do cenário (ex: "No Hospital").
      - difficulty_level: Dificuldade desta questão (Fácil, Intermediário ou Avançado).

      Responda APENAS com o JSON contendo um array de objetos.
    `;
    const response = await withRetry(
      () => ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
          parts: [
            { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                japanese_sentence: { type: Type.STRING },
                romaji: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
                correct_index: { type: Type.INTEGER },
                hint: { type: Type.STRING },
                explanation: { type: Type.STRING },
                context_name: { type: Type.STRING },
                difficulty_level: { type: Type.STRING }
              },
              required: ["japanese_sentence", "options", "correct_index", "hint", "context_name"]
            }
          }
        }
      })
    );
    const text = response.text;
    if (!text) throw new Error("Resposta vazia da IA.");
    const questions = JSON.parse(text.trim());
    return new Response(JSON.stringify({ questions }), { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
