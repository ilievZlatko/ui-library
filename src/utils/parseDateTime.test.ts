import { DateTime } from 'luxon';
import { parseDateTime } from './parseDateTime';

describe(parseDateTime, () => {
  it('should convert valid values to DateTime', () => {
    expect(parseDateTime('6/1/2019', ['M/d/yyyy'])).toEqual(DateTime.local(2019, 6, 1));
    expect(parseDateTime('1-10-2020', ['M/d/yyyy', 'M-d-yyyy'])).toEqual(DateTime.local(2020, 1, 10));
    expect(parseDateTime('1.1.2010', ['M.d.yyyy'])).toEqual(DateTime.local(2010, 1, 1));
  });

  it('should return null for invalid values', () => {
    expect(parseDateTime('6/1/2019', ['MM.dd.yyyy'])).toBeNull();
    expect(parseDateTime('2019-06-01T00:00:00.000-07:00', ['M.d.yyyy', 'MM.dd.yyyy'])).toBeNull();
  });
});
