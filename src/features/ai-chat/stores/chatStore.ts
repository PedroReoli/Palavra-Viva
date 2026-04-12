import { create } from 'zustand';

import type { ChatMessage, Conversation } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: ChatMessage[];
  streamingText: string;
  isStreaming: boolean;
  isLoading: boolean;

  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setStreamingText: (text: string) => void;
  setIsStreaming: (streaming: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  removeConversation: (id: string) => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  streamingText: '',
  isStreaming: false,
  isLoading: false,

  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (currentConversation) => set({ currentConversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  setStreamingText: (streamingText) => set({ streamingText }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setIsLoading: (isLoading) => set({ isLoading }),
  removeConversation: (id) =>
    set((s) => ({
      conversations: s.conversations.filter((c) => c.id !== id),
      currentConversation: s.currentConversation?.id === id ? null : s.currentConversation,
      messages: s.currentConversation?.id === id ? [] : s.messages,
    })),
  reset: () =>
    set({
      currentConversation: null,
      messages: [],
      streamingText: '',
      isStreaming: false,
    }),
}));
