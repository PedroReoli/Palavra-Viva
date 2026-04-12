/**
 * Palavra Viva — Design Tokens: Tema
 *
 * Combina todos os tokens em um unico objeto de tema.
 * Fornece o hook useTheme() para acessar o tema atual (light/dark).
 *
 * Uso:
 *   import { useTheme } from '@/design/theme';
 *
 *   const { colors, isDark, toggleTheme } = useTheme();
 */

import { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

import { lightColors, darkColors, type ColorTokens } from './colors';
import { fontFamilies, fontSizes, lineHeights, textStyles } from './typography';
import { spacing, screenPadding, maxContentWidth } from './spacing';
import { radii } from './radii';
import { shadows } from './shadows';

// ---------------------------------------------------------------------------
// Tema completo
// ---------------------------------------------------------------------------

export interface Theme {
  colors: ColorTokens;
  fonts: typeof fontFamilies;
  fontSizes: typeof fontSizes;
  lineHeights: typeof lineHeights;
  textStyles: typeof textStyles;
  spacing: typeof spacing;
  screenPadding: typeof screenPadding;
  maxContentWidth: typeof maxContentWidth;
  radii: typeof radii;
  shadows: typeof shadows;
  isDark: boolean;
}

const buildTheme = (isDark: boolean): Theme => ({
  colors: isDark ? darkColors : lightColors,
  fonts: fontFamilies,
  fontSizes,
  lineHeights,
  textStyles,
  spacing,
  screenPadding,
  maxContentWidth,
  radii,
  shadows,
  isDark,
});

export const lightTheme = buildTheme(false);
export const darkTheme = buildTheme(true);

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface ThemeContextValue extends Theme {
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  ...lightTheme,
  toggleTheme: () => {},
  setTheme: () => {},
});

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Retorna o tema atual com todas as tokens e funcoes de controle.
 *
 * Exemplo:
 *   const { colors, spacing, isDark, toggleTheme } = useTheme();
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  return context;
};

// ---------------------------------------------------------------------------
// Utilitario para obter tema baseado no sistema (sem provider)
// ---------------------------------------------------------------------------

/**
 * Retorna o tema baseado na preferencia do sistema operacional.
 * Util em contextos onde o ThemeProvider ainda nao esta disponivel
 * (ex: splash screen, _layout.tsx antes do provider).
 */
export const useSystemTheme = (): Theme => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
};
