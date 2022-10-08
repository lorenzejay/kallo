import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Layout from "../components/layout";
import Loader from "../components/loader";
import { configWithToken } from "../functions";
import { useAuth } from "../hooks/useAuth";
import { UserInfo } from "../types/userTypes";
import supabase from "../utils/supabaseClient";

const Profile = () => {
  const router = useRouter();
  const auth = useAuth();
  const { user, userDetails } = auth;
  // const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    } else {
      // const fetchUserDeets = async () => {
      //   const {data} = await supabase.from('users').select('username', 'first_name',);
      //   console.log('data',data)
      //   setUserDetails(data)
      // };
      // fetchUserDeets()
    }
  }, [user]);
  

  // const { data: userDetails, isLoading } = useQuery(`userInfo`, fetchUserDeets);

  return (
    <Layout>
      <>
        <Head>
          <title>Kallo | Profile</title>
          <link rel="icon" href="/home-1.png" />
        </Head>
        <main
          className={`flex flex-col items-center justify-center w-full min-h-screen relative`}
        >
          {/* <div className="absolute top-0 right-0 left-0 bottom-0">
            {isLoading && <Loader />}
          </div> */}
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
      </>
    </Layout>
  );
};

export default Profile;
