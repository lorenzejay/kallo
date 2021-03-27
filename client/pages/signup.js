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
    <Layout>
      <form className="flex items-center justify-center flex-col" onSubmit={handleSignUp}>
        <h2 className="text-3xl font-bold uppercase text-white">Register</h2>
        {formError && <p className="text-red-500">{formError}</p>}
        {error && <p className="text-red-500">{error}</p>}
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
          className="w-3/4 "
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Googlesigninbutton />
        <Button className="w-3/4 uppercase" type="submit">
          Start Sizzzlin
        </Button>
        <Link href="/signin" className="mt-5">
          <p>
            If you already have an account, <span style={{ color: "#ff0078" }}>Sign In</span>
          </p>
        </Link>
      </form>
    </Layout>
  );
};

export default Signup;
