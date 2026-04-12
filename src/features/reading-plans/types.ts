export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  type: 'full' | 'thematic' | 'book';
  icon: string;
  days: PlanDay[];
}

export interface PlanDay {
  day: number;
  title: string;
  passages: string[];
}

export interface UserPlanProgress {
  planId: string;
  day: number;
  completed: boolean;
  completedAt: string | null;
}

export interface ActivePlan {
  plan: ReadingPlan;
  progress: UserPlanProgress[];
  completedDays: number;
  totalDays: number;
  percentComplete: number;
  currentDay: number;
}
