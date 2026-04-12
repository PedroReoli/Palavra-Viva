import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { streamChat, SYSTEM_PROMPT, getProviderInfo } from '../lib/ai-provider';

export const aiRouter = Router();

// Rate limit especifico: 20 req/min por usuario para IA
const aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.userId ?? req.ip ?? 'unknown',
  message: { error: 'Limite de mensagens atingido. Aguarde um momento.' },
});

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().min(1).max(5000),
    }),
  ).min(1).max(20),
  conversationId: z.string().uuid().optional(),
});

// ---------------------------------------------------------------------------
// POST /ai/chat
// ---------------------------------------------------------------------------

aiRouter.post('/chat', authenticate, aiRateLimit, validate(chatSchema), async (req, res) => {
  try {
    const { messages } = req.body;

    const stream = await streamChat(messages, SYSTEM_PROMPT);

    if (!stream) {
      res.status(503).json({ error: 'Servico de IA indisponivel' });
      return;
    }

    // Proxy do stream para o client via SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = stream.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }

    res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno do servidor';
    if (!res.headersSent) {
      res.status(500).json({ error: message });
    } else {
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
      res.end();
    }
  }
});

// ---------------------------------------------------------------------------
// GET /ai/info (debug — somente em dev)
// ---------------------------------------------------------------------------

if (process.env.NODE_ENV === 'development') {
  aiRouter.get('/info', (_req, res) => {
    res.json(getProviderInfo());
  });
}
