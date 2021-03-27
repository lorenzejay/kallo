import { useState } from "react";
const { default: Header } = require("./header");
const { default: Sidebar } = require("./sidebar");

const Layout = ({ children, isSignInOrSignOutPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div>
      <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <Sidebar
        className={isSignInOrSignOutPage === true ? "md:hidden" : "md:block"}
        sidebarOpen={sidebarOpen}
      />
      <div className={`${isSignInOrSignOutPage ? "ml-0" : ""} ${sidebarOpen ? "ml-0" : "ml-72"}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
