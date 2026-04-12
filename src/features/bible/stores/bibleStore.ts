import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SupportedVersion, BibleBook, BibleChapter } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface BibleState {
  selectedVersion: SupportedVersion;
  selectedBook: BibleBook | null;
  selectedChapter: BibleChapter | null;
  fontSize: number;

  setVersion: (version: SupportedVersion) => void;
  setBook: (book: BibleBook | null) => void;
  setChapter: (chapter: BibleChapter | null) => void;
  setFontSize: (size: number) => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useBibleStore = create<BibleState>()(
  persist(
    (set) => ({
      selectedVersion: 'nvi',
      selectedBook: null,
      selectedChapter: null,
      fontSize: 18,

      setVersion: (selectedVersion) => set({ selectedVersion, selectedBook: null, selectedChapter: null }),
      setBook: (selectedBook) => set({ selectedBook, selectedChapter: null }),
      setChapter: (selectedChapter) => set({ selectedChapter }),
      setFontSize: (fontSize) => set({ fontSize }),
      reset: () => set({ selectedBook: null, selectedChapter: null }),
    }),
    {
      name: '@palavra_viva_bible',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedVersion: state.selectedVersion,
        fontSize: state.fontSize,
      }),
    },
  ),
);
