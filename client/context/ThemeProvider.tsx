import { useEffect } from "react";
import { useState } from "react";
import { DarkModeContext } from "./darkModeContext";

export const ThemeProvider: React.FC = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  useEffect(() => {
    const darkTheme = window.localStorage.getItem("isDarkMode");
    if (!darkTheme || darkTheme === null) {
      window.localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    }
  }, []);
  useEffect(() => {
    const darkTheme = window.localStorage.getItem("isDarkMode");
    if (darkTheme !== null) {
      setIsDarkMode(JSON.parse(darkTheme));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
