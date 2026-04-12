import axios from 'axios';

import { useAuthStore } from '@/features/auth/stores/authStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

/**
 * Instancia Axios configurada para a VPS API.
 * Adiciona token de autenticacao automaticamente.
 */
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: adicionar token em todas as requests
api.interceptors.request.use((config) => {
  const session = useAuthStore.getState().session;
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Interceptor: tratar erros globais
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado — limpar sessao
      useAuthStore.getState().clear();
    }
    return Promise.reject(error);
  },
);
