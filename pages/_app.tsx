import { NextPageContext } from 'next';
import type { AppProps } from 'next/app';
import { getActiveABTests } from '../utils/ab-testing-utils';
import { ABTests } from '../utils/ab-tests';
import { ABTestsContext } from '../utils/useABTest';
import './globals.css';

type CustomAppProps = AppProps & {
  abTests: ABTests;
};

export default function MyApp({
  Component,
  pageProps,
  abTests,
}: CustomAppProps) {
  return (
    <ABTestsContext.Provider value={abTests}>
      <Component {...pageProps} />
    </ABTestsContext.Provider>
  );
}

const COOKIE_SEPARATOR = '; ';

function getCookieMap(cookieString: string, abTestCookieNames: string[]) {
  return cookieString.split(COOKIE_SEPARATOR).reduce((prev, current) => {
    const [name, ...value] = current.split('=');
    if (!abTestCookieNames.includes(name)) {
      return prev;
    }
    prev[name] = value.join('=');
    return prev;
  }, {} as { [key: string]: string });
}

MyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  const activeABTestCookieNames = getActiveABTests().flatMap(([key, _]) => key);
  const isServer = !!ctx.req;

  // console.log('PATHNAME', ctx.asPath);

  console.log({ SetCookieResponseHeader: ctx.res?.getHeader('set-cookie') });

  if (isServer) {
    let response_setcookies_header = ctx.res?.getHeader('set-cookie');

    if (Array.isArray(response_setcookies_header)) {
      response_setcookies_header =
        response_setcookies_header.join(COOKIE_SEPARATOR);
    }

    const resCookieMap = response_setcookies_header
      ? getCookieMap(
          String(response_setcookies_header),
          activeABTestCookieNames,
        )
      : {};

    const reqCookieMap = ctx.req?.headers.cookie
      ? getCookieMap(ctx.req.headers.cookie, activeABTestCookieNames)
      : {};

    console.log({ resCookieMap });

    console.log({ reqCookieMap });
    console.log({ abTests: { abTests: { ...reqCookieMap, ...resCookieMap } } });

    // if (ctx.asPath === '/web/125/overview') {
    //   return {};
    // }
    return { abTests: { ...reqCookieMap, ...resCookieMap } };
  } else {
    console.log('document.cookie', document.cookie);
    return {
      abTests: {
        ...getCookieMap(document.cookie, activeABTestCookieNames),
      },
    };
  }
};
