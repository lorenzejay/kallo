import { useState } from "react";
const { default: Header } = require("./header");
const { default: Sidebar } = require("./sidebar");

const Layout = ({ children, isSignInOrSignOutPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div>
      <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <Sidebar
        className={isSignInOrSignOutPage === true ? "md:hidden" : "md:block"}
        sidebarOpen={sidebarOpen}
      />
      <div
        className={`px-7 lg:px-16 xl:px-24 ${isSignInOrSignOutPage ? "ml-0" : ""} ${
          sidebarOpen ? "ml-64 lg:px-0" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
