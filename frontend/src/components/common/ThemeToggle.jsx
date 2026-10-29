import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle Theme"
      className={`p-2 rounded-xl transition-all duration-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-90 duration-300" />
      )}
    </button>
  );
}
