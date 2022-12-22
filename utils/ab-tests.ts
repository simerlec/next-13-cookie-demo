import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const ABTests: ABTests = {
  'custom-ab-test-bucket': {
    buckets: ['a', 'b', 'c'],
    startDate: new Date(Date.UTC(2022, 11, 13)),
    endDate: new Date(Date.UTC(2022, 11, 22)),
  },
  'custom-ab-test-#2-bucket': {
    buckets: ['a', 'b'],
    startDate: new Date(Date.UTC(2022, 11, 13)),
    endDate: new Date(Date.UTC(2022, 11, 27)),
  },
};

/**
 * Map of cookie names to list of buckets with start/end date in UTC
 */
export interface ABTests {
  [cookieName: string]: { buckets: string[]; startDate: Date; endDate: Date };
}
