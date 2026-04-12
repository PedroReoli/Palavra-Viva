import { ScrollView, Pressable, View, StyleSheet } from 'react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Caption } from '@/shared/components';
import { CARD_TEMPLATES, type CardTemplate } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface TemplateSelectorProps {
  selected: string;
  onSelect: (template: CardTemplate) => void;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CARD_TEMPLATES.map((t) => {
        const isActive = t.id === selected;
        return (
          <Pressable
            key={t.id}
            onPress={() => onSelect(t)}
            style={[
              styles.item,
              isActive && { borderColor: colors.primary, borderWidth: 2 },
            ]}
          >
            <View style={[styles.preview, { backgroundColor: t.backgroundColor }]}>
              <View style={[styles.previewLine, { backgroundColor: t.textColor, opacity: 0.7 }]} />
              <View style={[styles.previewLineShort, { backgroundColor: t.textColor, opacity: 0.4 }]} />
              <View style={[styles.previewDot, { backgroundColor: t.accentColor }]} />
            </View>
            <Caption
              variant={isActive ? 'medium' : 'default'}
              color={isActive ? colors.primary : colors.textSecondary}
            >
              {t.name}
            </Caption>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  item: {
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: spacing.xs,
  },
  preview: {
    width: 56,
    height: 72,
    borderRadius: radii.md,
    padding: spacing.sm,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  previewLine: {
    height: 3,
    borderRadius: 1,
    width: '90%',
  },
  previewLineShort: {
    height: 3,
    borderRadius: 1,
    width: '60%',
  },
  previewDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: spacing.xs,
  },
});
