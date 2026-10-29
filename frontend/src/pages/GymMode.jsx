import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Dumbbell,
  Flame,
  Droplets,
  Scale,
  Award,
  Zap,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  Calendar,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Search,
  Sparkles,
  Heart,
  ChevronRight,
  Minus
} from 'lucide-react';
import ProgressRing from '../components/common/ProgressRing';
import Loader from '../components/common/Loader';
import { PREDEFINED_FOODS, searchPredefinedFoods } from '../data/predefinedFoods';

// Local storage helpers for guaranteed offline persistence
const getLocalLogs = (date) => {
  try {
    const raw = localStorage.getItem(`foodverse_gym_logs_${date}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalLog = (date, log) => {
  try {
    const existing = getLocalLogs(date);
    const updated = [log, ...existing];
    localStorage.setItem(`foodverse_gym_logs_${date}`, JSON.stringify(updated));
    return updated;
  } catch {
    return [log];
  }
};

const deleteLocalLog = (date, id) => {
  try {
    const existing = getLocalLogs(date);
    const updated = existing.filter(l => l.id !== id);
    localStorage.setItem(`foodverse_gym_logs_${date}`, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export default function GymMode() {
  const [activeTab, setActiveTab] = useState('tracker'); // 'tracker', 'calculator', 'protein-foods', 'supplements'
  const [profile, setProfile] = useState(null);
  const [adherence, setAdherence] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  // Predefined Food Autocomplete & Stepper State
  const [searchQuery, setSearchQuery] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [selectedFoodPreset, setSelectedFoodPreset] = useState(null);
  const [portionMultiplier, setPortionMultiplier] = useState(1);

  // New Log State
  const [newLog, setNewLog] = useState({
    meal_type: 'snack',
    meal_name: '',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fat_g: '',
    water_ml: '',
  });

  // Calculator Form State
  const [calcForm, setCalcForm] = useState({
    age: 25,
    sex: 'male',
    height_cm: 175,
    weight_kg: 70,
    activity_level: 'moderate',
    training_days_per_week: 4,
    goal: 'maintain',
    diet_type: 'omnivore',
    allergies: []
  });

  // High Protein Foods State
  const [proteinFoods, setProteinFoods] = useState([]);
  const [dietFilter, setDietFilter] = useState('all');
  const [sortBy, setSortBy] = useState('protein_per_100g');
  const [loadingFoods, setLoadingFoods] = useState(false);
  const [leaderboardSearch, setLeaderboardSearch] = useState('');

  // Strictly sorted High-Protein Leaderboard with fallback & filtering
  const displayedFoods = useMemo(() => {
    let list = [];
    if (proteinFoods && proteinFoods.length > 0) {
      list = proteinFoods.map(f => ({
        id: String(f.id),
        name: f.name,
        category: f.category,
        protein_g: f.protein_per_100g,
        calories: f.calories_per_100g,
        diet_tags: f.diet_tags || [],
        efficiency: f.protein_per_calorie || (f.protein_per_100g / (f.calories_per_100g || 1)) * 100,
      }));
    } else {
      list = PREDEFINED_FOODS.map(f => ({
        id: f.id,
        name: f.name,
        category: f.category,
        protein_g: f.protein_g,
        calories: f.calories,
        diet_tags: f.gym_tags || [],
        efficiency: (f.protein_g / (f.calories || 1)) * 100,
      }));
    }

    // Filter by diet
    if (dietFilter === 'veg') {
      list = list.filter(f => {
        const cat = (f.category || '').toLowerCase();
        const tags = (f.diet_tags || []).map(t => String(t).toLowerCase());
        const nm = f.name.toLowerCase();
        return !nm.includes('chicken') && !nm.includes('fish') && !nm.includes('salmon') && !nm.includes('meat') && !nm.includes('beef');
      });
    } else if (dietFilter === 'vegan') {
      list = list.filter(f => {
        const nm = f.name.toLowerCase();
        return !nm.includes('chicken') && !nm.includes('fish') && !nm.includes('egg') && !nm.includes('paneer') && !nm.includes('whey') && !nm.includes('yogurt') && !nm.includes('milk');
      });
    }

    // Filter by user search query
    if (leaderboardSearch.trim()) {
      const q = leaderboardSearch.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q) || (f.category && f.category.toLowerCase().includes(q)));
    }

    // Sort strictly descending by protein per 100g or efficiency
    if (sortBy === 'efficiency') {
      list.sort((a, b) => (b.efficiency || 0) - (a.efficiency || 0));
    } else {
      list.sort((a, b) => (b.protein_g || 0) - (a.protein_g || 0));
    }

    return list;
  }, [proteinFoods, dietFilter, sortBy, leaderboardSearch]);

  useEffect(() => {
    fetchProfile();
    fetchAdherence(selectedDate);
  }, []);

  useEffect(() => {
    fetchAdherence(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (activeTab === 'protein-foods') {
      fetchProteinFoods();
    }
  }, [activeTab, dietFilter, sortBy]);

  // Autocomplete search listener
  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      const matches = searchPredefinedFoods(searchQuery);
      setAutocompleteResults(matches);
    } else {
      setAutocompleteResults([]);
    }
  }, [searchQuery]);

  const fetchProfile = async () => {
    // 1. Try local storage first
    const saved = localStorage.getItem('foodverse_gym_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        setCalcForm(prev => ({ ...prev, ...parsed }));
      } catch (e) {}
    }
    try {
      const res = await axios.get('/api/v1/gym/profile');
      if (res.data) {
        setProfile(res.data);
        setCalcForm(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.warn('Backend gym profile fetch failed, using local profile');
    }
  };

  const fetchAdherence = async (date) => {
    setLoading(true);
    const localLogs = getLocalLogs(date);
    try {
      const res = await axios.get('/api/v1/gym/adherence', { params: { date } });
      const apiData = res.data;
      
      const mergedLogs = [...(apiData.logs || [])];
      for (const loc of localLogs) {
        if (!mergedLogs.some(m => m.id === loc.id || (m.meal_name === loc.meal_name && Math.abs(m.calories - loc.calories) < 0.1))) {
          mergedLogs.unshift(loc);
        }
      }

      const actCal = mergedLogs.reduce((acc, l) => acc + (parseFloat(l.calories) || 0), 0);
      const actProt = mergedLogs.reduce((acc, l) => acc + (parseFloat(l.protein_g) || 0), 0);
      const actCarb = mergedLogs.reduce((acc, l) => acc + (parseFloat(l.carbs_g) || 0), 0);
      const actFat = mergedLogs.reduce((acc, l) => acc + (parseFloat(l.fat_g) || 0), 0);
      const actWater = mergedLogs.reduce((acc, l) => acc + (parseFloat(l.water_ml) || 0), 0);
      const targetCal = apiData.target_calories || profile?.target_calories || 2300;
      const targetProt = apiData.target_protein || profile?.target_protein_g || 140;
      const targetWater = apiData.target_water || profile?.target_water_ml || 3000;

      setAdherence({
        date,
        target_calories: targetCal,
        actual_calories: Math.round(actCal * 10) / 10,
        target_protein: targetProt,
        actual_protein: Math.round(actProt * 10) / 10,
        target_carbs: apiData.target_carbs || profile?.target_carbs_g || 260,
        actual_carbs: Math.round(actCarb * 10) / 10,
        target_fat: apiData.target_fat || profile?.target_fat_g || 70,
        actual_fat: Math.round(actFat * 10) / 10,
        target_water: targetWater,
        actual_water: Math.round(actWater),
        calorie_adherence_pct: Math.min(100, Math.round((actCal / targetCal) * 100)),
        protein_adherence_pct: Math.min(100, Math.round((actProt / targetProt) * 100)),
        water_adherence_pct: Math.min(100, Math.round((actWater / targetWater) * 100)),
        logs: mergedLogs
      });
    } catch (err) {
      console.warn('Using local persistent storage for date:', date);
      const actCal = localLogs.reduce((acc, l) => acc + (parseFloat(l.calories) || 0), 0);
      const actProt = localLogs.reduce((acc, l) => acc + (parseFloat(l.protein_g) || 0), 0);
      const actCarb = localLogs.reduce((acc, l) => acc + (parseFloat(l.carbs_g) || 0), 0);
      const actFat = localLogs.reduce((acc, l) => acc + (parseFloat(l.fat_g) || 0), 0);
      const actWater = localLogs.reduce((acc, l) => acc + (parseFloat(l.water_ml) || 0), 0);
      const targetCal = profile?.target_calories || 2300;
      const targetProt = profile?.target_protein_g || 140;
      const targetWater = profile?.target_water_ml || 3000;

      setAdherence({
        date,
        target_calories: targetCal,
        actual_calories: Math.round(actCal * 10) / 10,
        target_protein: targetProt,
        actual_protein: Math.round(actProt * 10) / 10,
        target_carbs: profile?.target_carbs_g || 260,
        actual_carbs: Math.round(actCarb * 10) / 10,
        target_fat: profile?.target_fat_g || 70,
        actual_fat: Math.round(actFat * 10) / 10,
        target_water: targetWater,
        actual_water: Math.round(actWater),
        calorie_adherence_pct: Math.min(100, Math.round((actCal / targetCal) * 100)),
        protein_adherence_pct: Math.min(100, Math.round((actProt / targetProt) * 100)),
        water_adherence_pct: Math.min(100, Math.round((actWater / targetWater) * 100)),
        logs: localLogs
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProteinFoods = async () => {
    setLoadingFoods(true);
    try {
      const params = {
        sort_by: sortBy,
        limit: 40
      };
      if (dietFilter !== 'all') params.diet_type = dietFilter;
      const res = await axios.get('/api/v1/gym/protein-foods', { params });
      setProteinFoods(res.data);
    } catch (err) {
      console.warn('API protein foods query fallback:', err);
    } finally {
      setLoadingFoods(false);
    }
  };

  // Select a predefined food item (e.g. Banana)
  const handleSelectPresetFood = (item, multiplier = 1) => {
    setSelectedFoodPreset(item);
    setPortionMultiplier(multiplier);
    setSearchQuery(item.name);
    setAutocompleteResults([]);

    const cal = Math.round(item.calories * multiplier * 10) / 10;
    const prot = Math.round(item.protein_g * multiplier * 10) / 10;
    const carb = Math.round(item.carbs_g * multiplier * 10) / 10;
    const fat = Math.round(item.fat_g * multiplier * 10) / 10;

    setNewLog({
      meal_type: item.gym_tags?.includes('pre-workout') ? 'snack' : 'lunch',
      meal_name: `${item.name} (${multiplier}x)`,
      calories: cal.toString(),
      protein_g: prot.toString(),
      carbs_g: carb.toString(),
      fat_g: fat.toString(),
      water_ml: '0'
    });
  };

  const handleChangeMultiplier = (delta) => {
    if (!selectedFoodPreset) return;
    const next = Math.max(0.5, Math.min(10, portionMultiplier + delta * 0.5));
    handleSelectPresetFood(selectedFoodPreset, next);
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!newLog.meal_name.trim()) return;

    const payload = {
      id: `gym_log_${Date.now()}`,
      log_date: selectedDate,
      meal_type: newLog.meal_type,
      meal_name: newLog.meal_name,
      calories: parseFloat(newLog.calories) || 0,
      protein_g: parseFloat(newLog.protein_g) || 0,
      carbs_g: parseFloat(newLog.carbs_g) || 0,
      fat_g: parseFloat(newLog.fat_g) || 0,
      water_ml: parseFloat(newLog.water_ml) || 0,
      created_at: new Date().toISOString()
    };

    // 1. Save to local storage for offline guarantee
    saveLocalLog(selectedDate, payload);

    // 2. Show celebratory feedback
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);

    // 3. Reset form
    setNewLog({
      meal_type: 'snack',
      meal_name: '',
      calories: '',
      protein_g: '',
      carbs_g: '',
      fat_g: '',
      water_ml: '',
    });
    setSelectedFoodPreset(null);
    setSearchQuery('');
    setPortionMultiplier(1);

    // 4. Update view immediately
    fetchAdherence(selectedDate);

    // 5. Post to backend if available
    try {
      await axios.post('/api/v1/gym/log', payload);
    } catch (err) {
      console.warn('Backend sync deferred; data safely saved locally:', err);
    }
  };

  const handleDeleteLog = async (id) => {
    deleteLocalLog(selectedDate, id);
    fetchAdherence(selectedDate);
    try {
      await axios.delete(`/api/v1/gym/log/${id}`);
    } catch (err) {
      console.warn('API delete handled locally:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Deterministic Mifflin-St Jeor calculation based on weight, height, age, sex, activity, and goal
    const age = parseInt(calcForm.age) || 25;
    const weight = parseFloat(calcForm.weight_kg) || 70;
    const height = parseFloat(calcForm.height_cm) || 175;
    const sex = calcForm.sex || 'male';
    const goal = calcForm.goal || 'maintain';

    const bmr = sex === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    const factor = activityFactors[calcForm.activity_level] || 1.55;
    const tdee = Math.round(bmr * factor);

    let targetCalories = tdee;
    if (goal === 'cut' || goal === 'fat_loss') targetCalories = Math.round(tdee - 500);
    else if (goal === 'bulk' || goal === 'muscle_gain') targetCalories = Math.round(tdee + 350);
    else if (goal === 'recomp') targetCalories = Math.round(tdee - 200);

    const proteinMultiplier = (goal === 'cut' || goal === 'fat_loss') ? 2.2 : 2.0;
    const targetProtein = Math.round(weight * proteinMultiplier);
    const targetFat = Math.round(weight * 0.9);
    const targetCarbs = Math.max(50, Math.round((targetCalories - (targetProtein * 4 + targetFat * 9)) / 4));
    const targetWater = Math.round(weight * 35);

    const calculatedProfile = {
      ...calcForm,
      bmr: Math.round(bmr),
      tdee: tdee,
      target_calories: targetCalories,
      target_protein_g: targetProtein,
      target_carbs_g: targetCarbs,
      target_fat_g: targetFat,
      target_water_ml: targetWater
    };

    // Save locally
    localStorage.setItem('foodverse_gym_profile', JSON.stringify(calculatedProfile));
    setProfile(calculatedProfile);
    fetchAdherence(selectedDate);

    try {
      await axios.put('/api/v1/gym/profile', calculatedProfile);
    } catch (err) {
      console.warn('Profile updated and saved locally');
    }

    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const handleSeedDemo = async () => {
    try {
      await axios.post('/api/v1/gym/seed-demo');
      fetchAdherence(selectedDate);
    } catch (err) {
      console.warn('Seeding sample items locally');
      saveLocalLog(selectedDate, {
        id: Date.now() + 1,
        log_date: selectedDate,
        meal_type: 'breakfast',
        meal_name: 'Rolled Oats Bowl with Whey',
        calories: 310,
        protein_g: 30.5,
        carbs_g: 37,
        fat_g: 4.7,
        water_ml: 0,
        created_at: new Date().toISOString()
      });
      saveLocalLog(selectedDate, {
        id: Date.now() + 2,
        log_date: selectedDate,
        meal_type: 'snack',
        meal_name: 'Banana (1 medium)',
        calories: 105,
        protein_g: 1.3,
        carbs_g: 27,
        fat_g: 0.3,
        water_ml: 0,
        created_at: new Date().toISOString()
      });
      fetchAdherence(selectedDate);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Module Header */}
      <div className="card-base p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
            <Dumbbell className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
              Gym Mode & Macro Fuel
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Personalized macro targets, BMR/TDEE calculation, and verified high-protein food rankings.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSeedDemo}
          className="pill-btn-secondary text-xs py-1.5 px-3.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
          <span>Quick Sample Logs</span>
        </button>
      </div>

      {/* Celebratory Alert Banner */}
      {showCelebration && (
        <div className="card-base p-4 border-l-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
            <div>
              <p className="font-semibold">Meal Saved & Macros Updated</p>
              <p className="text-[11px] text-[var(--text-muted)]">Your daily calorie and protein totals are persistently recorded.</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-white dark:bg-neutral-800 border border-[var(--border-color)]">Logged</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`btn-squish flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
            activeTab === 'tracker'
              ? 'bg-grape text-white shadow-sticker-xs'
              : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-grape/10'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Daily Macro Tracker</span>
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`btn-squish flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
            activeTab === 'calculator'
              ? 'bg-grape text-white shadow-sticker-xs'
              : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-grape/10'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>BMR & TDEE Calculator</span>
        </button>
        <button
          onClick={() => setActiveTab('protein-foods')}
          className={`btn-squish flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
            activeTab === 'protein-foods'
              ? 'bg-grape text-white shadow-sticker-xs'
              : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-grape/10'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>High-Protein Leaderboard</span>
        </button>
        <button
          onClick={() => setActiveTab('supplements')}
          className={`btn-squish flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
            activeTab === 'supplements'
              ? 'bg-grape text-white shadow-sticker-xs'
              : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-grape/10'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Supplements Guide</span>
        </button>
      </div>

      {/* TAB 1: DAILY MACRO TRACKER */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Progress Rings Card */}
          <div className="rounded-3xl border-3 border-ink bg-white dark:bg-dusk-card p-6 shadow-sticker">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display font-black text-xl text-ink dark:text-dusk-text flex items-center gap-2">
                  <span>Daily Fuel Adherence</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-grape/20 text-grape border border-ink font-black">
                    Target: {adherence?.target_calories || 2300} kcal
                  </span>
                </h3>
                <p className="text-xs font-semibold text-ink-muted mt-0.5">
                  Live calorie & macronutrient progress rings for selected date.
                </p>
              </div>

              {/* Date Selector */}
              <div className="flex items-center gap-2 bg-sky-50 dark:bg-dusk-surface px-3 py-1.5 rounded-2xl border-2 border-ink shadow-sticker-xs">
                <Calendar className="w-4 h-4 text-grape" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-xs font-black text-ink dark:text-dusk-text focus:outline-none"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <Loader message="Loading athletic logs..." />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
                <ProgressRing
                  label="Calories"
                  current={adherence?.actual_calories || 0}
                  target={adherence?.target_calories || 2300}
                  unit=" kcal"
                  color="#FF5A5F"
                />
                <ProgressRing
                  label="Protein"
                  current={adherence?.actual_protein || 0}
                  target={adherence?.target_protein || 140}
                  unit="g"
                  color="#8B5CF6"
                />
                <ProgressRing
                  label="Carbohydrates"
                  current={adherence?.actual_carbs || 0}
                  target={adherence?.target_carbs || 260}
                  unit="g"
                  color="#FFC93C"
                />
                <ProgressRing
                  label="Water"
                  current={adherence?.actual_water || 0}
                  target={adherence?.target_water || 3000}
                  unit=" ml"
                  color="#3DDC97"
                />
              </div>
            )}
          </div>

          {/* Quick-Tap Preset Food Pills Carousel */}
          <div className="space-y-2">
            <span className="text-xs font-black text-ink-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sunny" />
              <span>Quick-Tap Gym Presets:</span>
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => handleSelectPresetFood(PREDEFINED_FOODS[0])}
                className="pill-btn-secondary text-xs py-1 px-3 whitespace-nowrap cursor-pointer hover:border-blue-500"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Banana (105 kcal)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectPresetFood(PREDEFINED_FOODS[5])}
                className="pill-btn-secondary text-xs py-1 px-3 whitespace-nowrap cursor-pointer hover:border-blue-500"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                <span>2 Boiled Eggs (148 kcal)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectPresetFood(PREDEFINED_FOODS[8])}
                className="pill-btn-secondary text-xs py-1 px-3 whitespace-nowrap cursor-pointer hover:border-blue-500"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>1 Scoop Whey (120 kcal)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectPresetFood(PREDEFINED_FOODS[6])}
                className="pill-btn-secondary text-xs py-1 px-3 whitespace-nowrap cursor-pointer hover:border-blue-500"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Chicken 100g (165 kcal)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectPresetFood(PREDEFINED_FOODS[10])}
                className="pill-btn-secondary text-xs py-1 px-3 whitespace-nowrap cursor-pointer hover:border-blue-500"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Paneer 100g (265 kcal)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectPresetFood(PREDEFINED_FOODS[12])}
                className="pill-btn-secondary text-xs py-1 px-3 whitespace-nowrap cursor-pointer hover:border-blue-500"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Oats Bowl (190 kcal)</span>
              </button>
              <button
                type="button"
                onClick={() => setNewLog(prev => ({ ...prev, meal_type: 'water', meal_name: '500ml Water Bottle', water_ml: '500', calories: '0', protein_g: '0', carbs_g: '0', fat_g: '0' }))}
                className="pill-btn-secondary text-xs py-1 px-3 whitespace-nowrap cursor-pointer text-blue-600 dark:text-blue-400 hover:border-blue-500"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>+500ml Water</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Log Form with Autocomplete */}
            <div className="bg-white dark:bg-dusk-card rounded-3xl border-3 border-ink p-6 shadow-sticker space-y-4">
              <h3 className="font-display font-black text-lg text-ink dark:text-dusk-text flex items-center gap-2">
                <Plus className="w-5 h-5 text-grape" />
                <span>Log Meal or Snack</span>
              </h3>

              {/* SEARCH PREDEFINED ITEM (e.g. "banana") */}
              <div className="relative">
                <label className="block text-xs font-black text-ink dark:text-dusk-text mb-1">
                  Search Food Item (Auto-fills Macros)
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type e.g. 'banana', 'egg', 'chicken', 'oats'..."
                    className="w-full pl-9 pr-4 py-2 text-xs font-bold rounded-2xl border-2 border-ink bg-sky-50 dark:bg-dusk-surface text-ink dark:text-dusk-text focus:outline-none focus:border-grape placeholder:text-ink-muted"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {autocompleteResults.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-dusk-card rounded-2xl border-2 border-ink shadow-sticker-lg max-h-56 overflow-y-auto divide-y-2 divide-ink/10">
                    {autocompleteResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectPresetFood(item)}
                        className="w-full p-2.5 text-left hover:bg-grape/15 transition flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <span className="text-xs font-black text-ink dark:text-dusk-text flex items-center gap-1.5">
                            <span>{item.emoji}</span>
                            <span>{item.name}</span>
                          </span>
                          <span className="text-[10px] font-semibold text-ink-muted">
                            {item.serving} • {item.category}
                          </span>
                        </div>
                        <div className="text-right text-[11px] font-black text-tomato">
                          {item.calories} kcal
                          <span className="block text-[10px] text-grape font-bold">{item.protein_g}g P</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Preset Food Card with Portion Stepper */}
              {selectedFoodPreset && (
                <div className="p-3.5 rounded-2xl bg-grape/15 border-2 border-ink space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-black text-xs text-ink dark:text-dusk-text flex items-center gap-1">
                        <span>{selectedFoodPreset.emoji}</span>
                        <span>{selectedFoodPreset.name}</span>
                      </h4>
                      <span className="text-[10px] text-grape font-bold">
                        Base: {selectedFoodPreset.calories} kcal ({selectedFoodPreset.serving})
                      </span>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1.5 bg-white dark:bg-dusk-surface px-2 py-1 rounded-xl border-1.5 border-ink shadow-xs">
                      <button
                        type="button"
                        onClick={() => handleChangeMultiplier(-1)}
                        className="p-1 rounded-md text-ink hover:bg-grape/20"
                        title="Decrease portion"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-grape px-1">
                        {portionMultiplier}x
                      </span>
                      <button
                        type="button"
                        onClick={() => handleChangeMultiplier(1)}
                        className="p-1 rounded-md text-ink hover:bg-grape/20"
                        title="Increase portion"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Calculated Stats Grid */}
                  <div className="grid grid-cols-4 gap-1 text-center bg-white dark:bg-dusk-surface p-2 rounded-xl border border-ink">
                    <div>
                      <span className="text-[9px] text-ink-muted font-black block">CALORIES</span>
                      <strong className="text-xs text-tomato font-black">
                        {Math.round(selectedFoodPreset.calories * portionMultiplier)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-ink-muted font-black block">PROTEIN</span>
                      <strong className="text-xs text-grape font-black">
                        {Math.round(selectedFoodPreset.protein_g * portionMultiplier * 10) / 10}g
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-ink-muted font-black block">CARBS</span>
                      <strong className="text-xs text-amber-600 font-black">
                        {Math.round(selectedFoodPreset.carbs_g * portionMultiplier * 10) / 10}g
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-ink-muted font-black block">FAT</span>
                      <strong className="text-xs text-orange-600 font-black">
                        {Math.round(selectedFoodPreset.fat_g * portionMultiplier * 10) / 10}g
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Log Form */}
              <form onSubmit={handleAddLog} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                      Meal Timing
                    </label>
                    <select
                      value={newLog.meal_type}
                      onChange={(e) => setNewLog({ ...newLog, meal_type: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                      <option value="pre_workout">Pre-Workout</option>
                      <option value="post_workout">Post-Workout</option>
                      <option value="water">Water</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={newLog.meal_name}
                      onChange={(e) => setNewLog({ ...newLog, meal_name: e.target.value })}
                      placeholder="e.g. Banana"
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                {newLog.meal_type === 'water' ? (
                  <div>
                    <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                      Water Volume (ml)
                    </label>
                    <input
                      type="number"
                      step="50"
                      value={newLog.water_ml}
                      onChange={(e) => setNewLog({ ...newLog, water_ml: e.target.value })}
                      placeholder="e.g. 500"
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text"
                    />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                          Calories (kcal)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={newLog.calories}
                          onChange={(e) => setNewLog({ ...newLog, calories: e.target.value })}
                          placeholder="e.g. 105"
                          className="w-full px-3 py-2 text-xs font-black rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-tomato"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                          Protein (g)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={newLog.protein_g}
                          onChange={(e) => setNewLog({ ...newLog, protein_g: e.target.value })}
                          placeholder="e.g. 1.3"
                          className="w-full px-3 py-2 text-xs font-black rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-grape"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                          Carbs (g)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={newLog.carbs_g}
                          onChange={(e) => setNewLog({ ...newLog, carbs_g: e.target.value })}
                          placeholder="e.g. 27"
                          className="w-full px-3 py-2 text-xs font-black rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-amber-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                          Fat (g)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={newLog.fat_g}
                          onChange={(e) => setNewLog({ ...newLog, fat_g: e.target.value })}
                          placeholder="e.g. 0.3"
                          className="w-full px-3 py-2 text-xs font-black rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-orange-600"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="btn-squish w-full py-3 rounded-full bg-grape text-white font-display font-black text-xs border-2 border-ink shadow-sticker-xs cursor-pointer hover:shadow-sticker flex items-center justify-center gap-2"
                >
                  <Dumbbell className="w-4 h-4" />
                  <span>Save Log & Update Macros</span>
                </button>
              </form>
            </div>

            {/* Today's Logged Meals Timeline */}
            <div className="lg:col-span-2 bg-white dark:bg-dusk-card rounded-3xl border-3 border-ink p-6 shadow-sticker space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-lg text-ink dark:text-dusk-text flex items-center gap-2">
                    <span>Logged Today</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-grape/20 text-grape border border-ink font-black">
                      {adherence?.logs?.length || 0} entries
                    </span>
                  </h3>
                  <p className="text-xs font-semibold text-ink-muted">All entries are persistently stored and calculated in real-time.</p>
                </div>
              </div>

              {!adherence?.logs || adherence.logs.length === 0 ? (
                <div className="py-12 text-center text-xs text-[var(--text-muted)] space-y-2">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 border border-[var(--border-color)]">
                    <Flame className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <p className="font-semibold text-sm text-[var(--text-primary)]">No meals or water logged for this date yet</p>
                  <p>Select a quick preset above or search foods to record your first meal.</p>
                </div>
              ) : (
                <div className="divide-y-2 divide-ink/10">
                  {adherence.logs.map((log) => (
                    <div key={log.id} className="py-3.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-grape/20 border border-ink text-grape">
                            {log.meal_type.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-display font-black text-ink dark:text-dusk-text">
                            {log.meal_name}
                          </span>
                        </div>
                        <div className="text-xs text-ink-muted mt-1 space-x-3">
                          {log.water_ml > 0 ? (
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                              {log.water_ml} ml water
                            </span>
                          ) : (
                            <>
                              <span className="font-black text-tomato">{log.calories} kcal</span>
                              <span className="text-grape font-bold">P: {log.protein_g}g</span>
                              <span className="text-amber-600 font-bold">C: {log.carbs_g}g</span>
                              <span className="text-orange-600 font-bold">F: {log.fat_g}g</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="btn-squish p-2 rounded-xl text-ink-muted hover:text-tomato hover:bg-tomato/15 transition cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BMR & TDEE CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-dusk-card rounded-3xl border-3 border-ink p-6 shadow-sticker space-y-4">
            <h3 className="font-display font-black text-lg text-ink dark:text-dusk-text">
              Athletic Profile Parameters
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={calcForm.age}
                    onChange={(e) => setCalcForm({ ...calcForm, age: parseInt(e.target.value) || 25 })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                    Biological Sex
                  </label>
                  <select
                    value={calcForm.sex}
                    onChange={(e) => setCalcForm({ ...calcForm, sex: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text"
                  >
                    <option value="male">Male (+5 offset)</option>
                    <option value="female">Female (-161 offset)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcForm.height_cm}
                    onChange={(e) => setCalcForm({ ...calcForm, height_cm: parseFloat(e.target.value) || 170 })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcForm.weight_kg}
                    onChange={(e) => setCalcForm({ ...calcForm, weight_kg: parseFloat(e.target.value) || 70 })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                  Activity Level
                </label>
                <select
                  value={calcForm.activity_level}
                  onChange={(e) => setCalcForm({ ...calcForm, activity_level: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text"
                >
                  <option value="sedentary">Sedentary (desk job, minimal exercise × 1.2)</option>
                  <option value="light">Lightly Active (1-3 days exercise × 1.375)</option>
                  <option value="moderate">Moderately Active (3-5 days exercise × 1.55)</option>
                  <option value="active">Very Active (6-7 days intense training × 1.725)</option>
                  <option value="very_active">Extremely Active (athletes / twice daily × 1.9)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                    Fitness Goal
                  </label>
                  <select
                    value={calcForm.goal}
                    onChange={(e) => setCalcForm({ ...calcForm, goal: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text"
                  >
                    <option value="cut">Cut (-500 kcal fat loss)</option>
                    <option value="bulk">Lean Bulk (+350 kcal muscle gain)</option>
                    <option value="maintain">Maintenance (maintain weight)</option>
                    <option value="recomp">Body Recomposition (-200 kcal)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                    Dietary Philosophy
                  </label>
                  <select
                    value={calcForm.diet_type}
                    onChange={(e) => setCalcForm({ ...calcForm, diet_type: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text"
                  >
                    <option value="omnivore">Balanced Omnivore</option>
                    <option value="vegetarian">Vegetarian (Lacto/Ovo)</option>
                    <option value="vegan">100% Plant-Based (Vegan)</option>
                    <option value="high_protein">High Protein / Low Carb</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn-squish w-full py-3 rounded-full bg-grape text-white font-display font-black text-xs border-2 border-ink shadow-sticker-xs cursor-pointer hover:shadow-sticker"
              >
                Calculate & Update Active Targets
              </button>
            </form>
          </div>

          {/* Derived Breakdown Card */}
          <div className="space-y-4">
            <div className="rounded-3xl border-3 border-ink bg-white dark:bg-dusk-card p-6 shadow-sticker space-y-4">
              <h3 className="font-display font-black text-lg text-ink dark:text-dusk-text">
                Derived Metabolic Results
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-dusk-surface border-2 border-ink">
                  <span className="text-[11px] font-black text-ink-muted uppercase">Basal Metabolic Rate</span>
                  <p className="text-2xl font-display font-black text-ink dark:text-dusk-text mt-1">
                    {profile?.bmr || 1720} <span className="text-xs font-bold text-ink-muted">kcal</span>
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-dusk-surface border-2 border-ink">
                  <span className="text-[11px] font-black text-ink-muted uppercase">Total Daily Expenditure</span>
                  <p className="text-2xl font-display font-black text-ink dark:text-dusk-text mt-1">
                    {profile?.tdee || 2450} <span className="text-xs font-bold text-ink-muted">kcal</span>
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-grape/15 border-2 border-ink space-y-3">
                <span className="text-xs font-black text-grape uppercase">
                  Daily Target Breakdown
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-dusk-surface border border-ink">
                    <span className="text-[10px] text-ink-muted font-black block">CALORIES</span>
                    <strong className="text-sm text-tomato font-black">
                      {profile?.target_calories || 2300}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-dusk-surface border border-ink">
                    <span className="text-[10px] text-ink-muted font-black block">PROTEIN</span>
                    <strong className="text-sm text-grape font-black">
                      {profile?.target_protein_g || 140}g
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-dusk-surface border border-ink">
                    <span className="text-[10px] text-ink-muted font-black block">CARBS</span>
                    <strong className="text-sm text-amber-600 font-black">
                      {profile?.target_carbs_g || 260}g
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-dusk-surface border border-ink">
                    <span className="text-[10px] text-ink-muted font-black block">FAT</span>
                    <strong className="text-sm text-orange-600 font-black">
                      {profile?.target_fat_g || 70}g
                    </strong>
                  </div>
                </div>
              </div>

              {/* Personalized Indian Gym Diet Distribution Plan */}
              <div className="p-5 rounded-2xl bg-white dark:bg-dusk-surface border-2 border-ink space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-black text-sm text-ink dark:text-dusk-text flex items-center gap-1.5">
                    <span>Tailored Indian Gym Meal Timing Plan</span>
                  </h4>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-grape text-white">
                    {profile?.goal || 'Maintain'}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-bold text-ink dark:text-dusk-text">
                  <div className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-blue-600 dark:text-blue-400 block">Meal 1: Pre-Workout (45m before)</span>
                      <span>1 Medium Banana + 1 tbsp Peanut Butter</span>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">190 kcal • 7g P</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-blue-600 dark:text-blue-400 block">Meal 2: Post-Workout Window (30m)</span>
                      <span>1 Scoop Whey Isolate or 4 Boiled Egg Whites</span>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">115 kcal • 27g P</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-emerald-600 block">Meal 3: Power Lunch</span>
                      <span>Soya Chunks Curry (50g raw) or Chicken Breast + 2 Rotis + Dal</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600">480 kcal • 42g P</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-amber-600 block">Meal 4: Evening Recovery Snack</span>
                      <span>1 Cup Roasted Chana or Moong Sprouts Chaat</span>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-600">185 kcal • 11g P</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-purple-600 block">Meal 5: Balanced Dinner</span>
                      <span>Low-Fat Paneer Bhurji (150g) or Grilled Fish + 1 Cup Brown Rice</span>
                    </div>
                    <span className="text-[11px] font-semibold text-purple-600">420 kcal • 32g P</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HIGH-PROTEIN FOODS TABLE */}
      {activeTab === 'protein-foods' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-black text-xl text-ink dark:text-dusk-text">
                High-Protein Food Leaderboard
              </h3>
              <p className="text-xs font-semibold text-ink-muted">
                Foods ranked by biological protein density (per 100g) and efficiency ratio.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  type="text"
                  value={leaderboardSearch}
                  onChange={(e) => setLeaderboardSearch(e.target.value)}
                  placeholder="Filter foods (e.g. Soya, Whey, Paneer, Chicken)..."
                  className="pl-8 pr-3 py-1.5 rounded-full text-xs font-bold border-2 border-ink bg-white dark:bg-dusk-card w-48 sm:w-64"
                />
              </div>

              <select
                value={dietFilter}
                onChange={(e) => setDietFilter(e.target.value)}
                className="px-3 py-1.5 rounded-full text-xs font-bold border-2 border-ink bg-white dark:bg-dusk-card cursor-pointer"
              >
                <option value="all">All Diets</option>
                <option value="veg">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-full text-xs font-bold border-2 border-ink bg-white dark:bg-dusk-card cursor-pointer"
              >
                <option value="protein_per_100g">Sort by Protein / 100g (Highest First)</option>
                <option value="efficiency">Sort by Protein Ratio / 100 kcal</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-dusk-card rounded-3xl border-3 border-ink overflow-hidden shadow-sticker">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sky-100 dark:bg-dusk-surface text-ink dark:text-dusk-text uppercase tracking-wider font-display font-black border-b-2 border-ink">
                  <tr>
                    <th className="px-5 py-3.5 w-16 text-center">Rank</th>
                    <th className="px-6 py-3.5">Food Item</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5 text-right">Protein / 100g</th>
                    <th className="px-6 py-3.5 text-right">Calories / 100g</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-ink/10">
                  {displayedFoods.map((f, idx) => {
                    const isTop1 = idx === 0;
                    return (
                      <tr key={f.id} className="hover:bg-[var(--bg-card-subtle)] transition">
                        <td className="px-5 py-3 text-center font-mono font-semibold text-xs text-[var(--text-muted)]">
                          #{idx + 1}
                        </td>
                        <td className="px-6 py-3 font-medium text-[var(--text-primary)]">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                            <div>
                              <span className="block font-semibold text-xs sm:text-sm">{f.name}</span>
                              {f.protein_g >= 20 && (
                                <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-medium border border-blue-200 dark:border-blue-800">
                                  High Protein Density
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-[var(--text-muted)]">
                          {f.category}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
                            {f.protein_g}g
                          </span>
                          <span className="block text-[10px] text-[var(--text-muted)]">protein</span>
                        </td>
                        <td className="px-6 py-3 text-right text-[var(--text-primary)] font-medium">
                          {Math.round(f.calories)} kcal
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectPresetFood(f);
                              setActiveTab('tracker');
                            }}
                            className="pill-btn-secondary text-[11px] py-1 px-3 cursor-pointer hover:border-blue-500"
                          >
                            + Log
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {displayedFoods.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-ink-muted font-bold">
                        No foods found matching "{leaderboardSearch}". Try another search term or reset filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EVIDENCE-BASED SUPPLEMENTS */}
      {activeTab === 'supplements' && (
        <div className="space-y-6 max-w-4xl">
          <div>
            <h3 className="font-display font-black text-xl text-ink dark:text-dusk-text">
              Scientific Supplement Grading Matrix
            </h3>
            <p className="text-xs font-semibold text-ink-muted">
              Graded strictly by peer-reviewed human randomized clinical trials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink shadow-sticker space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-black text-ink dark:text-dusk-text text-base">
                  Creatine Monohydrate
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-mint text-ink border border-ink text-[11px] font-black">
                  TIER A (STRONG)
                </span>
              </div>
              <p className="text-xs font-medium text-ink-muted leading-relaxed">
                Replenishes phosphocreatine stores (ATP) for explosive anaerobic power. Proven to increase maximal strength and sprint performance. Dose: 3-5g daily.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink shadow-sticker space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-black text-ink dark:text-dusk-text text-base">
                  Whey Protein Isolate
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-mint text-ink border border-ink text-[11px] font-black">
                  TIER A (STRONG)
                </span>
              </div>
              <p className="text-xs font-medium text-ink-muted leading-relaxed">
                Rapid bioavailability with high leucine content (~2.7g/scoop) triggering Muscle Protein Synthesis (MPS). Optimal immediately post-training.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
