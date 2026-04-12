import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading, Body, Avatar } from '@/shared/components';

export default function ProfileScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Avatar name="Usuario" size="lg" />
          <View>
            <Heading size="h4">Usuario</Heading>
            <Body variant="small" color={colors.textSecondary}>Plano Gratuito</Body>
          </View>
        </View>

        <Body color={colors.textSecondary}>
          Gerencie seu perfil, assinatura e preferencias.
        </Body>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
