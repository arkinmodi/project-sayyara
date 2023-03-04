import { wrapper } from "@redux/store";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
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

export default MyApp;
