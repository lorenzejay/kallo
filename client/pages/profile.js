import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/layout";
import { DarkModeContext } from "../context/darkModeContext";

const Profile = () => {
  const { isDarkMode } = useContext(DarkModeContext);

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
      <main
        className={`flex flex-col items-center justify-center w-full h-screen ${
          isDarkMode ? "text-white darkBody" : "lightBody text-black"
        }`}
      >
        <h1 className="text-5xl">Your Profile</h1>
        {userDetails && (
          <form className="w-full flex flex-col justify-between lg:justify-center lg:w-1/2">
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
          </form>
        )}
      </main>
    </Layout>
  );
};

export default Profile;
