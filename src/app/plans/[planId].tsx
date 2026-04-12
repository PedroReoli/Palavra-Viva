import { useEffect } from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Body } from '@/shared/components';
import PlanDetail from '@/features/reading-plans/components/PlanDetail';
import { usePlans } from '@/features/reading-plans/hooks/usePlans';

export default function PlanDetailScreen() {
  const { colors } = useTheme();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const router = useRouter();
  const { activePlans, selectedPlan, loadPlans, selectPlan, toggleDay } = usePlans();

  useEffect(() => {
    if (planId) selectPlan(planId);
  }, [planId, selectPlan]);

  useEffect(() => {
    if (activePlans.length === 0) loadPlans();
  }, [activePlans.length, loadPlans]);

  if (!selectedPlan) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backButton}>
          <ArrowLeft size={22} color={colors.icon} />
        </Pressable>
      </View>

      <PlanDetail
        activePlan={selectedPlan}
        onToggleDay={(day) => toggleDay(selectedPlan.plan.id, day)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
    alignSelf: 'flex-start',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
