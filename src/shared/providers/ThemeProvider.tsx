import { useState, useCallback, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeContext, lightTheme, darkTheme } from '@/design/theme';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = '@palavra_viva_theme';

interface ThemeProviderProps {
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  // Carregar preferencia salva
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setModeState(saved);
      }
    });
  }, []);

  const resolvedDark =
    mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  const theme = resolvedDark ? darkTheme : lightTheme;

  const toggleTheme = useCallback(() => {
    const next = resolvedDark ? 'light' : 'dark';
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }, [resolvedDark]);

  const setTheme = useCallback((newMode: 'light' | 'dark' | 'system') => {
    setModeState(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode);
  }, []);

  return (
    <ThemeContext.Provider value={{ ...theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
