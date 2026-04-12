export interface LiturgicalDate {
  date: string;           // formato MM-DD (fixo) ou YYYY-MM-DD (movel)
  title: string;
  description: string;
  verse: string;
  verseReference: string;
  type: 'evangelical' | 'catholic' | 'both' | 'biblical';
  movable: boolean;       // true = data muda a cada ano (ex: Pascoa)
}

export interface CalendarMonth {
  year: number;
  month: number;          // 0-11
  days: CalendarDayData[];
}

export interface CalendarDayData {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: LiturgicalDate[];
}
