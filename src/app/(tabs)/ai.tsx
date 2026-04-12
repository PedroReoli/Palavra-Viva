import { useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, List } from 'phosphor-react-native';
import { Pressable } from 'react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading, Body } from '@/shared/components';
import ChatBubble from '@/shared/components/ChatBubble';
import { useChat } from '@/features/ai-chat/hooks/useChat';
import { useRequirePremium } from '@/features/subscription/hooks/useRequirePremium';
import ChatInput from '@/features/ai-chat/components/ChatInput';
import SuggestionChips from '@/features/ai-chat/components/SuggestionChips';
import ConversationList from '@/features/ai-chat/components/ConversationList';
import PaywallScreen from '@/features/subscription/components/PaywallScreen';

// ---------------------------------------------------------------------------
// Modos da tela
// ---------------------------------------------------------------------------

type ScreenMode = 'chat' | 'history';

export default function AiChatScreen() {
  const { colors } = useTheme();
  const {
    conversations,
    currentConversation,
    messages,
    streamingText,
    isStreaming,
    isLoading,
    loadConversations,
    openConversation,
    sendMessage,
    deleteConversation,
    newConversation,
  } = useChat();
  const { isPremium, paywallVisible, showPaywall, dismissPaywall } = useRequirePremium();

  const [mode, setMode] = useState<ScreenMode>('chat');
  const listRef = useRef<FlatList>(null);

  // Carregar conversas ao montar
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Scroll para baixo quando novas mensagens chegam
  useEffect(() => {
    if (messages.length > 0 || streamingText) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length, streamingText]);

  const handleSend = (text: string) => {
    if (!isPremium) {
      showPaywall();
      return;
    }
    sendMessage(text);
  };

  const handleSelectConversation = (conversation: typeof conversations[0]) => {
    openConversation(conversation);
    setMode('chat');
  };

  const handleNewConversation = () => {
    newConversation();
    setMode('chat');
  };

  // Paywall
  if (paywallVisible) {
    return <PaywallScreen onClose={dismissPaywall} />;
  }

  // Historico
  if (mode === 'history') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Pressable onPress={() => setMode('chat')} hitSlop={8} style={styles.headerButton}>
            <ArrowLeft size={22} color={colors.icon} />
          </Pressable>
          <Heading size="h4" style={styles.headerTitle}>Conversas</Heading>
        </View>
        <ConversationList
          conversations={conversations}
          onSelect={handleSelectConversation}
          onDelete={deleteConversation}
          onNew={handleNewConversation}
        />
      </SafeAreaView>
    );
  }

  // Chat
  const isEmpty = messages.length === 0 && !streamingText;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Heading size="h4" style={styles.headerTitle}>
            {currentConversation?.title ?? 'Chat com IA'}
          </Heading>
          <Pressable onPress={() => setMode('history')} hitSlop={8} style={styles.headerButton}>
            <List size={22} color={colors.icon} />
          </Pressable>
        </View>

        {/* Mensagens */}
        {isEmpty ? (
          <View style={styles.emptyState}>
            <Heading size="h4" color={colors.textTertiary}>Palavra Viva IA</Heading>
            <Body color={colors.textTertiary} style={styles.emptyText}>
              Pergunte qualquer coisa sobre a Biblia.
            </Body>
            <SuggestionChips onSelect={handleSend} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messageList}
            renderItem={({ item }) => (
              <ChatBubble
                role={item.role}
                content={item.content}
                timestamp={item.createdAt}
              />
            )}
            ListFooterComponent={
              isStreaming && streamingText ? (
                <ChatBubble
                  role="assistant"
                  content={streamingText}
                  isStreaming
                />
              ) : null
            }
          />
        )}

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          disabled={isStreaming}
          placeholder={isPremium ? 'Escreva sua pergunta...' : 'Premium necessario'}
        />
      </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    flex: 1,
  },
  headerButton: {
    padding: spacing.xs,
  },
  messageList: {
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  emptyText: {
    textAlign: 'center',
    paddingHorizontal: screenPadding,
  },
});
