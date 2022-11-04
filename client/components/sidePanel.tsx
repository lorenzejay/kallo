import React from "react";

const SidePanel = ({ children }: { children: React.ReactElement[] }) => {
  return (
    <section className="z-10 absolute right-0 lg:right-16 top-32 p-2 text-white card-color w-48 h-auto rounded-md ">
      {children}
    </section>
  );
};

export default SidePanel;
