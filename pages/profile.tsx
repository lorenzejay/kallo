import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import React from "react";
import Layout from "../components/layout";
import Loader from "../components/loader";
import ProtectedWrapper from "../components/Protected";
// import useUser from "../hooks/useUser";
import { UserInfo } from "../types/userTypes";
import supabase from "../utils/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

const Profile = () => {
  const user = useUser();

  const fetchUserProfile = async (): Promise<UserInfo | undefined> => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("user_id", user.id)
      .single();
    if (error) throw new Error(error.message);
    return data as UserInfo;
  };
  const { data: userDetails, isLoading } = useQuery(
    [`user-${user?.id}`],
    fetchUserProfile,
    {
      enabled: !!user?.id,
    }
  );

  return (
    <Layout>
      <ProtectedWrapper>
        <Head>
          <title>Kallo | Profile</title>
          <link rel="icon" href="/home-1.png" />
        </Head>
        <main
          className={`flex flex-col items-center justify-center w-full min-h-screen relative`}
        >
          <div className="absolute top-0 right-0 left-0 bottom-0">
            {isLoading && <Loader />}
          </div>
          <h1 className="text-3xl lg:text-5xl">Your Profile</h1>
          {user && userDetails && (
            <section className="w-full flex flex-col justify-between text-lg lg:text-2xl lg:justify-center lg:w-1/2">
              <p className="flex mx-auto w-full my-3 text-left">
                <span className="uppercase flex-grow">Full Name:</span>
                {userDetails.first_name} {userDetails.last_name}
              </p>
              <p className="flex mx-auto w-full my-3">
                <span className="uppercase flex-grow">Username:</span>
                {userDetails.username}
              </p>
              <p className="flex mx-auto w-full my-3">
                <span className="uppercase flex-grow">Email:</span>
                {userDetails.email}
              </p>
            </section>
          )}
        </main>
      </ProtectedWrapper>
    </Layout>
  );
};

export default Profile;
