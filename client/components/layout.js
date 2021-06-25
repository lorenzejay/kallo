import { useContext, useState } from "react";
import { DarkModeContext } from "../context/darkModeContext";
const { default: Header } = require("./header");
const { default: Sidebar } = require("./sidebar");

const Layout = ({ children, isSignInOrSignOutPage }) => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <Sidebar
        className={isSignInOrSignOutPage === true ? "md:hidden" : "md:block"}
        sidebarOpen={sidebarOpen}
      />
      <div
        className={`px-7 lg:px-16 xl:px-24 2xl:min-h-screen ${
          isSignInOrSignOutPage ? "ml-0" : ""
        }  `}
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
