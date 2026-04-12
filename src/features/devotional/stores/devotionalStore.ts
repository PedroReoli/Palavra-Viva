import { create } from 'zustand';

import type { Devotional, GeneratedDevotional } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface DevotionalState {
  currentDevotional: GeneratedDevotional | null;
  savedDevotionals: Devotional[];
  isGenerating: boolean;
  error: string | null;

  setCurrent: (devotional: GeneratedDevotional | null) => void;
  setSaved: (devotionals: Devotional[]) => void;
  setIsGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useDevotionalStore = create<DevotionalState>((set) => ({
  currentDevotional: null,
  savedDevotionals: [],
  isGenerating: false,
  error: null,

  setCurrent: (currentDevotional) => set({ currentDevotional }),
  setSaved: (savedDevotionals) => set({ savedDevotionals }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
}));
