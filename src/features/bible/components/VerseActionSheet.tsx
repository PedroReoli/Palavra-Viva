import { useState } from 'react';
import { View, Pressable, TextInput, StyleSheet } from 'react-native';
import {
  HighlighterCircle,
  NotePencil,
  Copy,
  ShareNetwork,
  Heart,
  ChatCircle,
} from 'phosphor-react-native';
import * as Clipboard from 'expo-clipboard';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { fontFamilies, textStyles } from '@/design/typography';
import { highlightColors } from '@/design/colors';
import { Body, Caption, Button } from '@/shared/components';
import BottomSheet from '@/shared/components/BottomSheet';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface VerseActionSheetProps {
  visible: boolean;
  onClose: () => void;
  verseText: string;
  reference: string;
  onHighlight: (color: string) => void;
  onNote: (content: string) => void;
  onFavorite: () => void;
  onShare: () => void;
  onAskAI?: () => void;
}

type ActionMode = 'actions' | 'colors' | 'note';

const COLOR_OPTIONS = Object.entries(highlightColors) as [string, string][];

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function VerseActionSheet({
  visible,
  onClose,
  verseText,
  reference,
  onHighlight,
  onNote,
  onAskAI,
  onFavorite,
  onShare,
}: VerseActionSheetProps) {
  const { colors } = useTheme();
  const [mode, setMode] = useState<ActionMode>('actions');
  const [noteText, setNoteText] = useState('');

  const handleClose = () => {
    setMode('actions');
    setNoteText('');
    onClose();
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(`"${verseText}" — ${reference}`);
    handleClose();
  };

  const handleHighlight = (color: string) => {
    onHighlight(color);
    handleClose();
  };

  const handleSaveNote = () => {
    if (noteText.trim()) {
      onNote(noteText.trim());
    }
    handleClose();
  };

  return (
    <BottomSheet visible={visible} onClose={handleClose} height={360}>
      {/* Preview do versiculo */}
      <View style={styles.preview}>
        <Body variant="small" numberOfLines={2}>&ldquo;{verseText}&rdquo;</Body>
        <Caption variant="medium" color={colors.textSecondary}>{reference}</Caption>
      </View>

      {/* Acoes principais */}
      {mode === 'actions' && (
        <View style={styles.actions}>
          <ActionButton
            icon={<HighlighterCircle size={22} color={colors.icon} />}
            label="Destacar"
            onPress={() => setMode('colors')}
          />
          <ActionButton
            icon={<NotePencil size={22} color={colors.icon} />}
            label="Anotar"
            onPress={() => setMode('note')}
          />
          <ActionButton
            icon={<Copy size={22} color={colors.icon} />}
            label="Copiar"
            onPress={handleCopy}
          />
          <ActionButton
            icon={<ShareNetwork size={22} color={colors.icon} />}
            label="Compartilhar"
            onPress={() => { onShare(); handleClose(); }}
          />
          {onAskAI && (
            <ActionButton
              icon={<ChatCircle size={22} color={colors.icon} />}
              label="Perguntar IA"
              onPress={() => { onAskAI(); handleClose(); }}
            />
          )}
          <ActionButton
            icon={<Heart size={22} color={colors.icon} />}
            label="Favoritar"
            onPress={() => { onFavorite(); handleClose(); }}
          />
        </View>
      )}

      {/* Selecao de cor */}
      {mode === 'colors' && (
        <View style={styles.colorSection}>
          <Caption variant="medium" color={colors.textSecondary}>
            Escolha uma cor
          </Caption>
          <View style={styles.colorRow}>
            {COLOR_OPTIONS.map(([name, hex]) => (
              <Pressable
                key={name}
                onPress={() => handleHighlight(name)}
                style={[styles.colorCircle, { backgroundColor: hex }]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Formulario de nota */}
      {mode === 'note' && (
        <View style={styles.noteSection}>
          <TextInput
            placeholder="Escreva sua nota..."
            placeholderTextColor={colors.textTertiary}
            multiline
            autoFocus
            value={noteText}
            onChangeText={setNoteText}
            style={[
              styles.noteInput,
              {
                color: colors.textPrimary,
                backgroundColor: colors.surfaceVariant,
                fontFamily: fontFamilies.body,
                fontSize: textStyles.body.fontSize,
              },
            ]}
          />
          <Button variant="primary" size="md" onPress={handleSaveNote}>
            Salvar nota
          </Button>
        </View>
      )}
    </BottomSheet>
  );
}

// ---------------------------------------------------------------------------
// ActionButton
// ---------------------------------------------------------------------------

function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        pressed && { backgroundColor: colors.pressed },
      ]}
    >
      {icon}
      <Caption variant="medium" color={colors.textPrimary}>{label}</Caption>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  preview: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionButton: {
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radii.md,
    minWidth: 60,
  },
  colorSection: {
    gap: spacing.md,
  },
  colorRow: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
  },
  noteSection: {
    gap: spacing.md,
  },
  noteInput: {
    minHeight: 100,
    padding: spacing.ms,
    borderRadius: radii.md,
    textAlignVertical: 'top',
  },
});
