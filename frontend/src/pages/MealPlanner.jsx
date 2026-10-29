import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, RefreshCw, Shuffle, CheckSquare, Square, ShoppingBag, ShieldAlert, Sparkles, Check } from 'lucide-react';
import apiClient from '../services/api';
import AllergenAlert from '../components/common/AllergenAlert';
import { Loader } from '../components/common/Loader';

export default function MealPlanner() {
  const { t, i18n } = useTranslation();
  const [mealPlan, setMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [swappingMeal, setSwappingMeal] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/meal-plans/current');
      if (res && res.id) {
        setMealPlan(res);
      } else {
        await handleGeneratePlan();
      }
    } catch (err) {
      await handleGeneratePlan();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/meal-plans/generate', {
        plan_type: "daily",
        target_calories: 2050.0,
        lang: i18n.language || "en"
      });
      setMealPlan(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapMeal = async (dayIdx, mealIdx) => {
    if (!mealPlan) return;
    setSwappingMeal(`${dayIdx}-${mealIdx}`);
    try {
      const res = await apiClient.post('/meal-plans/swap', {
        plan_id: mealPlan.id,
        day_index: dayIdx,
        meal_index: mealIdx
      });
      if (res.status === 'success') {
        setMealPlan(prev => ({
          ...prev,
          days: res.days
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSwappingMeal(null);
    }
  };

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <span>{t('nav.meal_planner')}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Adaptive daily and weekly regimens calibrated to macro goals, dietary constraints, and zero-allergy safety.
          </p>
        </div>

        <button
          onClick={handleGeneratePlan}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all self-end md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Regenerate Adaptive Plan</span>
        </button>
      </div>

      {isLoading ? (
        <Loader message="Synthesizing personalized macro-balanced meal regimen..." />
      ) : mealPlan ? (
        <div className="space-y-6">
          {/* Target Macro Summary Header */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {mealPlan.diet_applied || 'Vegetarian'} Protocol
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {mealPlan.title || 'Personalized Regimen'}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {Math.round(mealPlan.target_calories)}
                </span>
                <span className="text-xs font-bold text-slate-400 ml-1">kcal target</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 text-center">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
                <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Protein</span>
                <p className="text-lg font-black text-blue-900 dark:text-blue-100">
                  {mealPlan.target_macros?.protein || 120}g
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold">Carbs</span>
                <p className="text-lg font-black text-amber-900 dark:text-amber-100">
                  {mealPlan.target_macros?.carbs || 230}g
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                <span className="text-xs text-rose-700 dark:text-rose-300 font-semibold">Fats</span>
                <p className="text-lg font-black text-rose-900 dark:text-rose-100">
                  {mealPlan.target_macros?.fat || 60}g
                </p>
              </div>
            </div>
          </div>

          {/* Allergen Exclusions Notice */}
          {mealPlan.allergen_exclusions_applied && mealPlan.allergen_exclusions_applied.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
              <ShieldAlert className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Allergen safety verified: Excluded all ingredients containing <strong>{mealPlan.allergen_exclusions_applied.join(', ')}</strong>.
              </span>
            </div>
          )}

          {/* Meal Schedule Cards */}
          <div className="space-y-4">
            {(mealPlan.days || []).map((day, dIdx) => (
              <div key={dIdx} className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {day.day}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {day.meals.map((meal, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                            {meal.meal_type}
                          </span>
                          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                            {Math.round(meal.calories)} kcal
                          </span>
                        </div>
                        <h5 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {meal.dish_name}
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {meal.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                          <span>P: <strong>{meal.protein}g</strong></span>
                          <span>C: <strong>{meal.carbs}g</strong></span>
                          <span>F: <strong>{meal.fat}g</strong></span>
                        </div>

                        <button
                          onClick={() => handleSwapMeal(dIdx, mIdx)}
                          disabled={swappingMeal === `${dIdx}-${mIdx}`}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
                          title="Swap with another meal recipe"
                        >
                          <Shuffle className={`w-3.5 h-3.5 ${swappingMeal === `${dIdx}-${mIdx}` ? 'animate-spin' : ''}`} />
                          <span>Swap</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Synchronized Grocery List */}
          {mealPlan.grocery_list && mealPlan.grocery_list.length > 0 && (
            <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft space-y-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Synchronized Grocery Checklist
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {mealPlan.grocery_list.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleCheck(idx)}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 text-xs text-left transition-colors"
                  >
                    {checkedItems[idx] ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span className={`font-medium ${checkedItems[idx] ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {item}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-400 italic">
            * {mealPlan.disclaimer || "General dietary guidance. Enforces a 1200 kcal floor to protect against crash starvation."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
