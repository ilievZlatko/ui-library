import range from 'lodash/range';
import { DateTime } from 'luxon';

const REMAINING_DAYS_PER_WEEK: number = 6;
const MAX_WEEKS_PER_MONTH: number = 6;
const MAX_WEEKS_IN_MONTH: Array<number> = range(MAX_WEEKS_PER_MONTH);

/**
 * Returns a list of 4-6 days, each being the first day of the week for all weeks in a given month.
 */
export function getAllSundaysForDisplayedMonth(currentMonth: DateTime): Array<DateTime> {
  const dates: Array<DateTime> = MAX_WEEKS_IN_MONTH.map(
    (offset: number): DateTime =>
      currentMonth
        .startOf('month')
        .plus({ weeks: offset })
        .startOf('week')
        // Luxon starts the week on Monday. We need to subtract a day to start the week on Sunday (for the calendar).
        .minus({ days: 1 })
  ).filter(
    (startOfWeek: DateTime): boolean => {
      return (
        startOfWeek.month === currentMonth.month ||
        startOfWeek.plus({ days: REMAINING_DAYS_PER_WEEK }).month === currentMonth.month
      );
    }
  );

  return dates;
}
