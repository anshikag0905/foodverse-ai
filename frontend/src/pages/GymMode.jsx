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
  Search
} from 'lucide-react';
import ProgressRing from '../components/common/ProgressRing';
import Loader from '../components/common/Loader';

export default function GymMode() {
  const [activeTab, setActiveTab] = useState('tracker'); // 'tracker', 'calculator', 'protein-foods', 'supplements'
  const [profile, setProfile] = useState(null);
  const [adherence, setAdherence] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  // New Log State
  const [newLog, setNewLog] = useState({
    meal_type: 'lunch',
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
      console.error('Failed to fetch gym profile:', err);
    }
  };

  const fetchAdherence = async (date) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/gym/adherence', { params: { date } });
      setAdherence(res.data);
    } catch (err) {
      console.error('Failed to fetch adherence:', err);
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
      console.error('Failed to fetch protein foods:', err);
    } finally {
      setLoadingFoods(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!newLog.meal_name.trim() && newLog.meal_type !== 'water') return;

    try {
      const payload = {
        log_date: selectedDate,
        meal_type: newLog.meal_type,
        meal_name: newLog.meal_name.trim() || (newLog.meal_type === 'water' ? 'Water Intake' : 'Logged Meal'),
        calories: parseFloat(newLog.calories) || 0,
        protein_g: parseFloat(newLog.protein_g) || 0,
        carbs_g: parseFloat(newLog.carbs_g) || 0,
        fat_g: parseFloat(newLog.fat_g) || 0,
        water_ml: parseFloat(newLog.water_ml) || 0,
      };

      await axios.post('/api/v1/gym/log', payload);
      setNewLog({
        meal_type: 'lunch',
        meal_name: '',
        calories: '',
        protein_g: '',
        carbs_g: '',
        fat_g: '',
        water_ml: '',
      });
      fetchAdherence(selectedDate);
    } catch (err) {
      console.error('Failed to add gym log:', err);
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await axios.delete(`/api/v1/gym/log/${id}`);
      fetchAdherence(selectedDate);
    } catch (err) {
      console.error('Failed to delete gym log:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/v1/gym/profile', calcForm);
      setProfile(res.data);
      fetchAdherence(selectedDate);
      alert('Athletic nutrition targets updated successfully!');
    } catch (err) {
      console.error('Failed to update gym profile:', err);
    }
  };

  const handleSeedDemo = async () => {
    try {
      await axios.post('/api/v1/gym/seed-demo');
      fetchAdherence(selectedDate);
    } catch (err) {
      console.error('Failed to seed demo gym data:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/70 text-violet-800 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Dumbbell className="w-3.5 h-3.5" />
            Performance & Bodybuilding Intelligence
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Gym Mode
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Science-backed macro targets, Mifflin-St Jeor metabolic tracking, and high-protein food directories.
          </p>
        </div>

        <button
          onClick={handleSeedDemo}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 dark:hover:bg-violet-900/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/80 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Seed Demo Gym Logs
        </button>
      </div>

      {/* Safety Floor Alert if active */}
      {profile?.safety_warning && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-amber-900 dark:text-amber-200">Metabolic Health Advisory</h4>
            <p className="text-amber-800 dark:text-amber-300 mt-0.5">{profile.safety_warning}</p>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'tracker'
              ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          Daily Macro Tracker
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'calculator'
              ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          BMR & TDEE Calculator
        </button>
        <button
          onClick={() => setActiveTab('protein-foods')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'protein-foods'
              ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          High-Protein Food Table
        </button>
        <button
          onClick={() => setActiveTab('supplements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'supplements'
              ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          Evidence-Based Supplements
        </button>
      </div>

      {/* TAB 1: DAILY MACRO TRACKER */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Target Summary Cards with Progress Rings */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  Daily Intake & Adherence
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target: {profile?.target_calories || 2300} kcal • Goal: {profile?.goal?.toUpperCase() || 'MAINTAIN'}
                </p>
              </div>

              {/* Date Selector */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <Loader message="Fetching macro logs..." />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
                <ProgressRing
                  label="Calories"
                  current={adherence?.actual_calories || 0}
                  target={adherence?.target_calories || 2300}
                  unit=" kcal"
                  color="#8b5cf6"
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Log Form */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                Quick Log Meal or Water
              </h3>

              <form onSubmit={handleAddLog} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Meal Type
                  </label>
                  <select
                    value={newLog.meal_type}
                    onChange={(e) => setNewLog({ ...newLog, meal_type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="pre_workout">Pre-Workout</option>
                    <option value="post_workout">Post-Workout</option>
                    <option value="water">Water / Hydration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Meal / Item Name
                  </label>
                  <input
                    type="text"
                    value={newLog.meal_name}
                    onChange={(e) => setNewLog({ ...newLog, meal_name: e.target.value })}
                    placeholder="e.g. Whey Shake + Banana, Grilled Chicken..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                {newLog.meal_type === 'water' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Water Intake (ml)
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
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Calories (kcal)
                        </label>
                        <input
                          type="number"
                          value={newLog.calories}
                          onChange={(e) => setNewLog({ ...newLog, calories: e.target.value })}
                          placeholder="e.g. 450"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Protein (g)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={newLog.protein_g}
                          onChange={(e) => setNewLog({ ...newLog, protein_g: e.target.value })}
                          placeholder="e.g. 35"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Carbs (g)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={newLog.carbs_g}
                          onChange={(e) => setNewLog({ ...newLog, carbs_g: e.target.value })}
                          placeholder="e.g. 50"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Fat (g)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={newLog.fat_g}
                          onChange={(e) => setNewLog({ ...newLog, fat_g: e.target.value })}
                          placeholder="e.g. 12"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/20 transition"
                >
                  Save Entry
                </button>
              </form>
            </div>

            {/* Today's Logged Meals Timeline */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Entries for {selectedDate}
              </h3>

              {!adherence?.logs || adherence.logs.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No meals or water logged for this date. Use the quick logger to track your intake.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {adherence.logs.map((log) => (
                    <div key={log.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300">
                            {log.meal_type.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {log.meal_name}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 space-x-3">
                          {log.water_ml > 0 ? (
                            <span className="text-sky-600 dark:text-sky-400 font-semibold">
                              💧 {log.water_ml} ml water
                            </span>
                          ) : (
                            <>
                              <span>{log.calories} kcal</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                P: {log.protein_g}g
                              </span>
                              <span>C: {log.carbs_g}g</span>
                              <span>F: {log.fat_g}g</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
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
          {/* Form */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Athletic Profile Parameters
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Activity Level
                </label>
                <select
                  value={calcForm.activity_level}
                  onChange={(e) => setCalcForm({ ...calcForm, activity_level: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="sedentary">Sedentary (desk job, minimal exercise × 1.2)</option>
                  <option value="light">Lightly Active (1-3 days exercise × 1.375)</option>
                  <option value="moderate">Moderately Active (3-5 days resistance/cardio × 1.55)</option>
                  <option value="active">Very Active (6-7 days intense training × 1.725)</option>
                  <option value="very_active">Extremely Active (athletes / twice daily × 1.9)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/25 transition"
              >
                Calculate & Update Active Targets
              </button>
            </form>
          </div>

          {/* Derived Breakdown Card */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-violet-600/10 via-purple-600/5 to-transparent rounded-3xl border border-violet-500/30 p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Derived Metabolic Results
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Basal Metabolic Rate</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {profile?.bmr || 0} <span className="text-xs font-semibold text-slate-500">kcal</span>
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Total Daily Expenditure</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {profile?.tdee || 0} <span className="text-xs font-semibold text-slate-500">kcal</span>
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase">
                  Daily Athletic Prescription
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/60">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">CALORIES</span>
                    <strong className="text-sm text-violet-700 dark:text-violet-300 font-extrabold">
                      {profile?.target_calories || 0}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">PROTEIN</span>
                    <strong className="text-sm text-emerald-700 dark:text-emerald-300 font-extrabold">
                      {profile?.target_protein_g || 0}g
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">CARBS</span>
                    <strong className="text-sm text-amber-700 dark:text-amber-300 font-extrabold">
                      {profile?.target_carbs_g || 0}g
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">FAT</span>
                    <strong className="text-sm text-blue-700 dark:text-blue-300 font-extrabold">
                      {profile?.target_fat_g || 0}g
                    </strong>
                  </div>
                </div>
              </div>

              {profile?.formula_explanation && (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="block text-slate-800 dark:text-slate-200 font-semibold mb-1">
                    Mifflin-St Jeor Methodology:
                  </strong>
                  {profile.formula_explanation}
                </div>
              )}
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
                Foods ranked by biological protein density (per 100g) and protein-to-calorie efficiency ratio.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={dietFilter}
                onChange={(e) => setDietFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                <option value="all">All Diets</option>
                <option value="veg">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                <option value="protein_per_100g">Sort by Protein / 100g</option>
                <option value="efficiency">Sort by Protein Efficiency Ratio</option>
              </select>
            </div>
          </div>

          {loadingFoods ? (
            <div className="py-16 flex justify-center">
              <Loader message="Scanning protein database..." />
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Food Item</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5 text-right">Protein / 100g</th>
                      <th className="px-6 py-3.5 text-right">Calories / 100g</th>
                      <th className="px-6 py-3.5 text-right">Efficiency Ratio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {proteinFoods.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                        <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white">
                          {f.name}
                        </td>
                        <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400">
                          {f.category}
                        </td>
                        <td className="px-6 py-3.5 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                          {f.protein_per_100g}g
                        </td>
                        <td className="px-6 py-3.5 text-right text-slate-600 dark:text-slate-300">
                          {f.calories_per_100g} kcal
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 font-bold text-[11px]">
                            {f.protein_per_calorie}% cal
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
              Graded strictly by peer-reviewed human randomized clinical trials (ISSN, examine.com protocols).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Creatine Monohydrate
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                  TIER A (STRONG)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Replenishes phosphocreatine stores (ATP) for anaerobic bursts. Proven to increase maximal strength, sprint power, and intracellular cellular hydration. Dose: 3-5g daily.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Whey Protein Isolate
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                  TIER A (STRONG)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Rapid bioavailability with high leucine content (~2.7g/scoop) triggering mTOR and Muscle Protein Synthesis (MPS). Optimal post-training or to meet daily protein goals.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  Caffeine Anhydrous
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                  TIER A (STRONG)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Adenosine receptor antagonist that reduces rate of perceived exertion (RPE) and increases motor unit recruitment. Dose: 3-6 mg/kg 45 min pre-workout.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  L-Citrulline Malate
                </h4>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black">
                  TIER B (MODERATE)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Precursor to L-arginine, boosting endothelial nitric oxide production, muscular pump, and ammonia clearance during high volume lifting. Dose: 6-8g.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
