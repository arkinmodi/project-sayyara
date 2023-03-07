import { wrapper } from "@redux/store";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps, NextWebVitalsMetric } from "next/app";
import { FC, useEffect, useRef } from "react";
import { Provider } from "react-redux";

import "primeicons/primeicons.css"; // icons
import "primereact/resources/primereact.min.css"; // core css
import "primereact/resources/themes/lara-light-blue/theme.css"; // theme

import { useNetwork } from "@components/hooks/useNetwork";
import { usePrevious } from "@components/hooks/usePrevious";
import "@styles/globals.css";
import { Toast } from "primereact/toast";
import Header from "src/components/common/Header";

const MyApp: FC<
  AppProps<{
    session: Session | null;
  }>
> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const isOnline = useNetwork();
  const prevIsOnline = usePrevious(isOnline);

  const networkToast = useRef<Toast>(null);

  useEffect(() => {
    if (!isOnline && networkToast.current) {
      networkToast.current.show({
        sticky: false,
        severity: "error",
        summary: "Error",
        detail:
          "No network connectivity! Please check your internet connection.",
      });
    } else if (
      prevIsOnline != undefined &&
      !prevIsOnline &&
      isOnline &&
      networkToast.current
    ) {
      networkToast.current.show({
        sticky: true,
        severity: "success",
        summary: "Success",
        detail: "Internet re-connected!",
      });
    }
  }, [prevIsOnline, isOnline]);

  return (
    <Provider store={store}>
      <SessionProvider session={rest.pageProps.session}>
        <Header />
        <Toast ref={networkToast} />
        <Component {...props.pageProps} />
      </SessionProvider>
    </Provider>
  );
};

// reportWebVitals is used for performance testing
// For a good user experience, the following vitals should be met:
// LCP < 2.5 seconds (1 second = 1000 ms)
// FID < 100 ms
// CLS < 0.1
// TTFB < 0.5 seconds
// FCP < 1.8 seconds
// Other custom vitals include time to start and finish hydrating, and time for a page to start and finish
// rendering after a route change.
export function reportWebVitals(metric: NextWebVitalsMetric) {
  switch (metric.name) {
    case "FCP":
      // First Contentful Paint
      console.log("FCP: ", metric.value);
      break;
    case "LCP":
      // Largest Contentful Paint
      console.log("LCP: ", metric.value);
      break;
    case "CLS":
      // Cumulative Layout Shift
      console.log("CLS: ", metric.value);
      break;
    case "FID":
      // First Input Delay
      console.log("FID: ", metric.value);
      break;
    case "TTFB":
      // Time to First Byte
      console.log("TTFB: ", metric.value);
      break;
    default:
      break;
  }
}

export default MyApp;
