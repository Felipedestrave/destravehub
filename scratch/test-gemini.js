import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const geminiKey = process.env.GEMINI_API_KEY;
console.log('Using Gemini Key:', geminiKey ? 'KEY_FOUND' : 'NOT_FOUND');

if (!geminiKey) {
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: geminiKey });

async function test() {
  const allowedCharsStr = "あ, い, う, え, お, か, き, く, け, こ";
  const prompt = `
  Você é um Professor de Japonês (Sensei) encarregado de criar um exercício personalizado para um aluno.
  O aluno está estudando o alfabeto "hiragana" e concluiu a lição 1.
  
  REGRAS CRÍTICAS DE CONSTRANGIMENTO DE CARACTERES:
  1. O aluno APENAS aprendeu e sabe ler estes caracteres: [${allowedCharsStr}].
  2. Você deve gerar exatamente 10 palavras REAIS da língua japonesa que possam ser escritas USANDO EXCLUSIVAMENTE os caracteres acima listados.
  3. É ABSOLUTAMENTE PROIBIDO utilizar Kanjis ou quaisquer outros caracteres do Hiragana/Katakana fora da lista fornecida!
  
  REGRAS DOS EXERCÍCIOS:
  - Para cada uma das 10 palavras, gere 4 alternativas de escolha (opções).
  - Cada alternativa deve estar no formato "Leitura em Romaji - Significado em português" (Ex: "aka - Vermelho").
  - Exatamente 1 alternativa deve ser a correta (isCorrect: true) e 3 devem ser incorretas (isCorrect: false).
  
  Retorne um JSON com o campo 'questions' contendo o array com os 10 objetos gerados.
  `;

  try {
    console.log('Sending request to Gemini API...');
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  romaji: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING },
                        isCorrect: { type: Type.BOOLEAN }
                      },
                      required: ['text', 'isCorrect']
                    }
                  }
                },
                required: ['word', 'romaji', 'meaning', 'options']
              }
            }
          },
          required: ['questions']
        }
      }
    });

    console.log('API Response received successfully:');
    console.log(JSON.stringify(JSON.parse(result.text), null, 2));
  } catch (error) {
    console.error('Error during Gemini API call:', error);
  }
}

test();
