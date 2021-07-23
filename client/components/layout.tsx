import { useContext, useState } from "react";
import { DarkModeContext } from "../context/darkModeContext";
const { default: Header } = require("./header");
const { default: Sidebar } = require("./sidebar");

type LayoutProps = {
  children: React.ReactChild;
  isSignInOrSignOutPage?: boolean;
};

const Layout = ({ children, isSignInOrSignOutPage }: LayoutProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <Sidebar
        className={isSignInOrSignOutPage === true ? "md:hidden" : "md:block"}
        sidebarOpen={sidebarOpen}
      />
      <div
        className={`px-7 lg:px-16 xl:px-32 min-h-screen ${
          isSignInOrSignOutPage ? "ml-0" : ""
        }  ${isDarkMode ? "darkBody" : "bg-white-175"} `}
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
