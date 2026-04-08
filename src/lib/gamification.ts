/**
 * 🎖️ Motor de Recompensas do Destrave Hub
 * Responsável por calcular XP e Coins baseados na performance pedagógica.
 */

export interface RewardResult {
  xpGain: number;
  coinsGain: number;
  bonuses: Array<{
    name: string;
    amount: number;
    type: 'completion' | 'accuracy' | 'speed' | 'combo';
    reason: string;
  }>;
}

export interface AchievementParams {
  score: number;        // Porcentagem (0-100)
  totalQuestions: number;
  timeSpent?: number;   // em segundos
  targetTime?: number;  // em segundos
  isReplay?: boolean;   // Se é uma tentativa extra
}

export const REWARDS_CONFIG = {
  COMPLETION_BASE: 20,
  ACCURACY_BONUS: 15,
  SPEED_BONUS: 20,
  REPLAY_MULTIPLIER: 0.1, // Apenas 10% do valor base para replays de estudo
};

/**
 * Calcula os ganhos de XP e Coins para uma missão
 */
export function calculateMissionRewards(params: AchievementParams): RewardResult {
  const { score, totalQuestions, timeSpent, targetTime, isReplay } = params;
  const result: RewardResult = {
    xpGain: 0,
    coinsGain: 0,
    bonuses: []
  };

  // 1. Ganho Base por Conclusão
  const baseCoins = REWARDS_CONFIG.COMPLETION_BASE;
  result.bonuses.push({
    name: 'Missão Concluída',
    amount: baseCoins,
    type: 'completion',
    reason: 'Você terminou o conteúdo!'
  });

  // 2. Bônus de Assertividade (100% de acerto)
  if (score >= 100) {
    result.bonuses.push({
      name: 'Foco Total',
      amount: REWARDS_CONFIG.ACCURACY_BONUS,
      type: 'accuracy',
      reason: '100% de precisão estratégica!'
    });
  }

  // 3. Bônus de Velocidade (Menor ou igual ao tempo alvo)
  if (timeSpent && targetTime && timeSpent <= targetTime) {
    result.bonuses.push({
      name: 'Flash Speed',
      amount: REWARDS_CONFIG.SPEED_BONUS,
      type: 'speed',
      reason: 'Domínio e fluidez no tempo alvo!'
    });
  }

  // Somar ganhos
  let totalCoins = result.bonuses.reduce((acc, b) => acc + b.amount, 0);

  // Aplicar redutor se for Replay (Estudo extra não deve inflar economia)
  if (isReplay) {
    totalCoins = Math.ceil(totalCoins * REWARDS_CONFIG.REPLAY_MULTIPLIER);
  }

  // XP é acumulativo e igual ao total de moedas ganhas na vida
  result.coinsGain = totalCoins;
  result.xpGain = totalCoins;

  return result;
}
