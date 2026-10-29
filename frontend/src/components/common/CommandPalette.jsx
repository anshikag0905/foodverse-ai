import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
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
  ArrowRight,
  X,
  LayoutDashboard
} from 'lucide-react';
import { PREDEFINED_FOODS } from '../../data/predefinedFoods';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, category: 'Core' },
    { name: 'Food Recognition & Portion Scanner', path: '/food-scan', icon: Scan, category: 'Core' },
    { name: 'Spoilage & Freshness Detector', path: '/freshness', icon: ShieldAlert, category: 'Core' },
    { name: 'Hygiene Detector & Inspection', path: '/hygiene', icon: Video, category: 'Core' },
    { name: 'Adaptive Meal Planner', path: '/meal-planner', icon: Calendar, category: 'Kitchen' },
    { name: 'Pantry & Expiry Tracker', path: '/pantry', icon: Package, category: 'Kitchen' },
    { name: 'Food Explorer Database', path: '/food-explorer', icon: Compass, category: 'Kitchen' },
    { name: 'Gym Mode & Macro Fuel', path: '/gym', icon: Dumbbell, category: 'Fitness' },
    { name: 'Food Science & Facts', path: '/did-you-know', icon: Lightbulb, category: 'Learn' },
    { name: 'Scan History & Reports', path: '/history', icon: History, category: 'Account' },
    { name: 'Settings & Privacy Preferences', path: '/settings', icon: Settings, category: 'Account' },
    { name: 'About Creator (Anshika Gupta)', path: '/about', icon: Info, category: 'Account' },
  ];

  // Include top predefined foods in search results
  const foodItems = PREDEFINED_FOODS.map((f) => ({
    name: `${f.name} (${f.calories} kcal, ${f.protein_g}g protein)`,
    path: `/food-explorer?q=${encodeURIComponent(f.name)}`,
    icon: Compass,
    category: 'Food Record',
  }));

  const allItems = [...navigationItems, ...foodItems];

  const filteredItems = allItems.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          navigate(filteredItems[selectedIndex].path);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl overflow-hidden">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
          <Search className="w-4 h-4 text-[var(--text-faint)]" strokeWidth={1.5} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search foods, modules, nutrition... (Esc to close)"
            autoFocus
            className="w-full bg-transparent text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[10px] font-mono text-[var(--text-muted)]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[var(--border-color)]">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              No results found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-[var(--bg-card-subtle)] text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-7 h-7 rounded-lg bg-[var(--bg-card-subtle)] flex items-center justify-center shrink-0 border border-[var(--border-color)]">
                      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate">{item.name}</p>
                      <span className="text-[10px] text-[var(--text-muted)]">{item.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-faint)] shrink-0" strokeWidth={1.5} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
