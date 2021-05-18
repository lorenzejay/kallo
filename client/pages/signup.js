import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/button";
import Googlesigninbutton from "../components/googlesigninbutton";
import Input from "../components/input";
import Layout from "../components/layout";
import { register } from "../redux/Actions/userActions";

const Signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, userInfo, error } = userLogin;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const handleSignUp = (e) => {
    e.preventDefault();
    setFormError("");
    if (password === confirmPassword) {
      if (username !== "" && firstName !== "" && lastName !== "" && password !== "" && email !== "")
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
    <main className="mt-24 flex flex-col items-center justify-center px-7 lg:px-16 text-white">
      <h1 className="text-5xl font-semibold ">Kallo</h1>
      {formError && <p className="text-red-500">{formError}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form
        className="card-color mt-5 py-10 px-2 flex items-center justify-center flex-col text-black shadow-lg w-full lg:w-1/4 rounded-md"
        onSubmit={handleSignUp}
      >
        <p className="mb-4 text-white text-xl">Register.</p>
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
          <p className="text-white mt-5">
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
