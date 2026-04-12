import { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CaretLeft, CaretRight } from 'phosphor-react-native';

import { useTheme } from '@/design/theme';
import { spacing, screenPadding } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Heading, Body, Caption, Card } from '@/shared/components';
import { VerseText } from '@/shared/components/Typography';
import CalendarDay from '@/shared/components/CalendarDay';
import { calendarService } from '@/features/calendar/services/calendarService';
import type { CalendarDayData, LiturgicalDate } from '@/features/calendar/types';

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function CalendarScreen() {
  const { colors } = useTheme();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<CalendarDayData | null>(null);

  const calendarMonth = useMemo(
    () => calendarService.buildMonth(year, month),
    [year, month],
  );

  const selectedEvents = selectedDay?.events ?? [];

  const goToPreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDay(null);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header com navegacao de mes */}
        <View style={styles.monthNav}>
          <Pressable onPress={goToPreviousMonth} hitSlop={12} style={styles.navButton}>
            <CaretLeft size={20} color={colors.icon} />
          </Pressable>
          <Heading size="h4">
            {MONTHS[month]} {year}
          </Heading>
          <Pressable onPress={goToNextMonth} hitSlop={12} style={styles.navButton}>
            <CaretRight size={20} color={colors.icon} />
          </Pressable>
        </View>

        {/* Header dos dias da semana */}
        <View style={styles.weekdayRow}>
          {WEEKDAYS.map((w) => (
            <View key={w} style={styles.weekdayCell}>
              <Caption variant="medium" color={colors.textTertiary}>{w}</Caption>
            </View>
          ))}
        </View>

        {/* Grid do calendario */}
        <View style={styles.grid}>
          {calendarMonth.days.map((day, i) => (
            <CalendarDay
              key={i}
              day={day.dayOfMonth}
              isCurrentMonth={day.isCurrentMonth}
              isToday={day.isToday}
              hasEvents={day.events.length > 0}
              isSelected={
                selectedDay?.dayOfMonth === day.dayOfMonth &&
                selectedDay?.isCurrentMonth === day.isCurrentMonth
              }
              onPress={() => day.isCurrentMonth ? setSelectedDay(day) : undefined}
            />
          ))}
        </View>

        {/* Eventos do dia selecionado */}
        {selectedEvents.length > 0 && (
          <View style={styles.eventsSection}>
            <Caption variant="overline" color={colors.textTertiary}>
              {selectedDay?.dayOfMonth} de {MONTHS[month]}
            </Caption>
            {selectedEvents.map((event, i) => (
              <EventCard key={i} event={event} />
            ))}
          </View>
        )}

        {/* Proximos eventos do mes */}
        {!selectedDay && (
          <UpcomingEvents year={year} month={month} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// EventCard
// ---------------------------------------------------------------------------

function EventCard({ event }: { event: LiturgicalDate }) {
  const { colors } = useTheme();

  const typeLabel =
    event.type === 'evangelical' ? 'Evangelico' :
    event.type === 'catholic' ? 'Catolico' :
    event.type === 'biblical' ? 'Biblico' : 'Cristao';

  return (
    <Card variant="elevated" padding="md">
      <View style={styles.eventHeader}>
        <Heading size="h5">{event.title}</Heading>
        <Caption color={colors.textTertiary}>{typeLabel}</Caption>
      </View>
      <Body variant="small" color={colors.textSecondary}>
        {event.description}
      </Body>
      <View style={[styles.verseBox, { backgroundColor: colors.surfaceVariant, borderRadius: radii.md }]}>
        <VerseText variant="default" reference={event.verseReference}>
          {event.verse}
        </VerseText>
      </View>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// UpcomingEvents
// ---------------------------------------------------------------------------

function UpcomingEvents({ year, month }: { year: number; month: number }) {
  const { colors } = useTheme();
  const today = new Date();

  const events = useMemo(() => {
    const monthEvents = calendarService.getEventsForMonth(year, month);
    // Filtrar apenas eventos futuros ou de hoje
    return monthEvents.filter((e) => {
      const day = e.movable
        ? parseInt(e.date.split('-')[2])
        : parseInt(e.date.split('-')[1]);
      return year > today.getFullYear() ||
        month > today.getMonth() ||
        day >= today.getDate();
    }).slice(0, 3);
  }, [year, month]);

  if (events.length === 0) return null;

  return (
    <View style={styles.eventsSection}>
      <Caption variant="overline" color={colors.textTertiary}>
        Proximas datas
      </Caption>
      {events.map((event, i) => (
        <EventCard key={i} event={event} />
      ))}
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
  scroll: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navButton: {
    padding: spacing.sm,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  eventsSection: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  verseBox: {
    padding: spacing.ms,
    marginTop: spacing.sm,
  },
});
