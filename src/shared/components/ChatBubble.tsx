import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Body, Caption } from './Typography';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function ChatBubble({
  role,
  content,
  timestamp,
  isStreaming = false,
  style,
}: ChatBubbleProps) {
  const { colors } = useTheme();
  const isUser = role === 'user';

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
        style,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.userBubble, { backgroundColor: colors.primary }]
            : [styles.aiBubble, { backgroundColor: colors.surfaceVariant }],
        ]}
      >
        <Body
          variant="small"
          color={isUser ? colors.textOnPrimary : colors.textPrimary}
          style={styles.text}
        >
          {content}
          {isStreaming && '\u258C'}
        </Body>
      </View>

      {timestamp && (
        <Caption
          color={colors.textTertiary}
          style={isUser ? styles.userTimestamp : styles.aiTimestamp}
        >
          {formatTime(timestamp)}
        </Caption>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.ms,
  },
  userBubble: {
    borderRadius: radii.lg,
    borderBottomRightRadius: radii.sm,
  },
  aiBubble: {
    borderRadius: radii.lg,
    borderBottomLeftRadius: radii.sm,
  },
  text: {
    lineHeight: 20,
  },
  userTimestamp: {
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  aiTimestamp: {
    textAlign: 'left',
    marginTop: spacing.xs,
  },
});
