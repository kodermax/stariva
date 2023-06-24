import { AppProps } from 'next/app';
import '../styles/global.css';
import { Analytics } from '@vercel/analytics/react';
import createEmotionCache from '../src/utils/createEmotionCache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { MotionLazyContainer } from '../src/components/animate';
import * as snippet from '@segment/snippet';

import Page from '../src/components/page/Page';
import Script from 'next/script';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../src/redux/store';
import ThemeProvider from '../src/theme';
import { ThemeSettings } from '../src/components/settings';
import { NextPage } from 'next';
import Head from 'next/head';

const clientSideEmotionCache = createEmotionCache();
const DEFAULT_WRITE_KEY = 'EdsFmaIrca2R4g21YYK5eshSanBu6nur';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

function renderSnippet() {
  const opts = {
    apiKey: process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY || DEFAULT_WRITE_KEY,

    // note: the page option only covers SSR tracking.
    // Page.js is used to track other events using `window.analytics.page()`
    page: true,
  };

  if (process.env.NODE_ENV === 'development') {
    return snippet.max(opts);
  }

  return snippet.min(opts);
}
function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: MyAppProps) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ReduxProvider store={store}>
        <MotionLazyContainer>
          <ThemeProvider>
            <ThemeSettings>
              <Page>
                <Script
                  id='segment-script'
                  dangerouslySetInnerHTML={{ __html: renderSnippet() }}
                />
                {getLayout(<Component {...pageProps} />)}
              </Page>
            </ThemeSettings>
          </ThemeProvider>
        </MotionLazyContainer>
        <Analytics />
      </ReduxProvider>
    </CacheProvider>
  );
}
export default App;
