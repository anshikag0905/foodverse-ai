import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Utensils,
  ChefHat,
  Calendar,
  Menu,
  X,
  ShieldCheck,
  Video,
  Package,
  Compass,
  Lightbulb,
  Dumbbell,
  History,
  Settings,
  Info
} from 'lucide-react';

export default function MobileTabBar() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();

  const mainTabs = [
    { to: '/', label: 'Home', icon: Sparkles },
    { to: '/food-scan', label: 'Scan', icon: Utensils },
    { to: '/cooking', label: 'Cook', icon: ChefHat },
    { to: '/meal-planner', label: 'Plan', icon: Calendar },
  ];

  const moreItems = [
    { to: '/freshness', label: 'Freshness Check', icon: ShieldCheck, color: 'text-mint' },
    { to: '/hygiene', label: 'Kitchen Hygiene', icon: Video, color: 'text-teal' },
    { to: '/pantry', label: 'Pantry & Expiry Tracker', icon: Package, color: 'text-peach' },
    { to: '/gym', label: 'Gym Mode & Macros', icon: Dumbbell, color: 'text-grape' },
    { to: '/food-explorer', label: 'Food Explorer Database', icon: Compass, color: 'text-teal' },
    { to: '/did-you-know', label: 'Food Science & Facts', icon: Lightbulb, color: 'text-sunny' },
    { to: '/history', label: 'Scan History & Reports', icon: History, color: 'text-ink-muted' },
    { to: '/settings', label: 'Settings & Privacy Policy', icon: Settings, color: 'text-ink-muted' },
    { to: '/about', label: 'About Creator (Anshika Gupta)', icon: Info, color: 'text-tomato' },
  ];

  return (
    <>
      {/* Fixed Bottom Tab Bar on Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 dark:bg-dusk-card/95 backdrop-blur-md border-t-3 border-ink px-2 py-1.5 shadow-sticker-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.to;

            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.to === '/'}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all btn-squish ${
                  isActive
                    ? 'bg-sky-200 dark:bg-dusk-surface border-2 border-ink shadow-sticker-sm text-ink dark:text-dusk-text'
                    : 'text-ink-muted dark:text-dusk-muted border-2 border-transparent'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-display font-extrabold">{tab.label}</span>
              </NavLink>
            );
          })}

          {/* More Sheet Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all btn-squish cursor-pointer ${
              isMoreOpen
                ? 'bg-sky-200 dark:bg-dusk-surface border-2 border-ink shadow-sticker-sm text-ink dark:text-dusk-text'
                : 'text-ink-muted dark:text-dusk-muted border-2 border-transparent'
            }`}
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-display font-extrabold">More</span>
          </button>
        </div>
      </nav>

      {/* "More" Slide-Up Bottom Drawer Modal */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full bg-card dark:bg-dusk-card border-t-3 border-ink rounded-t-3xl shadow-sticker-lg p-5 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 space-y-4"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-2 border-b-2 border-ink/20">
              <div>
                <h3 className="font-display font-extrabold text-base text-ink dark:text-dusk-text">
                  All FoodVerse AI Consoles
                </h3>
                <span className="text-xs text-ink-muted dark:text-dusk-muted">Select an intelligence module</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="w-8 h-8 rounded-full bg-sky-100 dark:bg-dusk-surface border-2 border-ink flex items-center justify-center text-ink dark:text-dusk-text font-bold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of More Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-2xl text-xs font-display font-bold border-2 transition-all btn-squish cursor-pointer ${
                      isActive
                        ? 'bg-sky-200 dark:bg-dusk-surface border-ink shadow-sticker-sm text-ink dark:text-dusk-text'
                        : 'bg-white dark:bg-dusk-surface border-ink/40 text-ink dark:text-dusk-text hover:border-ink shadow-xs'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-dusk-card border border-ink flex items-center justify-center shrink-0">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <span className="truncate flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}