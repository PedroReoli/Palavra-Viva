/**
 * Palavra Viva — Design Tokens: Sombras
 *
 * Presets de sombra para iOS e Android.
 * Cada preset inclui shadowColor/Offset/Opacity/Radius (iOS) + elevation (Android).
 *
 * Uso:
 *   import { shadows } from '@/design/shadows';
 *   const styles = StyleSheet.create({
 *     card: { ...shadows.md },
 *   });
 */

import { Platform, ViewStyle } from 'react-native';

type ShadowPreset = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const createShadow = (
  offsetY: number,
  opacity: number,
  radius: number,
  elevation: number,
): ShadowPreset => ({
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: opacity,
  shadowRadius: radius,
  ...(Platform.OS === 'android' ? { elevation } : {}),
});

export const shadows = {
  /** Sombra sutil — separacao minima (bordas de cards, inputs) */
  sm: createShadow(1, 0.05, 2, 1),

  /** Sombra media — cards padrao, botoes elevados */
  md: createShadow(2, 0.1, 4, 3),

  /** Sombra forte — modais, bottom sheets, elementos flutuantes */
  lg: createShadow(4, 0.15, 8, 6),

  /** Sombra extra — FABs, tooltips, menus dropdown */
  xl: createShadow(8, 0.2, 16, 10),

  /** Sem sombra */
  none: createShadow(0, 0, 0, 0),
} as const;

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type Shadow = keyof typeof shadows;
