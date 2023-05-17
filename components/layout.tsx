import { useContext } from "react";
import { DarkModeContext } from "../context/darkModeContext";
import Header from "./header";
// const { default: Header } = require("./header");

type LayoutProps = {
  children: JSX.Element;
};

const Layout = ({ children }: LayoutProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Header />

      <div
        className={`px-7 lg:px-16 2xl:px-0 min-h-screen ${
          isDarkMode ? "darkBody" : ""
        } `}
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
