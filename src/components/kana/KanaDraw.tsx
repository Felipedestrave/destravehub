import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { RefreshCcw, Download, Loader2 } from 'lucide-react';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import toast from 'react-hot-toast';

interface KanaDrawProps {
  char: string;
}

const easeInOutQuint = (t: number): number => {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
};

export const KANA_TO_ROMAJI: Record<string, string> = {
  // Hiragana
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'n',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',

  // Katakana
  'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
  'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
  'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
  'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
  'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
  'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
  'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
  'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
  'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
  'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n',
  'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
  'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
  'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
  'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
  'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
  'キャ': 'kya', 'キュ': 'kyu', 'キョ': 'kyo',
  'シャ': 'sha', 'シュ': 'shu', 'ショ': 'sho',
  'チャ': 'cha', 'チュ': 'chu', 'チョ': 'cho',
  'ニャ': 'nya', 'ニュ': 'nyu', 'ニョ': 'nyo',
  'ヒャ': 'hya', 'ヒュ': 'hyu', 'ヒョ': 'hyo',
  'ミャ': 'mya', 'ミュ': 'myu', 'ミョ': 'myo',
  'リャ': 'rya', 'リュ': 'ryu', 'リョ': 'ryo',
  'ギャ': 'gya', 'ギュ': 'gyu', 'ギョ': 'gyo',
  'ジャ': 'ja', 'ジュ': 'ju', 'ジョ': 'jo',
  'ビャ': 'bya', 'ビュ': 'byu', 'ビョ': 'byo',
  'ピャ': 'pya', 'ピュ': 'pyu', 'ピョ': 'pyo'
};

