import { supabase } from '@/lib/supabase';

export const highlightService = {
  // -----------------------------------------------------------------------
  // Destaques
  // -----------------------------------------------------------------------

  async getHighlights(userId: string) {
    const { data, error } = await supabase
      .from('highlights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async addHighlight(userId: string, verseId: string, color: string, text: string) {
    const { data, error } = await supabase
      .from('highlights')
      .insert({ user_id: userId, verse_id: verseId, color, text })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async removeHighlight(highlightId: string): Promise<void> {
    const { error } = await supabase
      .from('highlights')
      .delete()
      .eq('id', highlightId);
    if (error) throw error;
  },

  // -----------------------------------------------------------------------
  // Notas
  // -----------------------------------------------------------------------

  async getNotes(userId: string) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async addNote(userId: string, verseId: string, content: string) {
    const { data, error } = await supabase
      .from('notes')
      .insert({ user_id: userId, verse_id: verseId, content })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateNote(noteId: string, content: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .update({ content })
      .eq('id', noteId);
    if (error) throw error;
  },

  async removeNote(noteId: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);
    if (error) throw error;
  },

  // -----------------------------------------------------------------------
  // Favoritos
  // -----------------------------------------------------------------------

  async getFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async toggleFavorite(userId: string, verseId: string): Promise<boolean> {
    // Verificar se ja existe
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('verse_id', verseId)
      .maybeSingle();

    if (existing) {
      await supabase.from('favorites').delete().eq('id', existing.id);
      return false; // removido
    }

    await supabase
      .from('favorites')
      .insert({ user_id: userId, verse_id: verseId });
    return true; // adicionado
  },
};
