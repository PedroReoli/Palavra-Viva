import { useCallback } from 'react';

import { useAuthStore } from '@/features/auth/stores/authStore';
import { devotionalService } from '../services/devotionalService';
import { useDevotionalStore } from '../stores/devotionalStore';

/**
 * Hook principal de devocionais.
 * Gerencia geracao, salvamento e historico.
 */
export function useDevotional() {
  const userId = useAuthStore((s) => s.user?.id);
  const {
    currentDevotional,
    savedDevotionals,
    isGenerating,
    error,
    setCurrent,
    setSaved,
    setIsGenerating,
    setError,
  } = useDevotionalStore();

  const generate = useCallback(
    async (theme: string) => {
      if (!userId) return;

      setError(null);
      setIsGenerating(true);
      setCurrent(null);

      try {
        const devotional = await devotionalService.generate(theme);
        setCurrent(devotional);

        // Salvar automaticamente
        const today = new Date().toISOString().split('T')[0];
        await devotionalService.save(userId, devotional, today);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao gerar devocional';
        setError(message);
      } finally {
        setIsGenerating(false);
      }
    },
    [userId, setCurrent, setIsGenerating, setError],
  );

  const loadHistory = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await devotionalService.getByUser(userId);
      setSaved(data);
    } catch {
      // Silenciar erro de historico
    }
  }, [userId, setSaved]);

  return {
    currentDevotional,
    savedDevotionals,
    isGenerating,
    error,
    generate,
    loadHistory,
  };
}
