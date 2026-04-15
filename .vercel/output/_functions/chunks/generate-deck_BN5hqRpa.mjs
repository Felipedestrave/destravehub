import { GoogleGenAI, Type } from '@google/genai';

const withRetry = async (fn, retries = 3, delay = 2e3) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error?.message?.includes("429")) {
      await new Promise((r) => setTimeout(r, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};
const POST = async ({ request }) => {
  const geminiKey = "AIzaSyBfZOsc5MIfxo2Trc3YOKELWPM3eA_0gic";
  let config;
  try {
    config = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Payload inválido." }), { status: 400 });
  }
  const { context, title, level, quantity, pdfBase64 } = config;
  if (!pdfBase64 && (!context || context.trim().length < 20)) {
    return new Response(JSON.stringify({ error: "Forneça um PDF ou um texto base de pelos menos 20 caracteres." }), { status: 400 });
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
    1. FRENTE ('front'): Palavra ou gramática em japonês (Kanji/Kana).
    2. LEITURA ('reading'): Leitura em Hiragana/Katakana.
    3. VERSO ('back'): Tradução clara em português.
    4. EXEMPLO ('example'): Frase de exemplo em japonês NO CONTEXTO da aula.
    5. TRADUÇÃO DO EXEMPLO ('exampleTranslation'): Tradução do exemplo.
    6. NÍVEL ('level'): Use exatamente "${level}".
    7. VARIEDADE: Mescle vocabulário e padrões gramaticais.

    Retorne APENAS um JSON array contendo os ${quantity} objetos.
    `;
  try {
    const parts = [{ text: prompt }];
    if (pdfBase64) {
      parts.push({ inlineData: { mimeType: "application/pdf", data: pdfBase64 } });
    }
    const result = await withRetry(
      () => ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts }],
        config: {
          responseMimeType: "application/json",
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
                level: { type: Type.STRING }
              },
              required: ["front", "reading", "back", "example", "exampleTranslation", "level"]
            }
          }
        }
      })
    );
    const text = result.text;
    if (!text) throw new Error("IA retornou resposta vazia.");
    const raw = JSON.parse(text);
    const cards = raw.map((c, idx) => ({
      ...c,
      id: `card-${idx}-${Date.now()}`
    }));
    return new Response(JSON.stringify({ cards }), { status: 200 });
  } catch (err) {
    console.error("[Deck Generation Error]:", err);
    return new Response(JSON.stringify({ error: "Erro ao gerar deck: " + err.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
