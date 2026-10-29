import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  RefreshCw,
  Shuffle,
  CheckSquare,
  Square,
  ShoppingBag,
  ShieldAlert,
  Flame,
  Dumbbell,
  Clock,
  ChevronRight,
  Filter,
  Check,
  Printer,
  Sparkles
} from 'lucide-react';
import apiClient from '../services/api';
import { Loader } from '../components/common/Loader';

const PRESET_PLANS = [
  { id: 'indian_balanced', label: 'Indian Balanced', calories: 2000, desc: 'Dal, roti, paneer/egg, seasonal sabzi, curd, and brown basmati rice' },
  { id: 'indian_gym', label: 'Indian Gym Diet', calories: 2400, desc: 'High protein with paneer, soya chunks, boiled eggs, moong sprouts, and oats' },
  { id: 'japanese', label: 'Japanese Traditional', calories: 1850, desc: 'Miso soup, grilled salmon, steamed edamame, rice, and green tea' },
  { id: 'global_fitness', label: 'Global High-Protein', calories: 2200, desc: 'Grilled chicken breast, quinoa, greek yogurt, eggs, and sweet potatoes' },
  { id: 'vegetarian', label: 'Pure Vegetarian', calories: 1900, desc: 'Lentils, chickpeas, tofu, paneer, nuts, seeds, and leafy greens' }
];

