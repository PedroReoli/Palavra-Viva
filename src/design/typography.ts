/**
 * Palavra Viva — Design Tokens: Tipografia
 *
 * Fontes, tamanhos, pesos e estilos compostos.
 * Nenhum fontFamily ou fontSize hardcoded e permitido fora deste arquivo.
 *
 * Familias:
 *   - Poppins: headings, botoes, labels de destaque
 *   - Inter: body, captions, labels comuns
 *   - Lora: versiculos, destaques biblicos, citacoes
 *
 * Uso:
 *   import { fontFamilies, fontSizes, textStyles } from '@/design/typography';
 */

// ---------------------------------------------------------------------------
// Familias de fonte
// ---------------------------------------------------------------------------

export const fontFamilies = {
  // UI — headings, botoes
  heading: 'Poppins_600SemiBold',
  headingBold: 'Poppins_700Bold',

  // UI — body, captions
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',

  // Versiculos e destaques biblicos
  verse: 'Lora_400Regular',
  verseBold: 'Lora_700Bold',
} as const;

// ---------------------------------------------------------------------------
// Nomes das fontes para carregamento (expo-font / useFonts)
// ---------------------------------------------------------------------------

export const fontAssets = {
  Poppins_600SemiBold: require('@/assets/fonts/Poppins-SemiBold.ttf'),
  Poppins_700Bold: require('@/assets/fonts/Poppins-Bold.ttf'),
  Inter_400Regular: require('@/assets/fonts/Inter-Regular.ttf'),
  Inter_500Medium: require('@/assets/fonts/Inter-Medium.ttf'),
  Lora_400Regular: require('@/assets/fonts/Lora-Regular.ttf'),
  Lora_700Bold: require('@/assets/fonts/Lora-Bold.ttf'),
} as const;

// ---------------------------------------------------------------------------
// Escala de tamanho
// ---------------------------------------------------------------------------

export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

// ---------------------------------------------------------------------------
// Alturas de linha (multiplicador sobre o fontSize)
// ---------------------------------------------------------------------------

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
  verse: 1.8,
} as const;

// ---------------------------------------------------------------------------
// Pesos
// ---------------------------------------------------------------------------

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// ---------------------------------------------------------------------------
// Estilos compostos (prontos para uso em StyleSheet)
// ---------------------------------------------------------------------------

export const textStyles = {
  // Headings (Poppins)
  h1: {
    fontFamily: fontFamilies.headingBold,
    fontSize: fontSizes['4xl'],
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
  },
  h2: {
    fontFamily: fontFamilies.headingBold,
    fontSize: fontSizes['3xl'],
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
  },
  h3: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes['2xl'],
    lineHeight: fontSizes['2xl'] * lineHeights.tight,
  },
  h4: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.tight,
  },
  h5: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.tight,
  },

  // Body (Inter)
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.normal,
  },
  body: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
  },
  bodyMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * lineHeights.normal,
  },

  // Captions (Inter)
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  captionMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  overline: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
  },

  // Labels / Botoes (Poppins)
  button: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.base,
    lineHeight: fontSizes.base * lineHeights.tight,
  },
  buttonSmall: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * lineHeights.tight,
  },
  label: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * lineHeights.normal,
  },

  // Versiculos (Lora)
  verse: {
    fontFamily: fontFamilies.verse,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.verse,
  },
  verseLarge: {
    fontFamily: fontFamilies.verse,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.verse,
  },
  verseReference: {
    fontFamily: fontFamilies.verseBold,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * lineHeights.normal,
  },
  verseHighlight: {
    fontFamily: fontFamilies.verseBold,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.verse,
  },
} as const;

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type FontFamily = keyof typeof fontFamilies;
export type FontSize = keyof typeof fontSizes;
export type TextStyle = keyof typeof textStyles;
