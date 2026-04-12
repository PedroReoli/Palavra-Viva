import { useCallback } from 'react';

import { useAuthStore } from '@/features/auth/stores/authStore';
import { planService } from '../services/planService';
import { usePlanStore } from '../stores/planStore';

/**
 * Hook principal de planos de leitura.
 */
export function usePlans() {
  const userId = useAuthStore((s) => s.user?.id);
  const {
    activePlans,
    selectedPlanId,
    isLoading,
    setActivePlans,
    setSelectedPlanId,
    setLoading,
    updatePlanProgress,
  } = usePlanStore();

  const loadPlans = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const plans = planService.getPlans();
      const progress = await planService.getUserProgress(userId);

      const active = plans.map((plan) => {
        const planProgress = progress.filter((p) => p.planId === plan.id);
        return planService.buildActivePlan(plan, planProgress);
      });

      setActivePlans(active);
    } finally {
      setLoading(false);
    }
  }, [userId, setActivePlans, setLoading]);

  const toggleDay = useCallback(
    async (planId: string, day: number) => {
      if (!userId) return;
      const completed = await planService.toggleDay(userId, planId, day);
      updatePlanProgress(planId, day, completed);
    },
    [userId, updatePlanProgress],
  );

  const selectedPlan = activePlans.find((ap) => ap.plan.id === selectedPlanId) ?? null;

  return {
    plans: planService.getPlans(),
    activePlans,
    selectedPlan,
    isLoading,
    loadPlans,
    selectPlan: setSelectedPlanId,
    toggleDay,
  };
}
