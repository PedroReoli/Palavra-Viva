import { useRef } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { ArrowLeft, ArrowRight, TextAa } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { fontFamilies } from '@/design/typography';
import { Heading, Body, Caption } from '@/shared/components';
import type { ChapterContent } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface ChapterReaderProps {
  chapter: ChapterContent;
  fontSize: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onFontSizeChange: (size: number) => void;
  onVerseLongPress?: (verseText: string, reference: string) => void;
}

const MIN_FONT = 14;
const MAX_FONT = 28;

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function ChapterReader({
  chapter,
  fontSize,
  onPrevious,
  onNext,
  onFontSizeChange,
  onVerseLongPress,
}: ChapterReaderProps) {
  const { colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const handleFontIncrease = () => {
    if (fontSize < MAX_FONT) onFontSizeChange(fontSize + 2);
  };

  const handleFontDecrease = () => {
    if (fontSize > MIN_FONT) onFontSizeChange(fontSize - 2);
  };

  // Parsear o conteudo de texto plano em linhas de versiculos
  const verses = parseVerses(chapter.content);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Heading size="h5">{chapter.reference}</Heading>
        <View style={styles.fontControls}>
          <Pressable onPress={handleFontDecrease} hitSlop={8}>
            <TextAa size={16} color={colors.iconSecondary} />
          </Pressable>
          <Caption color={colors.textTertiary}>{fontSize}</Caption>
          <Pressable onPress={handleFontIncrease} hitSlop={8}>
            <TextAa size={22} color={colors.icon} />
          </Pressable>
        </View>
      </View>

      {/* Conteudo */}
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {verses.map((verse, i) => (
          <Pressable
            key={i}
            onLongPress={() =>
              onVerseLongPress?.(verse.text, `${chapter.reference}:${verse.number}`)
            }
            style={styles.verseLine}
          >
            {verse.number && (
              <Body
                variant="small"
                color={colors.primary}
                style={styles.verseNumber}
              >
                {verse.number}
              </Body>
            )}
            <Body
              style={[
                styles.verseText,
                {
                  fontSize,
                  lineHeight: fontSize * 1.8,
                  fontFamily: fontFamilies.verse,
                  color: colors.textPrimary,
                },
              ]}
            >
              {verse.text}
            </Body>
          </Pressable>
        ))}
      </ScrollView>

      {/* Navegacao entre capitulos */}
      <View style={styles.navigation}>
        <Pressable
          onPress={() => {
            onPrevious?.();
            scrollRef.current?.scrollTo({ y: 0, animated: false });
          }}
          disabled={!chapter.previous}
          style={[styles.navButton, !chapter.previous && styles.navDisabled]}
        >
          <ArrowLeft
            size={20}
            color={chapter.previous ? colors.primary : colors.disabled}
          />
          <Body
            variant="small"
            color={chapter.previous ? colors.primary : colors.disabledText}
          >
            Anterior
          </Body>
        </Pressable>

        <Pressable
          onPress={() => {
            onNext?.();
            scrollRef.current?.scrollTo({ y: 0, animated: false });
          }}
          disabled={!chapter.next}
          style={[styles.navButton, !chapter.next && styles.navDisabled]}
        >
          <Body
            variant="small"
            color={chapter.next ? colors.primary : colors.disabledText}
          >
            Proximo
          </Body>
          <ArrowRight
            size={20}
            color={chapter.next ? colors.primary : colors.disabled}
          />
        </Pressable>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Parser de versiculos
// ---------------------------------------------------------------------------

interface ParsedVerse {
  number: string;
  text: string;
}

function parseVerses(content: string): ParsedVerse[] {
  // API.Bible retorna texto com marcacoes [numero] texto
  // Formato varia — tentamos extrair versiculos numerados
  const lines = content.split('\n').filter((l) => l.trim());
  const result: ParsedVerse[] = [];

  for (const line of lines) {
    // Tentar extrair numero de versiculo no inicio: "1 No principio..."
    const match = line.match(/^\[?(\d+)\]?\s+(.+)/);
    if (match) {
      result.push({ number: match[1], text: match[2].trim() });
    } else if (line.trim()) {
      // Linha sem numero — pode ser titulo ou continuacao
      result.push({ number: '', text: line.trim() });
    }
  }

  // Se nao conseguiu parsear nenhum versiculo, retornar conteudo como bloco unico
  if (result.length === 0 && content.trim()) {
    result.push({ number: '', text: content.trim() });
  }

  return result;
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.sm,
  },
  fontControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.xxl,
  },
  verseLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  verseNumber: {
    width: 28,
    textAlign: 'right',
    marginRight: spacing.sm,
    paddingTop: 2,
  },
  verseText: {
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.ms,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
  navDisabled: {
    opacity: 0.4,
  },
});
