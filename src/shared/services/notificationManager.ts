import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getDailyVerse } from '@/features/bible/services/verseDayService';
import { calendarService } from '@/features/calendar/services/calendarService';

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

const STORAGE_KEY = '@palavra_viva_notification_settings';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface NotificationSettings {
  dailyReminder: boolean;
  dailyReminderHour: number;
  dailyReminderMinute: number;
  dailyVerse: boolean;
  dailyVerseHour: number;
  dailyVerseMinute: number;
  calendarEvents: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  dailyReminder: true,
  dailyReminderHour: 8,
  dailyReminderMinute: 0,
  dailyVerse: true,
  dailyVerseHour: 7,
  dailyVerseMinute: 0,
  calendarEvents: true,
};

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const notificationManager = {
  async requestPermission(): Promise<boolean> {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async getSettings(): Promise<NotificationSettings> {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    return DEFAULT_SETTINGS;
  },

  async saveSettings(settings: NotificationSettings): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    await this.rescheduleAll(settings);
  },

  /**
   * Reagenda todas as notificacoes baseado nas preferencias.
   */
  async rescheduleAll(settings?: NotificationSettings): Promise<void> {
    const s = settings ?? await this.getSettings();

    // Cancelar tudo primeiro
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Lembrete de leitura
    if (s.dailyReminder) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Hora da leitura',
          body: 'Reserve alguns minutos para a Palavra de Deus hoje.',
          data: { type: 'daily_reminder' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: s.dailyReminderHour,
          minute: s.dailyReminderMinute,
        },
      });
    }

    // Versiculo do dia
    if (s.dailyVerse) {
      const verse = getDailyVerse();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Versiculo do Dia',
          body: `"${verse.text.slice(0, 100)}..." — ${verse.reference}`,
          data: { type: 'daily_verse' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: s.dailyVerseHour,
          minute: s.dailyVerseMinute,
        },
      });
    }

    // Eventos do calendario (proximos 7 dias)
    if (s.calendarEvents) {
      const now = new Date();
      for (let d = 0; d < 7; d++) {
        const date = new Date(now);
        date.setDate(date.getDate() + d);

        const events = calendarService.getEventsForDay(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        );

        for (const event of events) {
          // Agendar para 8h do dia do evento
          const triggerDate = new Date(date);
          triggerDate.setHours(8, 0, 0, 0);

          if (triggerDate > now) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: event.title,
                body: event.description.slice(0, 120),
                data: { type: 'calendar_event', date: event.date },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate,
              },
            });
          }
        }
      }
    }
  },
};
