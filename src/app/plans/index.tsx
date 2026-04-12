import { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';
import { View, Pressable } from 'react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading } from '@/shared/components';
import PlanCard from '@/features/reading-plans/components/PlanCard';
import { usePlans } from '@/features/reading-plans/hooks/usePlans';

export default function PlansListScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { activePlans, loadPlans, selectPlan } = usePlans();

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleSelectPlan = (planId: string) => {
    selectPlan(planId);
    router.push(`/plans/${planId}`);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backButton}>
          <ArrowLeft size={22} color={colors.icon} />
        </Pressable>
        <Heading size="h4">Planos de Leitura</Heading>
      </View>

      <FlatList
        data={activePlans}
        keyExtractor={(item) => item.plan.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PlanCard
            activePlan={item}
            onPress={() => handleSelectPlan(item.plan.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  list: {
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
});
