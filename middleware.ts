// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getActiveABTests, chooseBucket } from './utils/ab-testing-utils';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return checkForABTest(request);
}

function checkForABTest(req: NextRequest, res?: NextResponse) {
    const { searchParams } = req.nextUrl;
    const response = res ? res : NextResponse.next();
  
    getActiveABTests().map(([cookieName, { buckets, endDate }]) => {
      const forceBucket = searchParams.get(cookieName);
  
      // Get the bucket from the cookie
      let bucket = req.cookies.get(cookieName)?.value;
      let hasBucket = !!bucket;
  
      // console.log('COOKIE ', cookieName, bucket);
  
      if (forceBucket && buckets.includes(forceBucket)) {
        // if we want to send someone to a specific bucket we can use a query param
        bucket = forceBucket;
        hasBucket = false;
      } else if (!bucket || !buckets.includes(bucket)) {
        // If there's no active bucket in cookies or its value is invalid, get a new one
        bucket = chooseBucket(buckets);
        hasBucket = false;
      }
  
      // console.log('COOKIE ', cookieName, { choosenBucket: bucket });
  
      // Add the bucket to the response cookies if it's not there
      // or if its value was invalid
      if (!hasBucket) {
        response.cookies.set(cookieName, bucket, {
          expires: endDate,
        });
      }
    });
  
    return response;
  }
  