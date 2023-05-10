import { useRouter } from "next/router";
import React, { useEffect } from "react";
// import useUser from "../hooks/useUser";
import Layout from "./layout";
import Loader from "./loader";
import { useUser } from "@supabase/auth-helpers-react";

export default function ProtectedWrapper({ children }: { children: any }) {
  const router = useRouter();
  const user = useUser();
  useEffect(() => {
    setTimeout(() => {
      if (!user) {
        router.push("/signin");
      }
    }, 500);
  }, [router, user]);

  if (!user) {
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
