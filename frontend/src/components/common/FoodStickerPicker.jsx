import React, { useState } from 'react';
import {
  X,
  Flame,
  Dumbbell,
  Zap,
  Droplets,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Package,
  Plus
} from 'lucide-react';
import {
  DoodleBanana,
  DoodlePancakes,
  DoodleBurrito,
  DoodlePizza,
  DoodleBurger,
  DoodleHotdog,
  DoodleRamen,
  DoodleSalad,
  DoodleTaco,
  DoodlePopcorn,
  DoodleDonut,
  DoodleAvocado,
  DoodleStrawberry,
  DoodlePie,
  DoodleDrumstick
} from '../../assets/doodles';

export const STICKER_FOODS = [
  {
    id: 'banana',
    name: 'Ripe Banana',
    serving: '1 medium (118g)',
    kcal: 105,
    protein: 1.3,
    carbs: 27.0,
    fat: 0.3,
    fiber: 3.1,
    allergens: [],
    fact: 'Rich in potassium and fast-acting natural carbs to prevent muscle cramps and fuel gym stamina.',
    Doodle: DoodleBanana,
    category: 'Fruit',
    color: 'bg-sunny/20'
  },
  {
    id: 'pancakes',
    name: 'Fluffy Pancakes',
    serving: 'Stack of 2',
    kcal: 260,
    protein: 6.0,
    carbs: 34.0,
    fat: 5.2,
    fiber: 1.5,
    allergens: ['Gluten', 'Dairy', 'Egg'],
    fact: 'Pancakes cooked with whole oats and served with Greek yogurt provide sustained morning energy.',
    Doodle: DoodlePancakes,
    category: 'Breakfast',
    color: 'bg-peach/20'
  },
  {
    id: 'burrito',
    name: 'Sushi Burrito',
    serving: '1 roll (200g)',
    kcal: 290,
    protein: 12.5,
    carbs: 48.0,
    fat: 4.0,
    fiber: 2.8,
    allergens: ['Fish', 'Soy'],
    fact: 'Fresh salmon, nori seaweed, and seasoned rice deliver clean brain-boosting Omega-3 fatty acids.',
    Doodle: DoodleBurrito,
    category: 'Lunch',
    color: 'bg-mint/20'
  },
  {
    id: 'pizza',
    name: 'Pepperoni Pizza',
    serving: '1 slice (105g)',
    kcal: 272,
    protein: 12.0,
    carbs: 32.0,
    fat: 10.5,
    fiber: 2.0,
    allergens: ['Dairy', 'Gluten'],
    fact: 'Cooked tomato sauce provides bioavailable lycopene, a potent heart-protective antioxidant.',
    Doodle: DoodlePizza,
    category: 'Fast Food',
    color: 'bg-tomato/20'
  },
  {
    id: 'burger',
    name: 'Classic Burger',
    serving: '1 burger (180g)',
    kcal: 450,
    protein: 24.0,
    carbs: 38.0,
    fat: 22.0,
    fiber: 2.5,
    allergens: ['Gluten', 'Sesame'],
    fact: 'A lean patty provides bioavailable heme iron, critical for oxygen transport in working muscles.',
    Doodle: DoodleBurger,
    category: 'Fast Food',
    color: 'bg-sunny/20'
  },
  {
    id: 'hotdog',
    name: 'Grilled Hot Dog',
    serving: '1 bun & dog (120g)',
    kcal: 310,
    protein: 11.0,
    carbs: 24.0,
    fat: 19.0,
    fiber: 1.0,
    allergens: ['Gluten', 'Mustard'],
    fact: 'Yellow mustard adds natural turmeric and allyl isothiocyanate, which stimulate digestive enzymes.',
    Doodle: DoodleHotdog,
    category: 'Fast Food',
    color: 'bg-peach/20'
  },
  {
    id: 'ramen',
    name: 'Tokyo Ramen',
    serving: '1 bowl (450g)',
    kcal: 420,
    protein: 16.0,
    carbs: 58.0,
    fat: 14.0,
    fiber: 3.0,
    allergens: ['Gluten', 'Soy'],
    fact: 'Slow-simmered bone broth delivers amino acids like glycine and proline to soothe the digestive lining.',
    Doodle: DoodleRamen,
    category: 'Comfort',
    color: 'bg-mint/20'
  },
  {
    id: 'salad',
    name: 'Garden Salad',
    serving: '1 large bowl (220g)',
    kcal: 140,
    protein: 4.5,
    carbs: 12.0,
    fat: 8.5,
    fiber: 5.0,
    allergens: [],
    fact: 'Dark leafy greens provide natural nitrates that help dilate blood vessels and enhance cardio flow.',
    Doodle: DoodleSalad,
    category: 'Healthy',
    color: 'bg-mint/25'
  },
  {
    id: 'taco',
    name: 'Street Taco',
    serving: '1 taco (95g)',
    kcal: 210,
    protein: 10.0,
    carbs: 18.0,
    fat: 11.0,
    fiber: 2.5,
    allergens: ['Corn'],
    fact: 'Traditional stone-ground corn tortillas release bound Vitamin B3 through natural nixtamalization.',
    Doodle: DoodleTaco,
    category: 'Street Food',
    color: 'bg-sunny/20'
  },
  {
    id: 'popcorn',
    name: 'Movie Popcorn',
    serving: '3 cups (50g)',
    kcal: 180,
    protein: 3.5,
    carbs: 26.0,
    fat: 7.0,
    fiber: 4.0,
    allergens: ['Corn'],
    fact: 'Popcorn is 100% unrefined whole grain and contains more polyphenol antioxidants than many apples!',
    Doodle: DoodlePopcorn,
    category: 'Snack',
    color: 'bg-sunny/25'
  },
  {
    id: 'donut',
    name: 'Glazed Donut',
    serving: '1 piece (75g)',
    kcal: 250,
    protein: 3.0,
    carbs: 31.0,
    fat: 13.0,
    fiber: 1.0,
    allergens: ['Gluten', 'Dairy'],
    fact: 'A quick simple sugar treat right after intense HIIT replenishes depleted muscle glycogen rapidly.',
    Doodle: DoodleDonut,
    category: 'Sweet',
    color: 'bg-peach/25'
  },
  {
    id: 'avocado',
    name: 'Creamy Avocado',
    serving: '1/2 fruit (100g)',
    kcal: 160,
    protein: 2.0,
    carbs: 8.5,
    fat: 14.7,
    fiber: 6.7,
    allergens: [],
    fact: 'Packed with monounsaturated oleic acid and more potassium than an average banana.',
    Doodle: DoodleAvocado,
    category: 'Superfood',
    color: 'bg-mint/20'
  },
  {
    id: 'strawberry',
    name: 'Sweet Berry',
    serving: '1 cup (150g)',
    kcal: 49,
    protein: 1.0,
    carbs: 11.7,
    fat: 0.5,
    fiber: 3.0,
    allergens: [],
    fact: 'Just one bowl delivers 100% of your daily Vitamin C and protective anthocyanin flavonoids.',
    Doodle: DoodleStrawberry,
    category: 'Fruit',
    color: 'bg-tomato/20'
  },
  {
    id: 'pie',
    name: 'Berry Cream Pie',
    serving: '1 slice (120g)',
    kcal: 280,
    protein: 3.2,
    carbs: 42.0,
    fat: 11.0,
    fiber: 2.2,
    allergens: ['Gluten', 'Dairy'],
    fact: 'Wild berries provide ellagic acid, which supports cellular longevity and DNA protection.',
    Doodle: DoodlePie,
    category: 'Dessert',
    color: 'bg-peach/20'
  },
  {
    id: 'drumstick',
    name: 'Roast Drumstick',
    serving: '1 leg (180g)',
    kcal: 248,
    protein: 38.0,
    carbs: 0.0,
    fat: 9.5,
    fiber: 0.0,
    allergens: [],
    fact: 'Ultra-lean bioavailable protein with high leucine content to stimulate muscle protein synthesis.',
    Doodle: DoodleDrumstick,
    category: 'Protein',
    color: 'bg-sunny/20'
  }
];

