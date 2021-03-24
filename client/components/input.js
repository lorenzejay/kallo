import React from "react";
import PropTypes from "prop-types";
const Input = ({ placeholder, type, name, value, onChange, className }) => {
  return (
    <input
      className={`px-5 py-2 rounded outline-none border my-3 ${className}`}
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
