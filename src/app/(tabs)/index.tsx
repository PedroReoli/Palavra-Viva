import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading, Body, Card } from '@/shared/components';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Heading size="h3">Palavra Viva</Heading>

        {/* Versiculo do Dia */}
        <Card variant="elevated" padding="lg">
          <Body variant="small" color={colors.textSecondary}>Versiculo do dia</Body>
          <Body style={styles.versePreview}>
            "O Senhor e o meu pastor; nada me faltara."
          </Body>
          <Body variant="small" color={colors.textSecondary}>Salmos 23:1</Body>
        </Card>

        {/* Progresso de Leitura */}
        <Card variant="outlined">
          <Heading size="h5">Plano de Leitura</Heading>
          <Body variant="small" color={colors.textSecondary}>
            Nenhum plano ativo. Comece um plano para acompanhar seu progresso.
          </Body>
        </Card>

        {/* Atalho IA */}
        <Card variant="filled">
          <Heading size="h5">Conversar com a IA</Heading>
          <Body variant="small" color={colors.textSecondary}>
            Tire suas duvidas sobre a Biblia com inteligencia artificial.
          </Body>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  versePreview: {
    marginVertical: spacing.sm,
  },
});
