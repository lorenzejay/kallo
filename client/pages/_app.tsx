import "../styles/globals.css";
import { Provider } from "react-redux";
import store from "../redux/store";
import { ThemeProvider } from "../context/ThemeProvider";
import { ReactPropTypes } from "react";
function MyApp({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: ReactPropTypes;
}) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
