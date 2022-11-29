import { wrapper } from "@redux/store";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { FC } from "react";
import { Provider } from "react-redux";

import "primeicons/primeicons.css"; // icons
import "primereact/resources/primereact.min.css"; // core css
import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme

import "../styles/globals.css";

const MyApp: FC<
  AppProps<{
    session: Session | null;
  }>
> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <SessionProvider session={rest.pageProps.session}>
        <Component {...props.pageProps} />
      </SessionProvider>
    </Provider>
  );
};

export default MyApp;
