import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('foodverse_theme');
    if (saved && ['pink', 'sky', 'dark'].includes(saved)) return saved;
    // Default to cute smooth light pink theme as requested!
    return 'pink';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-pink', 'theme-sky');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'sky') {
      root.classList.add('theme-sky');
    } else {
      root.classList.add('theme-pink');
    }
    localStorage.setItem('foodverse_theme', theme);
  }, [theme]);

  // Cycle through: Pink -> Sky -> Dark -> Pink
  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'pink') return 'sky';
      if (prev === 'sky') return 'dark';
      return 'pink';
    });
  };

  const setThemeExplicit = (t) => {
    if (['pink', 'sky', 'dark'].includes(t)) {
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
