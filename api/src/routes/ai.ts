import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';

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
    const claudeApiKey = process.env.CLAUDE_API_KEY;

    if (!claudeApiKey) {
      res.status(503).json({ error: 'Servico de IA indisponivel' });
      return;
    }

    const systemPrompt = `Voce e um assistente espiritual cristao chamado "Palavra Viva".
Suas respostas devem ser:
- Baseadas exclusivamente na Biblia Sagrada
- Em portugues brasileiro
- Respeitosas com todas as denominacoes cristas
- Contextualizadas historica e teologicamente
- Praticas e aplicaveis ao dia a dia

Ao citar versiculos, use o formato: "Texto" (Livro Capitulo:Versiculo).
Nunca invente versiculos. Se nao souber, diga que nao tem certeza.
Mantenha um tom acolhedor, pastoral e educativo.`;

    // Proxy para Claude API com streaming (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      res.write(`data: ${JSON.stringify({ error: 'Erro ao conectar com IA' })}\n\n`);
      res.end();
      return;
    }

    // Pipe do stream da Claude API para o client
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }

    res.end();
  } catch {
    res.write(`data: ${JSON.stringify({ error: 'Erro interno do servidor' })}\n\n`);
    res.end();
  }
});
