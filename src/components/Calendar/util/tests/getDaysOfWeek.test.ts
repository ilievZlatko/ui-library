import { DateTime } from 'luxon';
import { getDaysOfWeek } from '../getDaysOfWeek';

describe(
  getDaysOfWeek,
  (): void => {
    it('should return the correct days, given the first day of the week', (): void => {
      // Given Sunday, May 26, 2019.
      const weekOfMay26 = getDaysOfWeek(DateTime.fromObject({ year: 2019, month: 5, day: 26 }));

      // It should return the correct dates.
      expect(weekOfMay26.length).toEqual(7);
      expect(weekOfMay26).toMatchObject([
        { year: 2019, month: 5, day: 26 },
        { year: 2019, month: 5, day: 27 },
        { year: 2019, month: 5, day: 28 },
        { year: 2019, month: 5, day: 29 },
        { year: 2019, month: 5, day: 30 },
        { year: 2019, month: 5, day: 31 },
        { year: 2019, month: 6, day: 1 }
      ]);

      // Given Sunday, Feb 3, 2019.
      const weekOfFeb3 = getDaysOfWeek(DateTime.fromObject({ year: 2019, month: 2, day: 3 }));

      // It should return the correct dates.
      expect(weekOfFeb3.length).toEqual(7);
      expect(weekOfFeb3).toMatchObject([
        { year: 2019, month: 2, day: 3 },
        { year: 2019, month: 2, day: 4 },
        { year: 2019, month: 2, day: 5 },
        { year: 2019, month: 2, day: 6 },
        { year: 2019, month: 2, day: 7 },
        { year: 2019, month: 2, day: 8 },
        { year: 2019, month: 2, day: 9 }
      ]);
    });

    it('should return the correct days, given a day in the middle of the week', (): void => {
      // Given Tuesday, March 12, 2019.
      const weekOfMarch12 = getDaysOfWeek(DateTime.fromObject({ year: 2019, month: 3, day: 12 }));

      // It should use Sunday, March 10 and return the correct days.
      expect(weekOfMarch12.length).toEqual(7);
      expect(weekOfMarch12).toMatchObject([
        { year: 2019, month: 3, day: 10 },
        { year: 2019, month: 3, day: 11 },
        { year: 2019, month: 3, day: 12 },
        { year: 2019, month: 3, day: 13 },
        { year: 2019, month: 3, day: 14 },
        { year: 2019, month: 3, day: 15 },
        { year: 2019, month: 3, day: 16 }
      ]);

      // Given Saturday, April 27, 2019.
      const weekOfApril27 = getDaysOfWeek(DateTime.fromObject({ year: 2019, month: 4, day: 27 }));

      // It should use the previous Sunday, and return the correct days.
      expect(weekOfApril27.length).toEqual(7);
      expect(weekOfApril27).toMatchObject([
        { year: 2019, month: 4, day: 21 },
        { year: 2019, month: 4, day: 22 },
        { year: 2019, month: 4, day: 23 },
        { year: 2019, month: 4, day: 24 },
        { year: 2019, month: 4, day: 25 },
        { year: 2019, month: 4, day: 26 },
        { year: 2019, month: 4, day: 27 }
      ]);
    });
  }
);
