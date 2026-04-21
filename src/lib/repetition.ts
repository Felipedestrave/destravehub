// src/lib/repetition.ts

export const REPETITION_DAYS = [1, 2, 6, 11, 17, 26];
export const REPETITION_REWARDS = [0, 2, 4, 6, 8, 10]; // Nova escala solicitada

export interface RepetitionMilestone {
  milestone: number; // 1 a 5 (ou 0 a 5)
  scheduledDate: string;
  status: 'pending' | 'completed' | 'missed';
  notified?: boolean;
  completedAt?: string;
  earnedCoins?: number;
}

export const repetitionService = {
  /**
   * Calcula as datas de revisão baseadas na data de conclusão inicial (Dia 1)
   */
  generateSchedule(startDate: string | Date): RepetitionMilestone[] {
    const start = new Date(startDate);
    
    // O dia 1 é o dia que ele fez a primeira vez
    // As revisões são nos dias 2, 6, 11, 17, 26 relativos ao dia 1.
    return REPETITION_DAYS.slice(1).map((day, index) => {
      const scheduled = new Date(start);
      scheduled.setDate(start.getDate() + (day - 1));
      
      return {
        milestone: index + 1,
        scheduledDate: scheduled.toISOString(),
        status: 'pending'
      };
    });
  },

  /**
   * Calcula a recompensa baseada na data atual vs data agendada
   */
  calculateReward(milestone: number, scheduledDate: string, nextMilestoneDate?: string): { coins: number, status: 'full' | 'half' | 'none' } {
    const now = new Date();
    const scheduled = new Date(scheduledDate);
    
    // Normalizar para o início do dia para comparação justa
    const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const scheduledDay = new Date(scheduled.getFullYear(), scheduled.getMonth(), scheduled.getDate());
    
    const diffTime = nowDay.getTime() - scheduledDay.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const baseReward = REPETITION_REWARDS[milestone] || 0;

    // 1. No dia exato ou antes (adiantado também ganha 100%?)
    // Conforme regra 2: "se conseguir fazer no dia ganha pontos completos"
    if (diffDays <= 0) {
      return { coins: baseReward, status: 'full' };
    }

    // 2. Se estiver atrasado, mas antes do próximo marco
    if (nextMilestoneDate) {
      const nextDay = new Date(nextMilestoneDate);
      const nextDayNormalized = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate());
      
      if (nowDay < nextDayNormalized) {
        return { coins: Math.floor(baseReward * 0.5), status: 'half' };
      }
    } else {
      // É o último marco (Dia 26), vamos dar uma janela de 3 dias de tolerância para o 50%
      if (diffDays <= 3) {
        return { coins: Math.floor(baseReward * 0.5), status: 'half' };
      }
    }

    return { coins: 0, status: 'none' };
  }
};
