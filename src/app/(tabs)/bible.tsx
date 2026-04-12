import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading, Body } from '@/shared/components';

export default function BibleScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Heading size="h3">Biblia</Heading>
        <Body color={colors.textSecondary}>
          Selecione uma versao, livro e capitulo para comecar a leitura.
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
    gap: spacing.sm,
  },
});
