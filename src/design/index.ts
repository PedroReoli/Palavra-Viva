/**
 * Palavra Viva — Design System
 *
 * Re-export centralizado de todos os tokens.
 *
 * Uso:
 *   import { colors, spacing, radii, textStyles, useTheme } from '@/design';
 */

// Cores
export {
  lightColors,
  darkColors,
  highlightColors,
  highlightColorsDark,
  type ColorTokens,
  type HighlightColor,
} from './colors';

// Tipografia
export {
  fontFamilies,
  fontSizes,
  lineHeights,
  fontWeights,
  textStyles,
  type FontFamily,
  type FontSize,
  type TextStyle,
} from './typography';

// Espacamento
export {
  spacing,
  screenPadding,
  maxContentWidth,
  type Spacing,
} from './spacing';

// Border Radius
export { radii, type Radii } from './radii';

// Sombras
export { shadows, type Shadow } from './shadows';

// Tema
export {
  lightTheme,
  darkTheme,
  ThemeContext,
  useTheme,
  useSystemTheme,
  type Theme,
  type ThemeContextValue,
} from './theme';
