import { useContext, useEffect, useRef, useState } from "react";
import { IconType } from "react-icons/lib";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { DarkModeContext } from "../context/darkModeContext";

type DropdownType = {
  title?: string | React.ReactElement | IconType;
  children: React.ReactChild;
  hoverable?: boolean;
  className?: string;
  showArrow?: boolean;
  width?: string;
  buttonBgColor?: string;
};
const Dropdown = ({
  title,
  children,
  hoverable = true,
  className,
  showArrow = true,
  width,
}: DropdownType) => {
  const { isDarkMode } = useContext(DarkModeContext);

  const [openDropdown, setOpenDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const closeDropDownOnOutsideClick = () => {
    if (ref.current === null) return;
    document.addEventListener("click", (e: any) => {
      if (ref.current && e.target !== null && !ref.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    });
  };

  useEffect(() => {
    closeDropDownOnOutsideClick();
  }, [ref.current]);

  return (
    <div className={`text-white relative`} ref={ref}>
      <button
        onClick={() => setOpenDropdown(!openDropdown)}
        className={`flex ml-3 items-center p-2 z-20 w-auto rounded-md ${
          hoverable ? "hover:bg-gray-400" : ""
        }  transition-all duration-500 ease-in-out ${
          isDarkMode ? "text-white-175" : "black"
        }`}
      >
        <>
          {title}
          {openDropdown ? (
            <RiArrowDropDownLine
              size={20}
              className={`pointer-events-none bg-tranparent ${
                showArrow ? "block" : "hidden"
              }`}
            />
          ) : (
            <RiArrowDropUpLine
              size={20}
              className={`pointer-events-none bg-none ${
                showArrow ? "block" : "hidden"
              }`}
              onClick={() => setOpenDropdown(true)}
            />
          )}
        </>
      </button>
      <div
        className={`${width ? width : "w-40"} ${
          isDarkMode ? "card-color" : "bg-gray-150 text-black"
        } rounded-md shadow-md p-3 mt-2  transition-all ease-in-out duration-500  ${className} ${
          openDropdown ? "absolute right-0 z-30" : "hidden"
        } `}
        style={{ borderBottom: "-165px" }}
        onClick={closeDropDownOnOutsideClick}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
