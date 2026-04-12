/**
 * Palavra Viva — Design Tokens: Border Radius
 *
 * Valores padronizados de arredondamento.
 * Nenhum borderRadius hardcoded e permitido fora deste arquivo.
 *
 * Uso:
 *   import { radii } from '@/design/radii';
 *   { borderRadius: radii.md }
 */

export const radii = {
  /** 0px — sem arredondamento */
  none: 0,

  /** 4px — inputs, badges pequenos */
  sm: 4,

  /** 8px — cards, botoes, containers */
  md: 8,

  /** 12px — cards maiores, modais */
  lg: 12,

  /** 16px — cards de destaque, bottom sheets */
  xl: 16,

  /** 24px — cards hero, imagens de perfil quadradas arredondadas */
  xxl: 24,

  /** 9999px — botoes pill, avatares circulares, badges */
  full: 9999,
} as const;

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type Radii = keyof typeof radii;
