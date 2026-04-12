import { Router } from 'express';
import { z } from 'zod';

import { supabaseAdmin } from '../lib/supabase';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';

export const userRouter = Router();

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  avatar_url: z.string().url().optional(),
  denomination: z.string().optional(),
  preferred_version: z.enum(['nvi', 'ara', 'acf', 'ntlh']).optional(),
});

// ---------------------------------------------------------------------------
// GET /user/profile
// ---------------------------------------------------------------------------

userRouter.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      res.status(404).json({ error: 'Perfil nao encontrado' });
      return;
    }

    res.json(data);
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ---------------------------------------------------------------------------
// PUT /user/profile
// ---------------------------------------------------------------------------

userRouter.put('/profile', authenticate, validate(updateProfileSchema), async (req, res) => {
  try {
    const userId = req.userId;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(req.body)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
