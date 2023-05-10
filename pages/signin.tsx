import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Button from "../components/button";
import Input from "../components/input";
import Layout from "../components/layout";
import Loader from "../components/loader";
import { DarkModeContext } from "../context/darkModeContext";
import useLogin from "../hooks/useLogin";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "../utils/supabaseClient";

// import useUser from "../hooks/useUser";

const Signin = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const user = useUser();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    // mutate: loginMutation,
    isLoading,
    isError,
    error,
    isSuccess: loginMutationSuccess,
  } = useLogin({ email, password });

  useEffect(() => {
    if ((!isLoading && user) || (loginMutationSuccess && !isError)) {
      router.push("/projects");
    }
  }, [user, loginMutationSuccess, isLoading]);

  const handleLogin = async () => {
    if (email === "" || password === "") return;
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // loginMutation();
  };

  return (
    <Layout>
      <main
        className={`${
          isDarkMode ? "darkBody text-white" : " text-black"
        } min-h-screen flex flex-col items-center lg:justify-center px-7 pt-12 lg:px-16`}
      >
        <>
          <Head>
            <title>Kallo | Sign In</title>
            <link rel="icon" href="/home-1.png" />
          </Head>
          <h1
            className={`text-5xl font-semibold  ${
              isDarkMode ? " text-white" : " text-black"
            }`}
          >
            Kallo
          </h1>
          {isLoading && <Loader />}
          {isError && <p className="text-red-500 my-1">{error as string}</p>}
          <form
            className={`${
              isDarkMode ? "card-color text-white" : "bg-gray-100 text-black"
            } mt-5 py-10 flex items-center justify-center flex-col shadow-xl border w-full max-w-[450px] rounded-md`}
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <p className={`mb-4  text-xl `}>Log in.</p>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              name="email"
              className={`w-3/4 `}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              name="password"
              className={`w-3/4 `}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              disabled={email === "" || password === ""}
              className="w-3/4 mx-auto rounded-sm mt-3  bg-gradient-to-bl from-blue-400 to-blue-500 text-white-175 hover:bg-blue-500 transition-all duration-500"
            >
              Sign In
            </Button>
            <Link href="/signup">
              <p className=" mt-5 cursor-pointer">
                If you don't have an account,{" "}
                <span className="text-blue-500">Sign Up</span>
              </p>
            </Link>
          </form>
          <section className="hidden lg:flex justify-between items-center mt-48 w-full">
            <img src="/kallo-sign-in.svg" className="lg:w-96 object-cover" />
            <img src="/kallo-sign-in2.svg" className="lg:w-96 object-cover" />
          </section>
        </>
      </main>
    </Layout>
  );
};

export default Signin;
