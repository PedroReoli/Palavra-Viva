import { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'phosphor-react-native';
import { Pressable } from 'react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading, Body } from '@/shared/components';
import { useBooks, useChapters, useChapterContent, useBibleNavigation } from '@/features/bible/hooks/useBible';
import VersionSelector from '@/features/bible/components/VersionSelector';
import BookList from '@/features/bible/components/BookList';
import ChapterGrid from '@/features/bible/components/ChapterGrid';
import ChapterReader from '@/features/bible/components/ChapterReader';
import type { BibleBook, BibleChapter } from '@/features/bible/types';

// ---------------------------------------------------------------------------
// Etapas de navegacao
// ---------------------------------------------------------------------------

type Step = 'books' | 'chapters' | 'reading';

export default function BibleScreen() {
  const { colors } = useTheme();
  const {
    selectedVersion,
    selectedBook,
    selectedChapter,
    fontSize,
    setVersion,
    setBook,
    setChapter,
    setFontSize,
  } = useBibleNavigation();

  const [step, setStep] = useState<Step>(
    selectedChapter ? 'reading' : selectedBook ? 'chapters' : 'books',
  );
  const [verseActionData, setVerseActionData] = useState<{ text: string; reference: string } | null>(null);

  // Queries
  const { data: books, isLoading: loadingBooks } = useBooks(selectedVersion);
  const { data: chapters, isLoading: loadingChapters } = useChapters(
    selectedVersion,
    selectedBook?.id ?? null,
  );
  const { data: chapterContent, isLoading: loadingContent } = useChapterContent(
    selectedVersion,
    selectedChapter?.id ?? null,
  );

  // Handlers
  const handleSelectBook = (book: BibleBook) => {
    setBook(book);
    setStep('chapters');
  };

  const handleSelectChapter = (chapter: BibleChapter) => {
    setChapter(chapter);
    setStep('reading');
  };

  const handleBack = () => {
    if (step === 'reading') {
      setChapter(null);
      setStep('chapters');
    } else if (step === 'chapters') {
      setBook(null);
      setStep('books');
    }
  };

  const handlePrevious = () => {
    if (chapterContent?.previous && chapters) {
      const prev = chapters.find((c) => c.id === chapterContent.previous!.id);
      if (prev) setChapter(prev);
    }
  };

  const handleNext = () => {
    if (chapterContent?.next && chapters) {
      const next = chapters.find((c) => c.id === chapterContent.next!.id);
      if (next) setChapter(next);
    }
  };

  const handleVerseLongPress = (text: string, reference: string) => {
    setVerseActionData({ text, reference });
  };

  // Titulo dinamico
  const title =
    step === 'reading' && selectedBook
      ? selectedBook.name
      : step === 'chapters' && selectedBook
        ? selectedBook.name
        : 'Biblia';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        {step !== 'books' && (
          <Pressable onPress={handleBack} hitSlop={8} style={styles.backButton}>
            <ArrowLeft size={22} color={colors.icon} />
          </Pressable>
        )}
        <Heading size="h4" style={styles.title}>{title}</Heading>
      </View>

      {/* Seletor de versao (apenas na lista de livros) */}
      {step === 'books' && (
        <View style={styles.versionRow}>
          <VersionSelector selected={selectedVersion} onSelect={setVersion} />
        </View>
      )}

      {/* Conteudo */}
      {step === 'books' && (
        loadingBooks ? (
          <LoadingState />
        ) : books ? (
          <BookList books={books} onSelect={handleSelectBook} />
        ) : (
          <EmptyState message="Nao foi possivel carregar os livros." />
        )
      )}

      {step === 'chapters' && (
        loadingChapters ? (
          <LoadingState />
        ) : chapters ? (
          <View style={styles.chaptersContainer}>
            <Caption color={colors.textSecondary} style={styles.chaptersLabel}>
              Selecione o capitulo
            </Caption>
            <ChapterGrid chapters={chapters} onSelect={handleSelectChapter} />
          </View>
        ) : (
          <EmptyState message="Nao foi possivel carregar os capitulos." />
        )
      )}

      {step === 'reading' && (
        loadingContent ? (
          <LoadingState />
        ) : chapterContent ? (
          <ChapterReader
            chapter={chapterContent}
            fontSize={fontSize}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onFontSizeChange={setFontSize}
            onVerseLongPress={handleVerseLongPress}
          />
        ) : (
          <EmptyState message="Nao foi possivel carregar o capitulo." />
        )
      )}
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Componentes auxiliares
// ---------------------------------------------------------------------------

function LoadingState() {
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

function EmptyState({ message }: { message: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <Body color={colors.textSecondary}>{message}</Body>
    </View>
  );
}

function Caption(props: React.ComponentProps<typeof Body> & { variant?: string }) {
  // Re-usar Body com estilo caption
  return <Body variant="small" {...props} />;
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.sm,
  },
  backButton: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
  title: {
    flex: 1,
  },
  versionRow: {
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.ms,
  },
  chaptersContainer: {
    flex: 1,
    paddingHorizontal: screenPadding,
  },
  chaptersLabel: {
    marginBottom: spacing.sm,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
