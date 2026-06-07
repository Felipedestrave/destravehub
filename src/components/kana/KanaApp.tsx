import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { KanaDraw, KANA_TO_ROMAJI } from './KanaDraw';
import { KanaExercises } from './KanaExercises';

interface Lesson {
  id: number;
  name: string;
  description: string;
  chars: string[];
  moduleType: 'hiragana' | 'katakana';
}

const LESSONS: Lesson[] = [
  // Hiragana
  { id: 1, name: 'Vogais (あ-お)', description: 'As 5 vogais fundamentais do japonês', chars: ['あ', 'い', 'う', 'え', 'お'], moduleType: 'hiragana' },
  { id: 2, name: 'Família K (か-こ)', description: 'Consoante K combinada com as vogais', chars: ['か', 'き', 'く', 'け', 'こ'], moduleType: 'hiragana' },
  { id: 3, name: 'Família S (さ-そ)', description: 'Consoante S (com sh) combinada com as vogais', chars: ['さ', 'し', 'す', 'せ', 'そ'], moduleType: 'hiragana' },
  { id: 4, name: 'Família T (た-と)', description: 'Consoante T (com ch/tsu) combinada com as vogais', chars: ['た', 'ち', 'つ', 'て', 'と'], moduleType: 'hiragana' },
  { id: 5, name: 'Família N (な-の)', description: 'Consoante N combinada com as vogais', chars: ['na', 'ni', 'nu', 'ne', 'no'], moduleType: 'hiragana' }, // placeholder chars
  { id: 6, name: 'Família H (は-ほ)', description: 'Consoante H (com f) combinada com as vogais', chars: ['ha', 'hi', 'fu', 'he', 'ho'], moduleType: 'hiragana' },
  { id: 7, name: 'Família M (ま-も)', description: 'Consoante M combinada com as vogais', chars: ['ma', 'mi', 'mu', 'me', 'mo'], moduleType: 'hiragana' },
  { id: 8, name: 'Família Y (や-よ)', description: 'Semiconsante Y (apenas 3 sons)', chars: ['ya', 'yu', 'yo'], moduleType: 'hiragana' },
  { id: 9, name: 'Família R (ら-ろ)', description: 'Sons vibrantes do R japonês', chars: ['ra', 'ri', 'ru', 're', 'ro'], moduleType: 'hiragana' },
  { id: 10, name: 'Família W/N (わ,を,ん)', description: 'Vogais modificadas e a consoante isolada N', chars: ['wa', 'wo', 'n'], moduleType: 'hiragana' },
  { id: 11, name: 'Dakuten G & Z', description: 'Famílias com aspas: G (ga-go) e Z (za-zo)', chars: ['ga', 'gi', 'gu', 'ge', 'go', 'za', 'ji', 'zu', 'ze', 'zo'], moduleType: 'hiragana' },
  { id: 12, name: 'Dakuten D & B', description: 'Famílias com aspas: D (da-do) e B (ba-bo)', chars: ['da', 'dji', 'dzu', 'de', 'do', 'ba', 'bi', 'bu', 'be', 'bo'], moduleType: 'hiragana' },
  { id: 13, name: 'Handakuten P', description: 'Família com círculo: P (pa-po)', chars: ['pa', 'pi', 'pu', 'pe', 'po'], moduleType: 'hiragana' },
  { id: 14, name: 'Yōon K & S', description: 'Combinações kya-kyo e sha-sho', chars: ['kya', 'kyu', 'kyo', 'sha', 'shu', 'sho'], moduleType: 'hiragana' },
  { id: 15, name: 'Yōon T & N', description: 'Combinações cha-cho e nya-nyo', chars: ['cha', 'chu', 'cho', 'nya', 'nyu', 'nyo'], moduleType: 'hiragana' },
  { id: 16, name: 'Yōon H & M', description: 'Combinações hya-hyo e mya-myo', chars: ['hya', 'hyu', 'hyo', 'mya', 'myu', 'myo'], moduleType: 'hiragana' },
  { id: 17, name: 'Yōon R/G/Z', description: 'Combinações rya-ryo, gya-gyo e ja-jo', chars: ['rya', 'ryu', 'ryo', 'gya', 'gyu', 'gyo', 'ja', 'ju', 'jo'], moduleType: 'hiragana' },
  { id: 18, name: 'Yōon D/B/P', description: 'Combinações bya-byo e pya-pyo', chars: ['bya', 'byu', 'byo', 'pya', 'pyu', 'pyo'], moduleType: 'hiragana' },

  // Katakana
  { id: 1, name: 'Vogais (ア-オ)', description: 'As 5 vogais fundamentais do japonês', chars: ['ア', 'イ', 'ウ', 'エ', 'オ'], moduleType: 'katakana' },
  { id: 2, name: 'Família K (カ-コ)', description: 'Consoante K combinada com as vogais', chars: ['カ', 'キ', 'ク', 'ケ', 'コ'], moduleType: 'katakana' },
  { id: 3, name: 'Família S (サ-ソ)', description: 'Consoante S (com sh) combinada com as vogais', chars: ['サ', 'シ', 'ス', 'セ', 'ソ'], moduleType: 'katakana' },
  { id: 4, name: 'Família T (タ-ト)', description: 'Consoante T (com ch/tsu) combinada com as vogais', chars: ['タ', 'チ', 'ツ', 'テ', 'ト'], moduleType: 'katakana' },
  { id: 5, name: 'Família N (ナ-ノ)', description: 'Consoante N combinada com as vogais', chars: ['na', 'ni', 'nu', 'ne', 'no'], moduleType: 'katakana' }, // placeholders
  { id: 6, name: 'Família H (ハ-ホ)', description: 'Consoante H (com f) combinada com as vogais', chars: ['ha', 'hi', 'fu', 'he', 'ho'], moduleType: 'katakana' },
  { id: 7, name: 'Família M (マ-モ)', description: 'Consoante M combinada com as vogais', chars: ['ma', 'mi', 'mu', 'me', 'mo'], moduleType: 'katakana' },
  { id: 8, name: 'Família Y (ヤ-ヨ)', description: 'Semiconsante Y (apenas 3 sons)', chars: ['ya', 'yu', 'yo'], moduleType: 'katakana' },
  { id: 9, name: 'Família R (ラ-ロ)', description: 'Sons vibrantes do R japonês', chars: ['ra', 'ri', 'ru', 're', 'ro'], moduleType: 'katakana' },
  { id: 10, name: 'Família W/N (ワ,ヲ,ン)', description: 'Vogais modificadas e a consoante isolada N', chars: ['wa', 'wo', 'n'], moduleType: 'katakana' },
  { id: 11, name: 'Dakuten G & Z', description: 'Famílias com aspas: G (ga-go) e Z (za-zo)', chars: ['ga', 'gi', 'gu', 'ge', 'go', 'za', 'ji', 'zu', 'ze', 'zo'], moduleType: 'katakana' },
  { id: 12, name: 'Dakuten D & B', description: 'Famílias com aspas: D (da-do) e B (ba-bo)', chars: ['da', 'dji', 'dzu', 'de', 'do', 'ba', 'bi', 'bu', 'be', 'bo'], moduleType: 'katakana' },
  { id: 13, name: 'Handakuten P', description: 'Família com círculo: P (pa-po)', chars: ['pa', 'pi', 'pu', 'pe', 'po'], moduleType: 'katakana' },
  { id: 14, name: 'Yōon K & S', description: 'Combinações kya-kyo e sha-sho', chars: ['kya', 'kyu', 'kyo', 'sha', 'shu', 'sho'], moduleType: 'katakana' },
  { id: 15, name: 'Yōon T & N', description: 'Combinações cha-cho e nya-nyo', chars: ['cha', 'chu', 'cho', 'nya', 'nyu', 'nyo'], moduleType: 'katakana' },
  { id: 16, name: 'Yōon H & M', description: 'Combinações hya-hyo e mya-myo', chars: ['hya', 'hyu', 'hyo', 'mya', 'myu', 'myo'], moduleType: 'katakana' },
  { id: 17, name: 'Yōon R/G/Z', description: 'Combinações rya-ryo, gya-gyo e ja-jo', chars: ['rya', 'ryu', 'ryo', 'gya', 'gyu', 'gyo', 'ja', 'ju', 'jo'], moduleType: 'katakana' },
  { id: 18, name: 'Yōon D/B/P', description: 'Combinações bya-byo e pya-pyo', chars: ['bya', 'byu', 'byo', 'pya', 'pyu', 'pyo'], moduleType: 'katakana' }
];

