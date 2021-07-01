import {  createContext } from "react";

type ThemeContext = {isDarkMode: boolean; toggleDarkMode: () => void}

export const DarkModeContext = createContext<ThemeContext>(
  {} as ThemeContext
)