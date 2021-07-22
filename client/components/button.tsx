import React from "react";

export interface ButtonProps {
  children: React.ReactChild;
  type: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  className?: string;
  onClick?: () => void | undefined;
}

const Button = ({
  children,
  type = "button",
  disabled = false,
  className,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`text-white text-xl py-1 px-4 disabled:opacity-50 h-10 ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
