import { useState, useCallback } from 'react';

import { useSubscriptionStore } from '../stores/subscriptionStore';

/**
 * Hook gate para funcionalidades premium.
 *
 * Uso:
 *   const { isPremium, showPaywall, paywallVisible, dismissPaywall } = useRequirePremium();
 *
 *   const handleAction = () => {
 *     if (!isPremium) {
 *       showPaywall();
 *       return;
 *     }
 *     // logica premium aqui
 *   };
 */
export function useRequirePremium() {
  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const [paywallVisible, setPaywallVisible] = useState(false);

  const showPaywall = useCallback(() => setPaywallVisible(true), []);
  const dismissPaywall = useCallback(() => setPaywallVisible(false), []);

  return {
    isPremium,
    paywallVisible,
    showPaywall,
    dismissPaywall,
  };
}