export function KanaApp() {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedChar, setSelectedChar] = useState<string>('');
  const [viewState, setViewState] = useState<'list' | 'study' | 'quiz' | 'completed'>('list');
  const [userRole, setUserRole] = useState<'teacher' | 'student' | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const [completedLessons, setCompletedLessons] = useState<Record<'hiragana' | 'katakana', number[]>>({
    hiragana: [],
    katakana: []
  });
  
  const [lastQuizResult, setLastQuizResult] = useState<{
    score: number;
    coinsEarned: number;
    xpEarned: number;
  } | null>(null);

  // Fetch user role at mount
  useEffect(() => {
    async function checkUserRole() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        const role = profile?.role || 'student';
        setUserRole(role);
        if (role === 'teacher') {
          setIsPreviewMode(true);
        }
      } catch (err) {
        console.error('[Check Role Error]:', err);
      }
    }
    checkUserRole();
  }, []);

  // Load completed lessons from student metadata
  useEffect(() => {
    async function loadCompletedProgress() {
      if (isPreviewMode) {
        // No need to query database progress for teachers/preview mode
        return;
      }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) return;

        // Fetch completed progress from student endpoint (we can parse student profile/metadata info)
        const res = await fetch('/api/student/missions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        // Let's see if metadata has completed_kana_lessons
        // We can fetch student details or handle it dynamically
        const studentRes = await fetch('/api/kana/reward', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const progressData = await studentRes.json();
        if (progressData.completedProgress) {
          setCompletedLessons(progressData.completedProgress);
        }
      } catch (err) {
        console.error('[Load Progress Error]:', err);
      }
    }

    loadCompletedProgress();
  }, [viewState, isPreviewMode]);

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setSelectedChar(lesson.chars[0]);
    setViewState('study');
  };

  const handleStartQuiz = () => {
    setViewState('quiz');
  };

  const handleCompleteQuiz = async (score: number) => {
    if (!selectedLesson) return;

    if (isPreviewMode) {
      // Mock rewards for teachers so they don't hit database write/missing student profile errors
      setLastQuizResult({
        score,
        coinsEarned: 50,
        xpEarned: 100
      });

      setCompletedLessons(prev => {
        const currentModuleList = prev[activeTab];
        if (!currentModuleList.includes(selectedLesson.id)) {
          return {
            ...prev,
            [activeTab]: [...currentModuleList, selectedLesson.id]
          };
        }
        return prev;
      });

      setViewState('completed');
      toast.success('Demonstração: Progresso de teste simulado com sucesso.');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';
      
      // Submit result to backend to save progress and get rewards
      const res = await fetch('/api/kana/reward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          module: activeTab,
          lessonId: selectedLesson.id,
          score: (score / 10) * 100 // convert to percentage
        })
      });

      const result = await res.json();
      if (result.error) throw new Error(result.error);

      setLastQuizResult({
        score,
        coinsEarned: result.rewards?.coinsGain || 0,
        xpEarned: result.rewards?.xpGain || 0
      });

      // Update local completed state
      setCompletedLessons(prev => {
        const currentModuleList = prev[activeTab];
        if (!currentModuleList.includes(selectedLesson.id)) {
          return {
            ...prev,
            [activeTab]: [...currentModuleList, selectedLesson.id]
          };
        }
        return prev;
      });

      setViewState('completed');
    } catch (err: any) {
      console.error('[Quiz Saving Error]:', err);
      toast.error('Erro ao salvar progresso e recompensas.');
      setViewState('list');
    }
  };

  const handleBackToList = () => {
    setSelectedLesson(null);
    setViewState('list');
  };

  if (viewState === 'quiz' && selectedLesson) {
    return (
      <KanaExercises
        module={activeTab}
        lessonId={selectedLesson.id}
        lessonName={selectedLesson.name}
        onComplete={handleCompleteQuiz}
        onCancel={handleBackToList}
      />
    );
  }

  if (viewState === 'completed' && lastQuizResult && selectedLesson) {
    const isPerfect = lastQuizResult.score === 10;
    return (
      <div className="w-full max-w-md mx-auto flex flex-col gap-4 animate-fade-in">
        {isPreviewMode && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span><strong>Modo de Visualização (Professor):</strong> Resultados simulados.</span>
            </div>
            <span className="bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Preview</span>
          </div>
        )}
        <div className="w-full bg-white border border-[var(--color-slate-border)] rounded-2xl p-8 shadow-md text-center flex flex-col items-center gap-6">
          <div className="relative">
            <span className="text-6xl animate-bounce inline-block">🎉</span>
            {isPerfect && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-white shadow-sm">
                Perfeito!
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black font-outfit text-[var(--color-slate-dark)]">Lição Concluída!</h2>
            <p className="text-sm text-[var(--color-slate-mid)]">Você dominou o conteúdo de {selectedLesson.name}!</p>
          </div>

          {/* Score visualization */}
          <div className="bg-[var(--color-ice)] px-6 py-4 rounded-xl border border-[var(--color-slate-border)] w-full flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--color-slate-mid)] uppercase tracking-wider">Pontuação</span>
            <span className="text-xl font-black text-[var(--color-brand)] font-outfit">{lastQuizResult.score} / 10 acertos</span>
          </div>

          {/* Rewards Box */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col items-center justify-center gap-1 shadow-sm">
              <span className="text-2xl">🪙</span>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Moedas Ganhas</span>
              <span className="text-lg font-black text-amber-600 font-outfit">+{lastQuizResult.coinsEarned} DC</span>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex flex-col items-center justify-center gap-1 shadow-sm">
              <span className="text-2xl">⚡</span>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">XP Adquirido</span>
              <span className="text-lg font-black text-blue-600 font-outfit">+{lastQuizResult.xpEarned} XP</span>
            </div>
          </div>

          <button
            onClick={handleBackToList}
            className="w-full py-3.5 bg-[var(--color-brand)] hover:bg-[var(--color-action)] text-white font-black rounded-xl transition-all shadow-md text-sm"
          >
            Voltar para as Lições
          </button>
        </div>
      </div>
    );
  }

  if (viewState === 'study' && selectedLesson) {
    const isPhase1Unlocked = selectedLesson.id <= 2;

    return (
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        {isPreviewMode && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-sm animate-fade-in animate-once">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <span><strong>Modo de Visualização (Professor):</strong> Você está visualizando esta lição em modo de simulação (nenhum dado será gravado).</span>
            </div>
            <span className="bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Preview</span>
          </div>
        )}

        {/* Study Header */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--color-slate-border)] flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToList}
              className="p-2.5 hover:bg-[var(--color-ice)] rounded-xl border border-[var(--color-slate-border)] transition-colors text-[var(--color-slate-mid)]"
              title="Voltar à lista de lições"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[var(--color-brand)] uppercase tracking-wider">{activeTab.toUpperCase()}</span>
              <h2 className="text-xl font-black font-outfit text-[var(--color-slate-dark)]">{selectedLesson.name}</h2>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="px-6 py-3 bg-[var(--color-brand)] text-white font-black rounded-xl hover:bg-[var(--color-action)] transition-all shadow-md text-sm flex items-center gap-2"
          >
            <span>Praticar Leitura (Exercícios)</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>

        {/* Study Workspace */}
        {isPhase1Unlocked ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chars Selector Sidebar */}
            <div className="bg-white p-5 rounded-2xl border border-[var(--color-slate-border)] shadow-sm flex flex-col gap-4">
              <span className="text-xs font-bold text-[var(--color-slate-mid)] uppercase tracking-wider">Selecione uma Letra:</span>
              <div className="grid grid-cols-5 md:grid-cols-3 gap-2">
                {selectedLesson.chars.map(c => {
                  const romaji = KANA_TO_ROMAJI[c] || c;
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedChar(c)}
                      className={`aspect-square rounded-xl border-2 font-bold font-outfit text-2xl flex flex-col items-center justify-center transition-all shadow-sm p-1 leading-none ${
                        selectedChar === c
                          ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5 text-[var(--color-brand)] ring-2 ring-[var(--color-brand)]/20'
                          : 'border-[var(--color-slate-border)] text-[var(--color-slate-dark)] hover:border-[var(--color-brand)] hover:bg-[var(--color-ice)]'
                      }`}
                    >
                      <span className="text-2xl font-black">{c}</span>
                      <span className="text-[10px] font-bold opacity-60 uppercase mt-0.5 tracking-wider">{romaji}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visualizer Area */}
            <div className="md:col-span-2">
              <KanaDraw char={selectedChar} />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-[var(--color-slate-border)] flex flex-col items-center justify-center text-center gap-4 min-h-[350px]">
            <span className="text-5xl">🚧</span>
            <div className="flex flex-col gap-1 max-w-md">
              <h3 className="text-xl font-bold font-outfit text-[var(--color-slate-dark)]">Escrita em Desenvolvimento</h3>
              <p className="text-sm text-[var(--color-slate-mid)]">
                Para homologação da Fase 1, a animação de escrita está habilitada nas **Vogais (Lição 1)** e na **Família K (Lição 2)**.
              </p>
              <p className="text-xs text-[var(--color-slate-mid)] mt-3">
                No entanto, o Sensei IA é inteligente e você pode **praticar a leitura desta lição imediatamente** clicando no botão acima!
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ViewState === 'list'
  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {isPreviewMode && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-sm animate-fade-in animate-once">
          <div className="flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <span><strong>Modo de Visualização (Professor):</strong> Você pode testar todas as lições e exercícios. Suas conquistas e pontuações não serão salvas no banco de dados.</span>
          </div>
          <span className="bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Preview</span>
        </div>
      )}

      {/* Selector Tabs */}
      <div className="flex gap-3 bg-white p-2 rounded-2xl border border-[var(--color-slate-border)] shadow-sm max-w-md w-full mx-auto md:mx-0">
        <button
          onClick={() => setActiveTab('hiragana')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold font-outfit text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'hiragana'
              ? 'bg-[var(--color-brand)] text-white shadow-md'
              : 'text-[var(--color-slate-mid)] hover:text-[var(--color-slate-dark)] hover:bg-[var(--color-ice)]'
          }`}
        >
          <span>Hiragana</span>
          <span className="text-base">🎐</span>
        </button>
        <button
          onClick={() => setActiveTab('katakana')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold font-outfit text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'katakana'
              ? 'bg-[var(--color-brand)] text-white shadow-md'
              : 'text-[var(--color-slate-mid)] hover:text-[var(--color-slate-dark)] hover:bg-[var(--color-ice)]'
          }`}
        >
          <span>Katakana</span>
          <span className="text-base">🗡️</span>
        </button>
      </div>

      {/* Lesson List */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold font-outfit text-[var(--color-slate-dark)] border-b border-[var(--color-slate-border)] pb-2">
          Lições do Módulo ({activeTab === 'hiragana' ? 'Hiragana' : 'Katakana'})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LESSONS.filter(l => l.moduleType === activeTab).map(lesson => {
            const isCompleted = completedLessons[activeTab].includes(lesson.id);
            const isInteractive = lesson.id <= 2; // Vogais and K family are fully interactive for Kakijun in Phase 1

            return (
              <div
                key={lesson.id}
                onClick={() => handleStartLesson(lesson)}
                className={`group cursor-pointer bg-white border rounded-2xl p-5 transition-all shadow-sm hover:shadow-md hover:border-[var(--color-brand)] hover:-translate-y-0.5 relative flex flex-col justify-between min-h-[160px] ${
                  isCompleted ? 'border-green-200 bg-green-50/10' : 'border-[var(--color-slate-border)]'
                }`}
              >
                {/* Completed Badge */}
                {isCompleted && (
                  <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-green-200">
                    Concluído
                  </span>
                )}

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-slate-mid)] group-hover:text-[var(--color-brand)] transition-colors">
                    Lição {lesson.id}
                  </span>
                  <h4 className="text-base font-extrabold font-outfit text-[var(--color-slate-dark)] leading-tight">
                    {lesson.name}
                  </h4>
                  <p className="text-xs text-[var(--color-slate-mid)] leading-relaxed pr-6 line-clamp-2">
                    {lesson.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--color-slate-border)] pt-3 mt-4">
                  <span className="text-[10px] font-extrabold uppercase text-[var(--color-slate-mid)] tracking-wide flex items-center gap-1.5">
                    {isInteractive ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
                        Kakijun Ativo
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full inline-block"></span>
                        Apenas Leitura
                      </>
                    )}
                  </span>
                  <span className="text-xs font-bold text-[var(--color-brand)] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Estudar
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
