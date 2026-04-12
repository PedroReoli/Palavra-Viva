import { create } from 'zustand';

import type { ActivePlan } from '../types';

interface PlanState {
  activePlans: ActivePlan[];
  selectedPlanId: string | null;
  isLoading: boolean;

  setActivePlans: (plans: ActivePlan[]) => void;
  setSelectedPlanId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  updatePlanProgress: (planId: string, day: number, completed: boolean) => void;
}

export const usePlanStore = create<PlanState>((set) => ({
  activePlans: [],
  selectedPlanId: null,
  isLoading: false,

  setActivePlans: (activePlans) => set({ activePlans }),
  setSelectedPlanId: (selectedPlanId) => set({ selectedPlanId }),
  setLoading: (isLoading) => set({ isLoading }),

  updatePlanProgress: (planId, day, completed) =>
    set((s) => ({
      activePlans: s.activePlans.map((ap) => {
        if (ap.plan.id !== planId) return ap;

        const updatedProgress = [...ap.progress];
        const existing = updatedProgress.findIndex((p) => p.day === day);
        if (existing >= 0) {
          updatedProgress[existing] = { ...updatedProgress[existing], completed };
        } else {
          updatedProgress.push({ planId, day, completed, completedAt: new Date().toISOString() });
        }

        const completedDays = updatedProgress.filter((p) => p.completed).length;
        return {
          ...ap,
          progress: updatedProgress,
          completedDays,
          percentComplete: Math.round((completedDays / ap.totalDays) * 100),
        };
      }),
    })),
}));
