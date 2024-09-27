import {appWithTranslation} from "next-i18next";
import {AppProps} from "next/app";

function MyApp({Component, pageProps}: AppProps) {
  console.info("here");
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);
