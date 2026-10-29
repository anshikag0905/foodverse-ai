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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      {/* Demo Mode Notice Banner */}
      <div className="bg-emerald-600 text-white text-xs font-medium px-4 py-1.5 text-center flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
        <span>{t('common.demo_banner')}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                FoodVerse
              </span>
              <span className="text-xs font-semibold ml-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                AI Agent
              </span>
            </div>
          </Link>

          {/* Quick Actions (Language + Theme) */}
          <div className="flex items-center gap-2.5">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Horizontal Navigation Bar with Gym Mode distinct accent */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none text-xs font-medium border-t border-slate-100 dark:border-slate-800/60">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            const isGym = item.accent === 'gym';

            let activeClass = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold';
            if (isGym && active) {
              activeClass = 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 font-bold';
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  active
                    ? activeClass
                    : isGym
                    ? 'text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/40 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  active
                    ? isGym ? 'text-violet-600 dark:text-violet-400' : 'text-emerald-600 dark:text-emerald-400'
                    : isGym ? 'text-violet-500' : ''
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
