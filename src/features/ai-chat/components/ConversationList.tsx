import { FlatList, Pressable, View, StyleSheet, Alert } from 'react-native';
import { ChatCircle, Trash, Plus } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Body, Caption, Button } from '@/shared/components';
import type { Conversation } from '../types';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface ConversationListProps {
  conversations: Conversation[];
  onSelect: (conversation: Conversation) => void;
  onDelete: (conversationId: string) => void;
  onNew: () => void;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function ConversationList({
  conversations,
  onSelect,
  onDelete,
  onNew,
}: ConversationListProps) {
  const { colors } = useTheme();

  const handleDelete = (conversation: Conversation) => {
    Alert.alert(
      'Excluir conversa',
      `Deseja excluir "${conversation.title ?? 'Conversa sem titulo'}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => onDelete(conversation.id),
        },
      ],
    );
  };

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <Button variant="primary" size="md" onPress={onNew} icon={<Plus size={18} color={colors.textOnPrimary} />}>
          Nova conversa
        </Button>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onSelect(item)}
          style={({ pressed }) => [
            styles.item,
            {
              backgroundColor: pressed ? colors.pressed : colors.surface,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <ChatCircle size={20} color={colors.iconSecondary} />
          <View style={styles.itemContent}>
            <Body variant="small" numberOfLines={1}>
              {item.title ?? 'Conversa sem titulo'}
            </Body>
            <Caption color={colors.textTertiary}>
              {formatDate(item.createdAt)}
            </Caption>
          </View>
          <Pressable onPress={() => handleDelete(item)} hitSlop={8} style={styles.deleteButton}>
            <Trash size={16} color={colors.error} />
          </Pressable>
        </Pressable>
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <ChatCircle size={40} color={colors.textTertiary} weight="duotone" />
          <Body color={colors.textTertiary}>Nenhuma conversa ainda.</Body>
          <Caption color={colors.textTertiary}>
            Comece uma nova conversa com a IA.
          </Caption>
        </View>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  } catch {
    return '';
  }
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.ms,
    padding: spacing.ms,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  itemContent: {
    flex: 1,
    gap: 2,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.xxl,
  },
});
