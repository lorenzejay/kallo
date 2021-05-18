import { useEffect, useRef, useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
const Dropdown = ({ title, children, hoverable = true, className, showArrow = true }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const ref = useRef();

  const closeDropDownOnOutsideClick = () => {
    if (ref.current === null) return;
    document.addEventListener("click", (e) => {
      if (!ref.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    });
  };

  useEffect(() => {
    closeDropDownOnOutsideClick();
  }, [ref.current]);

  // const closeDropdown = (e) => {
  //   if (ref.current === e.target) {
  //     setOpenDropdown(false);
  //   }
  // };
  return (
    <div className="text-white relative z-20" ref={ref}>
      <button
        onClick={() => setOpenDropdown(!openDropdown)}
        className={`flex ml-3 items-center p-2 z-10 w-auto ${
          hoverable ? "hover:bg-gray-300 hover:text-black" : ""
        }  transition-all duration-500 ease-in-out ${openDropdown ? "card-color rounded-md" : ""}`}
      >
        {title}
        {openDropdown ? (
          <RiArrowDropDownLine size={20} className={`${showArrow ? "block" : "hidden"}`} />
        ) : (
          <RiArrowDropUpLine size={20} className={`${showArrow ? "block" : "hidden"}`} />
        )}
      </button>
      <div
        className={`card-color rounded-md shadow-md p-2 mt-2 z-30 transition-all ease-in-out duration-500  ${className} ${
          openDropdown ? "absolute " : "hidden"
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
