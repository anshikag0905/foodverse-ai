import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Utensils, Sparkles, ShieldCheck, Video, Calendar,
  Package, Compass, Lightbulb, Dumbbell, History, Settings, Info
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import LanguageToggle from '../common/LanguageToggle';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav.dashboard'), icon: Sparkles },
    { to: '/food-scan', label: t('nav.food_scan'), icon: Utensils },
    { to: '/freshness', label: t('nav.freshness'), icon: ShieldCheck },
    { to: '/hygiene', label: t('nav.hygiene'), icon: Video },
    { to: '/cooking', label: t('nav.cooking'), icon: Sparkles },
    { to: '/meal-planner', label: t('nav.meal_planner'), icon: Calendar },
    { to: '/pantry', label: t('nav.pantry'), icon: Package },
    { to: '/food-explorer', label: t('nav.food_explorer'), icon: Compass },
    { to: '/did-you-know', label: t('nav.did_you_know'), icon: Lightbulb },
    { to: '/gym', label: t('nav.gym_mode'), icon: Dumbbell, accent: 'gym' },
    { to: '/history', label: t('nav.history'), icon: History },
    { to: '/settings', label: t('nav.settings'), icon: Settings },
    { to: '/about', label: t('nav.about'), icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-rose-100/80 dark:border-slate-800">
      {/* Cute Demo Mode Notice Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white text-xs font-bold px-4 py-1.5 text-center flex items-center justify-center gap-2 shadow-xs">
        <span className="animate-spin">✨</span>
        <span>🌸 FoodVerse AI Multimodal Studio — Zero-Cost Demo Mode Active 🌸</span>
        <span className="animate-bounce">🥑</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-rose-500/25 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 dark:from-rose-400 dark:to-pink-300 bg-clip-text text-transparent">
                FoodVerse
              </span>
              <span className="text-[11px] font-bold ml-1.5 px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900">
                AI Agent ✨
              </span>
            </div>
          </Link>

          {/* Quick Actions (Language + Theme) */}
          <div className="flex items-center gap-2.5">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Horizontal Navigation Bar */}
        <nav className="flex space-x-1.5 overflow-x-auto py-2 scrollbar-none text-xs font-semibold border-t border-rose-100/60 dark:border-slate-800/60">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            const isGym = item.accent === 'gym';

            let activeClass = 'bg-rose-100/80 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 font-extrabold shadow-2xs';
            if (isGym && active) {
              activeClass = 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-extrabold shadow-2xs';
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl whitespace-nowrap transition-all ${
                  active
                    ? activeClass
                    : isGym
                    ? 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-rose-50/60 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  active
                    ? isGym ? 'text-purple-600 dark:text-purple-400' : 'text-rose-600 dark:text-rose-400'
                    : isGym ? 'text-purple-500' : ''
                }`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
