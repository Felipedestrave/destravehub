/**
 * Roadmap Phrases — Sensei & Buddy dialogue for the Adventure Map
 * Context-aware messages based on student progress state.
 */

export type RoadmapContext =
  | 'welcome'
  | 'pending_tasks'
  | 'srs_due'
  | 'all_done'
  | 'task_completed'
  | 'streak_active'
  | 'first_visit';

export const SENSEI_PHRASES: Record<RoadmapContext, string[]> = {
  welcome: [
    'Bem-vindo de volta! Sua jornada continua aqui 🎌',
    'O caminho do japonês nunca para! Vamos lá? 🌸',
    'Sensei está aqui! Pronto para continuar? 🍎',
  ],
  pending_tasks: [
    'Você tem missões esperando por você! Não deixe o japonês esfriar 🔥',
    'Olha quantas aventuras te aguardam! Qual você escolhe primeiro? ⚔️',
    'Suas missões estão prontas, guerreiro! É hora de agir! 💪',
  ],
  srs_due: [
    'Ei! O conhecimento que você conquistou precisa de revisão. Vamos fixar? 🧠',
    'Sua memória agradece quando você revisa! Não perca esse momento 📚',
    'A revisão de hoje vai fazer você lembrar para sempre! Vamos nessa? ✨',
  ],
  all_done: [
    'Incrível! Você completou tudo por hoje. Seu japonês está brilhando! 🌟',
    'Kampaiii! Todas as missões concluídas. Você é demais! 🎉',
    'Perfeito! Descanse, pois amanhã novas aventuras chegam! 🌙',
  ],
  task_completed: [
    'Yatta! Mais uma etapa vencida! Continue assim! 🎯',
    'Sugoi! Você está arrasando nessa jornada! 🚀',
    'Excelente trabalho! O Sensei está orgulhoso! 🍎',
  ],
  streak_active: [
    'Você está em chamas! Não quebre essa sequência! 🔥',
    'Consistência é o segredo da fluência! Continue! ⚡',
    'Que sequência impressionante! O japonês vai fluir naturalmente! 🌊',
  ],
  first_visit: [
    'Sua aventura começa aqui! Cada nó neste mapa é um passo rumo à fluência! 🗺️',
    'Bem-vindo ao seu Mapa da Aventura! Complete cada etapa para desbloquear a próxima! 🔓',
    'Este é seu caminho para o japonês! Cada missão te deixa mais próximo do objetivo! ⛩️',
  ],
};

export const BUDDY_PHRASES: Record<RoadmapContext, string[]> = {
  welcome: ['Kuuuu!', 'Okaeri~!', '*sacode a cauda*'],
  pending_tasks: ['Ganbatte!', 'Faito!', 'Ikuzo!'],
  srs_due: ['Ne ne ne!', 'Wasurenai de!', 'Zenzen OK!'],
  all_done: ['Yatta!!', 'Sugoooi!', 'Banzai!'],
  task_completed: ['Erai!', 'Kakkoii!', 'Subarashii!'],
  streak_active: ['Moeru ze!', 'Tsuyoi!', 'Atsui!'],
  first_visit: ['Yoroshiku!', 'Hajimemashoo!', 'Ikimashou!'],
};

export function getRoadmapPhrase(context: RoadmapContext, speaker: 'sensei' | 'buddy'): string {
  const phrases = speaker === 'sensei' ? SENSEI_PHRASES[context] : BUDDY_PHRASES[context];
  return phrases[Math.floor(Math.random() * phrases.length)];
}
