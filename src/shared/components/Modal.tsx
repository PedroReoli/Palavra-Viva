import {
  Modal as RNModal,
  View,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { ReactNode } from 'react';
import { X } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { shadows } from '@/design/shadows';
import { Heading } from './Typography';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function Modal({
  visible,
  onClose,
  title,
  children,
  actions,
  style,
}: ModalProps) {
  const { colors } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={onClose}>
        <Pressable
          style={[
            styles.content,
            { backgroundColor: colors.surfaceElevated },
            shadows.lg,
            style,
          ]}
          onPress={() => {}}
        >
          {/* Header */}
          {title && (
            <View style={styles.header}>
              <Heading size="h5" style={styles.title}>{title}</Heading>
              <Pressable onPress={onClose} hitSlop={8}>
                <X size={20} color={colors.icon} />
              </Pressable>
            </View>
          )}

          {/* Body */}
          <View style={styles.body}>{children}</View>

          {/* Actions */}
          {actions && <View style={styles.actions}>{actions}</View>}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    flex: 1,
  },
  body: {
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
});
