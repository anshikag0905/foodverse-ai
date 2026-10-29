import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  Plus,
  CheckCircle2,
  X,
  Flame,
  Dumbbell,
  Package,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const CUTE_FOODS = [
  {
    id: 'banana',
    emoji: '🍌',
    name: 'Ripe Banana',
    serving: '1 medium (118g)',
    cal: 105,
    prot: 1.3,
    carbs: 27.0,
    fat: 0.3,
    fiber: 3.1,
    tag: 'Pre-Workout Fuel',
    tip: 'Packed with potassium & quick carbs to stop muscle cramps and boost workout stamina!'
  },
  {
    id: 'pancake',
    emoji: '🥞',
    name: 'Fluffy Pancakes',
    serving: 'Stack of 2',
    cal: 260,
    prot: 6.0,
    carbs: 34.0,
    fat: 5.2,
    fiber: 1.5,
    tag: 'Weekend Energy',
    tip: 'Pair with maple syrup or Greek yogurt for an epic high-energy morning breakfast!'
  },
  {
    id: 'sushi',
    emoji: '🌯',
    name: 'Sushi Burrito',
    serving: '1 large roll (200g)',
    cal: 290,
    prot: 12.5,
    carbs: 48.0,
    fat: 4.0,
    fiber: 2.8,
    tag: 'Clean Carbs',
    tip: 'Fresh salmon/tuna, nori seaweed, and seasoned rice provide clean brain-boosting omega-3s.'
  },
  {
    id: 'chicken',
    emoji: '🍗',
    name: 'Roast Chicken Leg',
    serving: '1 leg (180g)',
    cal: 248,
    prot: 38.0,
    carbs: 0.0,
    fat: 9.5,
    fiber: 0.0,
    tag: 'Gym Muscle Builder',
    tip: 'Exceptional bioavailable protein for muscle recovery and lean tissue synthesis.'
  },
  {
    id: 'ramen',
    emoji: '🍜',
    name: 'Tokyo Ramen Bowl',
    serving: '1 big bowl',
    cal: 420,
    prot: 16.0,
    carbs: 58.0,
    fat: 14.0,
    fiber: 3.0,
    tag: 'Warm Comfort',
    tip: 'Rich bone broth replenishes sodium and electrolytes after heavy cardio sessions.'
  },
  {
    id: 'pie',
    emoji: '🥧',
    name: 'Berry Cream Pie',
    serving: '1 slice (120g)',
    cal: 280,
    prot: 3.2,
    carbs: 42.0,
    fat: 11.0,
    fiber: 2.2,
    tag: 'Sweet Treat',
    tip: 'Fresh berries supply polyphenols and vitamin C to protect cells against oxidative stress.'
  },
  {
    id: 'pizza',
    emoji: '🍕',
    name: 'Pepperoni Pizza Slice',
    serving: '1 regular slice',
    cal: 272,
    prot: 12.2,
    carbs: 31.0,
    fat: 10.8,
    fiber: 1.8,
    tag: 'Cheat Meal Staple',
    tip: 'Melted mozzarella gives solid calcium and protein; enjoy mindfully within your macro budget!'
  },
  {
    id: 'hotdog',
    emoji: '🌭',
    name: 'Classic Hot Dog',
    serving: '1 loaded dog',
    cal: 290,
    prot: 11.0,
    carbs: 24.0,
    fat: 16.0,
    fiber: 1.2,
    tag: 'Quick Snack',
    tip: 'Fast calorie-dense fuel when you are on the go. Pair with mustard for zero extra sugar.'
  },
  {
    id: 'salad',
    emoji: '🥗',
    name: 'Rainbow Crunch Salad',
    serving: '1 large bowl (250g)',
    cal: 85,
    prot: 3.5,
    carbs: 12.0,
    fat: 2.0,
    fiber: 4.8,
    tag: 'Micro Nutrient Bomb',
    tip: 'Crispy greens, cherry tomatoes, and cucumber keep gut microbiome flourishing.'
  },
  {
    id: 'burger',
    emoji: '🍔',
    name: 'Gourmet Cheeseburger',
    serving: '1 medium burger',
    cal: 380,
    prot: 22.0,
    carbs: 33.0,
    fat: 17.0,
    fiber: 2.0,
    tag: 'Bulking Classic',
    tip: 'High in zinc, B12, and iron, powering high-intensity hypertrophy workouts.'
  },
  {
    id: 'popcorn',
    emoji: '🍿',
    name: 'Buttery Popcorn Box',
    serving: '1 large box (60g)',
    cal: 190,
    prot: 4.0,
    carbs: 32.0,
    fat: 5.5,
    fiber: 5.8,
    tag: 'High-Volume Snack',
    tip: '100% whole grain with massive volume per calorie. One of the best movie diet hacks!'
  },
  {
    id: 'donut',
    emoji: '🍩',
    name: 'Glazed Pink Donut',
    serving: '1 frosted donut',
    cal: 240,
    prot: 3.0,
    carbs: 32.0,
    fat: 11.5,
    fiber: 0.8,
    tag: 'Sugar Rush',
    tip: 'Quick blood glucose reload right after exhausting marathon or heavy leg day!'
  },
  {
    id: 'taco',
    emoji: '🌮',
    name: 'Crispy Beef Taco',
    serving: '1 crunchy taco',
    cal: 180,
    prot: 9.5,
    carbs: 14.0,
    fat: 9.0,
    fiber: 2.2,
    tag: 'Flavor Fiesta',
    tip: 'Crunchy corn shell with spiced protein and crisp shredded lettuce.'
  },
  {
    id: 'avocado',
    emoji: '🥑',
    name: 'Creamy Avocado',
    serving: 'Half medium (80g)',
    cal: 160,
    prot: 2.0,
    carbs: 8.5,
    fat: 14.7,
    fiber: 6.7,
    tag: 'Healthy Fats',
    tip: 'High oleic monounsaturated fats lower LDL cholesterol and boost nutrient absorption.'
  },
  {
    id: 'strawberries',
    emoji: '🍓',
    name: 'Sweet Strawberries',
    serving: '1 cup (150g)',
    cal: 49,
    prot: 1.0,
    carbs: 11.7,
    fat: 0.5,
    fiber: 3.0,
    tag: 'Skin Glow Food',
    tip: 'More vitamin C than an orange! Sweet, low glycemic, and satisfies sugar cravings naturally.'
  }
];

