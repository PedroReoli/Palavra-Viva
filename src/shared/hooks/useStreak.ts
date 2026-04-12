import { useEffect, useState, useCallback } from 'react';

import { useAuthStore } from '@/features/auth/stores/authStore';
import { streakService, type StreakData } from '@/shared/services/streakService';

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  totalDaysRead: 0,
  thisMonthDays: 0,
};

/**
 * Hook para acessar dados de streak e estatisticas de leitura.
 */
export function useStreak() {
  const userId = useAuthStore((s) => s.user?.id);
  const [streak, setStreak] = useState<StreakData>(DEFAULT_STREAK);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await streakService.getStreak(userId);
      setStreak(data);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...streak, isLoading, refresh };
}
