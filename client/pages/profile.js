import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/layout";

const Profile = () => {
  const router = useRouter();
  const userDeets = useSelector((state) => state.userDeets);
  const { userDetails } = userDeets;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  useEffect(() => {
    if (!userInfo) {
      router.push("/signin");
    }
  }, [userInfo]);

  return (
    <Layout>
      <main className="flex items-center justify-center flex-col w-full text-white">
        <h1 className="text-5xl">Your Profile</h1>
        {userDetails && (
          <form className="w-full flex flex-col justify-center mt-20">
            <p className="flex w-1/2 mx-auto text-2xl my-3">
              <span className="uppercase flex-grow">Full Name:</span>
              {userDetails.first_name} {userDetails.last_name}
            </p>
            <p className="flex  w-1/2 mx-auto text-2xl my-3">
              <span className="uppercase flex-grow">Username:</span>
              {userDetails.username}
            </p>
            <p className="flex w-1/2 mx-auto text-2xl my-3">
              <span className="uppercase flex-grow">Email:</span>
              {userDetails.email}
            </p>
          </form>
        )}
      </main>
    </Layout>
  );
};

export default Profile;
