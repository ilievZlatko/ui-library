import { DateTime } from 'luxon';
import { convertDateTimeToObject } from '../convertDateTimeToObject';

describe(
  convertDateTimeToObject,
  (): void => {
    it('should convert times correctly', (): void => {
      // Given valid DateTimes it should convert to the correct object.
      expect(convertDateTimeToObject(DateTime.local(2019, 2, 2))?.toISODate()).toEqual('2019-02-02');
      expect(convertDateTimeToObject(DateTime.local(2019, 1, 1, 12, 30, 0, 0))?.toISODate()).toEqual('2019-01-01');
      expect(convertDateTimeToObject(DateTime.local(2018, 12, 10, 13))?.toISODate()).toEqual('2018-12-10');
      expect(convertDateTimeToObject(DateTime.local(2019, 6, 20))?.toISODate()).toEqual('2019-06-20');

      // Given null, it should return null.
      expect(convertDateTimeToObject(null)).toBeNull();
    });
  }
);