export default function FoodStickerPicker({ onFoodLogged }) {
  const [selectedFood, setSelectedFood] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogToGym = (food) => {
    const today = new Date().toISOString().split('T')[0];
    const logItem = {
      id: `gym_sticker_${Date.now()}`,
      meal_name: food.name,
      meal_type: 'snack',
      calories: food.kcal,
      protein_g: food.protein,
      carbs_g: food.carbs,
      fat_g: food.fat,
      water_ml: 200,
      logged_at: new Date().toISOString()
    };

    try {
      const key = `foodverse_gym_logs_${today}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([logItem, ...existing]));
      showToast(`Logged ${food.name} (${food.kcal} kcal) to Gym Mode! 💪`);
      if (onFoodLogged) onFoodLogged();
    } catch {
      showToast(`Logged ${food.name} locally!`);
    }
    setSelectedFood(null);
  };

  const handleAddToPantry = (food) => {
    const pantryItem = {
      id: Date.now(),
      name: food.name,
      category: food.category || 'Produce',
      quantity: 1,
      unit: 'serving',
      storage_location: 'fridge',
      days_shelf_life: 5,
      status: 'Fresh',
      days_remaining: 5,
      purchase_date: new Date().toISOString(),
      expiry_date: new Date(Date.now() + 5 * 86400000).toISOString(),
      is_active: true
    };

    try {
      const existing = JSON.parse(localStorage.getItem('foodverse_pantry_items') || '[]');
      localStorage.setItem('foodverse_pantry_items', JSON.stringify([pantryItem, ...existing]));
      showToast(`Added ${food.name} to Pantry! 📦`);
      if (onFoodLogged) onFoodLogged();
    } catch {
      showToast(`Added ${food.name} to Pantry!`);
    }
    setSelectedFood(null);
  };

  return (
    <div id="food-sticker-picker" className="w-full">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-white dark:bg-dusk-card border-2.5 border-ink px-4 py-2.5 rounded-2xl shadow-sticker-lg flex items-center gap-2.5 text-xs font-black text-ink animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-mint flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Grid of Food Stickers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {STICKER_FOODS.map((food) => {
          const Doodle = food.Doodle;
          return (
            <button
              key={food.id}
              type="button"
              onClick={() => setSelectedFood(food)}
              className="group rounded-3xl bg-white dark:bg-dusk-card border-2.5 border-ink p-3.5 sm:p-4 flex flex-col items-center justify-between text-center shadow-sticker hover:shadow-sticker-lg hover:-translate-y-1 active:translate-y-0.5 transition-all cursor-pointer select-none"
            >
              {/* Doodle Container */}
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${food.color} border-2 border-ink flex items-center justify-center p-2 mb-2 group-hover:scale-110 group-hover:rotate-2 transition-transform shadow-xs`}
              >
                <Doodle size={48} className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-xs" />
              </div>

              {/* Food Name (Wrapped to 2 lines, no truncation) */}
              <span className="font-display font-extrabold text-xs sm:text-sm text-ink dark:text-dusk-text leading-tight min-h-[2.4rem] flex items-center justify-center">
                {food.name}
              </span>

              {/* Calorie Chip */}
              <div className="mt-1 px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-dusk-surface border border-ink text-[11px] font-black text-ink dark:text-sky-300">
                {food.kcal} kcal
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal / Bottom Sheet Popup */}
      {selectedFood && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedFood(null)}
        >
          <div
            className="relative w-full max-w-md bg-white dark:bg-dusk-card border-3 border-ink rounded-3xl shadow-sticker-lg p-6 space-y-5 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedFood(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-sky-100 dark:bg-dusk-surface border-2 border-ink hover:bg-tomato hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4">
              <div
                className={`w-20 h-20 rounded-3xl ${selectedFood.color} border-2.5 border-ink flex items-center justify-center p-2 shadow-sticker-sm`}
              >
                <selectedFood.Doodle size={56} className="animate-float" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-sunny/30 border border-ink text-ink">
                  {selectedFood.category}
                </span>
                <h3 className="font-display font-black text-2xl text-ink dark:text-dusk-text mt-1">
                  {selectedFood.name}
                </h3>
                <p className="text-xs font-semibold text-ink-muted">
                  Serving: {selectedFood.serving}
                </p>
              </div>
            </div>

            {/* 4 Macro Chips Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-tomato/15 border-2 border-ink">
                <Flame className="w-4 h-4 mx-auto text-tomato mb-0.5" />
                <span className="block text-xs font-black text-ink">{selectedFood.kcal}</span>
                <span className="text-[10px] font-bold text-ink-muted">Calories</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-grape/15 border-2 border-ink">
                <Dumbbell className="w-4 h-4 mx-auto text-grape mb-0.5" />
                <span className="block text-xs font-black text-ink">{selectedFood.protein}g</span>
                <span className="text-[10px] font-bold text-ink-muted">Protein</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-sunny/20 border-2 border-ink">
                <Zap className="w-4 h-4 mx-auto text-amber-600 mb-0.5" />
                <span className="block text-xs font-black text-ink">{selectedFood.carbs}g</span>
                <span className="text-[10px] font-bold text-ink-muted">Carbs</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-peach/20 border-2 border-ink">
                <Droplets className="w-4 h-4 mx-auto text-orange-600 mb-0.5" />
                <span className="block text-xs font-black text-ink">{selectedFood.fat}g</span>
                <span className="text-[10px] font-bold text-ink-muted">Fat</span>
              </div>
            </div>

            {/* Allergen Warning Banner if applicable */}
            {selectedFood.allergens.length > 0 ? (
              <div className="p-3 rounded-2xl bg-tomato/15 border-2 border-tomato flex items-center gap-2.5 text-xs font-bold text-tomato">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Contains allergens: {selectedFood.allergens.join(', ')}</span>
              </div>
            ) : (
              <div className="p-2.5 rounded-2xl bg-mint/20 border-2 border-mint flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-mint">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Naturally allergen-friendly</span>
              </div>
            )}

            {/* Did You Know Fact */}
            <div className="p-3 rounded-2xl bg-sky-100 dark:bg-dusk-surface border-2 border-ink text-xs text-ink dark:text-dusk-text flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-[11px] block text-ink-muted uppercase">
                  Did you know?
                </span>
                <p className="font-medium text-xs mt-0.5">{selectedFood.fact}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleLogToGym(selectedFood)}
                className="btn-squish flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-grape text-white border-2 border-ink font-display font-black text-xs shadow-sticker hover:shadow-sticker-lg cursor-pointer"
              >
                <Dumbbell className="w-4 h-4" />
                Log to Gym
              </button>
              <button
                type="button"
                onClick={() => handleAddToPantry(selectedFood)}
                className="btn-squish flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text border-2 border-ink font-display font-black text-xs shadow-sticker hover:shadow-sticker-lg cursor-pointer"
              >
                <Package className="w-4 h-4 text-peach" />
                Add to Pantry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
