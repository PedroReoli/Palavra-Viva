import { Pressable, View, StyleSheet } from 'react-native';

import { useTheme } from '@/design/theme';
import { spacing } from '@/design/spacing';
import { radii } from '@/design/radii';
import { Caption } from './Typography';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface CalendarDayProps {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
  isSelected: boolean;
  onPress: () => void;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function CalendarDay({
  day,
  isCurrentMonth,
  isToday,
  hasEvents,
  isSelected,
  onPress,
}: CalendarDayProps) {
  const { colors } = useTheme();

  const textColor = isSelected
    ? colors.textOnPrimary
    : isToday
      ? colors.primary
      : isCurrentMonth
        ? colors.textPrimary
        : colors.textTertiary;

  const bgColor = isSelected
    ? colors.primary
    : isToday
      ? colors.primaryFaded
      : 'transparent';

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.dayCircle, { backgroundColor: bgColor }]}>
        <Caption variant="medium" color={textColor}>
          {day}
        </Caption>
      </View>
      {hasEvents && (
        <View style={[styles.dot, { backgroundColor: isSelected ? colors.textOnPrimary : colors.secondary }]} />
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: radii.full,
    marginTop: 2,
  },
});
