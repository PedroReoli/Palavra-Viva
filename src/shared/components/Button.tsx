import {
  Pressable,
  PressableProps,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { ReactNode } from 'react';

import { useTheme } from '@/design/theme';
import { textStyles } from '@/design/typography';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Body } from './Typography';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  style,
  children,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const variantStyles = getVariantStyles(variant, colors);
  const sizeStyles = getSizeStyles(size);

  return (
    <Pressable
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles,
        variantStyles.container,
        pressed && { backgroundColor: colors.pressed },
        isDisabled && styles.disabled,
        isDisabled && { backgroundColor: colors.disabled },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.textColor} />
      ) : (
        <>
          {icon}
          <Body
            variant={size === 'sm' ? 'small' : 'default'}
            color={isDisabled ? colors.disabledText : variantStyles.textColor}
            style={[
              size === 'sm' ? textStyles.buttonSmall : textStyles.button,
              icon ? { marginLeft: spacing.xs } : undefined,
              iconRight ? { marginRight: spacing.xs } : undefined,
            ]}
          >
            {children}
          </Body>
          {iconRight}
        </>
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getVariantStyles(variant: ButtonVariant, colors: ReturnType<typeof useTheme>['colors']) {
  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: colors.primary,
        } as ViewStyle,
        textColor: colors.textOnPrimary,
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
        } as ViewStyle,
        textColor: colors.primary,
      };
    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
        } as ViewStyle,
        textColor: colors.textPrimary,
      };
    case 'outline':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        } as ViewStyle,
        textColor: colors.textSecondary,
      };
  }
}

function getSizeStyles(size: ButtonSize): ViewStyle {
  switch (size) {
    case 'sm':
      return { paddingVertical: spacing.xs, paddingHorizontal: spacing.md };
    case 'md':
      return { paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.lg };
    case 'lg':
      return { paddingVertical: spacing.ms, paddingHorizontal: spacing.xl };
  }
}

// ---------------------------------------------------------------------------
// Estilos base
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
  },
  disabled: {
    opacity: 0.6,
  },
});
