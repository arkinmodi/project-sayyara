import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { FC } from "react";
import { Provider } from "react-redux";
import { wrapper } from "../redux/store";
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
