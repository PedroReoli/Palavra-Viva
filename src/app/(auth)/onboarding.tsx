import { View, StyleSheet } from 'react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading, Body } from '@/shared/components';

export default function OnboardingScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Heading size="h2">Bem-vindo ao Palavra Viva</Heading>
      <Body color={colors.textSecondary}>
        Configure suas preferencias para comecar.
      </Body>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: screenPadding,
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
