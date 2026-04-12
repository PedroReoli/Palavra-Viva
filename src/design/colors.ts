/**
 * Palavra Viva — Design Tokens: Cores
 *
 * Fonte unica de verdade para todas as cores da aplicacao.
 * Nenhuma cor hardcoded e permitida fora deste arquivo.
 *
 * Uso:
 *   import { colors } from '@/design/colors';
 *   // ou via hook:
 *   const { colors } = useTheme();
 */

// ---------------------------------------------------------------------------
// Primitivas (nao usar diretamente nos componentes)
// ---------------------------------------------------------------------------

const palette = {
  // Indigo — tom principal (espiritualidade, profundidade)
  indigo50: '#EEF2FF',
  indigo100: '#E0E7FF',
  indigo200: '#C7D2FE',
  indigo300: '#A5B4FC',
  indigo400: '#818CF8',
  indigo500: '#6366F1',
  indigo600: '#4F46E5',
  indigo700: '#4338CA',
  indigo800: '#3730A3',
  indigo900: '#312E81',

  // Amber — acento (calor, acolhimento, destaque)
  amber50: '#FFFBEB',
  amber100: '#FEF3C7',
  amber200: '#FDE68A',
  amber300: '#FCD34D',
  amber400: '#FBBF24',
  amber500: '#F59E0B',
  amber600: '#D97706',
  amber700: '#B45309',

  // Neutros quentes
  warm50: '#FAFAF9',
  warm100: '#F5F5F4',
  warm200: '#E7E5E4',
  warm300: '#D6D3D1',
  warm400: '#A8A29E',
  warm500: '#78716C',
  warm600: '#57534E',
  warm700: '#44403C',
  warm800: '#292524',
  warm900: '#1C1917',

  // Semanticas fixas
  green500: '#22C55E',
  green600: '#16A34A',
  red500: '#EF4444',
  red600: '#DC2626',
  yellow500: '#EAB308',
  yellow600: '#CA8A04',
  blue500: '#3B82F6',
  blue600: '#2563EB',

  // Base
  white: '#FFFFFF',
  black: '#000000',
} as const;

// ---------------------------------------------------------------------------
// Cores de destaque para versiculos (5 opcoes)
// ---------------------------------------------------------------------------

export const highlightColors = {
  yellow: '#FEF08A',
  green: '#BBF7D0',
  blue: '#BFDBFE',
  pink: '#FBCFE8',
  orange: '#FED7AA',
} as const;

export const highlightColorsDark = {
  yellow: '#854D0E',
  green: '#166534',
  blue: '#1E40AF',
  pink: '#9D174D',
  orange: '#9A3412',
} as const;

// ---------------------------------------------------------------------------
// Tema Light
// ---------------------------------------------------------------------------

export const lightColors = {
  // Marca
  primary: palette.indigo600,
  primaryLight: palette.indigo400,
  primaryDark: palette.indigo800,
  primaryFaded: palette.indigo100,

  // Acento
  secondary: palette.amber500,
  secondaryLight: palette.amber300,
  secondaryDark: palette.amber700,
  secondaryFaded: palette.amber100,

  // Fundos
  background: palette.warm50,
  backgroundAlt: palette.warm100,
  surface: palette.white,
  surfaceVariant: palette.warm100,
  surfaceElevated: palette.white,

  // Texto
  textPrimary: palette.warm900,
  textSecondary: palette.warm500,
  textTertiary: palette.warm400,
  textInverse: palette.white,
  textOnPrimary: palette.white,
  textLink: palette.indigo600,

  // Bordas e divisores
  border: palette.warm200,
  borderLight: palette.warm100,
  borderFocus: palette.indigo500,

  // Feedback
  success: palette.green500,
  successDark: palette.green600,
  error: palette.red500,
  errorDark: palette.red600,
  warning: palette.yellow500,
  warningDark: palette.yellow600,
  info: palette.blue500,
  infoDark: palette.blue600,

  // Interacao
  pressed: palette.warm200,
  disabled: palette.warm300,
  disabledText: palette.warm400,
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Tab bar
  tabActive: palette.indigo600,
  tabInactive: palette.warm400,

  // Destaques de versiculos
  highlight: highlightColors,

  // Icone
  icon: palette.warm700,
  iconSecondary: palette.warm400,
  iconActive: palette.indigo600,
} as const;

// ---------------------------------------------------------------------------
// Tema Dark
// ---------------------------------------------------------------------------

export const darkColors = {
  // Marca
  primary: palette.indigo400,
  primaryLight: palette.indigo300,
  primaryDark: palette.indigo600,
  primaryFaded: palette.indigo900,

  // Acento
  secondary: palette.amber400,
  secondaryLight: palette.amber300,
  secondaryDark: palette.amber600,
  secondaryFaded: '#422006',

  // Fundos
  background: palette.warm900,
  backgroundAlt: palette.warm800,
  surface: palette.warm800,
  surfaceVariant: palette.warm700,
  surfaceElevated: palette.warm700,

  // Texto
  textPrimary: palette.warm50,
  textSecondary: palette.warm400,
  textTertiary: palette.warm500,
  textInverse: palette.warm900,
  textOnPrimary: palette.warm900,
  textLink: palette.indigo300,

  // Bordas e divisores
  border: palette.warm700,
  borderLight: palette.warm800,
  borderFocus: palette.indigo400,

  // Feedback
  success: palette.green500,
  successDark: palette.green600,
  error: palette.red500,
  errorDark: palette.red600,
  warning: palette.yellow500,
  warningDark: palette.yellow600,
  info: palette.blue500,
  infoDark: palette.blue600,

  // Interacao
  pressed: palette.warm700,
  disabled: palette.warm600,
  disabledText: palette.warm500,
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Tab bar
  tabActive: palette.indigo400,
  tabInactive: palette.warm500,

  // Destaques de versiculos
  highlight: highlightColorsDark,

  // Icone
  icon: palette.warm200,
  iconSecondary: palette.warm500,
  iconActive: palette.indigo400,
} as const;

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type ColorTokens = {
  [K in keyof typeof lightColors]: K extends 'highlight'
    ? typeof highlightColors | typeof highlightColorsDark
    : string;
};
export type HighlightColor = keyof typeof highlightColors;
