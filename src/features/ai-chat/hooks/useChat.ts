import { useCallback } from 'react';

import { useAuthStore } from '@/features/auth/stores/authStore';
import { chatService } from '../services/chatService';
import { useChatStore } from '../stores/chatStore';

/**
 * Hook principal do chat com IA.
 * Gerencia envio de mensagens, streaming, historico e conversas.
 */
export function useChat() {
  const userId = useAuthStore((s) => s.user?.id);
  const {
    conversations,
    currentConversation,
    messages,
    streamingText,
    isStreaming,
    isLoading,
    setConversations,
    setCurrentConversation,
    setMessages,
    addMessage,
    setStreamingText,
    setIsStreaming,
    setIsLoading,
    removeConversation,
    reset,
  } = useChatStore();

  // Carregar conversas do usuario
  const loadConversations = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const data = await chatService.getConversations(userId);
      setConversations(data);
    } finally {
      setIsLoading(false);
    }
  }, [userId, setConversations, setIsLoading]);

  // Abrir uma conversa existente
  const openConversation = useCallback(
    async (conversation: typeof currentConversation) => {
      if (!conversation) return;
      setCurrentConversation(conversation);
      setIsLoading(true);
      try {
        const msgs = await chatService.getMessages(conversation.id);
        setMessages(msgs);
      } finally {
        setIsLoading(false);
      }
    },
    [setCurrentConversation, setMessages, setIsLoading],
  );

  // Enviar mensagem
  const sendMessage = useCallback(
    async (content: string) => {
      if (!userId || isStreaming) return;

      let conversation = currentConversation;

      // Criar conversa se nao existe
      if (!conversation) {
        const title = content.length > 50 ? content.slice(0, 50) + '...' : content;
        conversation = await chatService.createConversation(userId, title);
        setCurrentConversation(conversation);
        setConversations([conversation, ...conversations]);
      }

      // Salvar mensagem do usuario
      const userMsg = await chatService.saveMessage(conversation.id, 'user', content);
      addMessage(userMsg);

      // Preparar historico para a API (ultimas 20)
      const history = [...messages, userMsg]
        .slice(-20)
        .map((m) => ({ role: m.role, content: m.content }));

      // Iniciar streaming
      setIsStreaming(true);
      setStreamingText('');

      await chatService.sendMessage({
        messages: history,
        conversationId: conversation.id,
        onChunk: (text) => setStreamingText(text),
        onDone: async (fullText) => {
          setIsStreaming(false);
          setStreamingText('');

          if (fullText && conversation) {
            const assistantMsg = await chatService.saveMessage(
              conversation.id,
              'assistant',
              fullText,
            );
            addMessage(assistantMsg);
          }
        },
        onError: (error) => {
          setIsStreaming(false);
          setStreamingText('');
          // Adicionar mensagem de erro como assistente
          addMessage({
            id: `error-${Date.now()}`,
            conversationId: conversation!.id,
            role: 'assistant',
            content: `Desculpe, ocorreu um erro: ${error}`,
            createdAt: new Date().toISOString(),
          });
        },
      });
    },
    [
      userId,
      isStreaming,
      currentConversation,
      conversations,
      messages,
      addMessage,
      setCurrentConversation,
      setConversations,
      setIsStreaming,
      setStreamingText,
    ],
  );

  // Deletar conversa
  const deleteConversation = useCallback(
    async (conversationId: string) => {
      await chatService.deleteConversation(conversationId);
      removeConversation(conversationId);
    },
    [removeConversation],
  );

  // Nova conversa
  const newConversation = useCallback(() => {
    reset();
  }, [reset]);

  return {
    conversations,
    currentConversation,
    messages,
    streamingText,
    isStreaming,
    isLoading,
    loadConversations,
    openConversation,
    sendMessage,
    deleteConversation,
    newConversation,
  };
}
