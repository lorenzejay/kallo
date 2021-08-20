import { useContext, useState } from "react";
import { DarkModeContext } from "../context/darkModeContext";
const { default: Header } = require("./header");

type LayoutProps = {
  children: React.ReactChild;
};

const Layout = ({ children }: LayoutProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

      <div
        className={`px-7 lg:px-16 xl:px-32 min-h-screen 
        }  ${isDarkMode ? "darkBody" : "bg-white-175"} `}
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
