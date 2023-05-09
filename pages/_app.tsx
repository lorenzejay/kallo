import "../styles/globals.css";
import { ReactPropTypes } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import ErrorBoundary from "../components/ErrorBoundary";
export default function MyApp({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: ReactPropTypes;
}) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
