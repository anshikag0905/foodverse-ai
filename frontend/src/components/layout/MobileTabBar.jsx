import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Scan,
  ShieldAlert,
  Video,
  Menu,
  X,
  Calendar,
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
    { to: '/', label: 'Home', icon: LayoutDashboard },
    { to: '/food-scan', label: 'Scan', icon: Scan },
    { to: '/freshness', label: 'Spoilage', icon: ShieldAlert },
    { to: '/hygiene', label: 'Hygiene', icon: Video },
  ];

  const moreItems = [
    { to: '/meal-planner', label: 'Meal Planner', icon: Calendar },
    { to: '/pantry', label: 'Pantry & Expiry', icon: Package },
    { to: '/food-explorer', label: 'Food Explorer Database', icon: Compass },
    { to: '/gym', label: 'Gym Mode & Macros', icon: Dumbbell },
    { to: '/did-you-know', label: 'Food Science & Facts', icon: Lightbulb },
    { to: '/history', label: 'Scan History & Reports', icon: History },
    { to: '/settings', label: 'Settings & Privacy', icon: Settings },
    { to: '/about', label: 'About Creator', icon: Info },
  ];

  return (
    <>
      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-card)]/95 backdrop-blur-md border-t border-[var(--border-color)] px-2 py-1 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.to;

            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.to === '/'}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
                <span className="text-[10px]">{tab.label}</span>
              </NavLink>
            );
          })}

          {/* More Sheet Trigger */}
          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
              isMoreOpen
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Menu className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </nav>

      {/* More Sheet Backdrop & Drawer */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end">
          <div
            className="fixed inset-0"
            onClick={() => setIsMoreOpen(false)}
          />

          <div className="relative bg-[var(--bg-card)] border-t border-[var(--border-color)] rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <span className="font-semibold text-sm text-[var(--text-primary)]">
                More Modules & Settings
              </span>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--bg-card-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMoreOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-subtle)] hover:border-blue-400 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" strokeWidth={1.5} />
                    <span className="text-xs font-medium text-[var(--text-primary)] truncate">
                      {item.label}
                    </span>
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
