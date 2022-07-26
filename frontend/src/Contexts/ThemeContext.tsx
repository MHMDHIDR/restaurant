import React, { useState, createContext } from 'react'

export const ThemeContext = createContext({})

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(getLocalStorageTheme() ? true : false)

  //get the theme from localStorage
  function getLocalStorageTheme() {
    return localStorage.getItem('theme') === 'dark' ? true : false
  }

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, getLocalStorageTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContextProvider
