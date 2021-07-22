import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import Layout from "../components/layout";
import Loader from "../components/loader";
import { configWithToken } from "../functions";
import { RootState } from "../redux/store";
import { UserInfo } from "../types/userTypes";

const Profile = () => {
  const router = useRouter();
  // const userDeets = useSelector((state: RootState) => state.userDeets);
  // const { userDetails } = userDeets;
  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;
  useEffect(() => {
    if (!userInfo) {
      router.push("/signin");
    }
  }, [userInfo]);

  const fetchUserDeets = async () => {
    if (!userInfo || !userInfo.token) return;
    const config = configWithToken(userInfo.token);
    const { data } = await axios.get<UserInfo>("/api/users/details", config);
    return data;
  };
  const { data: userDetails, isLoading } = useQuery(`userInfo`, fetchUserDeets);

  return (
    <Layout>
      <main
        className={`flex flex-col items-center justify-center w-full min-h-screen relative`}
      >
        <div className="absolute top-0 right-0 left-0 bottom-0">
          {isLoading && <Loader />}
        </div>
        <h1 className="text-5xl">Your Profile</h1>
        {userDetails && (
          <section className="w-full flex flex-col justify-between lg:justify-center lg:w-1/2">
            <p className="flex mx-auto w-full text-2xl my-3 text-left">
              <span className="uppercase flex-grow">Full Name:</span>
              {userDetails.first_name} {userDetails.last_name}
            </p>
            <p className="flex mx-auto w-full text-2xl my-3">
              <span className="uppercase flex-grow">Username:</span>
              {userDetails.username}
            </p>
            <p className="flex mx-auto w-full text-2xl my-3">
              <span className="uppercase flex-grow">Email:</span>
              {userDetails.email}
            </p>
          </section>
        )}
      </main>
    </Layout>
  );
};

export default Profile;
