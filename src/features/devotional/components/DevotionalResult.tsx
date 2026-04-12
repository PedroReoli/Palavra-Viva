import { View, ScrollView, Share, StyleSheet } from 'react-native';
import { ShareNetwork, BookmarkSimple } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Heading, Body, Caption, Card, Button } from '@/shared/components';
import { VerseText } from '@/shared/components/Typography';
import type { GeneratedDevotional } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface DevotionalResultProps {
  devotional: GeneratedDevotional;
  onNewDevotional: () => void;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function DevotionalResult({ devotional, onNewDevotional }: DevotionalResultProps) {
  const { colors } = useTheme();

  const handleShare = async () => {
    const text = [
      `"${devotional.verse}" — ${devotional.verseReference}`,
      '',
      devotional.reflection,
      '',
      `Oracao: ${devotional.prayer}`,
      '',
      'Via Palavra Viva',
    ].join('\n');

    await Share.share({ message: text });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Versiculo */}
      <Card variant="elevated" padding="lg">
        <VerseText reference={devotional.verseReference} variant="default">
          {devotional.verse}
        </VerseText>
      </Card>

      {/* Reflexao */}
      <View style={styles.section}>
        <Caption variant="overline" color={colors.textTertiary}>Reflexao</Caption>
        <Body>{devotional.reflection}</Body>
      </View>

      {/* Oracao */}
      {devotional.prayer ? (
        <Card variant="filled" padding="md">
          <Caption variant="overline" color={colors.textTertiary}>Oracao</Caption>
          <Body variant="small" style={styles.prayerText}>
            {devotional.prayer}
          </Body>
        </Card>
      ) : null}

      {/* Aplicacao */}
      {devotional.application ? (
        <View style={styles.section}>
          <Caption variant="overline" color={colors.textTertiary}>Aplicacao para hoje</Caption>
          <Body variant="small" color={colors.textSecondary}>
            {devotional.application}
          </Body>
        </View>
      ) : null}

      {/* Acoes */}
      <View style={styles.actions}>
        <Button
          variant="outline"
          size="md"
          icon={<ShareNetwork size={18} color={colors.textSecondary} />}
          onPress={handleShare}
        >
          Compartilhar
        </Button>
        <Button variant="primary" size="md" onPress={onNewDevotional}>
          Novo devocional
        </Button>
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  section: {
    gap: spacing.sm,
  },
  prayerText: {
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
