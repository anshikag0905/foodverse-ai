import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Scan,
  ShieldAlert,
  Video,
  Calendar,
  Package,
  Compass,
  Dumbbell,
  Lightbulb,
  Search,
  ArrowRight,
  Plus,
  RotateCcw,
  Clock,
  AlertCircle,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { PREDEFINED_FOODS } from '../data/predefinedFoods';
import ExpiryBadge from '../components/common/ExpiryBadge';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isHindi = i18n.language?.startsWith('hi');

  // Search under hero
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [heroSearchResults, setHeroSearchResults] = useState([]);

  // Live gym macros & today's progress
  const [todayProgress, setTodayProgress] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    targetCalories: 2000,
    targetProtein: 120,
    targetCarbs: 220,
    targetFat: 60,
  });

  const [lastLoggedItem, setLastLoggedItem] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [useSoonPantry, setUseSoonPantry] = useState([]);
  const [didYouKnowFact, setDidYouKnowFact] = useState({
    title: 'Protein Satiety Effect',
    text: 'Protein triggers the release of peptide YY and GLP-1, hormones that signal fullness to your brain and help stabilize blood glucose.'
  });

  // Quick log category filter
  const [activeCategory, setActiveCategory] = useState('All');
  const [quickLogSearch, setQuickLogSearch] = useState('');

  // Module cards configuration (8 items in aligned grid)
  const moduleCards = [
    {
      to: '/food-scan',
      icon: Scan,
      title: isHindi ? 'भोजन पहचान' : 'Food Recognition',
      desc: isHindi
        ? 'थाली में भोजन को पहचानें, मात्रा और पोषण देखें।'
        : 'Detect each item on your plate, portion weights, and macro breakdown.',
    },
    {
      to: '/freshness',
      icon: ShieldAlert,
      title: isHindi ? 'खराबी पहचान' : 'Spoilage Detector',
      desc: isHindi
        ? 'भोजन की ताजगी, खराबी के संकेत और शेल्फ-लाइफ जानें।'
        : 'Inspect freshness, detect spoilage signs, and get safe-use advice.',
    },
    {
      to: '/hygiene',
      icon: Video,
      title: isHindi ? 'रसोई स्वच्छता' : 'Restaurant Hygiene',
      desc: isHindi
        ? 'वीडियो या फोटो से स्वच्छता मानकों की निष्पक्ष जांच।'
        : 'Analyze kitchen video or photos against safety standards with rubrics.',
    },
    {
      to: '/meal-planner',
      icon: Calendar,
      title: isHindi ? 'आहार योजना' : 'Meal Planner',
      desc: isHindi
        ? 'दैनिक और साप्ताहिक संतुलित आहार योजना तैयार करें।'
        : 'Generate balanced daily and weekly meal plans tailored to calorie targets.',
    },
    {
      to: '/pantry',
      icon: Package,
      title: isHindi ? 'रसोई भंडार और समाप्ति' : 'Pantry & Expiry',
      desc: isHindi
        ? 'खाद्य सामग्री ट्रैक करें और समाप्ति से पहले चेतावनी पाएं।'
        : 'Track pantry inventory, receive expiry warnings, and reduce food waste.',
    },
    {
      to: '/food-explorer',
      icon: Compass,
      title: isHindi ? 'खाद्य डेटाबेस' : 'Food Explorer',
      desc: isHindi
        ? '1,000+ भारतीय और वैश्विक खाद्य पदार्थों के पोषण की खोज।'
        : 'Search 1,000+ verified Indian, Japanese, and global nutrition records.',
    },
    {
      to: '/gym',
      icon: Dumbbell,
      title: isHindi ? 'जिम मोड' : 'Gym Mode',
      desc: isHindi
        ? 'उच्च प्रोटीन सूची, मैक्रो ट्रैकिंग और TDEE कैलकुलेटर।'
        : 'Protein leaderboards, macro target tracking, and personal TDEE calculation.',
    },
    {
      to: '/did-you-know',
      icon: Lightbulb,
      title: isHindi ? 'खाद्य विज्ञान' : 'Did You Know?',
      desc: isHindi
        ? 'दैनिक वैज्ञानिक तथ्य और पोषण से जुड़ी सही जानकारी।'
        : 'Evidence-based culinary science, myths busted, and smart nutrition facts.',
    },
  ];

  // Load today's progress from localStorage
  const loadTodayProgress = () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(`foodverse_gym_logs_${todayStr}`);
      const logs = saved ? JSON.parse(saved) : [];

      const calories = logs.reduce((acc, l) => acc + (parseFloat(l.calories) || 0), 0);
      const protein = logs.reduce((acc, l) => acc + (parseFloat(l.protein_g) || 0), 0);
      const carbs = logs.reduce((acc, l) => acc + (parseFloat(l.carbs_g) || 0), 0);
      const fat = logs.reduce((acc, l) => acc + (parseFloat(l.fat_g) || 0), 0);

      setTodayProgress((prev) => ({
        ...prev,
        calories: Math.round(calories),
        protein: Math.round(protein * 10) / 10,
        carbs: Math.round(carbs * 10) / 10,
        fat: Math.round(fat * 10) / 10,
      }));
    } catch (e) {
      console.warn('Could not read today logs:', e);
    }
  };

  // Load initial data
  useEffect(() => {
    loadTodayProgress();

    // Load recent analyses from localStorage
    try {
      const savedAnalyses = localStorage.getItem('foodverse_recent_scans');
      if (savedAnalyses) {
        setRecentAnalyses(JSON.parse(savedAnalyses).slice(0, 4));
      }
    } catch {}

    // Mock/Saved pantry items expiring soon
    try {
      const savedPantry = localStorage.getItem('foodverse_pantry_items');
      if (savedPantry) {
        const parsed = JSON.parse(savedPantry);
        const soon = parsed.filter((item) => {
          if (!item.expiry_date) return false;
          const days = Math.ceil((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
          return days >= 0 && days <= 4;
        });
        setUseSoonPantry(soon.slice(0, 3));
      } else {
        // Default useful items
        setUseSoonPantry([
          { id: 'p1', name: 'Whole Milk', expiry_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], category: 'Dairy' },
          { id: 'p2', name: 'Baby Spinach', expiry_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], category: 'Produce' },
        ]);
      }
    } catch {}
  }, []);

  // Hero live search
  useEffect(() => {
    if (!heroSearchQuery.trim()) {
      setHeroSearchResults([]);
      return;
    }
    const q = heroSearchQuery.toLowerCase().trim();
    const matches = PREDEFINED_FOODS.filter((f) =>
      f.name.toLowerCase().includes(q) ||
      (f.name_hi && f.name_hi.toLowerCase().includes(q)) ||
      (f.gym_tags && f.gym_tags.some((t) => t.toLowerCase().includes(q)))
    ).slice(0, 6);
    setHeroSearchResults(matches);
  }, [heroSearchQuery]);

  // Log food to today's progress
  const logFood = (food) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const key = `foodverse_gym_logs_${todayStr}`;
      const saved = localStorage.getItem(key);
      const logs = saved ? JSON.parse(saved) : [];

      const newEntry = {
        id: `log_${Date.now()}`,
        food_id: food.id,
        food_name: food.name,
        calories: food.calories || 0,
        protein_g: food.protein_g || 0,
        carbs_g: food.carbs_g || 0,
        fat_g: food.fat_g || 0,
        timestamp: new Date().toISOString(),
      };

      logs.push(newEntry);
      localStorage.setItem(key, JSON.stringify(logs));
      setLastLoggedItem(newEntry);
      loadTodayProgress();
    } catch (e) {
      console.error('Error logging food:', e);
    }
  };

  // Undo last logged food
  const undoLastLog = () => {
    if (!lastLoggedItem) return;
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const key = `foodverse_gym_logs_${todayStr}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        let logs = JSON.parse(saved);
        logs = logs.filter((l) => l.id !== lastLoggedItem.id);
        localStorage.setItem(key, JSON.stringify(logs));
        setLastLoggedItem(null);
        loadTodayProgress();
      }
    } catch (e) {
      console.error('Error undoing log:', e);
    }
  };

  // Quick log categories
  const quickLogCategories = ['All', 'Fruits', 'Breads', 'Rice and dals', 'Curries', 'Snacks', 'Drinks'];

  const filteredQuickLogFoods = PREDEFINED_FOODS.filter((item) => {
    if (activeCategory === 'Fruits' && !item.category?.includes('Fruit')) return false;
    if (activeCategory === 'Breads' && !item.category?.includes('Bread') && !item.category?.includes('Roti')) return false;
    if (activeCategory === 'Rice and dals' && !item.category?.includes('Rice') && !item.category?.includes('Dal') && !item.category?.includes('Lentils')) return false;
    if (activeCategory === 'Curries' && !item.category?.includes('Curry') && !item.category?.includes('Sabzi')) return false;
    if (activeCategory === 'Snacks' && !item.category?.includes('Snack')) return false;
    if (activeCategory === 'Drinks' && !item.category?.includes('Drink') && !item.category?.includes('Shake')) return false;

    if (quickLogSearch.trim()) {
      const q = quickLogSearch.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.name_hi && item.name_hi.toLowerCase().includes(q))
      );
    }
    return true;
  }).slice(0, 8);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center pt-4 pb-2 space-y-4">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[var(--text-primary)]">
          {isHindi ? 'भूख लगी है? आपकी थाली में क्या है?' : "Hungry? What's on your plate?"}
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
          {isHindi
            ? 'मल्टीमॉडल भोजन पहचान, रसोई स्वच्छता की जांच और संपूर्ण पोषण विश्लेषण।'
            : 'Multi-item plate recognition, real-time kitchen hygiene monitoring, and verified nutrition intelligence.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/food-scan" className="pill-btn-primary">
            <Scan className="w-4 h-4" strokeWidth={1.5} />
            <span>{isHindi ? 'भोजन स्कैन करें' : 'Scan a meal'}</span>
          </Link>
          <Link to="/food-explorer" className="pill-btn-secondary">
            <Search className="w-4 h-4" strokeWidth={1.5} />
            <span>{isHindi ? 'खाद्य खोजें' : 'Search a food'}</span>
          </Link>
        </div>

        {/* Live Search Box Under Hero */}
        <div className="relative max-w-xl mx-auto pt-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-faint)] absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            <input
              type="text"
              value={heroSearchQuery}
              onChange={(e) => setHeroSearchQuery(e.target.value)}
              placeholder={isHindi ? 'भोजन या पोषण खोजें (उदा. केला, दाल तड़का, पनीर)...' : 'Search food database as you type (e.g. Banana, Dal Tadka, Paneer)...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Search Dropdown Results */}
          {heroSearchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 card-base p-2 shadow-lg z-30 text-left max-h-72 overflow-y-auto">
              {heroSearchResults.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-card-subtle)] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)]">
                        {food.name}
                        {food.name_hi && <span className="ml-1 text-[11px] text-[var(--text-muted)] font-hindi">({food.name_hi})</span>}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {food.serving} • {food.calories} kcal • {food.protein_g}g protein
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logFood(food);
                      setHeroSearchQuery('');
                    }}
                    className="pill-btn-secondary text-[11px] py-1 px-2.5"
                  >
                    <Plus className="w-3 h-3" strokeWidth={1.5} />
                    <span>Log</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Undo Notification Pill */}
      {lastLoggedItem && (
        <div className="flex items-center justify-between max-w-md mx-auto py-2 px-3.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
            <span>Logged <strong>{lastLoggedItem.food_name}</strong></span>
          </div>
          <button
            type="button"
            onClick={undoLastLog}
            className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" strokeWidth={1.5} />
            <span>Undo</span>
          </button>
        </div>
      )}

      {/* 8 Module Cards (Aligned Grid) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
            {isHindi ? 'मॉड्यूल्स' : 'Explore Modules'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {moduleCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.to}
                className="card-base-hover p-4 flex flex-col justify-between h-40"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <Link
                  to={card.to}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-2 mt-auto"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Middle Row: Today's Progress, Use Soon Pantry, and Did You Know */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Progress (Calorie & Macro Rings) */}
        <div className="card-base p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">
              Today's Nutrition
            </h3>
            <Link to="/gym" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Gym Mode
            </Link>
          </div>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-muted)]">Calories</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {todayProgress.calories} / {todayProgress.targetCalories} kcal
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (todayProgress.calories / todayProgress.targetCalories) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-muted)]">Protein</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {todayProgress.protein} / {todayProgress.targetProtein} g
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (todayProgress.protein / todayProgress.targetProtein) * 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2 rounded-lg bg-[var(--bg-card-subtle)]">
                <span className="text-[var(--text-muted)] block text-[11px]">Carbs</span>
                <span className="font-semibold text-[var(--text-primary)]">{todayProgress.carbs}g</span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-card-subtle)]">
                <span className="text-[var(--text-muted)] block text-[11px]">Fats</span>
                <span className="font-semibold text-[var(--text-primary)]">{todayProgress.fat}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* "Use Soon" Pantry List */}
        <div className="card-base p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">
              Use Soon (Pantry)
            </h3>
            <Link to="/pantry" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              View All
            </Link>
          </div>

          {useSoonPantry.length > 0 ? (
            <div className="space-y-2">
              {useSoonPantry.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card-subtle)] text-xs"
                >
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{item.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{item.category}</p>
                  </div>
                  <ExpiryBadge expiryDate={item.expiry_date} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-[var(--text-muted)]">
              No items expiring within 4 days.
            </div>
          )}
        </div>

        {/* Did You Know? Card */}
        <div className="card-base p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
              <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                Did You Know?
              </h3>
            </div>
            <Link to="/did-you-know" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              More Facts
            </Link>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1">
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              {didYouKnowFact.title}
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed">
              {didYouKnowFact.text}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Log Table with Category Chips */}
      <section className="card-base p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-base text-[var(--text-primary)]">
              Quick Nutrition Log
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Log foods in one click to update today's caloric & macronutrient progress.
            </p>
          </div>

          {/* Quick search input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[var(--text-faint)] absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            <input
              type="text"
              value={quickLogSearch}
              onChange={(e) => setQuickLogSearch(e.target.value)}
              placeholder="Filter quick foods..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickLogCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table of Quick Foods */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)]">
                <th className="pb-2 font-medium">Food Name</th>
                <th className="pb-2 font-medium">Serving Size</th>
                <th className="pb-2 font-medium">Calories</th>
                <th className="pb-2 font-medium">Protein</th>
                <th className="pb-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredQuickLogFoods.map((food) => (
                <tr key={food.id} className="hover:bg-[var(--bg-card-subtle)] transition-colors">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="font-medium text-[var(--text-primary)]">{food.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-[var(--text-muted)]">{food.serving}</td>
                  <td className="py-2.5 font-medium text-[var(--text-primary)]">{food.calories} kcal</td>
                  <td className="py-2.5 font-medium text-[var(--text-primary)]">{food.protein_g} g</td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => logFood(food)}
                      className="pill-btn-secondary py-1 px-3 text-xs inline-flex items-center gap-1 hover:border-blue-500 cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                      <span>Log</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Analyses (Clean Text Empty State) */}
      <section className="card-base p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-[var(--text-primary)]">
            Recent Analyses
          </h3>
          <Link to="/history" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
            View History
          </Link>
        </div>

        {recentAnalyses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {recentAnalyses.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] space-y-1">
                <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                  {item.title || 'Food Analysis'}
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {item.date ? new Date(item.date).toLocaleDateString() : 'Recent'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            <p className="text-xs text-[var(--text-muted)]">
              No recent scans yet. Upload a photo or video to analyze your first meal.
            </p>
            <Link to="/food-scan" className="pill-btn-primary text-xs py-1.5 px-3.5 inline-flex items-center gap-1">
              <Scan className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Scan Now</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
