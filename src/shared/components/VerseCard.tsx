import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ShareNetwork } from 'phosphor-react-native';
import { Pressable } from 'react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { shadows } from '@/design/shadows';
import { textStyles, fontFamilies } from '@/design/typography';
import { Body } from './Typography';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface VerseCardProps {
  text: string;
  reference: string;
  onShare?: () => void;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function VerseCard({
  text,
  reference,
  onShare,
  compact = false,
  style,
}: VerseCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.secondaryFaded,
        },
        shadows.md,
        style,
      ]}
    >
      {/* Aspas decorativas */}
      <Body
        style={[
          styles.quote,
          { color: colors.secondary },
        ]}
      >
        &ldquo;
      </Body>

      {/* Texto do versiculo */}
      <Body
        style={[
          compact ? styles.textCompact : styles.text,
          {
            fontFamily: fontFamilies.verse,
            color: colors.textPrimary,
          },
        ]}
      >
        {text}
      </Body>

      {/* Rodape: referencia + acao */}
      <View style={styles.footer}>
        <Body
          variant="small"
          style={[
            styles.reference,
            {
              fontFamily: fontFamilies.verseBold,
              color: colors.textSecondary,
            },
          ]}
        >
          {reference}
        </Body>

        {onShare && (
          <Pressable onPress={onShare} hitSlop={8} style={styles.shareButton}>
            <ShareNetwork size={18} color={colors.iconSecondary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.lg,
  },
  quote: {
    fontSize: 32,
    lineHeight: 36,
    marginBottom: -spacing.sm,
  },
  text: {
    fontSize: textStyles.verse.fontSize,
    lineHeight: textStyles.verse.lineHeight,
  },
  textCompact: {
    fontSize: textStyles.body.fontSize,
    lineHeight: textStyles.body.lineHeight,
  },
  reference: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  shareButton: {
    padding: spacing.xs,
  },
});
