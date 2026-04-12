import { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChatCircle, BookOpen, Calendar } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading, Body, Card, VerseCard } from '@/shared/components';
import { getDailyVerse } from '@/features/bible/services/verseDayService';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const dailyVerse = useMemo(() => getDailyVerse(), []);

  const handleShareVerse = async () => {
    await Share.share({
      message: `"${dailyVerse.text}"\n\n— ${dailyVerse.reference}\n\nVia Palavra Viva`,
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Heading size="h3">Palavra Viva</Heading>

        {/* Versiculo do Dia */}
        <VerseCard
          text={dailyVerse.text}
          reference={dailyVerse.reference}
          onShare={handleShareVerse}
        />

        {/* Progresso de Leitura */}
        <Card variant="outlined" onPress={() => router.push('/(tabs)/bible')}>
          <View style={styles.cardRow}>
            <BookOpen size={22} color={colors.primary} />
            <View style={styles.cardContent}>
              <Heading size="h5">Plano de Leitura</Heading>
              <Body variant="small" color={colors.textSecondary}>
                Comece um plano para acompanhar seu progresso.
              </Body>
            </View>
          </View>
        </Card>

        {/* Atalho IA */}
        <Card variant="filled" onPress={() => router.push('/(tabs)/ai')}>
          <View style={styles.cardRow}>
            <ChatCircle size={22} color={colors.primary} />
            <View style={styles.cardContent}>
              <Heading size="h5">Conversar com a IA</Heading>
              <Body variant="small" color={colors.textSecondary}>
                Tire duvidas sobre qualquer passagem biblica.
              </Body>
            </View>
          </View>
        </Card>

        {/* Calendario */}
        <Card variant="outlined" onPress={() => router.push('/(tabs)/calendar')}>
          <View style={styles.cardRow}>
            <Calendar size={22} color={colors.primary} />
            <View style={styles.cardContent}>
              <Heading size="h5">Calendario Liturgico</Heading>
              <Body variant="small" color={colors.textSecondary}>
                Acompanhe as datas do calendario cristao.
              </Body>
            </View>
          </View>
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
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.ms,
  },
  cardContent: {
    flex: 1,
    gap: spacing.xs,
  },
});
