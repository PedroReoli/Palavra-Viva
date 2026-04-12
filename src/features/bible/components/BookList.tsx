import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { BookOpen } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Body, Caption } from '@/shared/components';
import type { BibleBook } from '../types';
import { OLD_TESTAMENT_COUNT } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface BookListProps {
  books: BibleBook[];
  onSelect: (book: BibleBook) => void;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function BookList({ books, onSelect }: BookListProps) {
  const { colors } = useTheme();
  const oldTestament = books.slice(0, OLD_TESTAMENT_COUNT);
  const newTestament = books.slice(OLD_TESTAMENT_COUNT);

  return (
    <FlatList
      data={[
        { type: 'header' as const, title: 'Antigo Testamento' },
        ...oldTestament.map((b) => ({ type: 'book' as const, book: b })),
        { type: 'header' as const, title: 'Novo Testamento' },
        ...newTestament.map((b) => ({ type: 'book' as const, book: b })),
      ]}
      keyExtractor={(item, i) => (item.type === 'header' ? `h-${i}` : item.book.id)}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        if (item.type === 'header') {
          return (
            <Caption variant="overline" color={colors.textTertiary} style={styles.sectionHeader}>
              {item.title}
            </Caption>
          );
        }

        return (
          <Pressable
            onPress={() => onSelect(item.book)}
            style={({ pressed }) => [
              styles.bookItem,
              { backgroundColor: pressed ? colors.pressed : colors.surface },
            ]}
          >
            <BookOpen size={18} color={colors.iconSecondary} />
            <Body variant="small">{item.book.name}</Body>
          </Pressable>
        );
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  list: {
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.ms,
    borderRadius: radii.md,
  },
});
