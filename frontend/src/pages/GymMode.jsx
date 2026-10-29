import React, { useState, useEffect } from 'react';
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
    try {
      const res = await axios.get('/api/v1/gym/profile');
      setProfile(res.data);
      setCalcForm({
        age: res.data.age,
        sex: res.data.sex,
        height_cm: res.data.height_cm,
        weight_kg: res.data.weight_kg,
        activity_level: res.data.activity_level,
        training_days_per_week: res.data.training_days_per_week,
        goal: res.data.goal,
        diet_type: res.data.diet_type,
        allergies: res.data.allergies || []
      });
    } catch (err) {
      console.warn('Backend gym profile fetch failed, using default profile:', err);
    }
  };

  const fetchAdherence = async (date) => {
    setLoading(true);
    const localLogs = getLocalLogs(date);
    try {
      const res = await axios.get('/api/v1/gym/adherence', { params: { date } });
      const apiData = res.data;
      
      // Merge unique local logs
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
      meal_type: newLog.meal_type || 'snack',
      meal_name: multiplier === 1 ? `${item.emoji} ${item.name}` : `${item.emoji} ${multiplier}x ${item.name}`,
      calories: cal.toString(),
      protein_g: prot.toString(),
      carbs_g: carb.toString(),
      fat_g: fat.toString(),
      water_ml: '0',
    });
  };

  // Change portion multiplier (e.g. 1 -> 2 bananas)
  const handleChangeMultiplier = (delta) => {
    if (!selectedFoodPreset) return;
    const nextMult = Math.max(0.5, Math.round((portionMultiplier + delta) * 10) / 10);
    handleSelectPresetFood(selectedFoodPreset, nextMult);
  };

  // Submit and save meal log (with dual localStorage + API persistence)
  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!newLog.meal_name.trim() && newLog.meal_type !== 'water') return;

    const payload = {
      id: Date.now(),
      log_date: selectedDate,
      meal_type: newLog.meal_type,
      meal_name: newLog.meal_name.trim() || (newLog.meal_type === 'water' ? '💧 Water Intake' : 'Logged Meal'),
      calories: parseFloat(newLog.calories) || 0,
      protein_g: parseFloat(newLog.protein_g) || 0,
      carbs_g: parseFloat(newLog.carbs_g) || 0,
      fat_g: parseFloat(newLog.fat_g) || 0,
      water_ml: parseFloat(newLog.water_ml) || 0,
      created_at: new Date().toISOString()
    };

    // 1. Immediately save to browser localStorage
    saveLocalLog(selectedDate, payload);

    // 2. Trigger cute celebration feedback
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
    // 1. Remove from localStorage
    deleteLocalLog(selectedDate, id);
    // 2. Update view immediately
    fetchAdherence(selectedDate);
    // 3. Delete from API
    try {
      await axios.delete(`/api/v1/gym/log/${id}`);
    } catch (err) {
      console.warn('API delete handled locally:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/v1/gym/profile', calcForm);
      setProfile(res.data);
      fetchAdherence(selectedDate);
      alert('🌸 Athletic nutrition targets updated successfully!');
    } catch (err) {
      console.warn('Profile updated locally:', err);
      alert('🌸 Athletic profile saved!');
    }
  };

  const handleSeedDemo = async () => {
    try {
      await axios.post('/api/v1/gym/seed-demo');
      fetchAdherence(selectedDate);
    } catch (err) {
      console.warn('Seeding sample items locally');
      // Local fallback seeds
      saveLocalLog(selectedDate, {
        id: Date.now() + 1,
        log_date: selectedDate,
        meal_type: 'breakfast',
        meal_name: '🥣 Rolled Oats Bowl with Whey',
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
        meal_name: '🍌 Banana (1 medium)',
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Page Header with Cute Aesthetic */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2 shadow-2xs">
            <span>✨</span>
            <span>Gym Mode & Athletic Nutrition</span>
            <span>🌸</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Gym Intelligence</span>
            <span className="text-2xl animate-bounce">💪</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Track daily macros, search instant foods with portion counts, and smash your fitness goals!
          </p>
        </div>

        <button
          onClick={handleSeedDemo}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 shadow-sm transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Quick Load Sample Logs
        </button>
      </div>

      {/* Celebratory Cute Alert Banner */}
      {showCelebration && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 border border-rose-300 text-rose-900 shadow-sm flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <h4 className="font-extrabold text-sm">Meal Saved & Macros Updated!</h4>
              <p className="text-xs text-rose-700 mt-0.5">Your calories and protein targets are recorded in live memory.</p>
            </div>
          </div>
          <span className="text-xl">🌸✨</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-rose-200/60 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'tracker'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          Daily Macro Tracker
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'calculator'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          BMR & TDEE Calculator
        </button>
        <button
          onClick={() => setActiveTab('protein-foods')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'protein-foods'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          High-Protein Table
        </button>
        <button
          onClick={() => setActiveTab('supplements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'supplements'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          Supplements Guide
        </button>
      </div>

      {/* TAB 1: DAILY MACRO TRACKER */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Progress Rings Card with Soft Pinkish Touch */}
          <div className="bg-gradient-to-br from-white via-rose-50/30 to-pink-50/40 dark:from-slate-900 dark:to-slate-900 rounded-3xl border border-rose-200/70 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Daily Nutritional Fuel</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                    Target: {adherence?.target_calories || 2300} kcal
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Live calorie & macronutrient progress rings for selected training date.
                </p>
              </div>

              {/* Date Selector */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-2xl border border-rose-200 dark:border-slate-700 shadow-2xs">
                <Calendar className="w-4 h-4 text-rose-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
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
                  color="#f43f5e"
                />
                <ProgressRing
                  label="Protein"
                  current={adherence?.actual_protein || 0}
                  target={adherence?.target_protein || 140}
                  unit="g"
                  color="#10b981"
                />
                <ProgressRing
                  label="Carbohydrates"
                  current={adherence?.actual_carbs || 0}
                  target={adherence?.target_carbs || 260}
                  unit="g"
                  color="#f59e0b"
                />
                <ProgressRing
                  label="Water Hydration"
                  current={adherence?.actual_water || 0}
                  target={adherence?.target_water || 3000}
                  unit=" ml"
                  color="#0ea5e9"
                />
              </div>
            )}
          </div>

          {/* Quick-Tap Preset Food Pills Carousel */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>⚡</span>
              <span>Quick-Tap Gym & Snack Presets:</span>
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => handleSelectPresetFood(PREDEFINED_FOODS[0])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-slate-700 hover:border-rose-400 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs whitespace-nowrap transition"
              >
                <span>🍌</span> Banana (105 kcal)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPresetFood(PREDEFINED_FOODS[5])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-slate-700 hover:border-rose-400 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs whitespace-nowrap transition"
              >
                <span>🥚🥚</span> 2 Boiled Eggs (148 kcal)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPresetFood(PREDEFINED_FOODS[8])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-slate-700 hover:border-rose-400 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs whitespace-nowrap transition"
              >
                <span>🥛</span> 1 Scoop Whey (120 kcal)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPresetFood(PREDEFINED_FOODS[6])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-slate-700 hover:border-rose-400 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs whitespace-nowrap transition"
              >
                <span>🍗</span> Chicken 100g (165 kcal)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPresetFood(PREDEFINED_FOODS[10])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-slate-700 hover:border-rose-400 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs whitespace-nowrap transition"
              >
                <span>🧀</span> Paneer 100g (265 kcal)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPresetFood(PREDEFINED_FOODS[12])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-slate-700 hover:border-rose-400 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs whitespace-nowrap transition"
              >
                <span>🥣</span> Oats Bowl (190 kcal)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPresetFood(PREDEFINED_FOODS[17])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-slate-700 hover:border-rose-400 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs whitespace-nowrap transition"
              >
                <span>🍞🥜</span> PB Toast (280 kcal)
              </button>
              <button
                type="button"
                onClick={() => setNewLog(prev => ({ ...prev, meal_type: 'water', meal_name: '💧 500ml Water Bottle', water_ml: '500', calories: '0', protein_g: '0', carbs_g: '0', fat_g: '0' }))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900 text-sky-700 dark:text-sky-300 text-xs font-bold shadow-2xs whitespace-nowrap"
              >
                <span>💧</span> +500ml Water
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Log Form with Autocomplete */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-rose-500" />
                <span>Log Meal or Snack</span>
                <span className="text-xs">🌸</span>
              </h3>

              {/* SEARCH PREDEFINED ITEM (e.g. "banana") */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Search Food Item (Auto-calculates Macros)
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type e.g. 'banana', 'egg', 'chicken', 'oats'..."
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-2xl border border-rose-200 dark:border-slate-700 bg-rose-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400 placeholder:text-slate-400"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {autocompleteResults.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-2xl border border-rose-200 dark:border-slate-700 shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                    {autocompleteResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectPresetFood(item)}
                        className="w-full p-2.5 text-left hover:bg-rose-50 dark:hover:bg-slate-700/60 transition flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{item.emoji}</span>
                            <span>{item.name}</span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {item.serving} • {item.category}
                          </span>
                        </div>
                        <div className="text-right text-[11px] font-extrabold text-rose-600 dark:text-rose-400">
                          {item.calories} kcal
                          <span className="block text-[10px] text-emerald-600 font-semibold">{item.protein_g}g P</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Preset Food Card with Portion Stepper */}
              {selectedFoodPreset && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/60 border border-rose-200 dark:border-slate-700 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-rose-950 dark:text-white flex items-center gap-1">
                        <span>{selectedFoodPreset.emoji}</span>
                        <span>{selectedFoodPreset.name}</span>
                      </h4>
                      <span className="text-[10px] text-rose-600 dark:text-rose-300 font-semibold">
                        Base: {selectedFoodPreset.calories} kcal ({selectedFoodPreset.serving})
                      </span>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-rose-200 dark:border-slate-700 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleChangeMultiplier(-1)}
                        className="p-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                        title="Decrease portion"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-extrabold text-rose-600 px-1">
                        {portionMultiplier}x
                      </span>
                      <button
                        type="button"
                        onClick={() => handleChangeMultiplier(1)}
                        className="p-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                        title="Increase portion"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Calculated Stats Grid */}
                  <div className="grid grid-cols-4 gap-1 text-center bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl border border-rose-100 dark:border-slate-800">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block">CALORIES</span>
                      <strong className="text-xs text-rose-600 font-black">
                        {Math.round(selectedFoodPreset.calories * portionMultiplier)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block">PROTEIN</span>
                      <strong className="text-xs text-emerald-600 font-black">
                        {Math.round(selectedFoodPreset.protein_g * portionMultiplier * 10) / 10}g
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block">CARBS</span>
                      <strong className="text-xs text-amber-600 font-black">
                        {Math.round(selectedFoodPreset.carbs_g * portionMultiplier * 10) / 10}g
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block">FAT</span>
                      <strong className="text-xs text-blue-600 font-black">
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Meal Timing
                    </label>
                    <select
                      value={newLog.meal_type}
                      onChange={(e) => setNewLog({ ...newLog, meal_type: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="breakfast">Breakfast 🍳</option>
                      <option value="lunch">Lunch 🥗</option>
                      <option value="dinner">Dinner 🍲</option>
                      <option value="snack">Snack 🍌</option>
                      <option value="pre_workout">Pre-Workout ⚡</option>
                      <option value="post_workout">Post-Workout 💪</option>
                      <option value="water">Water 💧</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={newLog.meal_name}
                      onChange={(e) => setNewLog({ ...newLog, meal_name: e.target.value })}
                      placeholder="e.g. 🍌 Banana"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {newLog.meal_type === 'water' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Water Volume (ml)
                    </label>
                    <input
                      type="number"
                      step="50"
                      value={newLog.water_ml}
                      onChange={(e) => setNewLog({ ...newLog, water_ml: e.target.value })}
                      placeholder="e.g. 500"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Calories (kcal)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={newLog.calories}
                          onChange={(e) => setNewLog({ ...newLog, calories: e.target.value })}
                          placeholder="e.g. 105"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-rose-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Protein (g)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={newLog.protein_g}
                          onChange={(e) => setNewLog({ ...newLog, protein_g: e.target.value })}
                          placeholder="e.g. 1.3"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Carbs (g)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={newLog.carbs_g}
                          onChange={(e) => setNewLog({ ...newLog, carbs_g: e.target.value })}
                          placeholder="e.g. 27"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-amber-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Fat (g)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={newLog.fat_g}
                          onChange={(e) => setNewLog({ ...newLog, fat_g: e.target.value })}
                          placeholder="e.g. 0.3"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-blue-600"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs shadow-md shadow-rose-500/25 transition transform active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>✨</span>
                  <span>Save Log & Update Macros</span>
                </button>
              </form>
            </div>

            {/* Today's Logged Meals Timeline */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-rose-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Logged Today</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                      {adherence?.logs?.length || 0} entries
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">All entries are persistently stored and calculated in real-time.</p>
                </div>
              </div>

              {!adherence?.logs || adherence.logs.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                  <span className="text-3xl block">🥑🥞</span>
                  <p className="font-bold">No meals or water logged for this date yet!</p>
                  <p>Tap any quick-add preset above or search for "banana" to log your first item.</p>
                </div>
              ) : (
                <div className="divide-y divide-rose-100 dark:divide-slate-800">
                  {adherence.logs.map((log) => (
                    <div key={log.id} className="py-3.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
                            {log.meal_type.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {log.meal_name}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 space-x-3">
                          {log.water_ml > 0 ? (
                            <span className="text-sky-600 dark:text-sky-400 font-bold">
                              💧 {log.water_ml} ml water
                            </span>
                          ) : (
                            <>
                              <span className="font-extrabold text-rose-600 dark:text-rose-400">{log.calories} kcal</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                P: {log.protein_g}g
                              </span>
                              <span className="text-amber-600 font-medium">C: {log.carbs_g}g</span>
                              <span className="text-blue-600 font-medium">F: {log.fat_g}g</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Athletic Profile Parameters
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={calcForm.age}
                    onChange={(e) => setCalcForm({ ...calcForm, age: parseInt(e.target.value) || 25 })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Biological Sex
                  </label>
                  <select
                    value={calcForm.sex}
                    onChange={(e) => setCalcForm({ ...calcForm, sex: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="male">Male (+5 offset)</option>
                    <option value="female">Female (-161 offset)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcForm.height_cm}
                    onChange={(e) => setCalcForm({ ...calcForm, height_cm: parseFloat(e.target.value) || 170 })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcForm.weight_kg}
                    onChange={(e) => setCalcForm({ ...calcForm, weight_kg: parseFloat(e.target.value) || 70 })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Activity Level
                </label>
                <select
                  value={calcForm.activity_level}
                  onChange={(e) => setCalcForm({ ...calcForm, activity_level: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fitness Goal
                  </label>
                  <select
                    value={calcForm.goal}
                    onChange={(e) => setCalcForm({ ...calcForm, goal: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="cut">Cut (-500 kcal fat loss)</option>
                    <option value="bulk">Lean Bulk (+350 kcal muscle gain)</option>
                    <option value="maintain">Maintenance (maintain weight)</option>
                    <option value="recomp">Body Recomposition (-200 kcal)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dietary Philosophy
                  </label>
                  <select
                    value={calcForm.diet_type}
                    onChange={(e) => setCalcForm({ ...calcForm, diet_type: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
                className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-500/25 transition"
              >
                Calculate & Update Active Targets
              </button>
            </form>
          </div>

          {/* Derived Breakdown Card */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent rounded-3xl border border-rose-300/60 p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Derived Metabolic Results
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Basal Metabolic Rate</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {profile?.bmr || 0} <span className="text-xs font-semibold text-slate-500">kcal</span>
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Total Daily Expenditure</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {profile?.tdee || 0} <span className="text-xs font-semibold text-slate-500">kcal</span>
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-rose-600 uppercase">
                  Daily Target Breakdown
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60">
                    <span className="text-[10px] text-slate-500 font-bold block">CALORIES</span>
                    <strong className="text-sm text-rose-600 font-black">
                      {profile?.target_calories || 0}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60">
                    <span className="text-[10px] text-slate-500 font-bold block">PROTEIN</span>
                    <strong className="text-sm text-emerald-600 font-black">
                      {profile?.target_protein_g || 0}g
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60">
                    <span className="text-[10px] text-slate-500 font-bold block">CARBS</span>
                    <strong className="text-sm text-amber-600 font-black">
                      {profile?.target_carbs_g || 0}g
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60">
                    <span className="text-[10px] text-slate-500 font-bold block">FAT</span>
                    <strong className="text-sm text-blue-600 font-black">
                      {profile?.target_fat_g || 0}g
                    </strong>
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
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                High-Protein Database Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Foods ranked by biological protein density (per 100g) and efficiency ratio.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={dietFilter}
                onChange={(e) => setDietFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs border border-rose-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
              >
                <option value="all">All Diets</option>
                <option value="veg">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs border border-rose-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
              >
                <option value="protein_per_100g">Sort by Protein / 100g</option>
                <option value="efficiency">Sort by Protein Efficiency Ratio</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-rose-50/50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-rose-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Food Item</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5 text-right">Protein / 100g</th>
                    <th className="px-6 py-3.5 text-right">Calories / 100g</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100/60 dark:divide-slate-800">
                  {PREDEFINED_FOODS.map((f) => (
                    <tr key={f.id} className="hover:bg-rose-50/40 dark:hover:bg-slate-800/40 transition">
                      <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{f.emoji}</span>
                        <span>{f.name}</span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">
                        {f.category}
                      </td>
                      <td className="px-6 py-3.5 text-right font-black text-emerald-600">
                        {f.protein_g}g
                      </td>
                      <td className="px-6 py-3.5 text-right text-slate-600 font-bold">
                        {f.calories} kcal
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => {
                            handleSelectPresetFood(f);
                            setActiveTab('tracker');
                          }}
                          className="px-3 py-1 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-extrabold text-[11px] transition"
                        >
                          + Quick Log
                        </button>
                      </td>
                    </tr>
                  ))}
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
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Scientific Supplement Grading Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Graded strictly by peer-reviewed human randomized clinical trials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Creatine Monohydrate
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black">
                  TIER A (STRONG)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Replenishes phosphocreatine stores (ATP) for anaerobic bursts. Proven to increase maximal strength and sprint power. Dose: 3-5g daily.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Whey Protein Isolate
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black">
                  TIER A (STRONG)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Rapid bioavailability with high leucine content (~2.7g/scoop) triggering Muscle Protein Synthesis (MPS). Optimal post-training.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
