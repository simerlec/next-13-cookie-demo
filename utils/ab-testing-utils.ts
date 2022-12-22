import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ABTests } from './ab-tests';
dayjs.extend(utc);

// taken from https://github.com/vercel/examples/blob/main/edge-functions/ab-testing-simple/lib/ab-testing.ts
export function chooseBucket(buckets: readonly string[]) {
  // Get a random number between 0 and 1
  let n = cryptoRandom() * 100;
  // Get the percentage of each bucket
  const percentage = 100 / buckets.length;
  // Loop through the buckets and see if the random number falls
  // within the range of the bucket
  return (
    buckets.find(() => {
      n -= percentage;
      return n <= 0;
    }) ?? buckets[0]
  );
}

function cryptoRandom() {
  return crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1);
}

/**
 * Return a list of active AB tests mapped/indexed by cookie name
 */
export function getActiveABTests() {
  return Object.entries(ABTests).filter(
    ([_, abTest]) =>
      dayjs().utc().isAfter(abTest.startDate) &&
      dayjs().utc().isBefore(abTest.endDate),
  );
}
