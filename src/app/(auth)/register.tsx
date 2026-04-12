import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { Heading, Body, Button, Input } from '@/shared/components';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { register, isLoading, error } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!name || !email || !password) return;
    register({ name, email, password });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <Heading size="h2">Criar Conta</Heading>
          <Body color={colors.textSecondary}>Comece sua jornada espiritual</Body>
        </View>

        <View style={styles.form}>
          <Input
            label="Nome"
            placeholder="Seu nome"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />
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
            placeholder="Minimo 8 caracteres"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && (
            <Body variant="small" color={colors.error}>{error}</Body>
          )}

          <Button variant="primary" size="lg" onPress={handleRegister} loading={isLoading}>
            Criar conta
          </Button>
        </View>

        <View style={styles.footer}>
          <Body variant="small" color={colors.textSecondary}>
            Ja tem conta?{' '}
            <Link href="/(auth)/login" style={{ color: colors.textLink }}>
              Entrar
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
