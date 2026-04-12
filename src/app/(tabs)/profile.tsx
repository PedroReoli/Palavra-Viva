import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Trophy, CalendarCheck, BookOpen, Gear, SignOut, Crown } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Heading, Body, Caption, Card, Avatar, Badge, Button } from '@/shared/components';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useStreak } from '@/shared/hooks/useStreak';
import { useSubscriptionStore } from '@/features/subscription/stores/subscriptionStore';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const { currentStreak, longestStreak, totalDaysRead, thisMonthDays } = useStreak();
  const isPremium = useSubscriptionStore((s) => s.isPremium);

  const userName = user?.user_metadata?.name ?? 'Usuario';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header do perfil */}
        <View style={styles.profileHeader}>
          <Avatar name={userName} size="lg" />
          <View style={styles.profileInfo}>
            <Heading size="h4">{userName}</Heading>
            <View style={styles.planRow}>
              <Badge
                label={isPremium ? 'Premium' : 'Gratuito'}
                variant={isPremium ? 'success' : 'default'}
              />
            </View>
          </View>
        </View>

        {/* Streak */}
        <Card variant="elevated" padding="md">
          <View style={styles.statsGrid}>
            <StatItem
              icon={<Flame size={22} color={colors.secondary} weight="fill" />}
              value={currentStreak}
              label="Streak atual"
            />
            <StatItem
              icon={<Trophy size={22} color={colors.secondary} />}
              value={longestStreak}
              label="Maior streak"
            />
            <StatItem
              icon={<CalendarCheck size={22} color={colors.primary} />}
              value={thisMonthDays}
              label="Este mes"
            />
            <StatItem
              icon={<BookOpen size={22} color={colors.primary} />}
              value={totalDaysRead}
              label="Total de dias"
            />
          </View>
        </Card>

        {/* Upgrade */}
        {!isPremium && (
          <Card
            variant="filled"
            padding="md"
            style={[styles.upgradeCard, { borderColor: colors.secondary }]}
          >
            <View style={styles.upgradeRow}>
              <Crown size={24} color={colors.secondary} weight="fill" />
              <View style={styles.upgradeContent}>
                <Body variant="medium">Desbloqueie o Premium</Body>
                <Caption color={colors.textSecondary}>
                  IA, devocionais, audio e mais.
                </Caption>
              </View>
            </View>
          </Card>
        )}

        {/* Acoes */}
        <View style={styles.actions}>
          <Button variant="outline" size="md" icon={<Gear size={18} color={colors.textSecondary} />}>
            Configuracoes
          </Button>
          <Button
            variant="ghost"
            size="md"
            icon={<SignOut size={18} color={colors.error} />}
            onPress={logout}
          >
            Sair
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// StatItem
// ---------------------------------------------------------------------------

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  const { colors } = useTheme();

  return (
    <View style={styles.statItem}>
      {icon}
      <Heading size="h4">{value}</Heading>
      <Caption color={colors.textTertiary}>{label}</Caption>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  profileInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  planRow: {
    flexDirection: 'row',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: '40%',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  upgradeCard: {
    borderWidth: 1,
    borderRadius: radii.lg,
  },
  upgradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.ms,
  },
  upgradeContent: {
    flex: 1,
    gap: 2,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
