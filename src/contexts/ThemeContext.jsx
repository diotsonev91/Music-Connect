import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement; // ✅ Apply to <html>, not <body>
    if (darkMode) {
        root.classList.add("dark-theme");
        localStorage.setItem("theme", "dark");
    } else {
        root.classList.remove("dark-theme");
        localStorage.setItem("theme", "light");
    }
}, [darkMode]);


  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
