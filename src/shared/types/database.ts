/**
 * Tipos do banco de dados Supabase.
 *
 * Este arquivo deve ser regenerado com:
 *   npx supabase gen types typescript --project-id <id> > src/shared/types/database.ts
 *
 * Por enquanto, contem a definicao manual das tabelas.
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          denomination: string | null;
          preferred_version: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          denomination?: string | null;
          preferred_version?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: 'free' | 'monthly' | 'yearly';
          status: 'active' | 'expired' | 'cancelled';
          provider_id: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          plan: 'free' | 'monthly' | 'yearly';
          status: 'active' | 'expired' | 'cancelled';
          provider_id?: string | null;
          expires_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
      highlights: {
        Row: {
          id: string;
          user_id: string;
          verse_id: string;
          color: string;
          text: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          verse_id: string;
          color: string;
          text: string;
        };
        Update: Partial<Database['public']['Tables']['highlights']['Insert']>;
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          verse_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          verse_id: string;
          content: string;
        };
        Update: Partial<Database['public']['Tables']['notes']['Insert']>;
      };
      reading_plans: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          duration_days: number;
          type: 'full' | 'thematic' | 'book';
        };
        Insert: {
          title: string;
          description?: string | null;
          duration_days: number;
          type: 'full' | 'thematic' | 'book';
        };
        Update: Partial<Database['public']['Tables']['reading_plans']['Insert']>;
      };
      reading_progress: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          day: number;
          completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          user_id: string;
          plan_id: string;
          day: number;
          completed?: boolean;
        };
        Update: Partial<Database['public']['Tables']['reading_progress']['Insert']>;
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title?: string | null;
        };
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at: string;
        };
        Insert: {
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      devotionals: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          verse_id: string | null;
          reflection: string;
          prayer: string | null;
          application: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          date: string;
          verse_id?: string | null;
          reflection: string;
          prayer?: string | null;
          application?: string | null;
        };
        Update: Partial<Database['public']['Tables']['devotionals']['Insert']>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          verse_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          verse_id: string;
        };
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