export default function CuteFoodPlayground({ onLoggedFood }) {
  const [selectedFood, setSelectedFood] = useState(null);
  const [successToast, setSuccessToast] = useState('');
  const [multiplier, setMultiplier] = useState(1);

  const handleSelect = (food) => {
    setSelectedFood(food);
    setMultiplier(1);
  };

  const handleLogToGym = (food) => {
    const today = new Date().toISOString().split('T')[0];
    const itemCal = Math.round(food.cal * multiplier * 10) / 10;
    const itemProt = Math.round(food.prot * multiplier * 10) / 10;
    const itemCarb = Math.round(food.carbs * multiplier * 10) / 10;
    const itemFat = Math.round(food.fat * multiplier * 10) / 10;

    const logEntry = {
      id: Date.now(),
      log_date: today,
      meal_type: 'snack',
      meal_name: multiplier === 1 ? `${food.emoji} ${food.name}` : `${food.emoji} ${multiplier}x ${food.name}`,
      calories: itemCal,
      protein_g: itemProt,
      carbs_g: itemCarb,
      fat_g: itemFat,
      water_ml: 0,
      created_at: new Date().toISOString()
    };

    try {
      const raw = localStorage.getItem(`foodverse_gym_logs_${today}`);
      const logs = raw ? JSON.parse(raw) : [];
      localStorage.setItem(`foodverse_gym_logs_${today}`, JSON.stringify([logEntry, ...logs]));
    } catch (e) {
      console.warn('LocalStorage save:', e);
    }

    setSuccessToast(`🎉 Logged ${multiplier > 1 ? `${multiplier}x ` : ''}${food.emoji} ${food.name} (${itemCal} kcal, ${itemProt}g Protein)!`);
    setTimeout(() => setSuccessToast(''), 3500);
    setSelectedFood(null);

    if (onLoggedFood) {
      onLoggedFood(logEntry);
    }
  };

  const handleAddToPantry = (food) => {
    const newItem = {
      id: Date.now(),
      name: food.name,
      category: 'Produce',
      quantity: multiplier,
      unit: 'servings',
      storage_location: 'fridge',
      days_shelf_life: 7,
      status: 'Fresh',
      days_remaining: 7,
      purchase_date: new Date().toISOString(),
      expiry_date: new Date(Date.now() + 7 * 86400000).toISOString(),
      is_active: true
    };

    try {
      const raw = localStorage.getItem('foodverse_pantry_items');
      const items = raw ? JSON.parse(raw) : [];
      localStorage.setItem('foodverse_pantry_items', JSON.stringify([newItem, ...items]));
    } catch (e) {
      console.warn('Pantry save:', e);
    }

    setSuccessToast(`📦 Saved ${food.emoji} ${food.name} to your Pantry Tracker!`);
    setTimeout(() => setSuccessToast(''), 3500);
    setSelectedFood(null);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ffeef4] via-[#fff5f8] to-[#fbf0f6] dark:from-slate-900/90 dark:via-purple-950/20 dark:to-slate-900/90 border-2 border-rose-200/90 dark:border-rose-900/30 p-6 sm:p-8 shadow-md">
      {/* Playful Floating Confetti Dots (Matching Screenshot 4 Reference) */}
      <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-pink-400/50 animate-ping" />
      <div className="absolute top-12 right-12 w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
      <div className="absolute bottom-8 left-16 w-3.5 h-3.5 rounded-full bg-purple-400/40" />
      <div className="absolute top-1/2 left-4 w-2 h-2 rounded-full bg-emerald-400/50" />
      <div className="absolute bottom-6 right-20 w-3 h-3 rounded-full bg-rose-400/50" />
      <div className="absolute top-8 right-1/3 w-2.5 h-2.5 rounded-full bg-amber-400/50" />

      {/* Hero Header (Inspired directly by user reference image "Hungry?") */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" />
          Interactive Multimodal Food Playground
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-rounded">
          Hungry? What's On Your Plate? ✨
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
          Tap any cute food doodle below to instantly calculate macros, discover science tips, or log straight into your Gym Tracker!
        </p>

        {/* Primary Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/food-scan"
            className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-500/25 transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            📸 Scan Real Meal
          </Link>
          <span className="text-xs font-bold text-slate-400">or</span>
          <button
            onClick={() => handleSelect(CUTE_FOODS[0])}
            className="px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-rose-50 text-rose-600 dark:text-rose-300 border-2 border-rose-300 dark:border-rose-800 font-extrabold text-xs sm:text-sm shadow-2xs transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            🍌 Select Food Icon
          </button>
        </div>
      </div>

      {/* Cute Celebration Toast */}
      {successToast && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-500 text-white text-center font-bold text-sm shadow-lg flex items-center justify-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Interactive Food Doodles Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3 sm:gap-4 pt-2">
        {CUTE_FOODS.map((food) => (
          <button
            key={food.id}
            type="button"
            onClick={() => handleSelect(food)}
            className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-white/95 dark:bg-slate-800/90 border border-rose-200/90 dark:border-slate-700 hover:border-rose-400 hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-200 group cursor-pointer text-center relative"
          >
            <span className="text-3xl sm:text-4xl mb-1 group-hover:rotate-6 transition-transform block">
              {food.emoji}
            </span>
            <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 truncate w-full block">
              {food.name}
            </span>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block mt-0.5">
              {food.cal} kcal
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Cute Detail Modal */}
      {selectedFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-rose-300 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedFood(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Emoji */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-4xl shadow-inner">
                {selectedFood.emoji}
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold uppercase tracking-wide">
                  {selectedFood.tag}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedFood.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Standard serving: {selectedFood.serving}
                </p>
              </div>
            </div>

            {/* Portions Multiplier Stepper */}
            <div className="bg-rose-50/70 dark:bg-slate-800/60 rounded-2xl p-3 border border-rose-100 dark:border-slate-700 flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Portion Size:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMultiplier(Math.max(0.5, multiplier - 0.5))}
                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 font-bold text-rose-600 shadow-2xs hover:bg-rose-100 transition flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-sm font-black text-rose-600 w-10 text-center">
                  {multiplier}x
                </span>
                <button
                  type="button"
                  onClick={() => setMultiplier(multiplier + 0.5)}
                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 font-bold text-rose-600 shadow-2xs hover:bg-rose-100 transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Macro Breakdown Cards */}
            <div className="grid grid-cols-4 gap-2 text-center mb-4">
              <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block uppercase">
                  Calories
                </span>
                <span className="text-base font-black text-amber-900 dark:text-amber-200">
                  {Math.round(selectedFood.cal * multiplier)}
                </span>
                <span className="text-[9px] text-amber-600 dark:text-amber-400 block">kcal</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 block uppercase">
                  Protein
                </span>
                <span className="text-base font-black text-rose-900 dark:text-rose-200">
                  {Math.round(selectedFood.prot * multiplier * 10) / 10}g
                </span>
                <span className="text-[9px] text-rose-600 dark:text-rose-400 block">muscle</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/40">
                <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 block uppercase">
                  Carbs
                </span>
                <span className="text-base font-black text-sky-900 dark:text-sky-200">
                  {Math.round(selectedFood.carbs * multiplier * 10) / 10}g
                </span>
                <span className="text-[9px] text-sky-600 dark:text-sky-400 block">energy</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">
                  Fats
                </span>
                <span className="text-base font-black text-emerald-900 dark:text-emerald-200">
                  {Math.round(selectedFood.fat * multiplier * 10) / 10}g
                </span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block">vitality</span>
              </div>
            </div>

            {/* Smart Science Tip */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 mb-5 leading-relaxed">
              💡 <strong className="text-slate-900 dark:text-white">Nutrition Tip:</strong> {selectedFood.tip}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleLogToGym(selectedFood)}
                className="py-3 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-md shadow-rose-500/30 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Dumbbell className="w-4 h-4" />
                Log to Gym
              </button>
              <button
                type="button"
                onClick={() => handleAddToPantry(selectedFood)}
                className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Package className="w-4 h-4" />
                Add to Pantry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}