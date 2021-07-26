import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import Dropdown from "./dropdown";
import { AiOutlineUser } from "react-icons/ai";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { RiTodoLine } from "react-icons/ri";
import { DarkModeContext } from "../context/darkModeContext";
import axios from "axios";
import { configWithToken } from "../functions";
import { useQuery } from "react-query";
import Loader from "./loader";
import { UserInfo } from "../types/userTypes";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const auth = useAuth();
  const { logout, userToken } = auth;
  // console.log("userToken", userToken);

  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const router = useRouter();
  // const userLogin = useSelector((state: RootState) => state.userLogin);
  // const { userInfo } = userLogin;

  const fetchLoggedInUserDetails = async () => {
    if (!userToken) return;
    const config = configWithToken(userToken);
    const { data } = await axios.get<UserInfo>("/api/users/details", config);
    return data;
  };

  const { data, isLoading } = useQuery("userInfo", fetchLoggedInUserDetails);

  const handleLogout = () => {
    logout();
    if (userToken === null) {
      router.push("/signin");
    }
  };

  return (
    <header
      className={`flex justify-between items-center h-24 px-7 lg:px-16 xl:px-32 shadow-2xl text-black ${
        isDarkMode ? "darkBody text-white" : "bg-white-175 "
      }`}
    >
      <Link href="/">
        <h2 className="text-3xl font-bold cursor-pointer tracking-wide">
          Kallo
        </h2>
      </Link>
      {/* <button onClick={() => setSidebarOpen(!sidebarOpen)} className="outline-none border-none">
        <FaBars size={30} className="outline-none border-none" />
      </button> */}
      {!userToken && (
        <ul className="flex justify-between items-center w-48 mr-3">
          <li>
            <Link href="/signin">Sign In</Link>
          </li>
          <li className="bg-blue-500 text-white-175 rounded-md p-3 ">
            <Link href="/signup">Try for free</Link>
          </li>
        </ul>
      )}
      {isLoading && <Loader />}
      {data && userToken && !isLoading && (
        <ul className="flex justify-between items-center w-64 ">
          <li className="">
            <Dropdown title={data.email} className="right-0">
              <ul>
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
                {/* <li className="hover:bg-gray-300 cursor-pointer hover:text-black rounded-md my-3 p-2 border-gray-50">
                  <Link href="/sharedProjects">
                    <div className="flex items-center">
                      <RiTodoLine
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        } mr-3`}
                      />
                      Shared Projects
                    </div>
                  </Link>
                </li>
                <hr /> */}
                <li className="hover:bg-gray-300 cursor-pointer hover:text-black rounded-md my-3 p-2 border-gray-50">
                  <Link href="/profile">
                    <div className="flex items-center">
                      <AiOutlineUser className="mr-3" /> My Profile
                    </div>
                  </Link>
                </li>
                <hr />
                <li className="hover:bg-gray-300 cursor-pointer hover:text-black rounded-md my-3 p-2 border-gray-50">
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center"
                  >
                    {isDarkMode ? (
                      <FiMoon className="mr-3" />
                    ) : (
                      <FiSun className="mr-3" />
                    )}{" "}
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                </li>
                <hr />
                <li className="hover:bg-gray-300 hover:text-black rounded-md my-3 p-2 ">
                  <button onClick={handleLogout} className="flex items-center">
                    <FiLogOut className="mr-3" /> Logout
                  </button>
                </li>
              </ul>
            </Dropdown>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Header;
