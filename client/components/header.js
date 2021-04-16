import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, logout } from "../redux/Actions/userActions";
import { FaBars } from "react-icons/fa";
import { useEffect } from "react";
import Dropdown from "./dropdown";
import { AiOutlineUser } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { RiTodoLine } from "react-icons/ri";

const Header = ({ setSidebarOpen, sidebarOpen }) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userDeets = useSelector((state) => state.userDeets);
  const { userDetails } = userDeets;
  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails());
    }
  }, [userInfo]);
  // console.log(userDetails);
  return (
    <header className="flex justify-between items-center h-24 lg:px-16 text-white">
      {/* <Link href="/">
        <h2 className="text-3xl font-bold">FREELANCIN</h2>
      </Link> */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="outline-none border-none">
        <FaBars size={30} className="outline-none border-none" />
      </button>
      {!userInfo && (
        <ul className="flex justify-between items-center w-64 ">
          <li>
            <Link href="/signin">Sign In</Link>
          </li>
          <li>
            <Link href="/signup">Sign Up</Link>
          </li>
        </ul>
      )}
      {userDetails && userDetails.username && (
        <ul className="flex justify-between items-center w-64 ">
          <li className="bg-gray-400 rounded-md px-2 py-1 w-9 h-9 flex justify-center items-center text-xl font-medium">
            {userDetails.username.slice(0, 1).toUpperCase()}
          </li>
          <li className="">
            <Dropdown title={userDetails.email} className="right-0">
              <ul>
                <li className="hover:bg-gray-300 cursor-pointer hover:text-black rounded-md my-3 p-1 border-gray-50">
                  <Link href="/projects">
                    <div className="flex items-center">
                      <RiTodoLine className="text-white mr-2" color={"white"} /> My Projects
                    </div>
                  </Link>
                </li>
                <hr />
                <li className="hover:bg-gray-300 cursor-pointer hover:text-black rounded-md my-3 p-1 border-gray-50">
                  <Link href="/sharedProjects">
                    <div className="flex items-center">
                      <RiTodoLine className="text-white mr-2" color={"white"} /> Shared Projects
                    </div>
                  </Link>
                </li>
                <hr />
                <li className="hover:bg-gray-300 cursor-pointer hover:text-black rounded-md my-3 p-1 border-gray-50">
                  <Link href="/profile">
                    <div className="flex items-center">
                      <AiOutlineUser className="mr-2" /> My Profile
                    </div>
                  </Link>
                </li>
                <hr />
                <li className="hover:bg-gray-300 hover:text-black rounded-md my-3 p-1 ">
                  <button onClick={() => dispatch(logout())} className="flex items-center">
                    <FiLogOut className="mr-2" /> Logout
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
