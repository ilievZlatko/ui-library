import { DateTimeConstants } from 'leanplum-lib-common';
import range from 'lodash/range';
import { DateTime } from 'luxon';

const DAYS_PER_WEEK_LIST: Array<number> = range(DateTimeConstants.DAYS_PER_WEEK);
const SUNDAY: number = 7;

/**
 * Returns a list of all days in the week for the given date, starting from Sunday.
 */
export function getDaysOfWeek(givenDay: DateTime): Array<DateTime> {
  let startOfWeek: DateTime;

  // Ensure that that the given day is Sunday.
  if (givenDay.weekday === SUNDAY) {
    startOfWeek = givenDay;
  } else {
    // Reset to the begining of the week, adjusting 1 day because Luxon starts the week on Monday.
    startOfWeek = givenDay.startOf('week').minus({ days: 1 });
  }

  const listOfDays: Array<DateTime> = DAYS_PER_WEEK_LIST.map(
    (offset: number): DateTime => startOfWeek.plus({ days: offset })
  );

  return listOfDays;
}
