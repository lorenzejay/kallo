import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useUser from "../hooks/useUser";
import Loader from "./loader";

export default function ProtectedWrapper({ children }: { children: any }) {
  const router = useRouter();
  const { isLoading, isError, data: user } = useUser();
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/signin");
    }
  }, [router, user]);
  if (isLoading) {
    return (
      <div className="h-screen grid place-items-center">
        <Loader size="w-[200px] h-[200px]" />
      </div>
    );
  }

  if (isError) {
    router.push("/signin");
    return (
      <div className="h-screen grid place-items-center">
        <Loader size="w-[200px] h-[200px]" />
      </div>
    );
  }

  return <div>{children}</div>;
}
