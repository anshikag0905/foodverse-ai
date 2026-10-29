import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Sparkles, Moon, Sun, User as UserIcon } from 'lucide-react';
import { DoodleAvocado } from '../../assets/doodles';
import { useTheme } from '../../context/ThemeContext';
import LanguageToggle from '../common/LanguageToggle';
import CommandPalette from '../common/CommandPalette';
import apiClient from '../../services/api';

export default function Header({ onToggleSidebar, isSidebarCollapsed }) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'online', 'demo', 'offline', 'checking'

  // Global Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Healthcheck status with strict 4s timeout (never gets stuck on connecting!)
  useEffect(() => {
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted && serverStatus === 'checking') {
        setServerStatus('demo');
      }
    }, 4000);

    apiClient.get('/health', { timeout: 3500 })
      .then((res) => {
        if (!isMounted) return;
        if (res?.demo_mode) {
          setServerStatus('demo');
        } else {
          setServerStatus('online');
        }
      })
      .catch(() => {
        if (isMounted) setServerStatus('demo'); // fallback to local demo mode safely
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-card/90 dark:bg-dusk-card/90 backdrop-blur-md border-b-3 border-ink transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: Brand Logo & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-sky-200 dark:bg-dusk-surface border-2 border-ink flex items-center justify-center shadow-sticker-sm group-hover:scale-105 group-hover:-rotate-3 transition-transform">
                  <DoodleAvocado size={28} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-black text-2xl tracking-tight text-ink dark:text-dusk-text">
                    FoodVerse
                  </span>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-sunny text-ink border-1.5 border-ink shadow-xs">
                    AI ✨
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Search Bar Trigger (Ctrl+K) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center justify-between w-64 lg:w-80 px-3.5 py-1.5 rounded-full bg-white dark:bg-dusk-surface border-2 border-ink text-xs font-bold text-ink-muted shadow-sticker-sm hover:border-tomato hover:text-ink transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-tomato" />
                <span>Search foods, recipes, macros...</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded-md bg-sky-100 dark:bg-dusk-card border border-ink/40 text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Right: Status Dot, Language, Theme, & User Identity */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Friendly Status Dot (Zero hanging) */}
              <div
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-dusk-surface border-2 border-ink text-[11px] font-extrabold shadow-sticker-sm"
                title={
                  serverStatus === 'online'
                    ? 'Connected to FastAPI Backend'
                    : 'Zero-Cost Demo Mode (Deterministic AI Active)'
                }
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    serverStatus === 'online'
                      ? 'bg-mint animate-pulse'
                      : serverStatus === 'demo'
                      ? 'bg-sunny'
                      : 'bg-slate-400'
                  }`}
                />
                <span className="text-ink dark:text-dusk-text capitalize">
                  {serverStatus === 'online' ? 'Online' : 'Demo Mode'}
                </span>
              </div>

              {/* Language Switcher */}
              <LanguageToggle />

              {/* Theme Toggle (Sun/Moon) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full bg-white dark:bg-dusk-surface border-2 border-ink flex items-center justify-center text-ink dark:text-dusk-text shadow-sticker-sm btn-squish cursor-pointer"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-sunny" />
                ) : (
                  <Moon className="w-4 h-4 text-grape" />
                )}
              </button>

              {/* Real User Profile Pill (Anshika Gupta) */}
              <Link
                to="/about"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-200 dark:bg-dusk-surface border-2 border-ink text-xs font-display font-extrabold text-ink dark:text-dusk-text shadow-sticker-sm hover:scale-105 transition-transform"
                title="Creator: Anshika Gupta (AIML, LNCT College)"
              >
                <div className="w-5 h-5 rounded-full bg-tomato text-white flex items-center justify-center text-[10px] font-bold">
                  AG
                </div>
                <span className="hidden sm:inline truncate max-w-[100px]">Anshika</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}