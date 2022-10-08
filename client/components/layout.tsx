import { useContext, useState } from "react";
import { DarkModeContext } from "../context/darkModeContext";
import Header from './header'
// const { default: Header } = require("./header");

type LayoutProps = {
  children: JSX.Element;
};

const Layout = ({ children }: LayoutProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Header  />

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
