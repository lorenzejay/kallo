import { useRouter } from "next/router";
import React, { useEffect } from "react";
// import useUser from "../hooks/useUser";
import Layout from "./layout";
import Loader from "./loader";
import { useUser, useSessionContext } from "@supabase/auth-helpers-react";

export default function ProtectedWrapper({ children }: { children: any }) {
  const router = useRouter();
  const user = useUser();
  const { isLoading } = useSessionContext();
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [router, user, isLoading]);

  if (isLoading) {
    return (
      <Layout>
        <div className="h-screen grid place-items-center">
          <Loader size="w-[200px] h-[200px]" />
        </div>
      </Layout>
    );
  }

  return <div>{children}</div>;
}
