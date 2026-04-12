export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
}

export interface ChatSuggestion {
  label: string;
  prompt: string;
}

export const CHAT_SUGGESTIONS: ChatSuggestion[] = [
  { label: 'Ansiedade', prompt: 'O que a Biblia fala sobre ansiedade?' },
  { label: 'Perdao', prompt: 'Quais versiculos falam sobre perdao?' },
  { label: 'Fe', prompt: 'Como fortalecer minha fe segundo a Biblia?' },
  { label: 'Sabedoria', prompt: 'O que a Biblia ensina sobre sabedoria?' },
  { label: 'Graca', prompt: 'Qual a diferenca entre graca e misericordia?' },
  { label: 'Oracao', prompt: 'Como a Biblia ensina a orar?' },
];
