import { useQuery } from '@tanstack/react-query';

import { bibleService } from '../services/bibleService';
import { useBibleStore } from '../stores/bibleStore';
import type { SupportedVersion } from '../types';

// Cache infinito para conteudo biblico (nunca muda)
const BIBLE_STALE_TIME = Infinity;

/**
 * Hook para listar livros de uma versao.
 */
export function useBooks(version: SupportedVersion) {
  return useQuery({
    queryKey: ['bible', 'books', version],
    queryFn: () => bibleService.getBooks(version),
    staleTime: BIBLE_STALE_TIME,
  });
}

/**
 * Hook para listar capitulos de um livro.
 */
export function useChapters(version: SupportedVersion, bookId: string | null) {
  return useQuery({
    queryKey: ['bible', 'chapters', version, bookId],
    queryFn: () => bibleService.getChapters(version, bookId!),
    enabled: !!bookId,
    staleTime: BIBLE_STALE_TIME,
  });
}

/**
 * Hook para buscar conteudo de um capitulo.
 */
export function useChapterContent(version: SupportedVersion, chapterId: string | null) {
  return useQuery({
    queryKey: ['bible', 'chapter-content', version, chapterId],
    queryFn: () => bibleService.getChapterContent(version, chapterId!),
    enabled: !!chapterId,
    staleTime: BIBLE_STALE_TIME,
  });
}

/**
 * Hook para busca biblica.
 */
export function useBibleSearch(version: SupportedVersion, query: string) {
  return useQuery({
    queryKey: ['bible', 'search', version, query],
    queryFn: () => bibleService.search(version, query),
    enabled: query.length >= 3,
    staleTime: 1000 * 60 * 10, // 10 minutos para buscas
  });
}

/**
 * Hook combinado para acesso rapido ao estado e navegacao biblica.
 */
export function useBibleNavigation() {
  const store = useBibleStore();

  return {
    selectedVersion: store.selectedVersion,
    selectedBook: store.selectedBook,
    selectedChapter: store.selectedChapter,
    fontSize: store.fontSize,
    setVersion: store.setVersion,
    setBook: store.setBook,
    setChapter: store.setChapter,
    setFontSize: store.setFontSize,
    reset: store.reset,
  };
}
