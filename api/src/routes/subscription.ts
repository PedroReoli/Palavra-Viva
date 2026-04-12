import { Router } from 'express';

import { supabaseAdmin } from '../lib/supabase';
import { authenticate } from '../middleware/authenticate';

export const subscriptionRouter = Router();

// ---------------------------------------------------------------------------
// GET /subscription/status
// ---------------------------------------------------------------------------

subscriptionRouter.get('/status', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      res.status(500).json({ error: 'Erro ao buscar assinatura' });
      return;
    }

    if (!data) {
      res.json({ plan: 'free', status: 'active', isPremium: false });
      return;
    }

    res.json({
      plan: data.plan,
      status: data.status,
      expiresAt: data.expires_at,
      isPremium: data.plan !== 'free' && data.status === 'active',
    });
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ---------------------------------------------------------------------------
// POST /subscription/webhook (RevenueCat)
// ---------------------------------------------------------------------------

subscriptionRouter.post('/webhook', async (req, res) => {
  try {
    const secret = req.headers['authorization'];
    if (secret !== `Bearer ${process.env.REVENUECAT_WEBHOOK_SECRET}`) {
      res.status(401).json({ error: 'Nao autorizado' });
      return;
    }

    const event = req.body;
    const appUserId = event?.event?.app_user_id;
    const eventType = event?.event?.type;

    if (!appUserId || !eventType) {
      res.status(400).json({ error: 'Payload invalido' });
      return;
    }

    // Mapear tipos de evento para status
    const activeEvents = [
      'INITIAL_PURCHASE',
      'RENEWAL',
      'UNCANCELLATION',
      'NON_RENEWING_PURCHASE',
    ];
    const cancelEvents = [
      'CANCELLATION',
      'EXPIRATION',
      'BILLING_ISSUE',
    ];

    if (activeEvents.includes(eventType)) {
      const productId = event.event?.product_id ?? '';
      const plan = productId.includes('annual') ? 'yearly' : 'monthly';
      const expiresAt = event.event?.expiration_at_ms
        ? new Date(event.event.expiration_at_ms).toISOString()
        : null;

      await supabaseAdmin.from('subscriptions').upsert(
        {
          user_id: appUserId,
          plan,
          status: 'active',
          provider_id: event.event?.original_transaction_id ?? null,
          expires_at: expiresAt,
        },
        { onConflict: 'user_id' },
      );
    }

    if (cancelEvents.includes(eventType)) {
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: eventType === 'EXPIRATION' ? 'expired' : 'cancelled' })
        .eq('user_id', appUserId);
    }

    res.json({ received: true });
  } catch {
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
});
