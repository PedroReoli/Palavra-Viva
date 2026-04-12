import { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowRight, Check } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Heading, Body, Caption, Button } from '@/shared/components';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { notificationManager } from '@/shared/services/notificationManager';

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const DENOMINATIONS = ['Evangelico', 'Catolico', 'Outro'];
const VERSIONS = [
  { id: 'nvi', label: 'NVI — Nova Versao Internacional' },
  { id: 'ara', label: 'ARA — Almeida Revista e Atualizada' },
  { id: 'acf', label: 'ACF — Almeida Corrigida Fiel' },
];
const GOALS = ['Leitura diaria', 'Estudo profundo', 'Devocionais', 'Conhecer a Biblia'];
const HOURS = [
  { label: 'Manha (7h)', hour: 7 },
  { label: 'Tarde (12h)', hour: 12 },
  { label: 'Noite (20h)', hour: 20 },
  { label: 'Sem lembrete', hour: -1 },
];

type Step = 0 | 1 | 2 | 3;

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function OnboardingFlow() {
  const { colors } = useTheme();
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);

  const [step, setStep] = useState<Step>(0);
  const [denomination, setDenomination] = useState<string | null>(null);
  const [version, setVersion] = useState<string>('nvi');
  const [goal, setGoal] = useState<string | null>(null);
  const [reminderHour, setReminderHour] = useState<number>(7);

  const canAdvance =
    (step === 0 && denomination) ||
    (step === 1 && version) ||
    (step === 2 && goal) ||
    step === 3;

  const handleNext = async () => {
    if (step < 3) {
      setStep((step + 1) as Step);
      return;
    }

    // Salvar preferencias
    if (userId) {
      await supabase.from('profiles').update({
        denomination: denomination?.toLowerCase(),
        preferred_version: version,
      }).eq('id', userId);
    }

    // Configurar notificacoes
    if (reminderHour >= 0) {
      await notificationManager.requestPermission();
      await notificationManager.saveSettings({
        dailyReminder: true,
        dailyReminderHour: reminderHour,
        dailyReminderMinute: 0,
        dailyVerse: true,
        dailyVerseHour: 7,
        dailyVerseMinute: 0,
        calendarEvents: true,
      });
    }

    // Navegar para as tabs
    router.replace('/(tabs)');
  };

  const stepTitles = [
    'Qual a sua denominacao?',
    'Versao biblica preferida',
    'Qual o seu objetivo?',
    'Horario de lembrete',
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Indicador de progresso */}
      <View style={styles.progressRow}>
        {[0, 1, 2, 3].map((s) => (
          <View
            key={s}
            style={[
              styles.progressDot,
              {
                backgroundColor: s <= step ? colors.primary : colors.surfaceVariant,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        <Caption variant="overline" color={colors.textTertiary}>
          Passo {step + 1} de 4
        </Caption>
        <Heading size="h3">{stepTitles[step]}</Heading>

        {/* Step 0: Denominacao */}
        {step === 0 && (
          <OptionList
            options={DENOMINATIONS}
            selected={denomination}
            onSelect={setDenomination}
          />
        )}

        {/* Step 1: Versao biblica */}
        {step === 1 && (
          <OptionList
            options={VERSIONS.map((v) => v.label)}
            selected={VERSIONS.find((v) => v.id === version)?.label ?? null}
            onSelect={(label) => {
              const v = VERSIONS.find((v) => v.label === label);
              if (v) setVersion(v.id);
            }}
          />
        )}

        {/* Step 2: Objetivo */}
        {step === 2 && (
          <OptionList
            options={GOALS}
            selected={goal}
            onSelect={setGoal}
          />
        )}

        {/* Step 3: Horario */}
        {step === 3 && (
          <OptionList
            options={HOURS.map((h) => h.label)}
            selected={HOURS.find((h) => h.hour === reminderHour)?.label ?? null}
            onSelect={(label) => {
              const h = HOURS.find((h) => h.label === label);
              if (h) setReminderHour(h.hour);
            }}
          />
        )}
      </View>

      {/* Botao avancar */}
      <View style={styles.footer}>
        <Button
          variant="primary"
          size="lg"
          onPress={handleNext}
          disabled={!canAdvance}
          iconRight={
            step === 3
              ? <Check size={18} color={colors.textOnPrimary} weight="bold" />
              : <ArrowRight size={18} color={colors.textOnPrimary} />
          }
        >
          {step === 3 ? 'Comecar' : 'Continuar'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// OptionList
// ---------------------------------------------------------------------------

function OptionList({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.optionList}>
      {options.map((opt) => {
        const isActive = opt === selected;
        return (
          <Pressable
            key={opt}
            onPress={() => onSelect(opt)}
            style={[
              styles.option,
              {
                backgroundColor: isActive ? colors.primaryFaded : colors.surface,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
          >
            <Body
              variant="small"
              color={isActive ? colors.primary : colors.textPrimary}
            >
              {opt}
            </Body>
            {isActive && <Check size={18} color={colors.primary} weight="bold" />}
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  progressRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.md,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: radii.full,
  },
  content: {
    flex: 1,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  optionList: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1.5,
  },
  footer: {
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.lg,
  },
});
