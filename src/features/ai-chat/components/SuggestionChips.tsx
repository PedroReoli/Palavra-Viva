import { ScrollView, Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Caption } from '@/shared/components';
import { CHAT_SUGGESTIONS, type ChatSuggestion } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface SuggestionChipsProps {
  onSelect: (prompt: string) => void;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CHAT_SUGGESTIONS.map((suggestion) => (
        <Pressable
          key={suggestion.label}
          onPress={() => onSelect(suggestion.prompt)}
          style={({ pressed }) => [
            styles.chip,
            {
              backgroundColor: pressed ? colors.primaryFaded : colors.surfaceVariant,
              borderColor: colors.border,
            },
          ]}
        >
          <Caption variant="medium" color={colors.textPrimary}>
            {suggestion.label}
          </Caption>
        </Pressable>
      ))}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.ms,
    borderRadius: radii.full,
    borderWidth: 1,
  },
});
