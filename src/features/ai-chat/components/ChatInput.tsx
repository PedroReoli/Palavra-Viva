import { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { PaperPlaneRight } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { fontFamilies, textStyles } from '@/design/typography';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Escreva sua pergunta...',
}: ChatInputProps) {
  const { colors } = useTheme();
  const [text, setText] = useState('');

  const canSend = text.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        multiline
        maxLength={2000}
        editable={!disabled}
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
        style={[
          styles.input,
          {
            color: colors.textPrimary,
            backgroundColor: colors.surfaceVariant,
            fontFamily: fontFamilies.body,
            fontSize: textStyles.body.fontSize,
          },
        ]}
      />
      <Pressable
        onPress={handleSend}
        disabled={!canSend}
        style={[
          styles.sendButton,
          {
            backgroundColor: canSend ? colors.primary : colors.disabled,
          },
        ]}
      >
        <PaperPlaneRight
          size={18}
          color={canSend ? colors.textOnPrimary : colors.disabledText}
          weight="fill"
        />
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.ms,
    borderRadius: radii.xl,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
