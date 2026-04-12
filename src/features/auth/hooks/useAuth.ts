import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'expo-router';

import { authService, type LoginCredentials, type RegisterData } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

/**
 * Hook principal de autenticacao.
 * Gerencia sessao, login, registro e logout.
 */
export function useAuth() {
  const router = useRouter();
  const { session, user, isLoading, isAuthenticated, setSession, setLoading, clear } =
    useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Escutar mudancas de autenticacao
  useEffect(() => {
    // Carregar sessao existente
    authService.getSession().then((existingSession) => {
      setSession(existingSession);
    });

    // Listener de mudancas
    const { data: subscription } = authService.onAuthStateChange((newSession) => {
      setSession(newSession as ReturnType<typeof useAuthStore.getState>['session']);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [setSession]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setError(null);
      setLoading(true);
      try {
        await authService.login(credentials);
        router.replace('/(tabs)');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao fazer login';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [router, setLoading],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      setError(null);
      setLoading(true);
      try {
        await authService.register(data);
        router.replace('/(tabs)');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao criar conta';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [router, setLoading],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      clear();
      router.replace('/(auth)/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao sair';
      setError(message);
    }
  }, [router, clear]);

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
  };
}
