import { View, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { useTheme } from '@/design/theme';
import { radii } from '@/design/radii';
import { textStyles } from '@/design/typography';
import { Body } from './Typography';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function Avatar({ source, name, size = 'md', style }: AvatarProps) {
  const { colors } = useTheme();
  const dimension = sizeMap[size];

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: radii.full,
    overflow: 'hidden',
  };

  if (source) {
    return (
      <View style={[containerStyle, style]}>
        <Image
          source={{ uri: source }}
          style={styles.image}
        />
      </View>
    );
  }

  const initials = getInitials(name ?? '');

  return (
    <View
      style={[
        containerStyle,
        styles.fallback,
        { backgroundColor: colors.primaryFaded },
        style,
      ]}
    >
      <Body
        variant={size === 'sm' ? 'small' : 'default'}
        color={colors.primary}
        style={size === 'lg' ? textStyles.bodyLarge : undefined}
      >
        {initials}
      </Body>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
