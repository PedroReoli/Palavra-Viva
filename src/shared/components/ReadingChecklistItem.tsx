import { Pressable, View, StyleSheet } from 'react-native';
import { Check } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Body, Caption } from './Typography';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface ReadingChecklistItemProps {
  title: string;
  subtitle?: string;
  completed: boolean;
  onToggle: () => void;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function ReadingChecklistItem({
  title,
  subtitle,
  completed,
  onToggle,
}: ReadingChecklistItemProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? colors.pressed : colors.surface,
          borderColor: completed ? colors.success : colors.border,
        },
      ]}
    >
      {/* Checkbox */}
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: completed ? colors.success : 'transparent',
            borderColor: completed ? colors.success : colors.border,
          },
        ]}
      >
        {completed && <Check size={14} color={colors.textInverse} weight="bold" />}
      </View>

      {/* Texto */}
      <View style={styles.content}>
        <Body
          variant="small"
          color={completed ? colors.textSecondary : colors.textPrimary}
          style={completed ? styles.completedText : undefined}
        >
          {title}
        </Body>
        {subtitle && (
          <Caption color={colors.textTertiary}>{subtitle}</Caption>
        )}
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.ms,
    padding: spacing.ms,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radii.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
});
