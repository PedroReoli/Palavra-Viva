import { View, ViewProps, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { shadows } from '@/design/shadows';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardProps extends Omit<ViewProps, 'style'> {
  variant?: CardVariant;
  onPress?: () => void;
  padding?: keyof typeof spacing;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function Card({
  variant = 'elevated',
  onPress,
  padding = 'md',
  style,
  children,
  ...props
}: CardProps) {
  const { colors } = useTheme();

  const variantStyle = getVariantStyle(variant, colors);
  const cardStyle = [
    styles.base,
    variantStyle,
    { padding: spacing[padding] },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...cardStyle,
          pressed && { opacity: 0.9 },
        ]}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getVariantStyle(
  variant: CardVariant,
  colors: ReturnType<typeof useTheme>['colors'],
): ViewStyle {
  switch (variant) {
    case 'elevated':
      return {
        backgroundColor: colors.surface,
        ...shadows.md,
      };
    case 'outlined':
      return {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      };
    case 'filled':
      return {
        backgroundColor: colors.surfaceVariant,
      };
  }
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
  },
});
