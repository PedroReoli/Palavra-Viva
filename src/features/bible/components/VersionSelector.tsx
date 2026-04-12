import { View, Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Body } from '@/shared/components';
import {
  type SupportedVersion,
  VERSION_LABELS,
} from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface VersionSelectorProps {
  selected: SupportedVersion;
  onSelect: (version: SupportedVersion) => void;
}

const VERSIONS: SupportedVersion[] = ['nvi', 'ara', 'acf'];

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function VersionSelector({ selected, onSelect }: VersionSelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {VERSIONS.map((v) => {
        const isActive = v === selected;
        return (
          <Pressable
            key={v}
            onPress={() => onSelect(v)}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.primary : colors.surfaceVariant,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
          >
            <Body
              variant="small"
              color={isActive ? colors.textOnPrimary : colors.textSecondary}
              style={styles.label}
            >
              {v.toUpperCase()}
            </Body>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.ms,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  label: {
    textAlign: 'center',
  },
});
