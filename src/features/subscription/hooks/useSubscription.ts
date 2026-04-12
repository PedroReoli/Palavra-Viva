import { useEffect, useCallback, useState } from 'react';
import type { PurchasesPackage } from 'react-native-purchases';

import { subscriptionService } from '../services/subscriptionService';
import { useSubscriptionStore } from '../stores/subscriptionStore';

/**
 * Hook principal de assinatura.
 * Gerencia status premium, ofertas, compra e restauracao.
 */
export function useSubscription() {
  const { isPremium, isLoading, offerings, setPremium, setLoading, setOfferings } =
    useSubscriptionStore();
  const [error, setError] = useState<string | null>(null);

  // Carregar status e ofertas ao montar
  useEffect(() => {
    async function init() {
      try {
        const [premium, allOfferings] = await Promise.all([
          subscriptionService.checkPremiumStatus(),
          subscriptionService.getOfferings(),
        ]);
        setPremium(premium);
        setOfferings(allOfferings);
      } catch {
        // RevenueCat pode falhar em ambiente de dev (Expo Go)
        setPremium(false);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [setPremium, setLoading, setOfferings]);

  const purchase = useCallback(
    async (pkg: PurchasesPackage) => {
      setError(null);
      setLoading(true);
      try {
        const customerInfo = await subscriptionService.purchasePackage(pkg);
        const active = customerInfo.entitlements.active['premium'] !== undefined;
        setPremium(active);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro na compra';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [setPremium, setLoading],
  );

  const restore = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const customerInfo = await subscriptionService.restorePurchases();
      const active = customerInfo.entitlements.active['premium'] !== undefined;
      setPremium(active);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao restaurar';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [setPremium, setLoading]);

  return {
    isPremium,
    isLoading,
    offerings,
    error,
    purchase,
    restore,
  };
}
