import { DateTime } from 'luxon';

export function parseDateTime(value: string, formats: Array<string>): DateTime | null {
  const matchingFormat = formats.find((format: string) => DateTime.fromFormat(value, format).isValid);

  if (!matchingFormat) {
    return null;
  }

  return DateTime.fromFormat(value, matchingFormat);
}
