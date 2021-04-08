import { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
const Dropdown = ({ title, children }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  return (
    <div className="text-white relative">
      <button
        onClick={() => setOpenDropdown(!openDropdown)}
        className={`flex items-center ${openDropdown ? "bg-gray-300" : ""}`}
      >
        {title}
        {openDropdown ? <RiArrowDropDownLine size={20} /> : <RiArrowDropUpLine size={20} />}
      </button>
      <div className={`${openDropdown ? "absolute top-8" : "hidden"} bg-gray-300`}>{children}</div>
    </div>
  );
};

export default Dropdown;
