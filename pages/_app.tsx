import { AppProps } from "next/app";
import "../styles/global.css";
import { Analytics } from "@vercel/analytics/react";
import createEmotionCache from "../src/utils/createEmotionCache";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { MotionLazyContainer } from "../src/components/animate";

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <MotionLazyContainer>
        <Component {...pageProps} />
      </MotionLazyContainer>
      <Analytics />
    </CacheProvider>
  );
}
export default App;
