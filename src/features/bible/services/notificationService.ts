import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { getDailyVerse } from './verseDayService';

// ---------------------------------------------------------------------------
// Configuracao
// ---------------------------------------------------------------------------

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const notificationService = {
  /**
   * Solicita permissao para notificacoes push.
   * Retorna true se concedida.
   */
  async requestPermission(): Promise<boolean> {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  /**
   * Agenda notificacao diaria do versiculo do dia.
   * @param hour Hora do dia (0-23)
   * @param minute Minuto (0-59)
   */
  async scheduleDailyVerse(hour: number = 7, minute: number = 0): Promise<void> {
    // Cancelar agendamentos anteriores do mesmo tipo
    await this.cancelDailyVerse();

    const verse = getDailyVerse();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Versiculo do Dia',
        body: `"${verse.text}" — ${verse.reference}`,
        data: { type: 'daily_verse' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  },

  /**
   * Cancela a notificacao diaria do versiculo.
   */
  async cancelDailyVerse(): Promise<void> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.data?.type === 'daily_verse') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  },
};
