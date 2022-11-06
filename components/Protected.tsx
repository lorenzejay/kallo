import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useUser from "../hooks/useUser";
import Layout from "./layout";
import Loader from "./loader";

export default function ProtectedWrapper({ children }: { children: any }) {
  const router = useRouter();
  const { isLoading, isError, data: user } = useUser();
  useEffect(() => {
    if ((!user && !isLoading) || (!user && isError)) {
      router.push("/signin");
    }
  }, [router, user, isError]);

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
