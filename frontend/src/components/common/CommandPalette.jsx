import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
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
  ArrowRight,
  X
} from 'lucide-react';
import { ALL_DOODLES } from '../../assets/doodles';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: Sparkles, category: 'Core', color: 'text-tomato' },
    { name: 'Food Recognition & Calories', path: '/food-scan', icon: Utensils, category: 'Core', color: 'text-tomato' },
    { name: 'Freshness & Spoilage Check', path: '/freshness', icon: ShieldCheck, category: 'Core', color: 'text-mint' },
    { name: 'Restaurant Kitchen Hygiene', path: '/hygiene', icon: Video, category: 'Core', color: 'text-teal' },
    { name: 'Smart Cooking Assistant', path: '/cooking', icon: ChefHat, category: 'Kitchen', color: 'text-sunny' },
    { name: 'Personalized Meal Planner', path: '/meal-planner', icon: Calendar, category: 'Kitchen', color: 'text-grape' },
    { name: 'Pantry & Expiry Tracker', path: '/pantry', icon: Package, category: 'Kitchen', color: 'text-peach' },
    { name: 'Food Explorer (FTS5 Database)', path: '/food-explorer', icon: Compass, category: 'Kitchen', color: 'text-teal' },
    { name: 'Gym Mode & Athletic Macros', path: '/gym', icon: Dumbbell, category: 'Fitness', color: 'text-grape' },
    { name: 'Did You Know? (Food Science)', path: '/did-you-know', icon: Lightbulb, category: 'Learn', color: 'text-sunny' },
    { name: 'Scan History & Reports', path: '/history', icon: History, category: 'Account', color: 'text-ink-muted' },
    { name: 'Settings & Privacy Policy', path: '/settings', icon: Settings, category: 'Account', color: 'text-ink-muted' },
    { name: 'About FoodVerse AI (Anshika Gupta)', path: '/about', icon: Info, category: 'Account', color: 'text-tomato' },
  ];

  // Also include food doodles in search
  const foodItems = ALL_DOODLES.map((d) => ({
    name: `${d.name} (${d.cal} kcal, ${d.protein})`,
    path: `/gym?food=${d.id}`,
    icon: d.Component,
    category: 'Quick Food',
    isDoodle: true,
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-ink/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-3xl bg-card dark:bg-dusk-card border-3 border-ink shadow-sticker-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b-2 border-ink bg-white dark:bg-dusk-surface">
          <Search className="w-5 h-5 text-ink-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search food, modules, recipes, or gym staples... (Esc to close)"
            autoFocus
            className="w-full bg-transparent text-sm font-display font-bold text-ink dark:text-dusk-text placeholder:text-ink-muted/60 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-ink-muted hover:text-ink cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-sky-100 dark:bg-dusk-card border border-ink/40 text-[10px] font-mono font-bold text-ink-muted">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-3 divide-y divide-ink/10">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs font-semibold text-ink-muted">
              No matching pages or foods found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-200 dark:bg-dusk-surface border-2 border-ink shadow-sticker-sm text-ink dark:text-dusk-text'
                      : 'text-ink-muted hover:text-ink border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-card dark:bg-dusk-card border border-ink/40 flex items-center justify-center shrink-0">
                      {item.isDoodle ? <Icon size={22} /> : <Icon className={`w-4 h-4 ${item.color}`} />}
                    </div>
                    <div>
                      <strong className="text-xs font-display font-bold block truncate">
                        {item.name}
                      </strong>
                      <span className="text-[10px] text-ink-muted/80 block">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 ${isSelected ? 'opacity-100 translate-x-1' : 'opacity-0'} transition-all`} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-2.5 bg-sky-100/70 dark:bg-dusk-surface border-t-2 border-ink flex items-center justify-between text-[11px] font-bold text-ink-muted">
          <span>Use ↑ ↓ to navigate</span>
          <span>↵ to select</span>
        </div>
      </div>
    </div>
  );
}