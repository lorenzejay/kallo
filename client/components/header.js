import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, logout } from "../redux/Actions/userActions";
import { FaBars } from "react-icons/fa";
import { useEffect } from "react";
import Dropdown from "./dropdown";
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
  console.log(userDetails);
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
      {userInfo && userDetails && (
        <ul className="flex justify-between items-center w-64 ">
          <li>{userDetails.username.slice(0, 1).toUpperCase()}</li>
          <li className="hover:bg-gray-300 hover:text-black transition-all duration-500 ease-in-out p-2 rounded-md">
            <Dropdown title={userDetails.email}>dask </Dropdown>
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
