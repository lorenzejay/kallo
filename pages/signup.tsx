import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect } from "react";
import { useContext, useState } from "react";
import Button from "../components/button";
import Input from "../components/input";
import { DarkModeContext } from "../context/darkModeContext";
import useRegister from "../hooks/useRegister";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "../utils/supabaseClient";
import Layout from "../components/layout";

const Signup = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const router = useRouter();
  const user = useUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const {
    // mutate: register,
    isLoading,
    isError,
    error,
    isSuccess: registerMutationSuccess,
  } = useRegister({ email, password, firstName, lastName, username });

  useEffect(() => {
    if ((!isLoading && user) || (registerMutationSuccess && !error)) {
      router.push("/projects");
    }
  }, [user, registerMutationSuccess, isLoading]);
  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    if (password === confirmPassword) {
      if (
        username !== "" &&
        firstName !== "" &&
        lastName !== "" &&
        password !== "" &&
        email !== ""
      ) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }
        if (data.user) {
          const { data: insertData, error: insertError } = await supabase
            .from("users")
            .insert([
              {
                user_id: data?.user.id,
                username: username,
                first_name: firstName,
                last_name: lastName,
                email: email,
              },
            ]);

          if (insertError) {
            throw insertError;
          }
          return insertData;
        }
        return user;
      } else {
        return setFormError("Nothing must be blank.");
      }
    } else {
      return setFormError("The passwords do not match");
    }
  };

  return (
    <Layout>
      <main
        className={`min-h-screen flex flex-col items-center py-16 lg:py-32 sm:px-7 lg:px-16 text-white ${
          isDarkMode ? "darkBody text-white" : " text-black"
        }`}
      >
        <Head>
          <title>Kallo | Register</title>
          <link rel="icon" href="/home-1.png" />
        </Head>
        <>
          {formError && <p className="text-red-500">{formError}</p>}
          {isError && <p className="text-red-500">{error as string}</p>}
          <form
            className={`${
              isDarkMode ? "card-color text-white" : "bg-gray-100 text-black"
            } px-2 flex items-center justify-center flex-col w-full max-w-[450px] rounded-md`}
            onSubmit={handleSignUp}
          >
            <p className={`mb-4  text-xl xl:text-3xl uppercase font-bold`}>
              Register.
            </p>
            <Input
              placeholder="First Name"
              type="text"
              name="firstName"
              value={firstName}
              className="w-3/4 "
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last Name"
              type="text"
              name="lastName"
              value={lastName}
              className="w-3/4 "
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              placeholder="Username"
              type="text"
              name="username"
              value={username}
              className="w-3/4 "
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              name="email"
              value={email}
              className="w-3/4 "
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              name="password"
              value={password}
              className="w-3/4 "
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              placeholder="Confirm Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              className="w-3/4"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              disabled={
                email === "" ||
                password === "" ||
                username === "" ||
                confirmPassword === "" ||
                firstName === "" ||
                lastName === ""
              }
              className="w-3/4 mx-auto rounded-sm mt-3  bg-gradient-to-bl from-blue-400 to-blue-500 text-white-175 hover:bg-blue-500 transition-all duration-500"
            >
              Register
            </Button>
            <Link href="/signin">
              <p className="mt-32 cursor-pointer">
                Already have an account?{" "}
                <span className="font-bold cursor-pointer">Sign In</span>
              </p>
            </Link>
          </form>
        </>
      </main>
    </Layout>
  );
};

export default Signup;
