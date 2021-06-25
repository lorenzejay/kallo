import { useEffect, useState } from "react";
import { DarkModeContext } from "./darkModeContext";

const ThemeContext = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("isDarkMode", JSON.stringify(!isDarkMode));
  };
  // useEffect(() => {
  //   //set local storage if there is none
  //   const currentTheme = JSON.parse(localStorage.getItem("isDarkMode"));
  //   if (currentTheme === null) {
  //     return localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  //   }
  //   setIsDarkMode(currentTheme);
  // }, []);
  const currentTheme = JSON.parse(localStorage.getItem("isDarkMode"));
  if (currentTheme === null) {
    return localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }
  const darkModeActive = currentTheme;
  cons;

  return (
    <DarkModeContext.Provider value={{ darkModeActive, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default ThemeContext;
