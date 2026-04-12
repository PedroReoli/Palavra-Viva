import { Text, TextProps, StyleSheet } from 'react-native';

import { textStyles } from '@/design/typography';
import { useTheme } from '@/design/theme';

// ---------------------------------------------------------------------------
// Heading
// ---------------------------------------------------------------------------

interface HeadingProps extends TextProps {
  size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  color?: string;
}

export function Heading({ size = 'h3', color, style, ...props }: HeadingProps) {
  const { colors } = useTheme();

  return (
    <Text
      style={[textStyles[size], { color: color ?? colors.textPrimary }, style]}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Body
// ---------------------------------------------------------------------------

interface BodyProps extends TextProps {
  variant?: 'default' | 'small' | 'large' | 'medium';
  color?: string;
}

const bodyVariantMap = {
  default: textStyles.body,
  small: textStyles.bodySmall,
  large: textStyles.bodyLarge,
  medium: textStyles.bodyMedium,
} as const;

export function Body({ variant = 'default', color, style, ...props }: BodyProps) {
  const { colors } = useTheme();

  return (
    <Text
      style={[bodyVariantMap[variant], { color: color ?? colors.textPrimary }, style]}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Caption
// ---------------------------------------------------------------------------

interface CaptionProps extends TextProps {
  variant?: 'default' | 'medium' | 'overline';
  color?: string;
}

const captionVariantMap = {
  default: textStyles.caption,
  medium: textStyles.captionMedium,
  overline: textStyles.overline,
} as const;

export function Caption({ variant = 'default', color, style, ...props }: CaptionProps) {
  const { colors } = useTheme();

  return (
    <Text
      style={[captionVariantMap[variant], { color: color ?? colors.textSecondary }, style]}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// VerseText
// ---------------------------------------------------------------------------

interface VerseTextProps extends TextProps {
  reference?: string;
  variant?: 'default' | 'large' | 'highlight';
  color?: string;
}

const verseVariantMap = {
  default: textStyles.verse,
  large: textStyles.verseLarge,
  highlight: textStyles.verseHighlight,
} as const;

export function VerseText({
  reference,
  variant = 'default',
  color,
  style,
  children,
  ...props
}: VerseTextProps) {
  const { colors } = useTheme();

  return (
    <Text style={[verseVariantMap[variant], { color: color ?? colors.textPrimary }, style]} {...props}>
      {children}
      {reference ? (
        <Text style={[textStyles.verseReference, { color: colors.textSecondary }]}>
          {'\n'}
          {reference}
        </Text>
      ) : null}
    </Text>
  );
}
