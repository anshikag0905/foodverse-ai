import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('foodverse_theme');
      if (saved && ['blue', 'white', 'black'].includes(saved)) return saved;
      if (saved === 'dark') return 'black';
      if (saved === 'sky' || saved === 'pink') return 'blue';
    } catch (e) {}
    // Default to Sky Blue (Image 5 Target Style)
    return 'blue';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'black') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('foodverse_theme', theme);
    } catch (e) {}
  }, [theme]);

  // Cycle through: Blue -> White -> Black -> Blue
  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'blue') return 'white';
      if (prev === 'white') return 'black';
      return 'blue';
    });
  };

  const setThemeExplicit = (t) => {
    if (['blue', 'white', 'black'].includes(t)) {
      setTheme(t);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeExplicit }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
