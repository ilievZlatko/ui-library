import { DateTime } from 'luxon';
import { getAllSundaysForDisplayedMonth } from '../getAllSundaysForDisplayedMonth';

describe(
  getAllSundaysForDisplayedMonth,
  (): void => {
    it('should return the correct days for a given month', (): void => {
      // Given a day, it should return all Sundays for displaying that month in Calendar.
      // If this test fails for an unknown reason, it may be because Luxon changed the API for `startOf('week')`.
      // As of today, Luxon returns Monday as the first day of the week.
      const daysForMay2019 = getAllSundaysForDisplayedMonth(DateTime.fromObject({ year: 2019, month: 5, day: 1 }));
      expect(daysForMay2019.length).toEqual(5);
      expect(daysForMay2019.map((x) => x.toISODate())).toEqual([
        '2019-04-28',
        '2019-05-05',
        '2019-05-12',
        '2019-05-19',
        '2019-05-26'
      ]);

      const daysForFeb2020 = getAllSundaysForDisplayedMonth(DateTime.fromObject({ year: 2020, month: 2, day: 10 }));
      expect(daysForFeb2020.length).toEqual(5);
      expect(daysForFeb2020.map((x) => x.toISODate())).toEqual([
        '2020-01-26',
        '2020-02-02',
        '2020-02-09',
        '2020-02-16',
        '2020-02-23'
      ]);

      const daysForFeb2018 = getAllSundaysForDisplayedMonth(DateTime.fromObject({ year: 2018, month: 2, day: 2 }));
      expect(daysForFeb2018.length).toEqual(5);
      expect(daysForFeb2018.map((x) => x.toISODate())).toEqual([
        '2018-01-28',
        '2018-02-04',
        '2018-02-11',
        '2018-02-18',
        '2018-02-25'
      ]);
    });
  }
);
