import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Sun, Moon, Cloud, Menu } from 'lucide-react';
import AnimatedLogo from '../common/AnimatedLogo';
import AnimatedGirlFace from '../common/AnimatedGirlFace';
import { useTheme } from '../../context/ThemeContext';
import LanguageToggle from '../common/LanguageToggle';
import CommandPalette from '../common/CommandPalette';
import apiClient from '../../services/api';

export default function Header({ onToggleSidebar, isSidebarCollapsed }) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
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

  // Healthcheck status
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

  const themeOptions = [
    { id: 'blue', label: 'Blue', Icon: Cloud },
    { id: 'white', label: 'White', Icon: Sun },
    { id: 'black', label: 'Black', Icon: Moon },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-color)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: Brand Logo + Sidebar Toggle */}
            <div className="flex items-center gap-3">
              {onToggleSidebar && (
                <button
                  type="button"
                  onClick={onToggleSidebar}
                  className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] transition-colors cursor-pointer"
                  title="Toggle sidebar"
                >
                  <Menu className="w-5 h-5" strokeWidth={1.5} />
                </button>
              )}

              <Link to="/" className="flex items-center gap-2.5 group">
                <AnimatedLogo size={30} />
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-bold text-xl tracking-tight text-[var(--text-primary)]">
                    FoodVerse AI
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center justify-between w-64 lg:w-80 px-3.5 py-1.5 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] hover:border-blue-400 hover:text-[var(--text-primary)] transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                <span>Search foods, nutrition, facts...</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px] font-mono text-[var(--text-muted)]">
                Ctrl K
              </kbd>
            </button>

            {/* Right: Status, Language, Theme Switcher & Creator User Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Status Dot */}
              <div
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs font-medium"
                title={serverStatus === 'online' ? 'Backend Online with AI Provider' : 'Demo Mode Active'}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    serverStatus === 'online'
                      ? 'bg-emerald-500'
                      : serverStatus === 'demo'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="text-[var(--text-muted)] text-[11px] capitalize">
                  {serverStatus === 'online' ? 'Online' : serverStatus === 'demo' ? 'Demo' : 'Offline'}
                </span>
              </div>

              {/* Language Switcher */}
              <LanguageToggle />

              {/* 3-Theme Switcher: Blue | White | Black */}
              <div className="flex items-center p-0.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card-subtle)]">
                {themeOptions.map((t) => {
                  const Icon = t.Icon;
                  const isActive = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                      title={`Switch to ${t.label} theme`}
                    >
                      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span className="hidden sm:inline">{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* User Menu / Creator Pill */}
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] hover:border-blue-400 transition-colors"
                title="Creator: Anshika Gupta (AIML, LNCT)"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-[var(--border-color)] flex items-center justify-center shrink-0">
                  <AnimatedGirlFace size={24} />
                </div>
                <div className="hidden md:flex flex-col text-left leading-none">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    Anshika Gupta
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    AIML • LNCT
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Palette */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
