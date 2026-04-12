import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Caption } from './Typography';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type BadgeVariant = 'default' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function Badge({ label, variant = 'default', size = 'md', style }: BadgeProps) {
  const { colors } = useTheme();
  const variantColors = getVariantColors(variant, colors);

  return (
    <View
      style={[
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: variantColors.bg },
        style,
      ]}
    >
      <Caption
        variant={size === 'sm' ? 'default' : 'medium'}
        color={variantColors.text}
      >
        {label}
      </Caption>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getVariantColors(
  variant: BadgeVariant,
  colors: ReturnType<typeof useTheme>['colors'],
) {
  switch (variant) {
    case 'default':
      return { bg: colors.primaryFaded, text: colors.primary };
    case 'success':
      return { bg: colors.primaryFaded, text: colors.success };
    case 'warning':
      return { bg: colors.secondaryFaded, text: colors.warningDark };
    case 'error':
      return { bg: colors.primaryFaded, text: colors.error };
  }
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: radii.full,
  },
  sm: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  md: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.ms,
  },
});
