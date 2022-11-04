import React, { useContext } from "react";
import PropTypes from "prop-types";
import { DarkModeContext } from "../context/darkModeContext";

interface InputProps {
  placeholder: string;
  type: string;
  name: string;
  value: string | number | readonly string[] | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className: string;
}

const Input = ({ placeholder, type, name, value, onChange, className }: InputProps) => {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <input
      className={`px-5 py-2 rounded-md outline-none border-2  border-gray-400 my-3 bg-transparent placeholder-opacity-75  ${
        isDarkMode ? " text-white placeholder-white" : " placeholder-black text-black"
      } ${className}`}
      placeholder={placeholder}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
    />
  );
};

Input.propTypes = {
  name: PropTypes.string,
};

Input.defaultProps = {
  type: `text`,
};
export default Input;
