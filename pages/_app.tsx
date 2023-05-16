import { AppProps } from "next/app";
import "../styles/global.css";
import { Analytics } from "@vercel/analytics/react";
import createEmotionCache from "../src/utils/createEmotionCache";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { MotionLazyContainer } from "../src/components/animate";
import * as snippet from "@segment/snippet";

import { useEffect } from "react";
import Page from "../src/components/page/Page";
import Script from "next/script";

const clientSideEmotionCache = createEmotionCache();
const DEFAULT_WRITE_KEY = "EdsFmaIrca2R4g21YYK5eshSanBu6nur";

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}
function renderSnippet() {
  const opts = {
    apiKey: process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY || DEFAULT_WRITE_KEY,

    // note: the page option only covers SSR tracking.
    // Page.js is used to track other events using `window.analytics.page()`
    page: true,
  };

  if (process.env.NODE_ENV === "development") {
    return snippet.max(opts);
  }

  return snippet.min(opts);
}
function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: MyAppProps) {
  useEffect(() => {
    setTimeout(() => {
      window.analytics.page("/");
    }, 5000);
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <MotionLazyContainer>
        <Page>
          <Script
            id="segment-script"
            dangerouslySetInnerHTML={{ __html: renderSnippet() }}
          />
          <Component {...pageProps} />
        </Page>
      </MotionLazyContainer>
      <Analytics />
    </CacheProvider>
  );
}
export default App;
