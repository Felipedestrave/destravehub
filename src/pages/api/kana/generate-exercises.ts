import type { APIRoute } from 'astro';
import { GoogleGenAI, Type } from '@google/genai';
import { supabase } from '../../../lib/supabase';

const HIRAGANA_CHARS = [
  ['あ', 'い', 'う', 'え', 'お'], // 1
  ['か', 'き', 'く', 'ke', 'け', 'こ'], // 2
  ['さ', 'し', 'す', 'se', 'せ', 'そ'], // 3
  ['た', 'ち', 'つ', 'te', 'て', 'と'], // 4
  ['な', 'に', 'ぬ', 'ね', 'の'], // 5
  ['は', 'ひ', 'ふ', 'へ', 'ほ'], // 6
  ['ま', 'み', 'む', 'め', 'mo', 'も'], // 7
  ['や', 'ゆ', 'よ'], // 8
  ['ら', 'り', 'る', 'れ', 'ろ'], // 9
  ['わ', 'を', 'ん'], // 10
  ['が', 'ぎ', 'ぐ', 'げ', 'ご', 'ざ', 'じ', 'ず', 'ぜ', 'zo', 'ぞ'], // 11
  ['だ', 'ぢ', 'づ', 'de', 'で', 'ど', 'ba', 'bi', 'bu', 'be', 'bo', 'ば', 'び', 'ぶ', 'べ', 'bo', 'ぼ'], // 12
  ['ぱ', 'pi', 'pu', 'pe', 'po', 'ぴ', 'ぷ', 'ぺ', 'ぽ'], // 13
  ['きゃ', 'きゅ', 'きょ', 'sha', 'shu', 'sho', 'しゃ', 'しゅ', 'しょ'], // 14
  ['cha', 'chu', 'cho', 'ちゃ', 'ちゅ', 'ちょ', 'nya', 'nyu', 'nyo', 'にゃ', 'にゅ', 'にょ'], // 15
  ['hya', 'hyu', 'hyo', 'mya', 'myu', 'myo', 'ひゃ', 'ひゅ', 'ひょ', 'みゃ', 'みゅ', 'みょ'], // 16
  ['りゃ', 'りゅ', 'りょ', 'gya', 'gyu', 'gyo', 'ぎゃ', 'ぎゅ', 'ぎょ', 'ja', 'ju', 'jo', 'じゃ', 'じゅ', 'じょ'], // 17
  ['bya', 'byu', 'byo', 'pya', 'pyu', 'pyo', 'びゃ', 'びゅ', 'びょ', 'ぴゃ', 'ぴu', 'ぴゅ', 'ぴょ'] // 18
];

