import axios from 'axios';

import {
  type BibleBook,
  type BibleChapter,
  type ChapterContent,
  type SearchResult,
  type SupportedVersion,
  VERSION_IDS,
} from '../types';

// ---------------------------------------------------------------------------
// Axios instance para API.Bible
// ---------------------------------------------------------------------------

const API_BIBLE_KEY = process.env.EXPO_PUBLIC_API_BIBLE_KEY ?? '';

const biblApi = axios.create({
  baseURL: 'https://api.scripture.api.bible/v1',
  timeout: 15000,
  headers: {
    'api-key': API_BIBLE_KEY,
  },
});

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const bibleService = {
  /**
   * Lista todos os livros de uma versao.
   */
  async getBooks(version: SupportedVersion): Promise<BibleBook[]> {
    const bibleId = VERSION_IDS[version];
    const { data } = await biblApi.get(`/bibles/${bibleId}/books`);
    return data.data;
  },

  /**
   * Lista todos os capitulos de um livro.
   */
  async getChapters(version: SupportedVersion, bookId: string): Promise<BibleChapter[]> {
    const bibleId = VERSION_IDS[version];
    const { data } = await biblApi.get(`/bibles/${bibleId}/books/${bookId}/chapters`);
    return data.data;
  },

  /**
   * Busca o conteudo completo de um capitulo.
   */
  async getChapterContent(
    version: SupportedVersion,
    chapterId: string,
  ): Promise<ChapterContent> {
    const bibleId = VERSION_IDS[version];
    const { data } = await biblApi.get(
      `/bibles/${bibleId}/chapters/${chapterId}`,
      {
        params: {
          'content-type': 'text',
          'include-notes': false,
          'include-titles': true,
          'include-chapter-numbers': false,
          'include-verse-numbers': true,
          'include-verse-spans': true,
        },
      },
    );
    return data.data;
  },

  /**
   * Busca por palavra ou frase na Biblia.
   */
  async search(
    version: SupportedVersion,
    query: string,
    limit: number = 20,
  ): Promise<SearchResult> {
    const bibleId = VERSION_IDS[version];
    const { data } = await biblApi.get(`/bibles/${bibleId}/search`, {
      params: {
        query,
        limit,
        sort: 'relevance',
      },
    });
    return data.data;
  },
};
