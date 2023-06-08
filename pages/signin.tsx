import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Button from "../components/button";
import Input from "../components/input";
import Layout from "../components/layout";
import Loader from "../components/loader";
import { DarkModeContext } from "../context/darkModeContext";
import { useSessionContext, useUser } from "@supabase/auth-helpers-react";
import supabase from "../utils/supabaseClient";
import { AuthError } from "@supabase/supabase-js";

// import useUser from "../hooks/useUser";

const Signin = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const user = useUser();
  const [error, setError] = useState<AuthError | null>(null);
  const { isLoading, session } = useSessionContext();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!isLoading && session) {
      router.push("/projects");
    }
  }, [user, session, error, isLoading]);

  const handleLogin = async () => {
    if (email === "" || password === "") return;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return setError(error);
  };

  return (
    <Layout>
      <main
        className={`${
          isDarkMode ? "darkBody text-white" : " text-black"
        } min-h-screen flex flex-col items-center py-16 lg:py-32 px-7 lg:px-16`}
      >
        <>
          <Head>
            <title>Kallo | Sign In</title>
            <link rel="icon" href="/home-1.png" />
          </Head>

          {isLoading && <Loader />}
          {error && <p className="text-red-500 my-1">{error.message}</p>}
          <form
            className={`${
              isDarkMode ? "card-color text-white" : "bg-gray-100 text-black"
            }  flex items-center justify-center flex-col  w-full max-w-[450px] rounded-md`}
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <p className={`mb-4  text-xl xl:text-3xl uppercase font-bold`}>
              Log in
            </p>
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
              <p className=" mt-32 cursor-pointer">
                Don't have an account yet?{" "}
                <span className="font-bold">Register now</span>
              </p>
            </Link>
          </form>
        </>
      </main>
    </Layout>
  );
};

export default Signin;
