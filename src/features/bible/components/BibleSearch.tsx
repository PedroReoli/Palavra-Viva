import { useState, useCallback } from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { MagnifyingGlass } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Body, Caption, Input } from '@/shared/components';
import { useBibleSearch } from '../hooks/useBible';
import type { SupportedVersion, BibleVerse } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface BibleSearchProps {
  version: SupportedVersion;
  onSelectVerse?: (verse: BibleVerse) => void;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function BibleSearch({ version, onSelectVerse }: BibleSearchProps) {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const { data: results, isLoading } = useBibleSearch(version, query);

  return (
    <View style={styles.container}>
      <Input
        variant="search"
        placeholder="Buscar na Biblia..."
        value={query}
        onChangeText={setQuery}
        icon={<MagnifyingGlass size={18} color={colors.iconSecondary} />}
      />

      {results && results.verses.length > 0 && (
        <View style={styles.resultInfo}>
          <Caption color={colors.textTertiary}>
            {results.total} resultados para &ldquo;{results.query}&rdquo;
          </Caption>
        </View>
      )}

      <FlatList
        data={results?.verses ?? []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onSelectVerse?.(item)}
            style={({ pressed }) => [
              styles.resultItem,
              {
                backgroundColor: pressed ? colors.pressed : colors.surface,
                borderColor: colors.borderLight,
              },
            ]}
          >
            <Caption variant="medium" color={colors.primary}>
              {item.reference}
            </Caption>
            <Body variant="small" numberOfLines={3}>
              {stripHtml(item.content)}
            </Body>
          </Pressable>
        )}
        ListEmptyComponent={
          query.length >= 3 && !isLoading ? (
            <View style={styles.empty}>
              <Body color={colors.textTertiary}>Nenhum resultado encontrado.</Body>
            </View>
          ) : null
        }
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: screenPadding,
    gap: spacing.sm,
  },
  resultInfo: {
    paddingVertical: spacing.xs,
  },
  list: {
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  resultItem: {
    padding: spacing.ms,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
  empty: {
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
});
