import { useState } from 'react'
import {DarkModeContext} from './darkModeContext'


export const ThemeProvider: React.FC  = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  }

  return (
    <DarkModeContext.Provider value={{isDarkMode,toggleDarkMode}} >{children}</DarkModeContext.Provider>
  )
}

