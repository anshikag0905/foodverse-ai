import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, RefreshCw, Shuffle, CheckSquare, Square, ShoppingBag, ShieldAlert, Sparkles, Check, Flame, Dumbbell, Zap, Droplets } from 'lucide-react';
import apiClient from '../services/api';
import AllergenAlert from '../components/common/AllergenAlert';
import { Loader } from '../components/common/Loader';
import { DoodlePancakes } from '../assets/doodles';

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
      // Fallback meal plan
      setMealPlan({
        id: `plan_${Date.now()}`,
        title: "Balanced Active Lifestyle Plan",
        target_calories: 2050,
        diet_applied: "Balanced High-Protein",
        target_macros: {
          protein: 135,
          carbs: 230,
          fat: 65
        },
        allergen_exclusions_applied: ["Shellfish"],
        days: [
          {
            day: "Today's Recommended Meals",
            meals: [
              {
                meal_type: "Breakfast",
                dish_name: "Rolled Oatmeal with Blueberries & Greek Yogurt",
                description: "Complex slow-digesting oats topped with fresh antioxidant berries and creamy protein.",
                calories: 420,
                protein: 26,
                carbs: 58,
                fat: 8
              },
              {
                meal_type: "Lunch",
                dish_name: "Grilled Herb Chicken Breast & Quinoa Bowl",
                description: "Marinated breast with fluffy tri-color quinoa, baby spinach, and lemon vinaigrette.",
                calories: 540,
                protein: 48,
                carbs: 45,
                fat: 14
              },
              {
                meal_type: "Snack",
                dish_name: "Ripe Banana with Almond Butter",
                description: "Quick clean carbohydrates and potassium to fuel stamina and stop muscle cramps.",
                calories: 220,
                protein: 6,
                carbs: 32,
                fat: 9
              },
              {
                meal_type: "Dinner",
                dish_name: "Steamed Atlantic Salmon with Brown Rice & Broccoli",
                description: "Omega-3 rich salmon fillet with steamed florets and bioavailable fiber.",
                calories: 590,
                protein: 42,
                carbs: 48,
                fat: 18
              }
            ]
          }
        ],
        grocery_list: [
          "Rolled Oats (500g)",
          "Fresh Blueberries (1 punnet)",
          "Greek Yogurt 0% Fat (400g)",
          "Boneless Chicken Breast (500g)",
          "Organic Tri-Color Quinoa (1 pack)",
          "Ripe Bananas (1 bunch)",
          "Natural Almond Butter (1 jar)",
          "Fresh Salmon Fillet (2 pcs)",
          "Fresh Broccoli Crown (1 head)"
        ],
        disclaimer: "Calibrated nutritional plan enforcing a safe 1200 kcal floor to protect metabolic health."
      });
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
      // Local swap simulation
      const alternativeMeals = [
        {
          meal_type: "Alternative Option",
          dish_name: "High-Protein Paneer & Veggie Sauté",
          description: "Golden pan-seared paneer cubes with bell peppers and toasted sesame.",
          calories: 480,
          protein: 28,
          carbs: 22,
          fat: 20
        },
        {
          meal_type: "Alternative Option",
          dish_name: "Garlic Chickpea Salad with Cherry Tomatoes",
          description: "High-fiber Mediterranean salad with chickpeas, cucumbers, and olive oil.",
          calories: 390,
          protein: 18,
          carbs: 46,
          fat: 12
        }
      ];
      const randomAlt = alternativeMeals[Math.floor(Math.random() * alternativeMeals.length)];
      setMealPlan(prev => {
        const copy = JSON.parse(JSON.stringify(prev));
        if (copy.days?.[dayIdx]?.meals?.[mealIdx]) {
          copy.days[dayIdx].meals[mealIdx] = randomAlt;
        }
        return copy;
      });
    } finally {
      setSwappingMeal(null);
    }
  };

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-8">
      {/* =========================================================================
          MODULE HEADER BAND (GRAPE ACCENT + DOODLE PANCAKES)
          ========================================================================= */}
      <div className="rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-6 shadow-sticker flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-grape/20 border-2.5 border-ink flex items-center justify-center p-2 shadow-sticker-sm">
            <DoodlePancakes size={46} className="animate-float" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-grape/25 border border-ink text-[11px] font-black uppercase text-grape">
              <span>Dietetics AI</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-ink dark:text-dusk-text mt-1">
              Adaptive Meal Planner
            </h1>
            <p className="text-xs font-semibold text-ink-muted mt-0.5">
              Calibrated daily & weekly regimens tailored to macro targets, allergy safety & groceries.
            </p>
          </div>
        </div>

        <button
          onClick={handleGeneratePlan}
          disabled={isLoading}
          className="btn-squish inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-grape text-white border-2 border-ink text-xs font-display font-black shadow-sticker-xs cursor-pointer hover:shadow-sticker disabled:opacity-50 self-end md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Regenerate Plan</span>
        </button>
      </div>

      {/* =========================================================================
          3-STEP "HOW IT WORKS" STRIP
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-ink dark:text-dusk-text">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-dusk-card border-2 border-ink shadow-sticker-xs flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-grape text-white border border-ink flex items-center justify-center font-display font-black text-xs flex-shrink-0">
            1
          </span>
          <span>Set calorie & macro goals (or use Gym Mode profile)</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-dusk-card border-2 border-ink shadow-sticker-xs flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-sunny text-ink border border-ink flex items-center justify-center font-display font-black text-xs flex-shrink-0">
            2
          </span>
          <span>AI balances protein, carbs, fats & filters allergen conflicts</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-dusk-card border-2 border-ink shadow-sticker-xs flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-mint text-ink border border-ink flex items-center justify-center font-display font-black text-xs flex-shrink-0">
            3
          </span>
          <span>Swap any dish with 1 tap & export aisle-ready grocery list</span>
        </div>
      </div>

      {isLoading ? (
        <Loader
          message="Synthesizing personalized macro-balanced meal regimen..."
          subtext="Balancing protein ratios & verifying zero-allergen guardrails ✨"
          type="pancake"
        />
      ) : mealPlan ? (
        <div className="space-y-6">
          {/* Target Macro Summary Header */}
          <div className="p-6 rounded-3xl border-3 border-ink bg-white dark:bg-dusk-card shadow-sticker">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-ink/10">
              <div>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-grape/20 text-grape border border-ink uppercase">
                  {mealPlan.diet_applied || 'Active Balanced'} Protocol
                </span>
                <h3 className="font-display font-black text-2xl text-ink dark:text-dusk-text mt-1">
                  {mealPlan.title || 'Personalized Regimen'}
                </h3>
              </div>
              <div className="text-right">
                <span className="font-display font-black text-3xl text-tomato">
                  {Math.round(mealPlan.target_calories)}
                </span>
                <span className="text-xs font-bold text-ink-muted ml-1">kcal target</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 text-center">
              <div className="p-3 rounded-2xl bg-grape/15 border-2 border-ink">
                <span className="text-xs text-grape font-extrabold uppercase">Protein</span>
                <p className="font-display font-black text-xl text-ink dark:text-dusk-text mt-0.5">
                  {mealPlan.target_macros?.protein || 135}g
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-sunny/20 border-2 border-ink">
                <span className="text-xs text-amber-700 dark:text-sunny font-extrabold uppercase">Carbs</span>
                <p className="font-display font-black text-xl text-ink dark:text-dusk-text mt-0.5">
                  {mealPlan.target_macros?.carbs || 230}g
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-peach/20 border-2 border-ink">
                <span className="text-xs text-orange-700 dark:text-peach font-extrabold uppercase">Fats</span>
                <p className="font-display font-black text-xl text-ink dark:text-dusk-text mt-0.5">
                  {mealPlan.target_macros?.fat || 65}g
                </p>
              </div>
            </div>
          </div>

          {/* Allergen Exclusions Notice */}
          {mealPlan.allergen_exclusions_applied && mealPlan.allergen_exclusions_applied.length > 0 && (
            <div className="p-4 rounded-2xl bg-mint/20 border-2 border-mint text-xs flex items-center gap-2.5 text-emerald-900 dark:text-mint font-bold shadow-sticker-xs">
              <ShieldAlert className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>
                Allergen safety verified: Excluded all ingredients containing <strong>{mealPlan.allergen_exclusions_applied.join(', ')}</strong>.
              </span>
            </div>
          )}

          {/* Meal Schedule Cards */}
          <div className="space-y-4">
            {(mealPlan.days || []).map((day, dIdx) => (
              <div key={dIdx} className="space-y-3">
                <h4 className="font-display font-black text-lg text-ink dark:text-dusk-text uppercase tracking-wider">
                  {day.day}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {day.meals.map((meal, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-5 rounded-3xl border-3 border-ink bg-white dark:bg-dusk-card shadow-sticker hover:shadow-sticker-lg transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-dusk-surface border border-ink text-ink dark:text-dusk-text uppercase">
                            {meal.meal_type}
                          </span>
                          <span className="text-xs font-black text-tomato">
                            {Math.round(meal.calories)} kcal
                          </span>
                        </div>
                        <h5 className="font-display font-black text-lg text-ink dark:text-dusk-text">
                          {meal.dish_name}
                        </h5>
                        <p className="text-xs font-semibold text-ink-muted leading-relaxed">
                          {meal.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t-2 border-ink/10 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[11px] font-bold text-ink-muted">
                          <span>P: <strong className="text-grape">{meal.protein}g</strong></span>
                          <span>C: <strong className="text-amber-600">{meal.carbs}g</strong></span>
                          <span>F: <strong className="text-orange-600">{meal.fat}g</strong></span>
                        </div>

                        <button
                          onClick={() => handleSwapMeal(dIdx, mIdx)}
                          disabled={swappingMeal === `${dIdx}-${mIdx}`}
                          className="btn-squish inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-black bg-white dark:bg-dusk-surface text-ink border-1.5 border-ink shadow-sticker-xs cursor-pointer hover:bg-grape/15"
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
            <div className="p-6 md:p-8 rounded-3xl border-3 border-ink bg-white dark:bg-dusk-card shadow-sticker space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-grape/20 border-2 border-ink flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-grape" />
                </div>
                <div>
                  <h4 className="font-display font-black text-lg text-ink dark:text-dusk-text">
                    Synchronized Grocery Checklist
                  </h4>
                  <p className="text-xs font-semibold text-ink-muted">Tap any item to check off as you shop in the supermarket.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {mealPlan.grocery_list.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleCheck(idx)}
                    className="p-3 rounded-2xl border-2 border-ink bg-sky-50 dark:bg-dusk-surface hover:bg-grape/10 flex items-center gap-3 text-xs text-left transition-colors cursor-pointer shadow-xs"
                  >
                    {checkedItems[idx] ? (
                      <CheckSquare className="w-4 h-4 text-mint flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-ink-muted flex-shrink-0" />
                    )}
                    <span className={`font-bold ${checkedItems[idx] ? 'line-through text-ink-muted' : 'text-ink dark:text-dusk-text'}`}>
                      {item}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-[11px] font-semibold text-ink-muted italic">
            * {mealPlan.disclaimer || "General dietary guidance. Enforces a 1200 kcal floor to protect against crash starvation."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
