import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { authRouter } from './routes/auth';
import { subscriptionRouter } from './routes/subscription';
import { userRouter } from './routes/user';
import { aiRouter } from './routes/ai';

const app = express();
const PORT = process.env.PORT ?? 3000;

// ---------------------------------------------------------------------------
// Middleware global
// ---------------------------------------------------------------------------

app.use(helmet());

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

// Rate limiting global: 100 req/min por IP
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisicoes. Tente novamente em breve.' },
}));

// ---------------------------------------------------------------------------
// Rotas
// ---------------------------------------------------------------------------

app.use('/auth', authRouter);
app.use('/subscription', subscriptionRouter);
app.use('/user', userRouter);
app.use('/ai', aiRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`[API] Servidor rodando na porta ${PORT}`);
});
