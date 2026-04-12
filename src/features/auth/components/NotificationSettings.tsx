import { useState, useEffect } from 'react';
import { View, Switch, StyleSheet } from 'react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { Body, Caption } from '@/shared/components';
import {
  notificationManager,
  type NotificationSettings as Settings,
} from '@/shared/services/notificationManager';

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function NotificationSettings() {
  const { colors } = useTheme();
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    notificationManager.getSettings().then(setSettings);
  }, []);

  if (!settings) return null;

  const update = async (partial: Partial<Settings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    await notificationManager.saveSettings(updated);
  };

  return (
    <View style={styles.container}>
      <SettingRow
        label="Lembrete de leitura"
        description={`Diario as ${settings.dailyReminderHour}h`}
        value={settings.dailyReminder}
        onToggle={(v) => update({ dailyReminder: v })}
      />
      <SettingRow
        label="Versiculo do dia"
        description={`Diario as ${settings.dailyVerseHour}h`}
        value={settings.dailyVerse}
        onToggle={(v) => update({ dailyVerse: v })}
      />
      <SettingRow
        label="Datas do calendario"
        description="Feriados e eventos liturgicos"
        value={settings.calendarEvents}
        onToggle={(v) => update({ calendarEvents: v })}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// SettingRow
// ---------------------------------------------------------------------------

function SettingRow({
  label,
  description,
  value,
  onToggle,
}: {
  label: string;
  description: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { borderBottomColor: colors.borderLight }]}>
      <View style={styles.rowInfo}>
        <Body variant="small">{label}</Body>
        <Caption color={colors.textTertiary}>{description}</Caption>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.surfaceVariant, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : colors.disabled}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.ms,
    borderBottomWidth: 1,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
    marginRight: spacing.md,
  },
});
