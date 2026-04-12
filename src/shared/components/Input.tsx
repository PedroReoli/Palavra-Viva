import { useState, ReactNode } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { useTheme } from '@/design/theme';
import { textStyles, fontFamilies } from '@/design/typography';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Caption } from './Typography';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type InputVariant = 'text' | 'search' | 'chat';

interface InputProps extends Omit<TextInputProps, 'style'> {
  variant?: InputVariant;
  label?: string;
  helperText?: string;
  error?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function Input({
  variant = 'text',
  label,
  helperText,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  ...inputProps
}: InputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
      ? colors.borderFocus
      : colors.border;

  const isChat = variant === 'chat';
  const isSearch = variant === 'search';

  return (
    <View style={containerStyle}>
      {label && !isSearch && !isChat && (
        <Caption variant="medium" color={error ? colors.error : colors.textSecondary} style={styles.label}>
          {label}
        </Caption>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor: isSearch || isChat ? colors.surfaceVariant : colors.surface,
            borderRadius: isChat ? radii.full : radii.md,
          },
          isSearch && styles.searchContainer,
        ]}
      >
        {icon && <View style={styles.iconLeft}>{icon}</View>}

        <TextInput
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.primary}
          style={[
            styles.input,
            {
              fontFamily: fontFamilies.body,
              fontSize: textStyles.body.fontSize,
              color: colors.textPrimary,
            },
            icon ? { paddingLeft: 0 } : undefined,
          ]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...inputProps}
        />

        {rightIcon && (
          <Pressable onPress={onRightIconPress} style={styles.iconRight}>
            {rightIcon}
          </Pressable>
        )}
      </View>

      {(helperText || error) && (
        <Caption
          color={error ? colors.error : colors.textTertiary}
          style={styles.helperText}
        >
          {error ?? helperText}
        </Caption>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: spacing.ms,
  },
  searchContainer: {
    borderWidth: 0,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xs,
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
  helperText: {
    marginTop: spacing.xs,
  },
});