const KATAKANA_CHARS = [
  ['ア', 'イ', 'ウ', 'エ', 'オ'], // 1
  ['カ', 'キ', 'ク', 'ケ', 'コ'], // 2
  ['サ', 'シ', 'ス', 'セ', 'ソ'], // 3
  ['タ', 'チ', 'ツ', 'テ', 'ト'], // 4
  ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'], // 5
  ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'], // 6
  ['マ', 'ミ', 'ム', 'メ', 'モ'], // 7
  ['ヤ', 'ユ', 'ヨ'], // 8
  ['ラ', 'リ', 'ル', 'レ', 'ロ'], // 9
  ['ワ', 'ヲ', 'ン'], // 10
  ['ガ', 'ギ', 'グ', 'ゲ', 'ゴ', 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ'], // 11
  ['ダ', 'ヂ', 'ヅ', 'デ', 'ド', 'バ', 'ビ', 'ブ', 'ベ', 'ボ'], // 12
  ['パ', 'ピ', 'プ', 'ペ', 'ポ'], // 13
  ['キャ', 'キュ', 'キョ', 'シャ', 'シュ', 'ショ'], // 14
  ['チャ', 'チュ', 'チョ', 'ニャ', 'ニュ', 'ニョ'], // 15
  ['ヒャ', 'ヒュ', 'ヒョ', 'ミャ', 'ミュ', 'ミョ'], // 16
  ['リャ', 'リュ', 'リョ', 'ギャ', 'ギュ', 'ギョ', 'ジャ', 'ジュ', 'ジョ'], // 17
  ['ビャ', 'ビュ', 'ビョ', 'ピャ', 'ピュ', 'ピョ'] // 18
];

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

export const GET: APIRoute = async ({ request }) => {
  const geminiKey = import.meta.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return new Response(JSON.stringify({ error: 'Gemini API Key não configurada.' }), { status: 500 });
  }

  // 1. Verify User Authentication
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Autorização necessária.' }), { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Sessão expirada ou inválida.' }), { status: 401 });
  }

  // 2. Parse URL parameters
  const url = new URL(request.url);
  const module = url.searchParams.get('module') as 'hiragana' | 'katakana';
  const lessonId = parseInt(url.searchParams.get('lessonId') || '1');

  if (!module || !['hiragana', 'katakana'].includes(module) || isNaN(lessonId) || lessonId < 1 || lessonId > 18) {
    return new Response(JSON.stringify({ error: 'Parâmetros de módulo ou lição inválidos.' }), { status: 400 });
  }

  // 3. Assemble the allowed characters list
  let allowedChars: string[] = [];
  const customChars = url.searchParams.get('customChars');

  if (customChars) {
    allowedChars = customChars.split(',').map(c => c.trim()).filter(Boolean);
  } else {
    const charsConfig = module === 'hiragana' ? HIRAGANA_CHARS : KATAKANA_CHARS;
    for (let i = 0; i < Math.min(lessonId, charsConfig.length); i++) {
      allowedChars.push(...charsConfig[i]);
    }
  }

  const allowedCharsStr = allowedChars.join(', ');

  const ai = new GoogleGenAI({ apiKey: geminiKey });

  // 4. Construct Socratic Prompt constraining character usage strictly
  const prompt = `
  Você é um Professor de Japonês (Sensei) encarregado de criar um exercício personalizado para um aluno.
  O aluno está estudando o alfabeto "${module}"${customChars ? ' e precisa de um treino reforçado de caracteres específicos.' : ` e concluiu a lição ${lessonId}.`}
  
  REGRAS CRÍTICAS DE CONSTRANGIMENTO DE CARACTERES:
  1. O aluno APENAS aprendeu e sabe ler estes caracteres: [${allowedCharsStr}].
  2. Você deve gerar exatamente 10 palavras REAIS da língua japonesa que possam ser escritas USANDO EXCLUSIVAMENTE os caracteres acima listados.
  3. É ABSOLUTAMENTE PROIBIDO utilizar Kanjis ou quaisquer outros caracteres do Hiragana/Katakana fora da lista fornecida!
  4. Por exemplo: se a lista NÃO contiver o caractere 'さ', a palavra 'あさ' (asa) NÃO pode ser gerada. Verifique caractere por caractere de cada palavra gerada contra a lista de autorizados antes de finalizar.
  
  REGRAS DOS EXERCÍCIOS:
  - Para cada uma das 10 palavras, gere 4 alternativas de escolha (opções).
  - Cada alternativa deve estar no formato "Leitura em Romaji - Significado em português" (Ex: "aka - Vermelho").
  - Exatamente 1 alternativa deve ser a correta (isCorrect: true) e 3 devem ser incorretas (isCorrect: false).
  - As alternativas incorretas devem usar palavras válidas em japonês (com sua leitura e tradução real), mas diferentes da palavra-pergunta.
  
  Retorne um JSON com o campo 'questions' contendo o array com os 10 objetos gerados.
  `;

  try {
    const result = await withRetry(() =>
      ai.models.generateContent({
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
      })
    );

    const text = result.text;
    if (!text) throw new Error('IA retornou uma resposta vazia.');

    const parsedData = JSON.parse(text);
    if (parsedData.questions && Array.isArray(parsedData.questions)) {
      parsedData.questions.forEach((q: any) => {
        if (q.options && Array.isArray(q.options)) {
          const arr = q.options;
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
        }
      });
    }

    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (err: any) {
    console.error('[Generate Kana Exercises Error]:', err);
    return new Response(JSON.stringify({ error: 'Erro ao gerar exercícios via IA: ' + err.message }), { status: 500 });
  }
};
