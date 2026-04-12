import { supabase } from '@/lib/supabase';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDaysRead: number;
  thisMonthDays: number;
}

export const streakService = {
  /**
   * Calcula o streak e estatisticas de leitura do usuario.
   * Baseado na tabela reading_progress (dias com completed=true).
   */
  async getStreak(userId: string): Promise<StreakData> {
    const { data, error } = await supabase
      .from('reading_progress')
      .select('completed_at')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('completed_at', { ascending: false });

    if (error || !data) {
      return { currentStreak: 0, longestStreak: 0, totalDaysRead: 0, thisMonthDays: 0 };
    }

    // Extrair datas unicas (um dia pode ter multiplas leituras)
    const uniqueDays = new Set<string>();
    for (const row of data) {
      if (row.completed_at) {
        const date = new Date(row.completed_at).toISOString().split('T')[0];
        uniqueDays.add(date);
      }
    }

    const sortedDays = Array.from(uniqueDays).sort().reverse();
    const totalDaysRead = sortedDays.length;

    // Dias deste mes
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisMonthDays = sortedDays.filter((d) => d.startsWith(thisMonth)).length;

    // Calcular streak atual (dias consecutivos ate hoje)
    const todayStr = now.toISOString().split('T')[0];
    const yesterdayStr = new Date(now.getTime() - 86400000).toISOString().split('T')[0];

    let currentStreak = 0;
    let checkDate = uniqueDays.has(todayStr) ? todayStr : yesterdayStr;

    if (uniqueDays.has(checkDate)) {
      currentStreak = 1;
      let d = new Date(checkDate);
      while (true) {
        d = new Date(d.getTime() - 86400000);
        const ds = d.toISOString().split('T')[0];
        if (uniqueDays.has(ds)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calcular maior streak
    let longestStreak = 0;
    let tempStreak = 1;
    const ascending = [...sortedDays].reverse();

    for (let i = 1; i < ascending.length; i++) {
      const prev = new Date(ascending[i - 1]);
      const curr = new Date(ascending[i]);
      const diff = (curr.getTime() - prev.getTime()) / 86400000;

      if (diff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak, totalDaysRead, thisMonthDays };
  },
};
