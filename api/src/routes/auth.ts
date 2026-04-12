import { Router } from 'express';
import { z } from 'zod';

import { supabaseAdmin } from '../lib/supabase';
import { validate } from '../middleware/validate';

export const authRouter = Router();

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const registerSchema = z.object({
  email: z.string().email('E-mail invalido'),
  password: z.string().min(8, 'Senha deve ter no minimo 8 caracteres'),
  name: z.string().min(1, 'Nome obrigatorio'),
});

const loginSchema = z.object({
  email: z.string().email('E-mail invalido'),
  password: z.string().min(1, 'Senha obrigatoria'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token obrigatorio'),
});

// ---------------------------------------------------------------------------
// POST /auth/register
// ---------------------------------------------------------------------------

authRouter.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    // Criar perfil na tabela profiles
    if (data.user) {
      await supabaseAdmin.from('profiles').insert({
        id: data.user.id,
        email,
        name,
        preferred_version: 'nvi',
      });
    }

    res.status(201).json({
      message: 'Conta criada com sucesso',
      userId: data.user?.id,
    });
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ---------------------------------------------------------------------------
// POST /auth/login
// ---------------------------------------------------------------------------

authRouter.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(401).json({ error: 'Credenciais invalidas' });
      return;
    }

    res.json({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
      },
    });
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ---------------------------------------------------------------------------
// POST /auth/refresh-token
// ---------------------------------------------------------------------------

authRouter.post('/refresh-token', validate(refreshSchema), async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      res.status(401).json({ error: 'Token invalido ou expirado' });
      return;
    }

    res.json({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
    });
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
