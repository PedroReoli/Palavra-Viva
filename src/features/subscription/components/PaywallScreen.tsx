import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Crown, Check, X } from 'phosphor-react-native';
import type { PurchasesPackage } from 'react-native-purchases';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Heading, Body, Caption, Button, Card } from '@/shared/components';
import { useSubscription } from '../hooks/useSubscription';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface PaywallScreenProps {
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Dados dos planos
// ---------------------------------------------------------------------------

const FREE_FEATURES = [
  { label: 'Biblia completa (ARA, NVI)', included: true },
  { label: 'Planos de leitura', included: true },
  { label: 'Versiculo do dia', included: true },
  { label: 'Calendario liturgico', included: true },
  { label: 'IA Conversacional', included: false },
  { label: 'Devocional com IA', included: false },
  { label: 'Audio das passagens', included: false },
];

const PREMIUM_FEATURES = [
  { label: 'Tudo do plano gratuito', included: true },
  { label: 'IA Conversacional ilimitada', included: true },
  { label: 'Devocional personalizado com IA', included: true },
  { label: 'Audio das passagens', included: true },
  { label: 'Historico de conversas', included: true },
  { label: 'Cartao de versiculo ilimitado', included: true },
];

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function PaywallScreen({ onClose }: PaywallScreenProps) {
  const { colors } = useTheme();
  const { offerings, purchase, restore, isLoading, error } = useSubscription();

  const monthlyPkg = offerings?.current?.monthly;
  const annualPkg = offerings?.current?.annual;

  const handlePurchase = async (pkg: PurchasesPackage | undefined) => {
    if (!pkg) return;
    await purchase(pkg);
    onClose();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Crown size={40} color={colors.secondary} weight="fill" />
          <Heading size="h2">Palavra Viva Premium</Heading>
          <Body color={colors.textSecondary}>
            Desbloqueie toda a experiencia espiritual com IA.
          </Body>
        </View>

        {/* Plano Gratuito */}
        <Card variant="outlined" padding="md">
          <Heading size="h5">Gratuito</Heading>
          <Caption color={colors.textSecondary}>R$0 / para sempre</Caption>
          <View style={styles.featureList}>
            {FREE_FEATURES.map((f) => (
              <FeatureRow key={f.label} label={f.label} included={f.included} />
            ))}
          </View>
        </Card>

        {/* Plano Premium */}
        <Card
          variant="elevated"
          padding="md"
          style={[styles.premiumCard, { borderColor: colors.secondary }]}
        >
          <View style={styles.premiumBadge}>
            <Caption variant="medium" color={colors.secondary}>
              Recomendado
            </Caption>
          </View>
          <Heading size="h5">Premium</Heading>
          <View style={styles.featureList}>
            {PREMIUM_FEATURES.map((f) => (
              <FeatureRow key={f.label} label={f.label} included={f.included} />
            ))}
          </View>

          {/* Opcoes de preco */}
          <View style={styles.priceOptions}>
            {monthlyPkg && (
              <Button
                variant="secondary"
                size="lg"
                onPress={() => handlePurchase(monthlyPkg)}
                loading={isLoading}
              >
                {monthlyPkg.product.priceString}/mes
              </Button>
            )}
            {annualPkg && (
              <Button
                variant="primary"
                size="lg"
                onPress={() => handlePurchase(annualPkg)}
                loading={isLoading}
              >
                {annualPkg.product.priceString}/ano
              </Button>
            )}
            {!monthlyPkg && !annualPkg && (
              <>
                <Button variant="primary" size="lg" disabled>
                  R$19,90/mes
                </Button>
                <Caption color={colors.textTertiary}>
                  Ofertas indisponiveis no momento
                </Caption>
              </>
            )}
          </View>
        </Card>

        {error && (
          <Body variant="small" color={colors.error}>{error}</Body>
        )}

        {/* Restaurar */}
        <Button variant="ghost" onPress={restore} loading={isLoading}>
          Restaurar compras
        </Button>

        {/* Fechar */}
        <Button variant="ghost" onPress={onClose}>
          Continuar com plano gratuito
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// FeatureRow
// ---------------------------------------------------------------------------

function FeatureRow({ label, included }: { label: string; included: boolean }) {
  const { colors } = useTheme();

  return (
    <View style={styles.featureRow}>
      {included ? (
        <Check size={16} color={colors.success} weight="bold" />
      ) : (
        <X size={16} color={colors.disabled} />
      )}
      <Body
        variant="small"
        color={included ? colors.textPrimary : colors.textTertiary}
      >
        {label}
      </Body>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  featureList: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  premiumCard: {
    borderWidth: 2,
    borderRadius: radii.xl,
  },
  premiumBadge: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  priceOptions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
