import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Sparkle } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading, Body, Button, Input } from '@/shared/components';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface DevotionalInputProps {
  onGenerate: (theme: string) => void;
  isGenerating: boolean;
}

const QUICK_THEMES = [
  'Ansiedade',
  'Gratidao',
  'Perdao',
  'Proposito',
  'Familia',
  'Paciencia',
];

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function DevotionalInput({ onGenerate, isGenerating }: DevotionalInputProps) {
  const { colors } = useTheme();
  const [theme, setTheme] = useState('');

  const handleGenerate = () => {
    if (theme.trim()) {
      onGenerate(theme.trim());
    }
  };

  return (
    <View style={styles.container}>
      <Sparkle size={40} color={colors.secondary} weight="duotone" />
      <Heading size="h3">Devocional do Dia</Heading>
      <Body color={colors.textSecondary} style={styles.subtitle}>
        Como voce esta hoje? Descreva um tema ou sentimento.
      </Body>

      <Input
        variant="text"
        placeholder="Ex: estou ansioso com o trabalho..."
        value={theme}
        onChangeText={setTheme}
        containerStyle={styles.input}
      />

      <Body variant="small" color={colors.textTertiary}>Ou escolha um tema:</Body>
      <View style={styles.quickThemes}>
        {QUICK_THEMES.map((t) => (
          <Button
            key={t}
            variant="outline"
            size="sm"
            onPress={() => onGenerate(t)}
          >
            {t}
          </Button>
        ))}
      </View>

      <Button
        variant="primary"
        size="lg"
        onPress={handleGenerate}
        loading={isGenerating}
        icon={<Sparkle size={18} color={colors.textOnPrimary} weight="fill" />}
      >
        Gerar devocional
      </Button>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: screenPadding,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  subtitle: {
    textAlign: 'center',
  },
  input: {
    width: '100%',
  },
  quickThemes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
});
