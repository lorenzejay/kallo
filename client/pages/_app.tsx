import "../styles/globals.css";
import { Provider } from "react-redux";
import store from "../redux/store";
import { ThemeProvider } from "../context/ThemeProvider";
import { ReactPropTypes } from "react";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../utils/queryClient";
import { AuthProvider } from "../hooks/useAuth";
function MyApp({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: ReactPropTypes;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Provider store={store}>
          <ThemeProvider>
            <Component {...pageProps} />
          </ThemeProvider>
        </Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
