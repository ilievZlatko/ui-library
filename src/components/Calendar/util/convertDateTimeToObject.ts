import { DateTime } from 'luxon';

// TODO(ignat): Remove this function.

/**
 * Converts a Luxon object to a simple DateObject, which does not have a timezone.
 */
export function convertDateTimeToObject(dateTime: DateTime | null): DateTime | null {
  if (!dateTime) {
    return null;
  }

  return dateTime.startOf('day');
}
