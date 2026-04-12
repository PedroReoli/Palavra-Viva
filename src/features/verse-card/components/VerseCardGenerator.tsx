import { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { DownloadSimple, ShareNetwork } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading, Body, Button } from '@/shared/components';
import { useRequirePremium } from '@/features/subscription/hooks/useRequirePremium';
import CardPreview from './CardPreview';
import TemplateSelector from './TemplateSelector';
import { CARD_TEMPLATES, type CardTemplate } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface VerseCardGeneratorProps {
  verseText: string;
  reference: string;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function VerseCardGenerator({
  verseText,
  reference,
  onClose,
}: VerseCardGeneratorProps) {
  const { colors } = useTheme();
  const { isPremium } = useRequirePremium();
  const viewShotRef = useRef<ViewShot>(null);
  const [template, setTemplate] = useState<CardTemplate>(CARD_TEMPLATES[0]);
  const [isExporting, setIsExporting] = useState(false);

  const captureCard = async (): Promise<string | null> => {
    if (!viewShotRef.current?.capture) return null;
    try {
      const uri = await viewShotRef.current.capture();
      return uri;
    } catch {
      return null;
    }
  };

  const handleShare = async () => {
    setIsExporting(true);
    try {
      const uri = await captureCard();
      if (!uri) {
        Alert.alert('Erro', 'Nao foi possivel gerar a imagem.');
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Compartilhar versiculo',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissao necessaria', 'Permita acesso a galeria para salvar a imagem.');
        return;
      }

      const uri = await captureCard();
      if (!uri) {
        Alert.alert('Erro', 'Nao foi possivel gerar a imagem.');
        return;
      }

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Salvo', 'Imagem salva na galeria.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Heading size="h4">Criar Cartao</Heading>

        {/* Preview do card */}
        <View style={styles.previewContainer}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'png', quality: 1, result: 'tmpfile' }}
          >
            <CardPreview
              verseText={verseText}
              reference={reference}
              template={template}
            />
          </ViewShot>
        </View>

        {/* Seletor de template */}
        <Body variant="small" color={colors.textSecondary} style={styles.label}>
          Escolha um estilo
        </Body>
        <TemplateSelector
          selected={template.id}
          onSelect={setTemplate}
        />

        {/* Acoes */}
        <View style={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            icon={<ShareNetwork size={18} color={colors.textOnPrimary} />}
            onPress={handleShare}
            loading={isExporting}
          >
            Compartilhar
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon={<DownloadSimple size={18} color={colors.primary} />}
            onPress={handleDownload}
            loading={isExporting}
          >
            Salvar na galeria
          </Button>
          <Button variant="ghost" size="md" onPress={onClose}>
            Fechar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  previewContainer: {
    alignItems: 'center',
  },
  label: {
    paddingHorizontal: spacing.md,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