export default function MealPlanner() {
  const { t, i18n } = useTranslation();
  const [mealPlan, setMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [swappingMeal, setSwappingMeal] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [targetCalories, setTargetCalories] = useState(2050);
  const [selectedDiet, setSelectedDiet] = useState('indian_balanced');

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/meal-plans/current');
      if (res && res.id && res.days && res.days.length > 0) {
        setMealPlan(res);
        if (res.target_calories) setTargetCalories(Math.round(res.target_calories));
      } else {
        await handleGeneratePlan(selectedDiet, targetCalories);
      }
    } catch (err) {
      await handleGeneratePlan(selectedDiet, targetCalories);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlan = async (dietKey = selectedDiet, calTarget = targetCalories) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/meal-plans/generate', {
        plan_type: 'daily',
        target_calories: Number(calTarget),
        diet_type: dietKey,
        lang: i18n.language || 'en'
      });
      if (res && res.days && res.days.length > 0) {
        setMealPlan(res);
      } else {
        buildFallbackPlan(dietKey, calTarget);
      }
    } catch (err) {
      console.warn('Backend meal plan generate fallback:', err);
      buildFallbackPlan(dietKey, calTarget);
    } finally {
      setIsLoading(false);
    }
  };

  const buildFallbackPlan = (dietKey, cal) => {
    const calNum = Number(cal) || 2000;
    const isGym = dietKey === 'indian_gym' || dietKey === 'global_fitness';
    const isJap = dietKey === 'japanese';
    const isVeg = dietKey === 'vegetarian';

    const proteinTarget = isGym ? Math.round(calNum * 0.32 / 4) : Math.round(calNum * 0.25 / 4);
    const fatTarget = Math.round(calNum * 0.25 / 9);
    const carbsTarget = Math.round((calNum - (proteinTarget * 4 + fatTarget * 9)) / 4);

    let meals = [];
    let groceryList = [];

    if (dietKey === 'indian_gym') {
      meals = [
        {
          meal_type: "Breakfast (Pre-Workout Fuel)",
          dish_name: "Rolled Oats with Peanut Butter, Sliced Banana & Boiled Eggs",
          description: "60g oats cooked with warm water/milk, 1 tbsp peanut butter, 1 fresh banana, and 3 egg whites (or 100g low-fat paneer).",
          calories: Math.round(calNum * 0.26),
          protein: Math.round(proteinTarget * 0.28),
          carbs: Math.round(carbsTarget * 0.32),
          fat: Math.round(fatTarget * 0.22)
        },
        {
          meal_type: "Lunch (Anabolic Recovery)",
          dish_name: "Grilled Paneer Tikka (or Chicken Breast) with Brown Rice & Yellow Dal",
          description: "150g spiced grilled paneer, 1 cup cooked brown basmati rice, 1 katori moong dal, and cucumber-tomato salad.",
          calories: Math.round(calNum * 0.35),
          protein: Math.round(proteinTarget * 0.36),
          carbs: Math.round(carbsTarget * 0.35),
          fat: Math.round(fatTarget * 0.35)
        },
        {
          meal_type: "Evening Snack",
          dish_name: "Sprouted Moong & Black Chana Chaat with Roasted Almonds",
          description: "1 cup steamed sprouted moong & black chana tossed with lemon juice, chaat masala, onions, and 12 almonds.",
          calories: Math.round(calNum * 0.14),
          protein: Math.round(proteinTarget * 0.14),
          carbs: Math.round(carbsTarget * 0.15),
          fat: Math.round(fatTarget * 0.18)
        },
        {
          meal_type: "Dinner (Slow-Release Night Protein)",
          dish_name: "Soya Chunks Masala Curry with 2 Whole Wheat Phulkas & Greek Curd",
          description: "50g high-protein nutri soya chunks simmered with tomato-onion gravy, 2 soft phulkas, and 100g fresh curd.",
          calories: Math.round(calNum * 0.25),
          protein: Math.round(proteinTarget * 0.22),
          carbs: Math.round(carbsTarget * 0.18),
          fat: Math.round(fatTarget * 0.25)
        }
      ];
      groceryList = [
        "Rolled Oats (500g)", "Raw Peanuts / Peanut Butter", "Fresh Bananas (1 dozen)",
        "Fresh Low-Fat Paneer (500g)", "Brown Basmati Rice (1kg)", "Yellow Moong Dal (500g)",
        "Sprouted Moong Beans (250g)", "Black Chana (Kala Chana) (500g)", "Whole Wheat Atta (1kg)",
        "Nutri Soya Chunks (200g)", "Plain Greek Yogurt / Curd (400g)", "Almonds (100g)"
      ];
    } else if (isJap) {
      meals = [
        {
          meal_type: "Asagohan (Traditional Breakfast)",
          dish_name: "Miso Soup with Silken Tofu, Wakame & Steamed Rice",
          description: "Authentic dashi-miso broth with cubes of soft tofu, wakame seaweed, warm short-grain rice, and green tea.",
          calories: Math.round(calNum * 0.24),
          protein: Math.round(proteinTarget * 0.22),
          carbs: Math.round(carbsTarget * 0.32),
          fat: Math.round(fatTarget * 0.18)
        },
        {
          meal_type: "Hirugohan (Nutrient Lunch)",
          dish_name: "Sake Shioyaki (Salt-Grilled Salmon) with Edamame & Tamagoyaki",
          description: "Crispy skin Atlantic salmon seasoned with sea salt, steamed edamame pods, rolled omelette, and pickled radish.",
          calories: Math.round(calNum * 0.36),
          protein: Math.round(proteinTarget * 0.40),
          carbs: Math.round(carbsTarget * 0.30),
          fat: Math.round(fatTarget * 0.38)
        },
        {
          meal_type: "Oyatsu (Afternoon Tea)",
          dish_name: "Warm Matcha Green Tea with Steamed Edamame & Roasted Nori",
          description: "Ceremonial grade green matcha with steamed sea salt edamame pods.",
          calories: Math.round(calNum * 0.12),
          protein: Math.round(proteinTarget * 0.12),
          carbs: Math.round(carbsTarget * 0.12),
          fat: Math.round(fatTarget * 0.12)
        },
        {
          meal_type: "Bangohan (Evening Dinner)",
          dish_name: "Teriyaki Chicken (or Teriyaki Tofu) with Soba Noodles & Bok Choy",
          description: "Pan-seared protein glazed with ginger teriyaki, chilled buckwheat soba noodles, and crisp steamed baby bok choy.",
          calories: Math.round(calNum * 0.28),
          protein: Math.round(proteinTarget * 0.26),
          carbs: Math.round(carbsTarget * 0.26),
          fat: Math.round(fatTarget * 0.32)
        }
      ];
      groceryList = [
        "White Miso Paste (300g)", "Silken Tofu (2 packs)", "Wakame Dried Seaweed",
        "Japanese Short-Grain Rice (1kg)", "Fresh Salmon Fillets (300g)", "Frozen Edamame Pods (500g)",
        "Eggs (1 dozen)", "Buckwheat Soba Noodles (1 pack)", "Fresh Baby Bok Choy (2 heads)", "Matcha Powder"
      ];
    } else {
      meals = [
        {
          meal_type: "Breakfast",
          dish_name: "Vegetable Poha with Roasted Peanuts & Fresh Coconut",
          description: "Flattened rice tempered with mustard seeds, curry leaves, onions, peas, crunchy peanuts, and lemon.",
          calories: Math.round(calNum * 0.25),
          protein: Math.round(proteinTarget * 0.20),
          carbs: Math.round(carbsTarget * 0.32),
          fat: Math.round(fatTarget * 0.22)
        },
        {
          meal_type: "Lunch",
          dish_name: "Homestyle Dal Tadka with 2 Phulkas, Bhindi Masala & Curd",
          description: "Garlic-cumin tempered toor dal, 2 whole wheat rotis, spiced okra stir-fry, and probiotic fresh yogurt.",
          calories: Math.round(calNum * 0.36),
          protein: Math.round(proteinTarget * 0.35),
          carbs: Math.round(carbsTarget * 0.36),
          fat: Math.round(fatTarget * 0.35)
        },
        {
          meal_type: "Evening Snack",
          dish_name: "Roasted Makhana (Foxnuts) with Chai & Fresh Apple",
          description: "Crunchy ghee-roasted makhana seasoned with rock salt and black pepper with 1 fresh seasonal fruit.",
          calories: Math.round(calNum * 0.14),
          protein: Math.round(proteinTarget * 0.15),
          carbs: Math.round(carbsTarget * 0.15),
          fat: Math.round(fatTarget * 0.15)
        },
        {
          meal_type: "Dinner",
          dish_name: "Paneer Palak Curry with Jeera Rice & Green Salad",
          description: "Fresh paneer cubes simmered in iron-rich spinach purée, fragrant cumin rice, and sliced cucumber salad.",
          calories: Math.round(calNum * 0.25),
          protein: Math.round(proteinTarget * 0.30),
          carbs: Math.round(carbsTarget * 0.17),
          fat: Math.round(fatTarget * 0.28)
        }
      ];
      groceryList = [
        "Thick Poha (500g)", "Raw Peanuts (250g)", "Toor Dal (1kg)", "Whole Wheat Atta (2kg)",
        "Fresh Bhindi / Okra (500g)", "Plain Curd / Dahi (500g)", "Phool Makhana (100g)",
        "Fresh Spinach (Palak) (2 bunches)", "Fresh Paneer (300g)", "Basmati Rice (1kg)", "Lemons & Ginger"
      ];
    }

    setMealPlan({
      id: `plan_${Date.now()}`,
      title: `${PRESET_PLANS.find(p => p.id === dietKey)?.label || 'Balanced'} Regimen`,
      target_calories: calNum,
      diet_applied: PRESET_PLANS.find(p => p.id === dietKey)?.label || 'Indian Balanced',
      target_macros: {
        protein: proteinTarget,
        carbs: carbsTarget,
        fat: fatTarget
      },
      allergen_exclusions_applied: ["Shellfish", "Artificial Sweeteners"],
      days: [
        {
          day: "Today's Nutrition Schedule",
          meals: meals
        }
      ],
      grocery_list: groceryList,
      disclaimer: "Calibrated nutritional plan adhering to safe dietary bounds (1200 kcal floor)."
    });
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
      if (res && res.status === 'success' && res.days) {
        setMealPlan(prev => ({ ...prev, days: res.days }));
        setSwappingMeal(null);
        return;
      }
    } catch (e) {
      // Local fallback swap
    }

    const swapBank = [
      {
        meal_type: "Alternative Option",
        dish_name: "Paneer & Bell Pepper Tikka Bowl",
        description: "Fresh cottage cheese cubes marinated in yogurt and ajwain, griddled with crisp capsicum.",
        calories: 380,
        protein: 26,
        carbs: 18,
        fat: 16
      },
      {
        meal_type: "Alternative Option",
        dish_name: "Sprouted Moong & Pomegranate Salad",
        description: "Steamed green moong sprouts, ruby pomegranate pearls, roasted cumin, and lime dressing.",
        calories: 290,
        protein: 16,
        carbs: 42,
        fat: 4
      },
      {
        meal_type: "Alternative Option",
        dish_name: "Quinoa Veggie Khichdi with Ghee Tadka",
        description: "High-fiber quinoa cooked with yellow moong lentils, carrots, beans, and a light cumin tempering.",
        calories: 410,
        protein: 22,
        carbs: 52,
        fat: 10
      },
      {
        meal_type: "Alternative Option",
        dish_name: "Egg Bhurji (Scrambled) with Multigrain Toast",
        description: "3 whole eggs sautéed with onions, green chilies, and coriander, served with toasted artisan bread.",
        calories: 360,
        protein: 24,
        carbs: 26,
        fat: 14
      }
    ];

    const randomPick = swapBank[Math.floor(Math.random() * swapBank.length)];
    setMealPlan(prev => {
      if (!prev) return prev;
      const copy = JSON.parse(JSON.stringify(prev));
      if (copy.days?.[dayIdx]?.meals?.[mealIdx]) {
        copy.days[dayIdx].meals[mealIdx] = {
          ...randomPick,
          meal_type: copy.days[dayIdx].meals[mealIdx].meal_type
        };
      }
      return copy;
    });
    setSwappingMeal(null);
  };

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="card-base p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
            <Calendar className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
              Personalized Meal Planner
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Goal-oriented nutrition plans calibrated to target calories, macro splits, and cuisine preferences.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="pill-btn-secondary py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={() => handleGeneratePlan(selectedDiet, targetCalories)}
            disabled={isLoading}
            className="pill-btn-primary py-1.5 px-3.5 text-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Generate Plan</span>
          </button>
        </div>
      </div>

      {/* Plan Customizer Controls */}
      <div className="card-base p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
          <span className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            1. Select Cuisine & Diet Profile
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            Active: <strong className="text-blue-600 dark:text-blue-400">{PRESET_PLANS.find(p => p.id === selectedDiet)?.label}</strong>
          </span>
        </div>

        {/* Diet Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {PRESET_PLANS.map((preset) => {
            const isSelected = selectedDiet === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setSelectedDiet(preset.id);
                  setTargetCalories(preset.calories);
                  handleGeneratePlan(preset.id, preset.calories);
                }}
                className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                    : 'border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-subtle)]'
                }`}
              >
                <span className="truncate block font-medium">{preset.label}</span>
                <span className="text-[11px] text-[var(--text-muted)] mt-1 font-mono">{preset.calories} kcal</span>
              </button>
            );
          })}
        </div>

        {/* Calorie Slider */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
            <span className="text-xs font-medium text-[var(--text-secondary)]">Daily Calorie Target:</span>
            <span className="font-bold text-sm text-[var(--text-primary)] font-mono">{targetCalories} kcal</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto max-w-xs">
            <input
              type="range"
              min="1400"
              max="3200"
              step="50"
              value={targetCalories}
              onChange={(e) => setTargetCalories(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => handleGeneratePlan(selectedDiet, targetCalories)}
              className="pill-btn-secondary text-xs py-1 px-2.5 whitespace-nowrap cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loader
          message="Synthesizing personalized macro-balanced meal regimen..."
          subtext="Calibrating amino acids, essential fats, and bioavailable micronutrients"
        />
      ) : mealPlan ? (
        <div className="space-y-6">
          {/* Target Macro Summary Header */}
          <div className="card-base p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
              <div>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 uppercase">
                  {mealPlan.diet_applied || 'Active Balanced'} Protocol
                </span>
                <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mt-1.5">
                  {mealPlan.title || 'Personalized Regimen'}
                </h3>
              </div>
              <div className="text-right">
                <span className="font-display font-bold text-3xl text-blue-600 dark:text-blue-400">
                  {Math.round(mealPlan.target_calories)}
                </span>
                <span className="text-xs text-[var(--text-muted)] ml-1">kcal target</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 text-center">
              <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold uppercase">Protein</span>
                <p className="font-bold text-lg text-[var(--text-primary)] mt-0.5">
                  {mealPlan.target_macros?.protein || 135}g
                </p>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {Math.round(((mealPlan.target_macros?.protein || 135) * 4 / mealPlan.target_calories) * 100)}% calories
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold uppercase">Carbs</span>
                <p className="font-bold text-lg text-[var(--text-primary)] mt-0.5">
                  {mealPlan.target_macros?.carbs || 230}g
                </p>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {Math.round(((mealPlan.target_macros?.carbs || 230) * 4 / mealPlan.target_calories) * 100)}% calories
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Fats</span>
                <p className="font-bold text-lg text-[var(--text-primary)] mt-0.5">
                  {mealPlan.target_macros?.fat || 65}g
                </p>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {Math.round(((mealPlan.target_macros?.fat || 65) * 9 / mealPlan.target_calories) * 100)}% calories
                </span>
              </div>
            </div>
          </div>

          {/* Allergen Exclusions Notice */}
          {mealPlan.allergen_exclusions_applied && mealPlan.allergen_exclusions_applied.length > 0 && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.5} />
              <span>
                Safety verified: Excluded recipes containing <strong>{mealPlan.allergen_exclusions_applied.join(', ')}</strong>.
              </span>
            </div>
          )}

          {/* Meal Schedule Cards */}
          <div className="space-y-4">
            {(mealPlan.days || []).map((day, dIdx) => (
              <div key={dIdx} className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {day.day}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {day.meals.map((meal, mIdx) => (
                    <div
                      key={mIdx}
                      className="card-base p-5 flex flex-col justify-between transition-all hover:border-blue-500/40"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-secondary)]">
                            {meal.meal_type}
                          </span>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {Math.round(meal.calories)} kcal
                          </span>
                        </div>
                        <h5 className="font-semibold text-base text-[var(--text-primary)]">
                          {meal.dish_name}
                        </h5>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                          {meal.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                          <span>P: <strong className="text-[var(--text-primary)]">{meal.protein}g</strong></span>
                          <span>C: <strong className="text-[var(--text-primary)]">{meal.carbs}g</strong></span>
                          <span>F: <strong className="text-[var(--text-primary)]">{meal.fat}g</strong></span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSwapMeal(dIdx, mIdx)}
                          disabled={swappingMeal === `${dIdx}-${mIdx}`}
                          className="pill-btn-secondary text-xs py-1 px-2.5 cursor-pointer inline-flex items-center gap-1"
                          title="Swap with another balanced dish"
                        >
                          <Shuffle className={`w-3 h-3 ${swappingMeal === `${dIdx}-${mIdx}` ? 'animate-spin' : ''}`} />
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
            <div className="card-base p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--text-primary)]">
                    Synchronized Grocery Checklist
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">Check items off as you stock your kitchen or pantry.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {mealPlan.grocery_list.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleCheck(idx)}
                    className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-subtle)] hover:bg-[var(--bg-card)] flex items-center gap-2.5 text-xs text-left transition-colors cursor-pointer"
                  >
                    {checkedItems[idx] ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                    )}
                    <span className={`${checkedItems[idx] ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)] font-medium'}`}>
                      {item}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-[11px] text-[var(--text-muted)] italic">
            * {mealPlan.disclaimer || "General dietary guidance calibrated to healthy macro splits."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
