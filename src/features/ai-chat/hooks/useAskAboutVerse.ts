import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { useChatStore } from '../stores/chatStore';

/**
 * Hook para integrar o leitor biblico com o chat de IA.
 * Ao chamar askAboutVerse, navega para a tab de IA com contexto pre-definido.
 */
export function useAskAboutVerse() {
  const router = useRouter();
  const reset = useChatStore((s) => s.reset);

  const askAboutVerse = useCallback(
    (verseText: string, reference: string) => {
      // Limpar conversa atual para iniciar uma nova com contexto
      reset();

      // Armazenar a pergunta pendente no store
      useChatStore.setState({
        // Usar uma mensagem pendente que o chat vai detectar
        streamingText: '',
      });

      // Navegar para a tab de IA
      router.push('/(tabs)/ai');

      // Agendar o envio da pergunta apos a navegacao
      setTimeout(() => {
        const prompt = `Explique o contexto historico e espiritual de ${reference}: "${verseText}"`;
        // O chat hook vai capturar isso via pendingQuestion
        useChatStore.setState({
          // Sinalizar pergunta pendente
          messages: [],
        });
        // Disparar o envio via evento (o componente da tela de chat vai detectar)
        globalPendingQuestion = prompt;
      }, 300);
    },
    [router, reset],
  );

  return { askAboutVerse };
}

/**
 * Variavel global para comunicar entre hooks.
 * O componente de chat consome e limpa apos uso.
 */
export let globalPendingQuestion: string | null = null;

export function consumePendingQuestion(): string | null {
  const q = globalPendingQuestion;
  globalPendingQuestion = null;
  return q;
}
