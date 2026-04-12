import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatCircle } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading, Body } from '@/shared/components';

export default function AiChatScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <ChatCircle size={48} color={colors.primary} weight="duotone" />
        <Heading size="h3">Chat com IA</Heading>
        <Body color={colors.textSecondary}>
          Converse com a IA sobre qualquer passagem ou tema biblico.
        </Body>
        <Body variant="small" color={colors.textTertiary}>
          Funcionalidade Premium
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