export function KanaDraw({ char }: KanaDrawProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [charIndices, setCharIndices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [strokeLengths, setStrokeLengths] = useState<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const cancelExportRef = useRef(false);

  const fetchCharacterPaths = async () => {
    try {
      setLoading(true);
      setError(false);
      setPaths([]);
      setCharIndices([]);
      setStrokeLengths([]);

      const fetchCharPaths = async (c: string) => {
        const hexCode = c.charCodeAt(0).toString(16).toLowerCase().padStart(5, '0');
        const url = `https://cdn.jsdelivr.net/gh/kanjivg/kanjivg@master/kanji/${hexCode}.svg`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Falha ao carregar os vetores de ${c}.`);

        const svgText = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const pathElements = Array.from(doc.querySelectorAll('path'));

        const strokeCoordinates = pathElements
          .map(el => el.getAttribute('d') || '')
          .filter(Boolean);

        if (strokeCoordinates.length === 0) {
          throw new Error(`Nenhum traço encontrado para ${c}.`);
        }
        return strokeCoordinates;
      };

      const allPaths: string[] = [];
      const indices: number[] = [];

      const p1 = await fetchCharPaths(char[0]);
      allPaths.push(...p1);
      indices.push(...Array(p1.length).fill(0));

      if (char.length > 1) {
        const p2 = await fetchCharPaths(char[1]);
        allPaths.push(...p2);
        indices.push(...Array(p2.length).fill(1));
      }

      setPaths(allPaths);
      setCharIndices(indices);
      setKey(prev => prev + 1);
    } catch (err: any) {
      console.error('[Fetch SVG Error]:', err);
      setError(true);
      toast.error(`Erro ao carregar escrita de "${char}".`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacterPaths();
  }, [char]);

  // Cancel GIF export on unmount or character change
  useEffect(() => {
    cancelExportRef.current = true;
    return () => {
      cancelExportRef.current = true;
    };
  }, [char]);

  // Measure path lengths in pixels dynamically inside browser Layout phase
  useLayoutEffect(() => {
    if (paths.length === 0) return;
    const lengths = paths.map((_, i) => {
      const el = pathRefs.current[i];
      return el ? el.getTotalLength() : 120;
    });
    setStrokeLengths(lengths);
  }, [paths, key]);

  const SPEED_PX_PER_MS = 0.055; 
  const MIN_DURATION = 900; 
  const PAUSE_BETWEEN_STROKES = 500; 
  const START_DELAY = 600; 

  // Compute timing metadata for each stroke animation
  const getAnimationMeta = () => {
    let accumulatedDelay = START_DELAY;
    const meta = strokeLengths.map((len) => {
      const duration = Math.max(MIN_DURATION, len / SPEED_PX_PER_MS);
      const start = accumulatedDelay;
      accumulatedDelay += duration + PAUSE_BETWEEN_STROKES;
      return { start, duration, length: len };
    });
    return { meta, totalDuration: accumulatedDelay + 800 };
  };

  const restartAnimation = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setKey(prev => prev + 1);
      setIsPlaying(true);
    }, 50);
  };

  // Motor de exportação de GIF dinâmico frame-a-frame no Canvas
  const handleDownloadGif = async () => {
    if (strokeLengths.length === 0 || paths.length === 0) return;
    cancelExportRef.current = false;
    setIsExporting(true);

    try {
      const gif = new GIFEncoder();
      const { meta, totalDuration } = getAnimationMeta();
      
      const fps = 15; 
      const width = 300;
      const height = 300;
      const dt = 1000 / fps;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error("Falha ao inicializar Canvas");

      for (let t = 0; t <= totalDuration; t += dt) {
        if (cancelExportRef.current) {
          throw new Error('Exportação cancelada.');
        }

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Grade de fundo
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height/2); ctx.lineTo(width, height/2);
        ctx.moveTo(width/2, 0); ctx.lineTo(width/2, height);
        ctx.stroke();

        const isYoon = char.length > 1;
        const viewBoxStr = isYoon ? "0 0 145 109" : "0 0 109 109";
        const getTransform = (charIdx: number) => {
          if (!isYoon) return "";
          if (charIdx === 0) return "translate(0, 5) scale(0.85)";
          return "translate(75, 30) scale(0.6)";
        };

        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBoxStr}">`;
        
        // Traços de fundo translúcidos
        svgContent += `<g stroke="#e2e8f0" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round">`;
        paths.forEach((p, i) => { 
          const tf = getTransform(charIndices[i]);
          const tfAttr = tf ? ` transform="${tf}"` : "";
          svgContent += `<path d="${p}"${tfAttr} />`; 
        });
        svgContent += `</g>`;

        // Traços desenhados progressivamente
        svgContent += `<g stroke="#0f172a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round">`;
        paths.forEach((p, i) => {
            const { start, duration, length } = meta[i];
            let progress = 0;
            if (t < start) progress = 0;
            else if (t > start + duration) progress = 1;
            else {
                const localT = (t - start) / duration;
                progress = easeInOutQuint(localT);
            }
            const offset = length * (1 - progress);
            if (progress > 0) {
                 const tf = getTransform(charIndices[i]);
                 const tfAttr = tf ? ` transform="${tf}"` : "";
                 svgContent += `<path d="${p}"${tfAttr} stroke-dasharray="${length} ${length}" stroke-dashoffset="${offset}" />`;
            }
        });
        svgContent += `</g></svg>`;

        const img = new Image();
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        await new Promise((resolve, reject) => {
            img.onload = () => {
                ctx.drawImage(img, 0, 0, width, height);
                URL.revokeObjectURL(url);
                resolve(null);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Erro ao desenhar imagem no canvas"));
            };
            img.src = url;
        });

        const data = ctx.getImageData(0, 0, width, height).data;
        const palette = quantize(data, 128);
        const index = applyPalette(data, palette);
        gif.writeFrame(index, width, height, { palette, delay: dt });
      }

      gif.finish();
      const buffer = gif.bytes();
      const blob = new Blob([buffer], { type: 'image/gif' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `escrita_${char}_${Date.now()}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('GIF exportado com sucesso!');
    } catch (e: any) {
      console.error("Erro na geração de GIF:", e);
      if (e.message === 'Exportação cancelada.') {
        toast.error("Geração do GIF cancelada.");
      } else {
        toast.error("Erro ao criar GIF.");
      }
    } finally {
      setIsExporting(false);
    }
  };

  const { meta } = strokeLengths.length > 0 ? getAnimationMeta() : { meta: [] };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white border border-[var(--color-slate-border)] rounded-2xl h-80 shadow-sm animate-pulse">
        <Loader2 className="animate-spin text-[var(--color-brand)] h-8 w-8 mb-2" />
        <span className="text-sm font-semibold text-[var(--color-slate-mid)]">Buscando ordem dos traços...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white border border-[var(--color-slate-border)] rounded-2xl shadow-sm">
      <div className="flex items-center justify-between w-full border-b border-[var(--color-slate-border)] pb-3">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-slate-mid)]">Ordem dos Traços</span>
            <span className="text-lg font-bold font-outfit text-[var(--color-slate-dark)]">Escrita de "{char}"</span>
          </div>
          {/* Pronúncia em Destaque Especial */}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl shadow-sm font-outfit select-none">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Pronúncia:</span>
            <span className="text-base font-black tracking-wide">/ {KANA_TO_ROMAJI[char] || char} /</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={restartAnimation}
            disabled={error}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-ice)] text-[var(--color-brand)] font-bold text-xs rounded-lg border border-[var(--color-slate-border)] hover:bg-[var(--color-brand)] hover:text-white transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCcw size={13} />
            Reescrever
          </button>
          
          <button
            disabled={isExporting || error || strokeLengths.length === 0}
            onClick={handleDownloadGif}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-black transition-all shadow-sm disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={13} className="animate-spin"/> : <Download size={13} />}
            {isExporting ? 'Criando...' : 'GIF'}
          </button>
        </div>
      </div>

      <div 
        className="relative bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden shadow-inner w-64 h-64"
      >
        {/* Japanese writing auxiliary grid */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
          <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-slate-300"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-slate-300"></div>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center text-center p-4 gap-3 z-10 w-full h-full animate-fade-in">
            <span className="text-3xl">🧑‍🦲</span>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wide">Ops! Algo deu errado</span>
              <p className="text-[10px] leading-snug text-slate-500 font-semibold px-2">
                Erro ao carregar o traçado. Calma! Estamos ficando carecas de tanto trabalhar para solucionar esta falha!
              </p>
            </div>
            <button
              onClick={fetchCharacterPaths}
              className="px-3.5 py-1.5 bg-[var(--color-brand)] text-white text-xs font-bold rounded-lg hover:bg-[var(--color-action)] transition-all shadow-sm flex items-center gap-1.5"
            >
              <RefreshCcw size={12} />
              Tentar Novamente
            </button>
          </div>
        ) : paths.length > 0 && (
          <svg 
            key={key}
            width="180" 
            height="180" 
            viewBox={char.length > 1 ? "0 0 145 109" : "0 0 109 109"}
            className="relative z-10"
          >
            {/* Guide layers (desaturated backing strokes) */}
            <g stroke="#cbd5e1" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {paths.map((d, index) => {
                const tf = char.length > 1 ? (charIndices[index] === 0 ? "translate(0, 5) scale(0.85)" : "translate(75, 30) scale(0.6)") : undefined;
                return <path key={`bg-${index}`} d={d} transform={tf} />;
              })}
            </g>

            {/* Animating active layers */}
            <g stroke="var(--color-slate-dark)" strokeWidth="5.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {strokeLengths.length > 0 && isPlaying && paths.map((d, index) => {
                 const { start, duration, length } = meta[index];
                 const tf = char.length > 1 ? (charIndices[index] === 0 ? "translate(0, 5) scale(0.85)" : "translate(75, 30) scale(0.6)") : undefined;
                 return (
                   <path
                     key={`stroke-${index}`}
                     ref={el => pathRefs.current[index] = el}
                     d={d}
                     transform={tf}
                     style={{
                       strokeDasharray: length,
                       strokeDashoffset: length,
                       animation: `drawFluid ${duration}ms cubic-bezier(0.64, 0, 0.35, 1) forwards`,
                       animationDelay: `${start}ms`
                     }}
                   />
                 );
              })}
              
              {/* Measurement initialization nodes */}
              {strokeLengths.length === 0 && paths.map((d, index) => {
                 const tf = char.length > 1 ? (charIndices[index] === 0 ? "translate(0, 5) scale(0.85)" : "translate(75, 30) scale(0.6)") : undefined;
                 return (
                   <path
                    key={`measure-${index}`}
                    ref={el => pathRefs.current[index] = el}
                    d={d}
                    transform={tf}
                    opacity="0"
                   />
                 );
              })}
            </g>

            {/* Stroke order number circles */}
            {strokeLengths.length > 0 && isPlaying && paths.map((d, index) => {
              const startMatch = d.match(/^M\s*([\d.]+)\s+([\d.]+)/);
              if (!startMatch) return null;
              const startX = parseFloat(startMatch[1]);
              const startY = parseFloat(startMatch[2]);
              const { start } = meta[index];
              const tf = char.length > 1 ? (charIndices[index] === 0 ? "translate(0, 5) scale(0.85)" : "translate(75, 30) scale(0.6)") : undefined;

              return (
                <g
                  key={`num-${index}`}
                  className="animate-fade-in"
                  transform={tf}
                  style={{
                    animationDelay: `${start}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <circle
                    cx={startX}
                    cy={startY - 6}
                    r="4.5"
                    fill="var(--color-brand)"
                    stroke="white"
                    strokeWidth="1.2"
                  />
                  <text
                    x={startX}
                    y={startY - 3.8}
                    fill="white"
                    fontSize="7"
                    fontWeight="900"
                    textAnchor="middle"
                    fontFamily="var(--font-outfit), sans-serif"
                  >
                    {index + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {/* CSS fluid animations definition */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes drawFluid {
            to { stroke-dashoffset: 0; }
          }
        `}} />

        <div className="absolute bottom-3 right-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">
          {paths.length} Traços
        </div>
      </div>

      <div className="w-full bg-[var(--color-ice)] p-3 rounded-xl border border-[var(--color-slate-border)] flex items-center justify-between text-xs font-bold text-[var(--color-slate-mid)]">
        <span>Código Unicode: U+{char.charCodeAt(0).toString(16).toUpperCase()}</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
          Velocidade Orgânica
        </span>
      </div>
    </div>
  );
}
