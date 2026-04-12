import { FIXED_DATES, getMovableDates } from '../data/liturgical-dates';
import type { LiturgicalDate, CalendarMonth, CalendarDayData } from '../types';

export const calendarService = {
  /**
   * Retorna todas as datas liturgicas de um ano (fixas + moveis).
   */
  getDatesForYear(year: number): LiturgicalDate[] {
    const movable = getMovableDates(year);
    return [...FIXED_DATES, ...movable];
  },

  /**
   * Retorna os eventos de um mes especifico.
   */
  getEventsForMonth(year: number, month: number): LiturgicalDate[] {
    const all = this.getDatesForYear(year);
    const mm = String(month + 1).padStart(2, '0');

    return all.filter((d) => {
      if (d.movable) {
        // Formato YYYY-MM-DD
        return d.date.startsWith(`${year}-${mm}`);
      }
      // Formato MM-DD
      return d.date.startsWith(mm);
    });
  },

  /**
   * Retorna os eventos de um dia especifico.
   */
  getEventsForDay(year: number, month: number, day: number): LiturgicalDate[] {
    const all = this.getDatesForYear(year);
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');

    return all.filter((d) => {
      if (d.movable) {
        return d.date === `${year}-${mm}-${dd}`;
      }
      return d.date === `${mm}-${dd}`;
    });
  },

  /**
   * Gera os dados do calendario para um mes (grid completo com dias do mes anterior/proximo).
   */
  buildMonth(year: number, month: number): CalendarMonth {
    const today = new Date();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay(); // 0=dom, 6=sab
    const daysInMonth = lastDay.getDate();

    const events = this.getEventsForMonth(year, month);
    const days: CalendarDayData[] = [];

    // Dias do mes anterior (para preencher a primeira semana)
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      days.push({
        date: new Date(year, month - 1, d),
        dayOfMonth: d,
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }

    // Dias do mes atual
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');

      const dayEvents = events.filter((e) => {
        if (e.movable) return e.date === `${year}-${mm}-${dd}`;
        return e.date === `${mm}-${dd}`;
      });

      days.push({
        date,
        dayOfMonth: d,
        isCurrentMonth: true,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
        events: dayEvents,
      });
    }

    // Dias do proximo mes (completar ate 42 = 6 semanas)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        date: new Date(year, month + 1, d),
        dayOfMonth: d,
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }

    return { year, month, days };
  },
};
