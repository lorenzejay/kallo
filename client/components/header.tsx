import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, logout } from "../redux/Actions/userActions";
import { useContext, useEffect } from "react";
import Dropdown from "./dropdown";
import { AiOutlineUser } from "react-icons/ai";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { RiTodoLine } from "react-icons/ri";
import { DarkModeContext } from "../context/darkModeContext";
import { RootState } from "../redux/store";

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;
  const userDeets = useSelector((state: RootState) => state.userDeets);
  const { userDetails } = userDeets;

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails());
    }
  }, [userInfo]);
  // console.log(userInfo);

  // console.log('username', showUsername())
  const handleLogout = () => {
    dispatch(logout());
    if (!userInfo || userInfo === null) {
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
      {userInfo === null && (
        <ul className="flex justify-between items-center w-48 mr-3">
          <li>
            <Link href="/signin">Sign In</Link>
          </li>
          <li className="bg-blue-500 text-white-175 rounded-md p-3 ">
            <Link href="/signup">Try for free</Link>
          </li>
        </ul>
      )}
      {userDetails && userDetails.username && (
        <ul className="flex justify-between items-center w-64 ">
          <li className="">
            <Dropdown title={userDetails.email} className="right-0">
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
                <li className="hover:bg-gray-300 cursor-pointer hover:text-black rounded-md my-3 p-2 border-gray-50">
                  <Link href="/sharedProjects">
                    <div className="flex items-center">
                      <RiTodoLine
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        } mr-3"`}
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
                <li className="hover:bg-gray-300 cursor-pointer hover:text-black rounded-md my-3 p-2 border-gray-50">
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center"
                  >
                    {isDarkMode ? <FiMoon className='mr-3'/> : <FiSun className='mr-3'/>} DarkMode
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

          {/* <li>
            <button onClick={() => dispatch(logout())}>Logout</button>
          </li>
          <li>
            <Link href="/projects">Projects</Link>
          </li> */}
        </ul>
      )}
    </header>
  );
};

export default Header;
