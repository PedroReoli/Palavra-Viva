import { create } from 'zustand';
import type { PurchasesOfferings } from 'react-native-purchases';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface SubscriptionState {
  isPremium: boolean;
  isLoading: boolean;
  offerings: PurchasesOfferings | null;

  setPremium: (isPremium: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setOfferings: (offerings: PurchasesOfferings | null) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  isPremium: false,
  isLoading: true,
  offerings: null,

  setPremium: (isPremium) => set({ isPremium }),
  setLoading: (isLoading) => set({ isLoading }),
  setOfferings: (offerings) => set({ offerings }),
}));
