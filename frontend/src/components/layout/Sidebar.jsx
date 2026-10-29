import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  Utensils,
  ShieldCheck,
  Video,
  ChefHat,
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
        { to: '/', label: t('nav.dashboard') || 'Dashboard', icon: Sparkles, accent: 'bg-tomato/15 text-tomato' },
        { to: '/food-scan', label: t('nav.food_scan') || 'Food Scan', icon: Utensils, accent: 'bg-tomato/15 text-tomato' },
        { to: '/freshness', label: t('nav.freshness') || 'Freshness Check', icon: ShieldCheck, accent: 'bg-mint/20 text-emerald-600' },
        { to: '/hygiene', label: t('nav.hygiene') || 'Kitchen Hygiene', icon: Video, accent: 'bg-teal/20 text-teal' },
      ],
    },
    {
      group: 'Kitchen',
      items: [
        { to: '/cooking', label: t('nav.cooking') || 'Cooking Guide', icon: ChefHat, accent: 'bg-sunny/25 text-amber-600' },
        { to: '/meal-planner', label: t('nav.meal_planner') || 'Meal Planner', icon: Calendar, accent: 'bg-grape/20 text-grape' },
        { to: '/pantry', label: t('nav.pantry') || 'Pantry & Expiry', icon: Package, accent: 'bg-peach/25 text-orange-600' },
        { to: '/food-explorer', label: t('nav.food_explorer') || 'Food Explorer', icon: Compass, accent: 'bg-teal/20 text-teal' },
      ],
    },
    {
      group: 'Fitness & Fun',
      items: [
        { to: '/gym', label: t('nav.gym_mode') || 'Gym Mode', icon: Dumbbell, accent: 'bg-grape/25 text-purple-600', badge: 'PRO' },
        { to: '/did-you-know', label: t('nav.did_you_know') || 'Food Science', icon: Lightbulb, accent: 'bg-sunny/20 text-amber-600' },
      ],
    },
    {
      group: 'Account',
      items: [
        { to: '/history', label: t('nav.history') || 'History & Reports', icon: History, accent: 'bg-slate-200 text-ink' },
        { to: '/settings', label: t('nav.settings') || 'Settings & Privacy', icon: Settings, accent: 'bg-slate-200 text-ink' },
        { to: '/about', label: t('nav.about') || 'About Creator', icon: Info, accent: 'bg-tomato/15 text-tomato' },
      ],
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 bg-card dark:bg-dusk-card border-r-3 border-ink transition-all duration-200 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            {!isCollapsed && (
              <span className="px-3 text-[10px] font-display font-extrabold uppercase tracking-wider text-ink-muted/80 dark:text-dusk-muted block">
                {group.group}
              </span>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-display font-bold transition-all btn-squish cursor-pointer ${
                        isActive
                          ? 'bg-sky-200 dark:bg-dusk-surface border-2 border-ink shadow-sticker-sm text-ink dark:text-dusk-text'
                          : 'text-ink-muted dark:text-dusk-muted hover:text-ink hover:bg-sky-100/60 dark:hover:bg-dusk-surface/60 border-2 border-transparent'
                      } ${isCollapsed ? 'justify-center px-0' : ''}`
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border border-ink/30 ${item.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {!isCollapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span className="px-1.5 py-0.5 rounded-md bg-grape text-white text-[9px] font-extrabold border border-ink">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Collapse / Expand Toggle Foot */}
      <div className="p-3 border-t-2 border-ink/20 flex items-center justify-between">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="w-full py-2 px-3 rounded-2xl bg-sky-100 dark:bg-dusk-surface border-2 border-ink text-ink dark:text-dusk-text text-xs font-display font-extrabold shadow-sticker-sm btn-squish flex items-center justify-center gap-2 cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}