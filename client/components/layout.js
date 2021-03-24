import { useState } from "react";
const { default: Header } = require("./header");
const { default: Sidebar } = require("./sidebar");

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="md:ml-72">{children}</div>
    </div>
  );
};

export default Layout;
