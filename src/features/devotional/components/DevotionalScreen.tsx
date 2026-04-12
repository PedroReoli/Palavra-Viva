import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { Heading, Body } from '@/shared/components';
import { useDevotional } from '../hooks/useDevotional';
import { useDevotionalStore } from '../stores/devotionalStore';
import { useRequirePremium } from '@/features/subscription/hooks/useRequirePremium';
import PaywallScreen from '@/features/subscription/components/PaywallScreen';
import DevotionalInput from './DevotionalInput';
import DevotionalResult from './DevotionalResult';

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function DevotionalScreen() {
  const { colors } = useTheme();
  const { currentDevotional, isGenerating, error, generate } = useDevotional();
  const { isPremium, paywallVisible, showPaywall, dismissPaywall } = useRequirePremium();

  if (paywallVisible) {
    return <PaywallScreen onClose={dismissPaywall} />;
  }

  const handleGenerate = (theme: string) => {
    if (!isPremium) {
      showPaywall();
      return;
    }
    generate(theme);
  };

  const handleNewDevotional = () => {
    useDevotionalStore.getState().setCurrent(null);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {isGenerating ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Heading size="h5" color={colors.textSecondary}>Gerando seu devocional...</Heading>
          <Body variant="small" color={colors.textTertiary}>
            Isso pode levar alguns segundos.
          </Body>
        </View>
      ) : currentDevotional ? (
        <DevotionalResult
          devotional={currentDevotional}
          onNewDevotional={handleNewDevotional}
        />
      ) : (
        <DevotionalInput onGenerate={handleGenerate} isGenerating={isGenerating} />
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Body variant="small" color={colors.error}>{error}</Body>
        </View>
      )}
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  errorContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    alignItems: 'center',
  },
});
