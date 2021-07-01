import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/button";
import Input from "../components/input";
import { DarkModeContext } from "../context/darkModeContext";
import { register } from "../redux/Actions/userActions";
import { RootState } from "../redux/store";

const Signup = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo, error } = userLogin;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleSignUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    if (password === confirmPassword) {
      if (
        username !== "" &&
        firstName !== "" &&
        lastName !== "" &&
        password !== "" &&
        email !== ""
      )
        dispatch(register(email, username, firstName, lastName, password));
      else {
        return setFormError("Nothing must be blank.");
      }
    } else {
      setFormError("The passwords do not match");
    }
  };
  useEffect(() => {
    if (userInfo) {
      router.push("/projects");
    }
  }, [userInfo]);
  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center px-7 lg:px-16 lg:pt-12 text-white ${
        isDarkMode ? "darkBody text-white" : "bg-gray-50 lightBody text-black"
      }`}
    >
      <h1
        className={`text-5xl font-semibold  pt-12 ${
          isDarkMode ? "text-white" : " text-black"
        }`}
      >
        Kallo
      </h1>
      {formError && <p className="text-red-500">{formError}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form
        className={`${
          isDarkMode ? "card-color text-white" : "bg-gray-100 text-black"
        } mt-10 py-10 px-2 flex items-center justify-center flex-col shadow-lg w-full lg:w-1/2 2xl:w-1/4 rounded-md`}
        onSubmit={handleSignUp}
      >
        <p className="mb-4  text-xl">Register.</p>
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
          className="w-3/4 mx-auto rounded-sm mt-3 column-color hover:bg-blue-500 transition-all duration-500"
          type="submit"
        >
          Register
        </Button>
        <Link href="/signin">
          <p className="mt-5 cursor-pointer">
            If you already have an account,{" "}
            <span className="text-blue-500 cursor-pointer">Sign In</span>
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

export default Signup;
