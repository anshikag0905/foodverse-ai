import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Sparkles, Moon, Sun, Palette } from 'lucide-react';
import AnimatedLogo from '../common/AnimatedLogo';
import AnimatedGirlFace from '../common/AnimatedGirlFace';
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
        if (isMounted) setServerStatus('demo');
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const getThemeIcon = () => {
    if (theme === 'pink') return '🌸';
    if (theme === 'sky') return '🌤️';
    return '🌙';
  };

  const getThemeTitle = () => {
    if (theme === 'pink') return 'Theme: Cute Pastel Pink (Click to switch)';
    if (theme === 'sky') return 'Theme: Playful Sky Blue (Click to switch)';
    return 'Theme: Friendly Navy Dark (Click to switch)';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-dusk-card/90 backdrop-blur-md border-b-3 border-ink transition-colors duration-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: Brand Animated Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-dusk-surface border-2 border-ink flex items-center justify-center shadow-sticker-sm group-hover:scale-105 group-hover:-rotate-3 transition-transform">
                  <AnimatedLogo size={32} />
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
              <kbd className="px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-dusk-card border border-ink/40 text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Right: Status Dot, Language, Theme, & Anshika Gupta Identity */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Friendly Status Dot */}
              <div
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-dusk-surface border-2 border-ink text-[11px] font-extrabold shadow-sticker-sm"
                title={
                  serverStatus === 'online'
                    ? 'AI Engine Online'
                    : 'Zero-cost local demo mode active'
                }
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    serverStatus === 'online'
                      ? 'bg-mint animate-pulse'
                      : serverStatus === 'demo'
                      ? 'bg-sunny'
                      : 'bg-tomato'
                  }`}
                />
                <span className="text-ink dark:text-dusk-text capitalize">
                  {serverStatus === 'online'
                    ? 'Online'
                    : serverStatus === 'demo'
                    ? 'Demo'
                    : 'Offline'}
                </span>
              </div>

              {/* Language Switcher (EN / हिन्दी) */}
              <LanguageToggle />

              {/* Cute 3-Theme Switcher (Pink -> Sky -> Dark) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="btn-squish flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-ink bg-white dark:bg-dusk-surface text-xs font-display font-black text-ink dark:text-dusk-text shadow-sticker-xs cursor-pointer hover:bg-pink-100 dark:hover:bg-dusk-card"
                title={getThemeTitle()}
                aria-label="Toggle Theme"
              >
                <span className="text-sm">{getThemeIcon()}</span>
                <span className="capitalize hidden lg:inline text-[11px]">{theme}</span>
              </button>

              {/* Verified Creator User Pill (Anshika Gupta with cute avatar) */}
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white dark:bg-dusk-surface border-2 border-ink shadow-sticker-sm hover:border-tomato transition-colors cursor-pointer"
                title="Creator: Anshika Gupta (AIML, LNCT)"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden border border-ink flex items-center justify-center bg-pink-100 flex-shrink-0">
                  <AnimatedGirlFace size={28} />
                </div>
                <div className="hidden md:flex flex-col text-left leading-none">
                  <span className="text-xs font-display font-black text-ink dark:text-dusk-text">
                    Anshika Gupta
                  </span>
                  <span className="text-[9px] font-bold text-tomato">
                    AIML • LNCT
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Global Command Search Palette Modal */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
