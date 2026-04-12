import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { parseSSEChunk } from '@/shared/utils/parseSSE';

import type { Devotional, GeneratedDevotional } from '../types';

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const devotionalService = {
  /**
   * Gera um devocional personalizado via proxy VPS (provider configuravel).
   */
  async generate(theme: string): Promise<GeneratedDevotional> {
    const systemContext = `O usuario pediu um devocional sobre: "${theme}".
Gere um devocional personalizado no seguinte formato JSON (sem markdown, apenas JSON puro):
{
  "verse": "texto do versiculo",
  "verseReference": "Livro Capitulo:Versiculo",
  "reflection": "reflexao espiritual de 2-3 paragrafos",
  "prayer": "oracao sugerida de 1 paragrafo",
  "application": "aplicacao pratica para o dia em 1-2 frases"
}
Baseie-se exclusivamente na Biblia. Responda em portugues brasileiro.`;

    const fullResponse = await fetchFullResponse(systemContext);

    try {
      // Extrair JSON do texto da resposta
      const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Resposta sem JSON valido');
      return JSON.parse(jsonMatch[0]) as GeneratedDevotional;
    } catch {
      // Fallback se nao conseguir parsear
      return {
        verse: '',
        verseReference: '',
        reflection: fullResponse,
        prayer: '',
        application: '',
      };
    }
  },

  /**
   * Salva um devocional no Supabase.
   */
  async save(
    userId: string,
    devotional: GeneratedDevotional,
    date: string,
  ): Promise<Devotional> {
    const { data, error } = await supabase
      .from('devotionals')
      .insert({
        user_id: userId,
        date,
        verse_id: devotional.verseReference,
        reflection: devotional.reflection,
        prayer: devotional.prayer,
        application: devotional.application,
      })
      .select()
      .single();
    if (error) throw error;
    return mapDevotional(data);
  },

  /**
   * Busca devocionais do usuario.
   */
  async getByUser(userId: string): Promise<Devotional[]> {
    const { data, error } = await supabase
      .from('devotionals')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30);
    if (error) throw error;
    return (data ?? []).map(mapDevotional);
  },

  /**
   * Busca devocional de uma data especifica.
   */
  async getByDate(userId: string, date: string): Promise<Devotional | null> {
    const { data, error } = await supabase
      .from('devotionals')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle();
    if (error) throw error;
    return data ? mapDevotional(data) : null;
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchFullResponse(prompt: string): Promise<string> {
  const baseUrl = api.defaults.baseURL;
  const token = api.defaults.headers.common?.Authorization;

  const response = await fetch(`${baseUrl}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token as string } : {}),
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error('Erro ao gerar devocional');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const extracted = parseSSEChunk(chunk);
    if (extracted) fullText += extracted;
  }

  return fullText;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDevotional(row: any): Devotional {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    verseId: row.verse_id,
    reflection: row.reflection,
    prayer: row.prayer,
    application: row.application,
    createdAt: row.created_at,
  };
}
