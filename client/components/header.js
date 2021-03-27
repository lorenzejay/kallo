import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/Actions/userActions";
import { FaBars } from "react-icons/fa";
const Header = ({ setSidebarOpen, sidebarOpen }) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, userInfo, error } = userLogin;

  return (
    <header className="flex justify-between items-center h-24 px-10 text-white">
      {/* <Link href="/">
        <h2 className="text-3xl font-bold">FREELANCIN</h2>
      </Link> */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="outline-none border-0">
        <FaBars size={30} />
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
      {userInfo && (
        <ul className="flex justify-between items-center w-64 ">
          <li>
            <button onClick={() => dispatch(logout())}>Logout</button>
          </li>
          <li>
            <Link href="/projects">Projects</Link>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Header;
