import "../styles/globals.css";
import { ReactPropTypes } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import ErrorBoundary from "../components/ErrorBoundary";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import supabase from "../utils/supabaseClient";

export default function MyApp({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: ReactPropTypes;
}) {
  // const [supabaseClient] = useState(() => createBrowserSupabaseClient({}));
  // const supabaseClient = useSupabaseClient();

  return (
    <ErrorBoundary>
      <SessionContextProvider
        supabaseClient={supabase}
        // @ts-ignore
        initialSession={pageProps.initialSession}
      >
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </SessionContextProvider>
    </ErrorBoundary>
  );
}
