import Link from "next/link";
import React, { useState } from "react";
import Button from "../components/button";
import Googlesigninbutton from "../components/googlesigninbutton";
import Input from "../components/input";
import Layout from "../components/layout";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
  };
  return (
    <Layout>
      <section>
        <form className="flex items-center justify-center flex-col" onSubmit={handleSignIn}>
          <h2 className="text-3xl font-bold uppercase">Sign In</h2>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            name="email"
            className="w-3/4 "
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            name="password"
            className=" w-3/4"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Googlesigninbutton />
          <Button type="submit" className="w-3/4 mx-auto">
            Sign In
          </Button>
          <Link href="/signup" className="mt-5">
            <p>
              If you don't have an account, <span style={{ color: "#ff0078" }}>Sign Up</span>
            </p>
          </Link>
        </form>
      </section>
    </Layout>
  );
};

export default Signin;
