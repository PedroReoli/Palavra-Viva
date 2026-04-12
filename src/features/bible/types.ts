/**
 * Tipos da feature Bible.
 * Baseados nos contratos da API.Bible (api.scripture.api.bible/v1).
 */

export interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  language: {
    id: string;
    name: string;
  };
}

export interface BibleBook {
  id: string;
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;
}

export interface BibleChapter {
  id: string;
  bibleId: string;
  bookId: string;
  number: string;
  reference: string;
}

export interface BibleVerse {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  reference: string;
  content: string;
  verseCount?: number;
}

export interface ChapterContent {
  id: string;
  bibleId: string;
  bookId: string;
  number: string;
  reference: string;
  content: string;
  verseCount: number;
  next?: { id: string; bookId: string; number: string };
  previous?: { id: string; bookId: string; number: string };
}

export interface SearchResult {
  query: string;
  total: number;
  verseCount: number;
  verses: BibleVerse[];
}

/** Versoes suportadas no app */
export type SupportedVersion = 'nvi' | 'ara' | 'acf';

/** Mapa de IDs das versoes na API.Bible */
export const VERSION_IDS: Record<SupportedVersion, string> = {
  acf: '65eec8e0b60e656b-01',
  nvi: 'bba9f40180d04e55-01',
  ara: '5c561da118e9aaf2-01',
};

export const VERSION_LABELS: Record<SupportedVersion, string> = {
  nvi: 'Nova Versao Internacional',
  ara: 'Almeida Revista e Atualizada',
  acf: 'Almeida Corrigida Fiel',
};

/** Divisao dos livros */
export const OLD_TESTAMENT_COUNT = 39;
