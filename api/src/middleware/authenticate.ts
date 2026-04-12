import type { Request, Response, NextFunction } from 'express';

import { supabaseAdmin } from '../lib/supabase';

// Extender o tipo Request para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Middleware de autenticacao.
 * Verifica o token JWT no header Authorization.
 * Adiciona req.userId se valido.
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token nao fornecido' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ error: 'Token invalido ou expirado' });
      return;
    }

    req.userId = data.user.id;
    next();
  } catch {
    res.status(401).json({ error: 'Erro na autenticacao' });
  }
}
