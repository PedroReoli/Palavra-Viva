import { supabase } from '@/lib/supabase';

import { READING_PLANS } from '../data/plans';
import type { ReadingPlan, UserPlanProgress, ActivePlan } from '../types';

export const planService = {
  /**
   * Retorna todos os planos disponiveis.
   */
  getPlans(): ReadingPlan[] {
    return READING_PLANS;
  },

  /**
   * Retorna um plano pelo ID.
   */
  getPlanById(planId: string): ReadingPlan | undefined {
    return READING_PLANS.find((p) => p.id === planId);
  },

  /**
   * Busca o progresso do usuario em todos os planos.
   */
  async getUserProgress(userId: string): Promise<UserPlanProgress[]> {
    const { data, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', userId)
      .order('day', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapProgress);
  },

  /**
   * Busca o progresso do usuario em um plano especifico.
   */
  async getPlanProgress(userId: string, planId: string): Promise<UserPlanProgress[]> {
    const { data, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_id', planId)
      .order('day', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapProgress);
  },

  /**
   * Marca um dia como concluido (ou desfaz).
   */
  async toggleDay(userId: string, planId: string, day: number): Promise<boolean> {
    // Verificar se ja existe
    const { data: existing } = await supabase
      .from('reading_progress')
      .select('id, completed')
      .eq('user_id', userId)
      .eq('plan_id', planId)
      .eq('day', day)
      .maybeSingle();

    if (existing) {
      const newCompleted = !existing.completed;
      await supabase
        .from('reading_progress')
        .update({
          completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null,
        })
        .eq('id', existing.id);
      return newCompleted;
    }

    // Criar novo registro como concluido
    await supabase.from('reading_progress').insert({
      user_id: userId,
      plan_id: planId,
      day,
      completed: true,
      completed_at: new Date().toISOString(),
    });
    return true;
  },

  /**
   * Monta um ActivePlan com progresso calculado.
   */
  buildActivePlan(plan: ReadingPlan, progress: UserPlanProgress[]): ActivePlan {
    const completedDays = progress.filter((p) => p.completed).length;
    const totalDays = plan.durationDays;
    const percentComplete = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    // Proximo dia nao concluido
    const completedSet = new Set(progress.filter((p) => p.completed).map((p) => p.day));
    let currentDay = 1;
    for (let d = 1; d <= totalDays; d++) {
      if (!completedSet.has(d)) {
        currentDay = d;
        break;
      }
      currentDay = d + 1;
    }

    return {
      plan,
      progress,
      completedDays,
      totalDays,
      percentComplete,
      currentDay: Math.min(currentDay, totalDays),
    };
  },
};

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProgress(row: any): UserPlanProgress {
  return {
    planId: row.plan_id,
    day: row.day,
    completed: row.completed,
    completedAt: row.completed_at,
  };
}
