import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import Dropdown from "./dropdown";
import { AiOutlineUser } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { RiTodoLine } from "react-icons/ri";
import { DarkModeContext } from "../context/darkModeContext";
// import useUser from "../hooks/useUser";
import useLogout from "../hooks/useLogout";
import { useUser } from "@supabase/auth-helpers-react";

const Header = () => {
  const logoutMuation = useLogout();
  const user = useUser();
  const { isDarkMode } = useContext(DarkModeContext);
  const router = useRouter();

  const handleLogout = () => {
    logoutMuation.mutate();
  };

  if (logoutMuation.isSuccess) router.push("/signin");

  return (
    <header
      className={`flex justify-between items-center h-24 px-7 lg:px-16 2xl:px-0 text-black ${
        isDarkMode ? "darkBody text-white" : ""
      }`}
    >
      <Link href="/">
        <h2 className="text-3xl font-bold cursor-pointer tracking-wide">
          Kallo
        </h2>
      </Link>

      {!user && (
        <ul className="flex justify-between items-center w-48 mr-3">
          <li>
            <Link href="/signin">Sign In</Link>
          </li>
          <li className="bg-blue-500 text-white-175 rounded-md p-3 ">
            <Link href="/signup">Try for free</Link>
          </li>
        </ul>
      )}
      {/* {isLoading && <Loader />} */}
      {user && (
        <Dropdown title={user.email} className="right-0" width={"w-48"}>
          <ul className="text-sm">
            <li className="hover:bg-gray-300 cursor-pointer hover:text-black rounded-md my-3 p-2 border-gray-50">
              <Link href="/projects">
                <div className="flex items-center mr-3">
                  <RiTodoLine
                    className={`${
                      isDarkMode ? "text-white" : "text-black"
                    } mr-3`}
                  />
                  My Projects
                </div>
              </Link>
            </li>
            <hr />
            <li className="whitespace-nowrap hover:bg-gray-300 cursor-pointer hover:text-black rounded-md my-3 p-2 border-gray-50">
              <Link href="/sharedProjects">
                <div className="flex items-center ">
                  <RiTodoLine
                    className={`${
                      isDarkMode ? "text-white" : "text-black"
                    } mr-3`}
                  />
                  Shared Projects
                </div>
              </Link>
            </li>
            <hr />
            <li className="hover:bg-gray-300 cursor-pointer hover:text-black rounded-md my-3 p-2 border-gray-50">
              <Link href="/profile">
                <div className="flex items-center">
                  <AiOutlineUser className="mr-3" /> My Profile
                </div>
              </Link>
            </li>
            <hr />
            {/* <li className="hover:bg-gray-300 cursor-pointer hover:text-black rounded-md my-3 p-2 border-gray-50">
              <button onClick={toggleDarkMode} className="flex items-center">
                {isDarkMode ? (
                  <FiMoon className="mr-3" />
                ) : (
                  <FiSun className="mr-3" />
                )}{" "}
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </li> */}
            <hr />
            <li className="hover:bg-gray-300 hover:text-black rounded-md my-3 p-2 ">
              <button onClick={handleLogout} className="flex items-center">
                <FiLogOut className="mr-3" /> Logout
              </button>
            </li>
          </ul>
        </Dropdown>
      )}
    </header>
  );
};

export default Header;
