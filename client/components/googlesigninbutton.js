import React from "react";
import { FcGoogle } from "react-icons/fc";
const Googlesigninbutton = () => {
  return (
    <button
      className={`bg-none text-black px-5 py-2 rounded outline-none border my-3 w-3/4 flex items-center hover:bg-blue-200 transition-all ease-in duration-500`}
    >
      <FcGoogle className="mr-5" /> Sign in with Google
    </button>
  );
};

export default Googlesigninbutton;
