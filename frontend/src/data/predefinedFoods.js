/**
 * Predefined Quick-Add Food & Gym Nutrition Database
 * Enables instant auto-fill, portion multipliers, and real-time macro calculation
 */

export const PREDEFINED_FOODS = [
  {
    id: "banana-med",
    name: "Banana (1 medium)",
    emoji: "🍌",
    category: "Fruits & Carbs",
    serving: "1 medium (118g)",
    calories: 105,
    protein_g: 1.3,
    carbs_g: 27.0,
    fat_g: 0.3,
    fiber_g: 3.1,
    potassium_mg: 422,
    gym_tags: ["pre-workout", "energy", "clean-carb"]
  },
  {
    id: "banana-large",
    name: "Banana (Large)",
    emoji: "🍌",
    category: "Fruits & Carbs",
    serving: "1 large (136g)",
    calories: 121,
    protein_g: 1.5,
    carbs_g: 31.0,
    fat_g: 0.4,
    fiber_g: 3.5,
    potassium_mg: 487,
    gym_tags: ["pre-workout", "energy"]
  },
  {
    id: "banana-pb",
    name: "Banana with Peanut Butter",
    emoji: "🍌🥜",
    category: "Gym Snacks",
    serving: "1 banana + 2 tbsp PB",
    calories: 295,
    protein_g: 9.3,
    carbs_g: 34.0,
    fat_g: 16.3,
    fiber_g: 5.1,
    gym_tags: ["pre-workout", "bulking", "snack"]
  },
  {
    id: "banana-shake",
    name: "Banana Milkshake",
    emoji: "🥤🍌",
    category: "Smoothies",
    serving: "1 glass (300ml)",
    calories: 220,
    protein_g: 8.5,
    carbs_g: 42.0,
    fat_g: 4.5,
    gym_tags: ["energy", "recovery"]
  },
  {
    id: "boiled-egg-single",
    name: "Boiled Egg (1 whole)",
    emoji: "🥚",
    category: "Proteins",
    serving: "1 large egg (50g)",
    calories: 74,
    protein_g: 6.3,
    carbs_g: 0.4,
    fat_g: 5.0,
    gym_tags: ["high-protein", "keto", "breakfast"]
  },
  {
    id: "boiled-egg-two",
    name: "2 Boiled Eggs",
    emoji: "🥚🥚",
    category: "Proteins",
    serving: "2 large eggs (100g)",
    calories: 148,
    protein_g: 12.6,
    carbs_g: 0.8,
    fat_g: 10.0,
    gym_tags: ["high-protein", "keto", "breakfast"]
  },
  {
    id: "chicken-breast-100",
    name: "Grilled Chicken Breast (100g)",
    emoji: "🍗",
    category: "Lean Proteins",
    serving: "100g cooked",
    calories: 165,
    protein_g: 31.0,
    carbs_g: 0.0,
    fat_g: 3.6,
    gym_tags: ["high-protein", "lean-bulk", "cutting", "lunch", "dinner"]
  },
  {
    id: "chicken-breast-150",
    name: "Grilled Chicken Breast (150g)",
    emoji: "🍗",
    category: "Lean Proteins",
    serving: "150g cooked",
    calories: 248,
    protein_g: 46.5,
    carbs_g: 0.0,
    fat_g: 5.4,
    gym_tags: ["high-protein", "muscle-building", "dinner"]
  },
  {
    id: "whey-shake-1",
    name: "Whey Protein Shake (1 Scoop)",
    emoji: "🥛",
    category: "Supplements",
    serving: "1 scoop (30g powder in water)",
    calories: 120,
    protein_g: 24.0,
    carbs_g: 3.0,
    fat_g: 1.5,
    gym_tags: ["post-workout", "fast-protein", "high-protein"]
  },
  {
    id: "whey-shake-milk",
    name: "Whey Protein Shake with Milk",
    emoji: "🥛✨",
    category: "Supplements",
    serving: "1 scoop + 250ml milk",
    calories: 240,
    protein_g: 32.0,
    carbs_g: 15.0,
    fat_g: 6.0,
    gym_tags: ["post-workout", "bulking"]
  },
  {
    id: "paneer-100",
    name: "Fresh Paneer / Cottage Cheese (100g)",
    emoji: "🧀",
    category: "Vegetarian Protein",
    serving: "100g",
    calories: 265,
    protein_g: 18.3,
    carbs_g: 3.4,
    fat_g: 20.8,
    gym_tags: ["vegetarian", "high-protein", "dinner"]
  },
  {
    id: "paneer-lowfat",
    name: "Low-Fat Paneer (100g)",
    emoji: "🧀✨",
    category: "Vegetarian Protein",
    serving: "100g",
    calories: 180,
    protein_g: 25.0,
    carbs_g: 4.0,
    fat_g: 6.0,
    gym_tags: ["vegetarian", "cutting", "high-protein"]
  },
  {
    id: "rolled-oats",
    name: "Rolled Oats Bowl (50g dry)",
    emoji: "🥣",
    category: "Complex Carbs",
    serving: "50g dry cooked with water",
    calories: 190,
    protein_g: 6.5,
    carbs_g: 34.0,
    fat_g: 3.2,
    fiber_g: 5.2,
    gym_tags: ["breakfast", "clean-carb", "pre-workout"]
  },
  {
    id: "oats-protein-bowl",
    name: "Proats (Oats + Whey Scoop)",
    emoji: "🥣💪",
    category: "Gym Breakfast",
    serving: "50g oats + 1 scoop whey",
    calories: 310,
    protein_g: 30.5,
    carbs_g: 37.0,
    fat_g: 4.7,
    gym_tags: ["breakfast", "muscle-building", "high-protein"]
  },
  {
    id: "brown-rice",
    name: "Steamed Brown Rice (1 cup cooked)",
    emoji: "🍚",
    category: "Complex Carbs",
    serving: "1 cup (195g)",
    calories: 216,
    protein_g: 5.0,
    carbs_g: 45.0,
    fat_g: 1.8,
    fiber_g: 3.5,
    gym_tags: ["clean-carb", "lunch", "dinner"]
  },
  {
    id: "sweet-potato",
    name: "Baked Sweet Potato",
    emoji: "🍠",
    category: "Complex Carbs",
    serving: "1 medium (114g)",
    calories: 103,
    protein_g: 2.3,
    carbs_g: 24.0,
    fat_g: 0.2,
    fiber_g: 3.8,
    gym_tags: ["clean-carb", "pre-workout"]
  },
  {
    id: "greek-yogurt",
    name: "Greek Yogurt (1 cup / 170g)",
    emoji: "🍶",
    category: "Dairy & Protein",
    serving: "170g plain nonfat",
    calories: 100,
    protein_g: 17.0,
    carbs_g: 6.0,
    fat_g: 0.7,
    gym_tags: ["high-protein", "casein", "snack"]
  },
  {
    id: "peanut-butter-toast",
    name: "Peanut Butter on Whole Wheat Toast",
    emoji: "🍞🥜",
    category: "Gym Snacks",
    serving: "1 slice bread + 2 tbsp PB",
    calories: 280,
    protein_g: 12.0,
    carbs_g: 24.0,
    fat_g: 17.2,
    gym_tags: ["snack", "energy", "bulking"]
  },
  {
    id: "apple",
    name: "Fresh Red Apple",
    emoji: "🍎",
    category: "Fruits",
    serving: "1 medium (182g)",
    calories: 95,
    protein_g: 0.5,
    carbs_g: 25.0,
    fat_g: 0.3,
    fiber_g: 4.4,
    gym_tags: ["clean-carb", "snack", "hydration"]
  },
  {
    id: "avocado",
    name: "Avocado (Half)",
    emoji: "🥑",
    category: "Healthy Fats",
    serving: "1/2 medium (100g)",
    calories: 160,
    protein_g: 2.0,
    carbs_g: 8.5,
    fat_g: 14.7,
    fiber_g: 6.7,
    gym_tags: ["keto", "healthy-fat", "salad"]
  },
  {
    id: "canned-tuna",
    name: "Canned Tuna in Water",
    emoji: "🐟",
    category: "Lean Proteins",
    serving: "1 can drained (120g)",
    calories: 130,
    protein_g: 28.0,
    carbs_g: 0.0,
    fat_g: 1.0,
    gym_tags: ["lean-protein", "cutting", "high-protein"]
  },
  {
    id: "steamed-broccoli",
    name: "Steamed Broccoli",
    emoji: "🥦",
    category: "Vegetables",
    serving: "1 cup (100g)",
    calories: 34,
    protein_g: 2.8,
    carbs_g: 7.0,
    fat_g: 0.4,
    fiber_g: 2.6,
    gym_tags: ["micronutrients", "cutting", "fiber"]
  },
  {
    id: "protein-pancakes",
    name: "Protein Pancakes (Stack of 2)",
    emoji: "🥞",
    category: "Gym Breakfast",
    serving: "2 medium pancakes",
    calories: 260,
    protein_g: 22.0,
    carbs_g: 32.0,
    fat_g: 4.5,
    gym_tags: ["breakfast", "high-protein", "cheat-clean"]
  },
  {
    id: "mixed-berries",
    name: "Mixed Berries Bowl",
    emoji: "🍓🫐",
    category: "Fruits & Antioxidants",
    serving: "1 bowl (150g)",
    calories: 75,
    protein_g: 1.5,
    carbs_g: 17.0,
    fat_g: 0.5,
    fiber_g: 5.0,
    gym_tags: ["antioxidants", "low-calorie", "snack"]
  },
  {
    id: "almonds-handful",
    name: "Raw Almonds Handful (30g)",
    emoji: "🥜",
    category: "Healthy Fats",
    serving: "Approx 24 nuts (30g)",
    calories: 175,
    protein_g: 6.0,
    carbs_g: 6.0,
    fat_g: 15.0,
    gym_tags: ["healthy-fat", "snack", "keto"]
  }
];

export function searchPredefinedFoods(query) {
  if (!query || !query.trim()) return [];
  const cleanQ = query.toLowerCase().trim();
  return PREDEFINED_FOODS.filter(item => 
    item.name.toLowerCase().includes(cleanQ) ||
    item.category.toLowerCase().includes(cleanQ) ||
    item.gym_tags.some(tag => tag.includes(cleanQ))
  );
}
