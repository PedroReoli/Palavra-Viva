import { FlatList, Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Body } from '@/shared/components';
import type { BibleChapter } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface ChapterGridProps {
  chapters: BibleChapter[];
  onSelect: (chapter: BibleChapter) => void;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function ChapterGrid({ chapters, onSelect }: ChapterGridProps) {
  const { colors } = useTheme();

  // Filtrar o capitulo "intro" que a API retorna
  const filtered = chapters.filter((c) => c.number !== 'intro');

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      numColumns={5}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.grid}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onSelect(item)}
          style={({ pressed }) => [
            styles.cell,
            {
              backgroundColor: pressed ? colors.primaryFaded : colors.surfaceVariant,
              borderColor: colors.border,
            },
          ]}
        >
          <Body variant="small" color={colors.textPrimary}>
            {item.number}
          </Body>
        </Pressable>
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  grid: {
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  row: {
    gap: spacing.sm,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
  },
});
