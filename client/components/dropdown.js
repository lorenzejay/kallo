import { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
const Dropdown = ({ title, children, hoverable = true, className }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  return (
    <div className="text-white relative z-10">
      <button
        onClick={() => setOpenDropdown(!openDropdown)}
        className={`flex ml-3 items-center p-2  w-auto ${
          hoverable ? "hover:bg-gray-300 hover:text-black" : ""
        }  transition-all duration-500 ease-in-out ${openDropdown ? "card-color rounded-md" : ""}`}
      >
        {title}
        {openDropdown ? <RiArrowDropDownLine size={20} /> : <RiArrowDropUpLine size={20} />}
      </button>
      <div
        className={`card-color rounded-md shadow-md p-2 mt-2 z-10 transition-all ease-in-out duration-500 ${
          openDropdown ? "absolute " : "hidden"
        } ${className}`}
        style={{ borderBottom: "-165px" }}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
