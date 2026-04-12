export type { LoginCredentials, RegisterData } from './services/authService';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  denomination: string | null;
  preferred_version: string;
  created_at: string;
}
