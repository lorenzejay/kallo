import Link from "next/link";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/button";
import Input from "../components/input";
import { login } from "../redux/Actions/userActions";
import { DarkModeContext } from "../context/darkModeContext";
import { RootState } from "../redux/store";

const Signin = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  const router = useRouter();
  const dispatch = useDispatch();
  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { loading, userInfo, error } = userLogin;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (userInfo !== null || userInfo) {
      router.push("/projects");
    }
  }, [userInfo, router]);

  const handleSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login(email, password));
    if (!error) {
      router.push("/projects");
    }
  };
  return (
    <main
      className={`${
        isDarkMode ? "darkBody text-white" : "lightBody text-black"
      } min-h-screen flex flex-col items-center justify-center px-7 lg:px-16 lg:pt-24`}
    >
      <h1
        className={`text-5xl font-semibold  ${
          isDarkMode ? " text-white" : " text-black"
        }`}
      >
        Kallo
      </h1>
      {loading && <p>loading....</p>}
      {error && <p className="text-red-500 my-1">{error}</p>}
      <form
        className={`${
          isDarkMode ? "card-color text-white" : "bg-gray-100 text-black"
        } mt-5 py-10  flex items-center justify-center flex-col shadow-lg w-full sm:w-1/2 2xl:w-1/4 rounded-md`}
        onSubmit={handleSignIn}
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
    </main>
  );
};

export default Signin;
