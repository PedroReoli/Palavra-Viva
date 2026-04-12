/**
 * Palavra Viva — Design Tokens: Espacamento
 *
 * Grid de 4 pontos. Todos os valores de margin, padding e gap
 * devem vir deste arquivo.
 *
 * Uso:
 *   import { spacing } from '@/design/spacing';
 *   { padding: spacing.md, gap: spacing.sm }
 */

export const spacing = {
  /** 4px — separacao minima entre icones inline */
  xs: 4,

  /** 8px — gap entre elementos pequenos, padding interno de badges */
  sm: 8,

  /** 12px — meio-termo para ajustes finos */
  ms: 12,

  /** 16px — padding padrao de containers, gap entre cards */
  md: 16,

  /** 24px — separacao entre secoes dentro de uma tela */
  lg: 24,

  /** 32px — margem lateral de telas, separacao entre blocos */
  xl: 32,

  /** 48px — espacamento entre secoes grandes */
  xxl: 48,

  /** 64px — espacamento de topo/fundo de telas */
  xxxl: 64,
} as const;

/**
 * Padding horizontal padrao para telas.
 * Uso: { paddingHorizontal: screenPadding }
 */
export const screenPadding = spacing.xl;

/**
 * Largura maxima do conteudo (para tablets).
 * Uso em layouts que precisam limitar a largura.
 */
export const maxContentWidth = 600;

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type Spacing = keyof typeof spacing;
