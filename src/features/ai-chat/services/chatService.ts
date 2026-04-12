import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { parseSSEChunk } from '@/shared/utils/parseSSE';

import type { ChatMessage, Conversation } from '../types';

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------

interface SendMessageParams {
  messages: { role: 'user' | 'assistant'; content: string }[];
  conversationId?: string;
  onChunk: (text: string) => void;
  onDone: (fullText: string) => void;
  onError: (error: string) => void;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const chatService = {
  /**
   * Envia mensagens para o proxy de IA com streaming.
   */
  async sendMessage({ messages, conversationId, onChunk, onDone, onError }: SendMessageParams) {
    try {
      const response = await fetch(
        `${api.defaults.baseURL}/ai/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: api.defaults.headers.common?.Authorization as string ?? '',
          },
          body: JSON.stringify({ messages, conversationId }),
        },
      );

      if (!response.ok || !response.body) {
        onError('Erro ao conectar com a IA');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const extracted = parseSSEChunk(chunk);
        if (extracted) {
          fullText += extracted;
          onChunk(fullText);
        }
      }

      onDone(fullText);
    } catch {
      onError('Erro de conexao com o servidor');
    }
  },

  // -----------------------------------------------------------------------
  // Persistencia (Supabase)
  // -----------------------------------------------------------------------

  async createConversation(userId: string, title: string): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: userId, title })
      .select()
      .single();
    if (error) throw error;
    return mapConversation(data);
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapConversation);
  },

  async deleteConversation(conversationId: string): Promise<void> {
    // Deletar mensagens primeiro (cascade manual)
    await supabase.from('messages').delete().eq('conversation_id', conversationId);
    const { error } = await supabase.from('conversations').delete().eq('id', conversationId);
    if (error) throw error;
  },

  async saveMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
  ): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, role, content })
      .select()
      .single();
    if (error) throw error;
    return mapMessage(data);
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapMessage);
  },
};

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapConversation(row: any): Conversation {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMessage(row: any): ChatMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at,
  };
}
