import "../styles/globals.css";
import { Provider } from "react-redux";
import store from "../redux/store";
import { ReactPropTypes } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
export default function MyApp({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: ReactPropTypes;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <Provider store={store}> */}
      <Component {...pageProps} />
      {/* </Provider> */}
    </QueryClientProvider>
  );
}
