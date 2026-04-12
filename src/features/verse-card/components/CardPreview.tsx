import { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { fontFamilies } from '@/design/typography';
import type { CardTemplate } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface CardPreviewProps {
  verseText: string;
  reference: string;
  template: CardTemplate;
}

// ---------------------------------------------------------------------------
// Componente (forwardRef para view-shot)
// ---------------------------------------------------------------------------

const CardPreview = forwardRef<View, CardPreviewProps>(
  ({ verseText, reference, template }, ref) => {
    const font = template.fontStyle === 'serif' ? fontFamilies.verse : fontFamilies.body;

    return (
      <View
        ref={ref}
        style={[
          styles.card,
          { backgroundColor: template.backgroundColor },
        ]}
      >
        {/* Aspas decorativas */}
        <Text style={[styles.quote, { color: template.accentColor }]}>&ldquo;</Text>

        {/* Texto do versiculo */}
        <Text
          style={[
            styles.verseText,
            { color: template.textColor, fontFamily: font },
          ]}
        >
          {verseText}
        </Text>

        {/* Referencia */}
        <Text style={[styles.reference, { color: template.accentColor }]}>
          {reference}
        </Text>

        {/* Marca d'agua */}
        <Text style={[styles.watermark, { color: template.accentColor }]}>
          Palavra Viva
        </Text>
      </View>
    );
  },
);

CardPreview.displayName = 'CardPreview';

export default CardPreview;

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    width: 360,
    minHeight: 480,
    borderRadius: radii.xl,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  quote: {
    fontSize: 48,
    lineHeight: 52,
    marginBottom: -spacing.sm,
  },
  verseText: {
    fontSize: 22,
    lineHeight: 34,
    marginBottom: spacing.lg,
  },
  reference: {
    fontSize: 14,
    fontFamily: fontFamilies.bodyMedium,
    marginBottom: spacing.xxl,
  },
  watermark: {
    fontSize: 10,
    fontFamily: fontFamilies.bodyMedium,
    opacity: 0.5,
    textAlign: 'right',
  },
});
