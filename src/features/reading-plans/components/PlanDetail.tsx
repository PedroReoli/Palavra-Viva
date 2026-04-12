import { View, FlatList, StyleSheet } from 'react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading, Body, Caption } from '@/shared/components';
import ReadingChecklistItem from '@/shared/components/ReadingChecklistItem';
import type { ActivePlan, PlanDay } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface PlanDetailProps {
  activePlan: ActivePlan;
  onToggleDay: (day: number) => void;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function PlanDetail({ activePlan, onToggleDay }: PlanDetailProps) {
  const { colors } = useTheme();
  const { plan, progress, completedDays, totalDays, percentComplete } = activePlan;
  const completedSet = new Set(progress.filter((p) => p.completed).map((p) => p.day));

  return (
    <FlatList
      data={plan.days}
      keyExtractor={(item) => `day-${item.day}`}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Heading size="h4">{plan.title}</Heading>
          <Body variant="small" color={colors.textSecondary}>{plan.description}</Body>

          {/* Progresso */}
          <View style={styles.progressSection}>
            <View style={[styles.progressBar, { backgroundColor: colors.surfaceVariant }]}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: colors.primary, width: `${percentComplete}%` },
                ]}
              />
            </View>
            <View style={styles.progressRow}>
              <Caption color={colors.textTertiary}>
                {completedDays} de {totalDays} dias
              </Caption>
              <Caption color={colors.primary}>{percentComplete}%</Caption>
            </View>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <ReadingChecklistItem
          title={item.title}
          subtitle={item.passages.join(' | ')}
          completed={completedSet.has(item.day)}
          onToggle={() => onToggleDay(item.day)}
        />
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  progressSection: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
