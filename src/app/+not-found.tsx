import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading, Body } from '@/shared/components';

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Heading size="h2">404</Heading>
      <Body color={colors.textSecondary}>Pagina nao encontrada.</Body>
      <Link href="/(tabs)" style={{ color: colors.textLink }}>
        Voltar ao inicio
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: screenPadding,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
