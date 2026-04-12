import { View, Pressable, StyleSheet } from 'react-native';
import * as Icons from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { shadows } from '@/design/shadows';
import { Heading, Body, Caption } from '@/shared/components';
import type { ActivePlan } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface PlanCardProps {
  activePlan: ActivePlan;
  onPress: () => void;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function PlanCard({ activePlan, onPress }: PlanCardProps) {
  const { colors } = useTheme();
  const { plan, completedDays, totalDays, percentComplete } = activePlan;

  const IconComponent = getIcon(plan.icon);
  const hasStarted = completedDays > 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: pressed ? colors.pressed : colors.surface,
        },
        shadows.sm,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryFaded }]}>
          <IconComponent size={22} color={colors.primary} />
        </View>
        <View style={styles.meta}>
          <Caption color={colors.textTertiary}>
            {plan.durationDays} dias
            {plan.type === 'thematic' ? ' — Tematico' : ''}
          </Caption>
        </View>
      </View>

      <Heading size="h5">{plan.title}</Heading>
      <Body variant="small" color={colors.textSecondary} numberOfLines={2}>
        {plan.description}
      </Body>

      {/* Barra de progresso */}
      {hasStarted && (
        <View style={styles.progressSection}>
          <View style={[styles.progressBar, { backgroundColor: colors.surfaceVariant }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${percentComplete}%`,
                },
              ]}
            />
          </View>
          <Caption color={colors.textTertiary}>
            {completedDays}/{totalDays} dias ({percentComplete}%)
          </Caption>
        </View>
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getIcon(name: string) {
  const iconMap: Record<string, React.ComponentType<{ size: number; color: string }>> = {
    BookOpen: Icons.BookOpen,
    MusicNotes: Icons.MusicNotes,
    Heart: Icons.Heart,
    UsersThree: Icons.UsersThree,
    Compass: Icons.Compass,
    Crown: Icons.Crown,
  };
  return iconMap[name] ?? Icons.BookOpen;
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radii.lg,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressSection: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 6,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.full,
  },
});
