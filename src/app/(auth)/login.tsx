import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading, Body, Button, Input } from '@/shared/components';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { login, isLoading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) return;
    login({ email, password });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <Heading size="h2">Palavra Viva</Heading>
          <Body color={colors.textSecondary}>Entre na sua conta</Body>
        </View>

        <View style={styles.form}>
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Senha"
            placeholder="Sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && (
            <Body variant="small" color={colors.error}>{error}</Body>
          )}

          <Button variant="primary" size="lg" onPress={handleLogin} loading={isLoading}>
            Entrar
          </Button>
        </View>

        <View style={styles.footer}>
          <Body variant="small" color={colors.textSecondary}>
            Nao tem conta?{' '}
            <Link href="/(auth)/register" style={{ color: colors.textLink }}>
              Criar conta
            </Link>
          </Body>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: screenPadding,
    justifyContent: 'center',
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});
