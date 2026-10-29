import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Scan,
  ShieldAlert,
  Video,
  Calendar,
  Package,
  Compass,
  Lightbulb,
  Dumbbell,
  History,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ isCollapsed, onToggleCollapse }) {
  const { t } = useTranslation();

  const navGroups = [
    {
      group: 'Core',
      items: [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/food-scan', label: 'Food Detection', icon: Scan },
        { to: '/freshness', label: 'Spoilage Detector', icon: ShieldAlert },
        { to: '/hygiene', label: 'Hygiene Detector', icon: Video },
      ],
    },
    {
      group: 'Kitchen',
      items: [
        { to: '/meal-planner', label: 'Meal Planner', icon: Calendar },
        { to: '/pantry', label: 'Pantry & Expiry', icon: Package },
        { to: '/food-explorer', label: 'Food Explorer', icon: Compass },
      ],
    },
    {
      group: 'Fitness',
      items: [
        { to: '/gym', label: 'Gym Mode', icon: Dumbbell },
        { to: '/did-you-know', label: 'Food Science', icon: Lightbulb },
      ],
    },
    {
      group: 'Account',
      items: [
        { to: '/history', label: 'History & Reports', icon: History },
        { to: '/settings', label: 'Settings & Privacy', icon: Settings },
        { to: '/about', label: 'About Creator', icon: Info },
      ],
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 bg-[var(--bg-card)] border-r border-[var(--border-color)] transition-all duration-200 z-30 select-none ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            {!isCollapsed && (
              <span className="px-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)] block">
                {group.group}
              </span>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)]'
                      } ${isCollapsed ? 'justify-center px-0' : ''}`
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    {!isCollapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-[var(--border-color)]">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-2 rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
