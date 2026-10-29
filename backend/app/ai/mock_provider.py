import os
import re
import uuid
import hashlib
from typing import Optional, List, Dict, Any
from pathlib import Path
from app.ai.base import AIProvider
from app.schemas.ai import (
    FoodItemDetection,
    MultiFoodDetectionResult,
    DetectedFoodItem,
    FoodBox,
    MacroNutrients,
    FreshnessAnalysisResult,
    HygieneAnalysisResult,
    FlaggedIncident,
    MealPlanResult,
    DailyMealPlan,
    MealEntry
)

def classify_image_features(image_bytes: Optional[bytes]) -> Dict[str, Any]:
    if not image_bytes:
        return {"category": "thali", "banana_prob": 0.0, "apple_prob": 0.0, "spot_prob": 0.0}
    try:
        import io
        from PIL import Image
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        thumb = img.resize((48, 48))
        all_pixels = [thumb.getpixel((x, y)) for y in range(48) for x in range(48)]
        food_pixels = [p for p in all_pixels if 40 < sum(p) < 730]
        if not food_pixels:
            food_pixels = all_pixels
        n = len(food_pixels)

        yellow_count = 0
        red_count = 0
        green_count = 0
        brown_count = 0
        dark_spots = 0

        for r, g, b in food_pixels:
            tot = r + g + b
            if r > 115 and g > 95 and (r + g) > 2.0 * (b + 1):
                yellow_count += 1
            elif r > 115 and r > 1.3 * g and r > 1.3 * b:
                red_count += 1
            elif g > 90 and g > 1.15 * r and g > 1.15 * b:
                green_count += 1
            elif r > 100 and 50 <= g <= 135 and b < 80:
                brown_count += 1
            if tot < 90:
                dark_spots += 1

        y_r = yellow_count / n
        r_r = red_count / n
        g_r = green_count / n
        b_r = brown_count / n
        spot_r = dark_spots / n

        if y_r >= 0.10 or (y_r > r_r and y_r > g_r and y_r > 0.06):
            cat = "banana"
        elif r_r >= 0.12 or (r_r > y_r and r_r > g_r and r_r > 0.06):
            cat = "apple"
        elif g_r >= 0.12:
            cat = "fruit"
        elif b_r >= 0.14:
            cat = "snack"
        else:
            cat = "thali"

        return {
            "category": cat,
            "banana_prob": y_r,
            "apple_prob": r_r,
            "green_prob": g_r,
            "brown_prob": b_r,
            "spot_prob": spot_r
        }
    except Exception:
        return {"category": "thali", "banana_prob": 0.0, "apple_prob": 0.0, "spot_prob": 0.0}

class MockAIProvider(AIProvider):
    """
    Deterministic Mock AI Provider for FoodVerse AI.
    Provides realistic multimodal food intelligence responses without external API keys.
    """

    async def analyze_food_multi(
        self,
        image_bytes: Optional[bytes] = None,
        image_path: Optional[str] = None,
        query: Optional[str] = None,
        user_diet: Optional[str] = None,
        user_allergies: Optional[List[str]] = None,
        lang: str = "en"
    ) -> MultiFoodDetectionResult:
        from app.core.config import settings
        path_str = (image_path or query or "").lower()

        # Check if text query is provided
        if query and not image_bytes:
            q_lower = query.lower()
            items = []
            # Parse multiple items mentioned in query
            if "roti" in q_lower or "chapati" in q_lower:
                count = 2
                match = re.search(r"(\d+)\s*(?:roti|chapati)", q_lower)
                if match:
                    count = int(match.group(1))
                items.append(DetectedFoodItem(
                    id="item_roti",
                    name="Whole Wheat Chapati",
                    name_hi="चपाती",
                    confidence=0.98,
                    estimated_grams=float(count * 40),
                    category="Grains & Breads",
                    cuisine="Indian",
                    calories=round(count * 40 * 2.64, 1),
                    protein=round(count * 40 * 0.085, 1),
                    carbs=round(count * 40 * 0.52, 1),
                    fat=round(count * 40 * 0.028, 1),
                    fiber=round(count * 40 * 0.075, 1),
                    allergens=["gluten"],
                    diet_tags=["Vegetarian", "Vegan"],
                    data_source="database"
                ))
            if "dal" in q_lower or "tadka" in q_lower or "lentil" in q_lower:
                items.append(DetectedFoodItem(
                    id="item_dal",
                    name="Dal Tadka",
                    name_hi="दाल तड़का",
                    confidence=0.96,
                    estimated_grams=200.0,
                    category="Curry",
                    cuisine="Indian",
                    calories=232.0,
                    protein=13.6,
                    carbs=33.0,
                    fat=6.4,
                    fiber=9.0,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                ))
            if "rice" in q_lower or "chawal" in q_lower or "pulao" in q_lower:
                items.append(DetectedFoodItem(
                    id="item_rice",
                    name="Steamed Basmati Rice",
                    name_hi="उबले बासमती चावल",
                    confidence=0.95,
                    estimated_grams=150.0,
                    category="Grains & Breads",
                    cuisine="Indian",
                    calories=195.0,
                    protein=4.5,
                    carbs=43.5,
                    fat=0.8,
                    fiber=1.2,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                ))
            if "curd" in q_lower or "dahi" in q_lower or "yogurt" in q_lower:
                items.append(DetectedFoodItem(
                    id="item_curd",
                    name="Spiced Buttermilk (Masala Chaas)",
                    name_hi="मसाला छाछ",
                    confidence=0.94,
                    estimated_grams=100.0,
                    category="Traditional Snacks & Drinks",
                    cuisine="Indian Heritage",
                    calories=60.0,
                    protein=3.5,
                    carbs=4.5,
                    fat=3.0,
                    fiber=0.2,
                    allergens=["dairy"],
                    diet_tags=["Vegetarian", "Gluten-Free"],
                    data_source="database"
                ))
            if "banana" in q_lower or "kela" in q_lower:
                items.append(DetectedFoodItem(
                    id="item_banana",
                    name="Cavendish Banana",
                    name_hi="केला",
                    confidence=0.98,
                    estimated_grams=118.0,
                    category="Raw Staples & Grocery",
                    cuisine="Global",
                    calories=105.0,
                    protein=1.3,
                    carbs=27.0,
                    fat=0.4,
                    fiber=3.1,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                ))
            if "apple" in q_lower or "seb" in q_lower:
                items.append(DetectedFoodItem(
                    id="item_apple",
                    name="Honeycrisp Apple",
                    name_hi="सेब",
                    confidence=0.97,
                    estimated_grams=150.0,
                    category="Raw Staples & Grocery",
                    cuisine="Global",
                    calories=78.0,
                    protein=0.5,
                    carbs=21.0,
                    fat=0.3,
                    fiber=3.6,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                ))
            if "potato" in q_lower or "aloo" in q_lower or "sabzi" in q_lower:
                items.append(DetectedFoodItem(
                    id="item_aloo",
                    name="Aloo Gobi",
                    name_hi="आलू गोभी",
                    confidence=0.95,
                    estimated_grams=180.0,
                    category="Curry",
                    cuisine="North Indian",
                    calories=162.0,
                    protein=4.8,
                    carbs=26.0,
                    fat=5.5,
                    fiber=4.5,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                ))
            if "paneer" in q_lower or "tikka" in q_lower:
                items.append(DetectedFoodItem(
                    id="item_paneer",
                    name="Grilled Paneer Tikka (Zero Oil)",
                    name_hi="पनीर टिक्का (जीरो ऑयल)",
                    confidence=0.96,
                    estimated_grams=180.0,
                    category="Gym & Athletic Diet",
                    cuisine="High-Protein",
                    calories=265.0,
                    protein=24.0,
                    carbs=9.0,
                    fat=14.5,
                    fiber=3.2,
                    allergens=["dairy"],
                    diet_tags=["Vegetarian", "Gluten-Free", "High-Protein"],
                    data_source="database"
                ))
            if "soya" in q_lower or "chunks" in q_lower:
                items.append(DetectedFoodItem(
                    id="item_soya",
                    name="Boiled Soya Chunks",
                    name_hi="उबले सोया चंक्स",
                    confidence=0.97,
                    estimated_grams=150.0,
                    category="Gym & Athletic Diet",
                    cuisine="High-Protein",
                    calories=220.0,
                    protein=31.5,
                    carbs=18.0,
                    fat=1.2,
                    fiber=7.5,
                    allergens=["soy"],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free", "High-Protein"],
                    data_source="database"
                ))

            if items:
                tot_cal = sum(it.calories for it in items)
                tot_p = sum(it.protein for it in items)
                tot_c = sum(it.carbs for it in items)
                tot_f = sum(it.fat for it in items)
                tot_fib = sum(it.fiber for it in items)
                tot_wt = sum(it.estimated_grams for it in items)
                return MultiFoodDetectionResult(
                    items=items,
                    total_calories=round(tot_cal, 1),
                    total_protein=round(tot_p, 1),
                    total_carbs=round(tot_c, 1),
                    total_fat=round(tot_f, 1),
                    total_fiber=round(tot_fib, 1),
                    total_weight_grams=round(tot_wt, 1),
                    health_score=88,
                    health_explanation="Balanced meal containing whole grains, dietary protein, and essential micronutrients.",
                    model_provider="mock",
                    cues_detected=["Parsed natural language meal description", "Matched with verified SQLite FTS5 database entries"]
                )

        # 2. Bundled Demonstration Samples & Intelligent Visual Color/Texture Classification
        v_cues = classify_image_features(image_bytes)
        v_cat = v_cues.get("category", "thali")

        is_banana = "banana" in path_str or "kela" in path_str or v_cat == "banana"
        is_apple = ("apple" in path_str or "seb" in path_str or v_cat == "apple") and not is_banana
        is_fruit = ("fruit" in path_str or "grapes" in path_str or v_cat == "fruit") and not is_banana and not is_apple
        is_snack = ("snack" in path_str or "samosa" in path_str or v_cat == "snack") and not is_banana and not is_apple and not is_fruit
        is_gym = "gym" in path_str or "chicken" in path_str
        is_potato = "potato" in path_str or "aloo" in path_str
        is_paneer = "paneer" in path_str
        is_soya = "soya" in path_str
        is_thali = ("thali" in path_str or v_cat == "thali") and not is_banana and not is_apple and not is_fruit and not is_snack and not is_gym and not is_potato and not is_paneer and not is_soya

        if is_thali:
            items = [
                DetectedFoodItem(
                    id="box_1",
                    name="Whole Wheat Chapati",
                    name_hi="चपाती",
                    confidence=0.96,
                    box=FoodBox(ymin=0.12, xmin=0.08, ymax=0.48, xmax=0.46),
                    estimated_grams=80.0,
                    category="Grains & Breads",
                    cuisine="Indian",
                    calories=211.2,
                    protein=6.8,
                    carbs=41.6,
                    fat=2.2,
                    fiber=6.0,
                    allergens=["gluten"],
                    diet_tags=["Vegetarian", "Vegan"],
                    data_source="database"
                ),
                DetectedFoodItem(
                    id="box_2",
                    name="Dal Tadka",
                    name_hi="दाल तड़का",
                    confidence=0.94,
                    box=FoodBox(ymin=0.10, xmin=0.52, ymax=0.50, xmax=0.92),
                    estimated_grams=180.0,
                    category="Curry",
                    cuisine="Indian",
                    calories=208.8,
                    protein=12.2,
                    carbs=29.7,
                    fat=5.8,
                    fiber=8.1,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                ),
                DetectedFoodItem(
                    id="box_3",
                    name="Steamed Basmati Rice",
                    name_hi="उबले बासमती चावल",
                    confidence=0.95,
                    box=FoodBox(ymin=0.52, xmin=0.12, ymax=0.92, xmax=0.54),
                    estimated_grams=150.0,
                    category="Grains & Breads",
                    cuisine="Indian",
                    calories=195.0,
                    protein=4.5,
                    carbs=43.5,
                    fat=0.8,
                    fiber=1.2,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                ),
                DetectedFoodItem(
                    id="box_4",
                    name="Spiced Buttermilk (Masala Chaas)",
                    name_hi="मसाला छाछ",
                    confidence=0.92,
                    box=FoodBox(ymin=0.55, xmin=0.60, ymax=0.92, xmax=0.92),
                    estimated_grams=120.0,
                    category="Traditional Snacks & Drinks",
                    cuisine="Indian Heritage",
                    calories=72.0,
                    protein=4.2,
                    carbs=5.4,
                    fat=3.6,
                    fiber=0.2,
                    allergens=["dairy"],
                    diet_tags=["Vegetarian", "Gluten-Free"],
                    data_source="database"
                )
            ]
        elif is_fruit:
            items = [
                DetectedFoodItem(
                    id="box_fruit_1",
                    name="Honeycrisp Apple",
                    name_hi="सेब",
                    confidence=0.97,
                    box=FoodBox(ymin=0.15, xmin=0.10, ymax=0.65, xmax=0.52),
                    estimated_grams=140.0,
                    category="Raw Staples & Grocery",
                    cuisine="Global",
                    calories=72.8,
                    protein=0.4,
                    carbs=19.6,
                    fat=0.3,
                    fiber=3.4,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                ),
                DetectedFoodItem(
                    id="box_fruit_2",
                    name="Cavendish Banana",
                    name_hi="केला",
                    confidence=0.96,
                    box=FoodBox(ymin=0.22, xmin=0.48, ymax=0.85, xmax=0.90),
                    estimated_grams=118.0,
                    category="Raw Staples & Grocery",
                    cuisine="Global",
                    calories=105.0,
                    protein=1.3,
                    carbs=27.0,
                    fat=0.4,
                    fiber=3.1,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                ),
                DetectedFoodItem(
                    id="box_fruit_3",
                    name="Green Seedless Grapes",
                    name_hi="अंगूर",
                    confidence=0.91,
                    box=FoodBox(ymin=0.62, xmin=0.15, ymax=0.92, xmax=0.55),
                    estimated_grams=80.0,
                    category="Raw Staples & Grocery",
                    cuisine="Global",
                    calories=55.2,
                    protein=0.6,
                    carbs=14.4,
                    fat=0.2,
                    fiber=0.7,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                )
            ]
        elif is_gym:
            items = [
                DetectedFoodItem(
                    id="box_gym_1",
                    name="Grilled Chicken Breast",
                    name_hi="ग्रिल्ड चिकन",
                    confidence=0.98,
                    box=FoodBox(ymin=0.15, xmin=0.10, ymax=0.60, xmax=0.55),
                    estimated_grams=150.0,
                    category="Gym & Athletic Diet",
                    cuisine="Global",
                    calories=247.5,
                    protein=46.5,
                    carbs=0.0,
                    fat=5.4,
                    fiber=0.0,
                    allergens=[],
                    diet_tags=["High-Protein", "Gluten-Free"],
                    data_source="database"
                ),
                DetectedFoodItem(
                    id="box_gym_2",
                    name="Steamed Basmati Rice",
                    name_hi="उबले चावल",
                    confidence=0.95,
                    box=FoodBox(ymin=0.15, xmin=0.55, ymax=0.60, xmax=0.92),
                    estimated_grams=150.0,
                    category="Grains & Breads",
                    cuisine="Global",
                    calories=195.0,
                    protein=4.0,
                    carbs=42.5,
                    fat=0.4,
                    fiber=0.8,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                ),
                DetectedFoodItem(
                    id="box_gym_3",
                    name="Steamed Broccoli Florets",
                    name_hi="ब्रोकोली",
                    confidence=0.92,
                    box=FoodBox(ymin=0.62, xmin=0.20, ymax=0.92, xmax=0.80),
                    estimated_grams=100.0,
                    category="Raw Staples & Grocery",
                    cuisine="Global",
                    calories=35.0,
                    protein=2.8,
                    carbs=7.0,
                    fat=0.4,
                    fiber=2.6,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                )
            ]
        elif is_snack:
            items = [
                DetectedFoodItem(
                    id="box_snack_1",
                    name="Samosa",
                    name_hi="समोसा",
                    confidence=0.96,
                    box=FoodBox(ymin=0.15, xmin=0.12, ymax=0.82, xmax=0.56),
                    estimated_grams=85.0,
                    category="Street Food & Chaat",
                    cuisine="Indian Street Food",
                    calories=224.0,
                    protein=3.6,
                    carbs=27.2,
                    fat=12.3,
                    fiber=2.1,
                    allergens=["gluten"],
                    diet_tags=["Vegetarian", "Vegan"],
                    data_source="database"
                ),
                DetectedFoodItem(
                    id="box_snack_2",
                    name="Masala Chai (with Milk)",
                    name_hi="मसाला चाय",
                    confidence=0.93,
                    box=FoodBox(ymin=0.18, xmin=0.58, ymax=0.82, xmax=0.92),
                    estimated_grams=120.0,
                    category="Traditional Snacks & Drinks",
                    cuisine="Indian Heritage",
                    calories=88.8,
                    protein=3.4,
                    carbs=10.2,
                    fat=3.8,
                    fiber=0.0,
                    allergens=["dairy"],
                    diet_tags=["Vegetarian", "Gluten-Free"],
                    data_source="database"
                )
            ]
        elif is_banana:
            items = [
                DetectedFoodItem(
                    id="box_banana_1",
                    name="Cavendish Banana",
                    name_hi="केला",
                    confidence=0.98,
                    box=FoodBox(ymin=0.15, xmin=0.15, ymax=0.85, xmax=0.85),
                    estimated_grams=118.0,
                    category="Raw Staples & Grocery",
                    cuisine="Global",
                    calories=105.0,
                    protein=1.3,
                    carbs=27.0,
                    fat=0.4,
                    fiber=3.1,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                )
            ]
        elif is_apple:
            items = [
                DetectedFoodItem(
                    id="box_apple_1",
                    name="Honeycrisp Apple",
                    name_hi="सेब",
                    confidence=0.97,
                    box=FoodBox(ymin=0.15, xmin=0.15, ymax=0.85, xmax=0.85),
                    estimated_grams=150.0,
                    category="Raw Staples & Grocery",
                    cuisine="Global",
                    calories=78.0,
                    protein=0.5,
                    carbs=21.0,
                    fat=0.3,
                    fiber=3.6,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                )
            ]
        elif is_potato:
            items = [
                DetectedFoodItem(
                    id="box_potato_1",
                    name="Aloo Gobi",
                    name_hi="आलू गोभी",
                    confidence=0.95,
                    box=FoodBox(ymin=0.15, xmin=0.15, ymax=0.85, xmax=0.85),
                    estimated_grams=180.0,
                    category="Curry",
                    cuisine="North Indian",
                    calories=162.0,
                    protein=4.8,
                    carbs=26.0,
                    fat=5.5,
                    fiber=4.5,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free"],
                    data_source="database"
                )
            ]
        elif is_paneer:
            items = [
                DetectedFoodItem(
                    id="box_paneer_1",
                    name="Grilled Paneer Tikka (Zero Oil)",
                    name_hi="पनीर टिक्का (जीरो ऑयल)",
                    confidence=0.96,
                    box=FoodBox(ymin=0.15, xmin=0.15, ymax=0.85, xmax=0.85),
                    estimated_grams=180.0,
                    category="Gym & Athletic Diet",
                    cuisine="High-Protein",
                    calories=265.0,
                    protein=24.0,
                    carbs=9.0,
                    fat=14.5,
                    fiber=3.2,
                    allergens=["dairy"],
                    diet_tags=["Vegetarian", "Gluten-Free", "High-Protein"],
                    data_source="database"
                )
            ]
        elif is_soya:
            items = [
                DetectedFoodItem(
                    id="box_soya_1",
                    name="Boiled Soya Chunks",
                    name_hi="उबले सोया चंक्स",
                    confidence=0.96,
                    box=FoodBox(ymin=0.15, xmin=0.15, ymax=0.85, xmax=0.85),
                    estimated_grams=150.0,
                    category="Gym & Athletic Diet",
                    cuisine="High-Protein",
                    calories=220.0,
                    protein=31.5,
                    carbs=18.0,
                    fat=1.2,
                    fiber=7.5,
                    allergens=["soy"],
                    diet_tags=["Vegetarian", "Vegan", "Gluten-Free", "High-Protein"],
                    data_source="database"
                )
            ]
        else:
            # Dynamic fallback using query, visual cues, or nutritious meal estimation
            dish_name = query.title() if query else "Wholesome Culinary Dish"
            if "banana" in path_str:
                dish_name = "Cavendish Banana"
            elif "apple" in path_str:
                dish_name = "Red Apple"
            elif "potato" in path_str or "aloo" in path_str:
                dish_name = "Homestyle Potato Sabzi"

            is_banana_item = "banana" in dish_name.lower()
            is_potato_item = "potato" in dish_name.lower() or "aloo" in dish_name.lower()

            prot_val = 1.3 if is_banana_item else (3.2 if is_potato_item else 8.0)
            cal_val = 105.0 if is_banana_item else (140.0 if is_potato_item else 220.0)
            carb_val = 27.0 if is_banana_item else (22.0 if is_potato_item else 30.0)
            fat_val = 0.3 if is_banana_item else (4.5 if is_potato_item else 6.0)

            items = [
                DetectedFoodItem(
                    id="box_detected_1",
                    name=dish_name,
                    name_hi=dish_name,
                    confidence=0.88,
                    box=FoodBox(ymin=0.15, xmin=0.15, ymax=0.85, xmax=0.85),
                    estimated_grams=120.0 if is_banana_item else 150.0,
                    category="Fruit" if is_banana_item else ("Vegetable Curry" if is_potato_item else "Nutritious Meal"),
                    cuisine="Global" if is_banana_item else "Indian",
                    calories=cal_val,
                    protein=prot_val,
                    carbs=carb_val,
                    fat=fat_val,
                    fiber=3.0,
                    allergens=[],
                    diet_tags=["Vegetarian", "Vegan"],
                    data_source="ai_estimate"
                )
            ]

        tot_cal = sum(it.calories for it in items)
        tot_p = sum(it.protein for it in items)
        tot_c = sum(it.carbs for it in items)
        tot_f = sum(it.fat for it in items)
        tot_fib = sum(it.fiber for it in items)
        tot_wt = sum(it.estimated_grams for it in items)

        return MultiFoodDetectionResult(
            items=items,
            total_calories=round(tot_cal, 1),
            total_protein=round(tot_p, 1),
            total_carbs=round(tot_c, 1),
            total_fat=round(tot_f, 1),
            total_fiber=round(tot_fib, 1),
            total_weight_grams=round(tot_wt, 1),
            health_score=85,
            health_explanation="Balanced nutrient profile with authentic culinary portions scaled to verified database values.",
            model_provider="mock",
            cues_detected=["Multimodal visual food item localization", "Scaled from FTS5 verified nutritional database"]
        )

    async def analyze_food(
        self,
        image_bytes: Optional[bytes] = None,
        image_path: Optional[str] = None,
        query: Optional[str] = None,
        user_diet: Optional[str] = None,
        user_allergies: Optional[List[str]] = None,
        lang: str = "en"
    ) -> FoodItemDetection:
        path_str = (image_path or query or "").lower()

        # 1. Paneer Tikka (Indian regional dish)
        if "paneer" in path_str or "tikka" in path_str:
            return FoodItemDetection(
                name="Grilled Paneer Tikka",
                name_hi="पनीर टिक्का",
                confidence=0.96,
                category="Indian Appetizer / Curry",
                cuisine="North Indian",
                macros=MacroNutrients(
                    calories=285.0,
                    protein=21.5,
                    carbs=11.2,
                    fat=17.8,
                    fiber=3.5,
                    sugar=3.0,
                    sodium_mg=420.0,
                    servingSize="1 skewer / plate (220g)"
                ),
                health_score=82,
                health_explanation="High protein content from cottage cheese with antioxidant-rich bell peppers; moderate saturated fat.",
                allergens=["dairy"],
                diet_tags=["Vegetarian", "Gluten-Free"],
                cues_detected=[
                    "Charred rectangular curd cheese cubes",
                    "Caramelized capsicum and onion wedges",
                    "Orange-red tandoori marinade glaze"
                ],
                data_source="database"
            )

        # 2. Fresh Apple
        elif "apple" in path_str:
            return FoodItemDetection(
                name="Honeycrisp Apple",
                name_hi="सेब",
                confidence=0.98,
                category="Fresh Fruit",
                cuisine="Global",
                macros=MacroNutrients(
                    calories=95.0,
                    protein=0.5,
                    carbs=25.0,
                    fat=0.3,
                    fiber=4.4,
                    sugar=19.0,
                    sodium_mg=2.0,
                    servingSize="1 medium apple (182g)"
                ),
                health_score=94,
                health_explanation="Outstanding natural source of pectin soluble fiber and vitamin C with negligible fat and sodium.",
                allergens=[],
                diet_tags=["Vegan", "Vegetarian", "Jain", "Halal", "Gluten-Free"],
                cues_detected=[
                    "Smooth waxy red-yellow epidermal skin",
                    "Distinct apical stem indentation",
                    "Firm spherical geometry"
                ],
                data_source="database"
            )

        # 3. Banana (Accurate USDA: 105 kcal, 1.3g protein, 422mg potassium)
        elif "banana" in path_str or "kela" in path_str or "banana_ripe" in path_str:
            return FoodItemDetection(
                name="Ripe Banana",
                name_hi="पका केला",
                confidence=0.97,
                category="Fresh Fruit",
                cuisine="Tropical",
                macros=MacroNutrients(
                    calories=105.0,
                    protein=1.3,
                    carbs=27.0,
                    fat=0.4,
                    fiber=3.1,
                    sugar=14.4,
                    sodium_mg=1.2,
                    servingSize="1 medium banana (118g)"
                ),
                health_score=89,
                health_explanation="High bioavailable potassium (422mg) and vitamin B6 supporting muscular recovery and electrolyte balance.",
                allergens=[],
                diet_tags=["Vegan", "Vegetarian", "Jain", "Halal", "Gluten-Free"],
                cues_detected=[
                    "Elongated curved peel",
                    "Yellow pigment with small sugar freckles",
                    "Fibrous peel end"
                ],
                data_source="database"
            )

        # 4. Aloo Sabzi / Potato Curry (Accurate realistic macros: 138 kcal, 2.4g protein, NOT 16g!)
        elif any(k in path_str for k in ["potato", "aloo", "sabzi", "jeera aloo", "batata"]):
            return FoodItemDetection(
                name="Aloo Sabzi (Potato Curry)",
                name_hi="आलू की सब्जी",
                confidence=0.95,
                category="Indian Sabzi",
                cuisine="North Indian",
                macros=MacroNutrients(
                    calories=138.0,
                    protein=2.4, # Verified realistic IFCT/USDA protein for potato curry!
                    carbs=24.5,
                    fat=3.8,
                    fiber=2.8,
                    sugar=1.5,
                    sodium_mg=380.0,
                    servingSize="1 bowl (150g)"
                ),
                health_score=78,
                health_explanation="Wholesome potassium and complex resistant starch cooked in turmeric and cumin; low natural protein typical of root vegetables.",
                allergens=[],
                diet_tags=["Vegan", "Vegetarian", "Halal", "Gluten-Free"],
                cues_detected=[
                    "Diced golden potato cubes in spiced gravy",
                    "Cumin and mustard seed tempering",
                    "Turmeric-yellow aromatic reduction"
                ],
                data_source="database"
            )

        # 5. Soya Chunks (Vegetarian high-protein powerhouse: 26g protein per 50g!)
        elif "soya" in path_str or "nutrela" in path_str:
            return FoodItemDetection(
                name="Soya Chunks Curry (Nutrela)",
                name_hi="सोया चंक्स करी",
                confidence=0.96,
                category="Gym Protein",
                cuisine="Indian",
                macros=MacroNutrients(
                    calories=175.0,
                    protein=26.0,
                    carbs=16.0,
                    fat=1.2,
                    fiber=6.5,
                    sugar=1.0,
                    sodium_mg=320.0,
                    servingSize="1 bowl (180g)"
                ),
                health_score=94,
                health_explanation="Exceptional complete plant protein density with BCAAs supporting muscle hypertrophy.",
                allergens=["soy"],
                diet_tags=["Vegan", "Vegetarian", "High-Protein"],
                cues_detected=[
                    "Spongy textured defatted soy nuggets",
                    "Rich spiced tomato-onion curry base"
                ],
                data_source="database"
            )

        # 6. Chicken Breast (Lean bodybuilder staple)
        elif "chicken" in path_str or "murgh" in path_str:
            return FoodItemDetection(
                name="Grilled Chicken Breast",
                name_hi="ग्रिल्ड चिकन ब्रेस्ट",
                confidence=0.97,
                category="Gym Protein",
                cuisine="Global",
                macros=MacroNutrients(
                    calories=247.0,
                    protein=46.5,
                    carbs=0.0,
                    fat=5.4,
                    fiber=0.0,
                    sugar=0.0,
                    sodium_mg=210.0,
                    servingSize="1 breast portion (150g)"
                ),
                health_score=95,
                health_explanation="Ultra-lean source of complete animal protein rich in niacin, phosphorus, and vitamin B6.",
                allergens=[],
                diet_tags=["High-Protein", "Halal", "Keto"],
                cues_detected=[
                    "Charred grill cross-hatch marks",
                    "Fibrous lean white meat striations"
                ],
                data_source="database"
            )

        # 7. Eggs / Omelette
        elif "egg" in path_str or "anda" in path_str or "bhurji" in path_str:
            return FoodItemDetection(
                name="Desi Masala Egg Bhurji",
                name_hi="मसाला अंडा भुर्जी",
                confidence=0.96,
                category="Gym Breakfast",
                cuisine="Indian",
                macros=MacroNutrients(
                    calories=245.0,
                    protein=19.0,
                    carbs=5.0,
                    fat=16.5,
                    fiber=1.2,
                    sugar=2.0,
                    sodium_mg=410.0,
                    servingSize="3-egg scramble (180g)"
                ),
                health_score=88,
                health_explanation="Complete amino acid profile rich in choline and lutein with sautéed onions and green chilies.",
                allergens=["egg"],
                diet_tags=["Vegetarian-friendly (Eggetarian)", "High-Protein", "Keto"],
                cues_detected=[
                    "Fluffy yellow scrambled curd clusters",
                    "Finely chopped green chilies and onions"
                ],
                data_source="database"
            )

        # 8. Ramen Noodles
        elif "ramen" in path_str or "miso" in path_str:
            return FoodItemDetection(
                name="Shoyu Ramen Bowl",
                name_hi="जापानी शोयु रेमन",
                confidence=0.94,
                category="Japanese Noodle",
                cuisine="Japanese",
                macros=MacroNutrients(
                    calories=380.0,
                    protein=16.5,
                    carbs=54.0,
                    fat=11.0,
                    fiber=3.0,
                    sugar=4.0,
                    sodium_mg=920.0,
                    servingSize="1 ramen bowl (400ml)"
                ),
                health_score=75,
                health_explanation="Savory umami-rich broth with wheat noodles, seasoned egg, and bamboo shoots; monitor sodium.",
                allergens=["gluten", "soy", "egg"],
                diet_tags=[],
                cues_detected=[
                    "Curled wheat noodles in clear amber dashi broth",
                    "Soft-boiled marinated ajitsuke tamago half"
                ],
                data_source="database"
            )

        # 9. Edamame
        elif "edamame" in path_str:
            return FoodItemDetection(
                name="Steamed Edamame",
                name_hi="एदाममे (सोयाबीन फली)",
                confidence=0.98,
                category="Japanese Plant Protein",
                cuisine="Japanese",
                macros=MacroNutrients(
                    calories=188.0,
                    protein=18.4,
                    carbs=13.8,
                    fat=8.0,
                    fiber=8.0,
                    sugar=2.2,
                    sodium_mg=15.0,
                    servingSize="1 cup pods (155g)"
                ),
                health_score=96,
                health_explanation="Wholesome young soybeans delivering high isoflavones, soluble fiber, and complete plant protein.",
                allergens=["soy"],
                diet_tags=["Vegan", "Vegetarian", "High-Fiber", "Gluten-Free"],
                cues_detected=[
                    "Bright green pods with fuzzy texture",
                    "Visible seed bulges"
                ],
                data_source="database"
            )

        # 4. Bread / Toast
        elif "bread" in path_str or "toast" in path_str:
            return FoodItemDetection(
                name="Artisan Sourdough Bread",
                name_hi="ब्रेड / रोटी",
                confidence=0.92,
                category="Bakery / Grain",
                cuisine="European",
                macros=MacroNutrients(
                    calories=185.0,
                    protein=7.5,
                    carbs=36.0,
                    fat=1.2,
                    fiber=2.4,
                    sugar=1.5,
                    sodium_mg=340.0,
                    servingSize="2 medium slices (70g)"
                ),
                health_score=76,
                health_explanation="Complex fermentation aids gut microbiome digestion; moderate sodium content.",
                allergens=["gluten"],
                diet_tags=["Vegetarian", "Halal"],
                cues_detected=[
                    "Golden crust with airy crumb alveolar structure",
                    "Flour-dusted top surface"
                ],
                data_source="database"
            )

        # Generic Fallback
        clean_name = query.title() if query else "Nutritious Mixed Bowl"
        return FoodItemDetection(
            name=clean_name,
            name_hi="मिश्रित पौष्टिक आहार",
            confidence=0.88,
            category="Prepared Food",
            cuisine="Healthy Fusion",
            macros=MacroNutrients(
                calories=340.0,
                protein=18.0,
                carbs=45.0,
                fat=9.5,
                fiber=6.0,
                sugar=4.0,
                sodium_mg=290.0,
                servingSize="1 bowl (300g)"
            ),
            health_score=85,
            health_explanation="Balanced macronutrient profile rich in fiber and micronutrients.",
            allergens=[],
            diet_tags=["Vegetarian"],
            cues_detected=[
                "Even color saturation",
                "Recognizable grain and vegetable textures",
                "Fresh culinary presentation"
            ],
            data_source="ai_estimate"
        )

    async def analyze_freshness(
        self,
        image_bytes: Optional[bytes] = None,
        image_path: Optional[str] = None,
        food_hint: Optional[str] = None,
        lang: str = "en"
    ) -> FreshnessAnalysisResult:
        path_str = (image_path or food_hint or "").lower()
        v_cues = classify_image_features(image_bytes)
        v_cat = v_cues.get("category", "")
        spot_r = v_cues.get("spot_prob", 0.0)

        # Spoiled Bread or Mold
        if "mold" in path_str or "bread" in path_str or "spoiled" in path_str:
            return FreshnessAnalysisResult(
                item_name="Artisan Bread Slice",
                status="spoiled",
                confidence=0.96,
                freshness_score=18,
                visual_indicators=[
                    "Visible green/gray fungal mold colonies (Penicillium species)",
                    "Dull crust discoloration",
                    "Localized spore cluster spread"
                ],
                storage_advice="Bread was exposed to ambient humidity. In future, keep in sealed dry breadbox or freeze.",
                consumption_verdict="Do not consume. Mold hyphae penetrate deep beyond visible surface. Discard immediately.",
            )

        # Moderately Fresh / Ripe / Fresh Banana
        elif "banana" in path_str or "ripe" in path_str or "kela" in path_str or v_cat == "banana":
            is_speckled = spot_r > 0.08
            return FreshnessAnalysisResult(
                item_name="Cavendish Banana",
                status="moderately_fresh" if is_speckled else "fresh",
                confidence=0.95,
                freshness_score=75 if is_speckled else 95,
                visual_indicators=[
                    "Yellow peel with natural ripening sugar freckles" if is_speckled else "Vibrant yellow peel with uniform surface firmness",
                    "Slight skin softening at extremities" if is_speckled else "Intact taut skin and healthy stem juncture",
                    "Zero surface mold or deep bruising"
                ],
                storage_advice="Peel has reached peak sweetness. Eat within 48 hours or peel and freeze for smoothies." if is_speckled else "Store at room temperature away from direct sunlight for up to 5 days.",
                consumption_verdict="Safe and optimal for immediate eating or baking banana bread." if is_speckled else "Peak freshness. Excellent for raw consumption.",
            )

        # Fresh Apple / Default Fresh
        else:
            return FreshnessAnalysisResult(
                item_name="Fresh Honeycrisp Apple",
                status="fresh",
                confidence=0.97,
                freshness_score=95,
                visual_indicators=[
                    "Vibrant crimson and chartreuse skin luster",
                    "Firm taut dermal surface with no indentation",
                    "Clean intact stem with no signs of fungal rot"
                ],
                storage_advice="Store in crisper drawer at 2°C - 4°C with 90% humidity to maintain crunch for up to 3 weeks.",
                consumption_verdict="Peak freshness. Excellent for raw consumption.",
            )

    async def analyze_kitchen_photo(
        self,
        image_bytes: Optional[bytes] = None,
        image_path: Optional[str] = None,
        filename: Optional[str] = None,
        lang: str = "en"
    ) -> HygieneAnalysisResult:
        fname = filename or "kitchen_photo.jpg"
        fname_lower = fname.lower()
        file_hash = hashlib.sha256(image_bytes).hexdigest() if image_bytes else "photo_hash_demo"

        # Determine scenario based on keywords or hash
        is_dirty = "dirty" in fname_lower or "cross" in fname_lower or "street" in fname_lower
        is_spotless = "clean" in fname_lower or "spotless" in fname_lower or "prep" in fname_lower

        if is_dirty:
            score = 58
            grade = "Grade C (Critical - Needs Deep Clean)"
            compliance = "fail"
            indicators = {
                "surface_cleanliness": False,
                "cross_contamination_control": False,
                "sink_sanitation": True,
                "safe_storage": False,
                "waste_management": True
            }
            incidents = [
                FlaggedIncident(
                    timestamp="Photo",
                    indicator="Cross-Contamination Risk",
                    status="fail",
                    description="Raw poultry prep knife resting adjacent to fresh produce salad bowl.",
                    severity="high"
                ),
                FlaggedIncident(
                    timestamp="Photo",
                    indicator="Surface Cleanliness",
                    status="fail",
                    description="Grease and food residue visible on cutting surface.",
                    severity="medium"
                )
            ]
            summary = "Inspection revealed high cross-contamination risk and food debris. Immediate sanitization required."
            recs = [
                "Separate raw meat cutting boards from ready-to-eat vegetable prep areas.",
                "Sanitize all stainless steel surfaces with chlorine-based food contact sanitizer."
            ]
        elif is_spotless:
            score = 96
            grade = "Grade A (Excellent - Spotless)"
            compliance = "pass"
            indicators = {
                "surface_cleanliness": True,
                "cross_contamination_control": True,
                "sink_sanitation": True,
                "safe_storage": True,
                "waste_management": True
            }
            incidents = [
                FlaggedIncident(
                    timestamp="Photo",
                    indicator="Sanitation Station Ready",
                    status="pass",
                    description="Sanitizer bucket with test strips present at prep station.",
                    severity="low"
                )
            ]
            summary = "Exemplary food prep environment. Stainless steel surfaces sanitized and zero cross-contact hazards."
            recs = ["Maintain current daily sanitation log and temperature check sheets."]
        else:
            score = 86
            grade = "Grade A (Excellent - Minor Notes)"
            compliance = "pass"
            indicators = {
                "surface_cleanliness": True,
                "cross_contamination_control": True,
                "sink_sanitation": True,
                "safe_storage": True,
                "waste_management": True
            }
            incidents = [
                FlaggedIncident(
                    timestamp="Photo",
                    indicator="Prep Station Hygiene",
                    status="pass",
                    description="Clean prep station observed with sanitized cutting surfaces.",
                    severity="low"
                )
            ]
            summary = "Kitchen prep area complies with core sanitation standards. Clean countertops and organized storage."
            recs = ["Ensure dishcloths are replaced every 4 hours or when soiled."]

        return HygieneAnalysisResult(
            job_id=f"photo_{file_hash[:10]}",
            overall_score=score,
            hygiene_grade=grade,
            compliance_status=compliance,
            audit_type="photo",
            indicators=indicators,
            flagged_incidents=incidents,
            summary_report=summary,
            recommendations=recs,
            file_name=fname,
            file_hash=file_hash,
            duration_sec=0.0,
            frames_analyzed=1,
            is_sample_demo=False
        )

    async def ask_ai(
        self,
        question: str,
        context_type: str = "general",
        context_data: Optional[Dict[str, Any]] = None,
        image_bytes: Optional[bytes] = None,
        lang: str = "en"
    ) -> Dict[str, Any]:
        q_lower = question.lower()
        if "make" in q_lower or "cook" in q_lower or "recipe" in q_lower:
            answer = (
                "🍳 **Delicious Ideas You Can Make:**\n\n"
                "1. **Quick High-Protein Stir-Fry**: Sauté with olive oil, minced garlic, and colorful vegetables. Season with soy sauce and black pepper.\n"
                "2. **Nutrient-Dense Power Bowl**: Layer with cooked quinoa or brown rice, add sliced avocados, roasted seeds, and a zesty lemon-tahini dressing.\n"
                "3. **Wholesome Smoothie / Soup**: Blend with greek yogurt or almond milk for a rapid pre-workout boost, or simmer into a soothing vegetable broth!"
            )
        elif "protein" in q_lower or "calorie" in q_lower or "nutrition" in q_lower:
            answer = (
                "💪 **Nutritional Breakdown & Health Benefits:**\n\n"
                "• **Macronutrients**: High biological value protein supporting muscle protein synthesis and satiety.\n"
                "• **Micronutrients**: Rich in potassium, essential B-vitamins, and dietary fiber for optimal gut motility.\n"
                "• **Fitness Tip**: Consume within 45 minutes post-workout alongside complex carbohydrates to accelerate glycogen replenishment!"
            )
        else:
            answer = (
                f"✨ **FoodVerse AI Chef Advice:**\n\n"
                f"Great question! Based on culinary and nutritional science, fresh ingredients are best kept at steady cool temperatures. "
                f"Combine with healthy fats (cold-pressed olive oil, nuts) to enhance fat-soluble vitamin absorption (A, D, E, K)."
            )

        return {
            "answer": answer,
            "suggestions": [
                "What can I cook with this?",
                "What is the exact protein & calorie count?",
                "How long will this stay fresh?"
            ],
            "model_provider": "offline_knowledge_base"
        }

    async def analyze_kitchen_video(
        self,
        video_path: str,
        job_id: str,
        file_hash: Optional[str] = None,
        filename: Optional[str] = None,
        extracted_frames: Optional[List[Dict[str, Any]]] = None,
        duration_sec: float = 0.0,
        lang: str = "en",
        progress_callback: Optional[Any] = None
    ) -> HygieneAnalysisResult:
        from app.core.config import settings
        fname = filename or Path(video_path).name
        fname_lower = fname.lower()
        is_demo = "sample" in fname_lower or "demo" in fname_lower or "kitchen_prep" in fname_lower or "test" in fname_lower

        frames = extracted_frames or []
        num_frames = len(frames)

        # If not demo and no API key is provided, never fabricate fake analysis
        if not is_demo and not settings.GEMINI_API_KEY:
            return HygieneAnalysisResult(
                job_id=job_id,
                overall_score=0,
                compliance_status="fail",
                file_name=fname,
                file_hash=file_hash,
                duration_sec=duration_sec,
                frames_analyzed=num_frames,
                requires_api_key=True,
                error_message="AI provider not configured. Add GEMINI_API_KEY (or OPENAI_API_KEY) in the backend environment to enable video frame analysis.",
                summary_report="AI provider not configured. Add GEMINI_API_KEY (or OPENAI_API_KEY) in the backend environment to inspect custom uploaded video frames.",
                indicators={},
                flagged_incidents=[]
            )

        # For demo / test videos or when frames are extracted:
        # Compute dynamic score uniquely derived from the video file hash
        hash_seed = int(file_hash[:6], 16) if (file_hash and len(file_hash) >= 6) else sum(ord(c) for c in fname)
        overall_score = 82 + (hash_seed % 14) # Range: 82 to 95
        compliance_status = "pass" if overall_score >= 80 else "warning"

        # Dynamically build flagged incidents with actual timestamps from extracted frames
        incidents = []
        if frames:
            # First frame incident
            t1 = frames[0].get("timestamp_str", "00:01s")
            thumb1 = frames[0].get("thumbnail_path")
            incidents.append(FlaggedIncident(
                timestamp=t1,
                indicator="PPE & Glove Verification",
                status="pass",
                description="Food handler actively wearing certified nitrile food-prep gloves and clean headwear at prep station.",
                severity="low",
                thumbnail_path=thumb1
            ))

            # Mid frame incident
            mid_idx = len(frames) // 2
            t2 = frames[mid_idx].get("timestamp_str", "00:04s")
            thumb2 = frames[mid_idx].get("thumbnail_path")
            is_cross_contact = (hash_seed % 3 == 0)
            incidents.append(FlaggedIncident(
                timestamp=t2,
                indicator="Cross-Contamination Audit",
                status="fail" if is_cross_contact else "pass",
                description="Raw cutting board observed in proximity to ready-to-eat salad zone." if is_cross_contact else "Color-coded cutting board strictly segregated for vegetable slicing.",
                severity="high" if is_cross_contact else "low",
                thumbnail_path=thumb2
            ))

            # Last frame incident
            t3 = frames[-1].get("timestamp_str", "00:08s")
            thumb3 = frames[-1].get("thumbnail_path")
            incidents.append(FlaggedIncident(
                timestamp=t3,
                indicator="Station Sanitization",
                status="pass",
                description="Stainless steel prep surface wiped and sanitized with food-contact spray.",
                severity="low",
                thumbnail_path=thumb3
            ))
        else:
            incidents = [
                FlaggedIncident(
                    timestamp="00:02s",
                    indicator="PPE Compliance",
                    status="pass",
                    description="Gloves and hairnets observed across prep team.",
                    severity="low"
                )
            ]

        has_cross_contact = any(inc.indicator == "Cross-Contamination Audit" and inc.status == "fail" for inc in incidents)

        return HygieneAnalysisResult(
            job_id=job_id,
            overall_score=overall_score,
            compliance_status=compliance_status,
            indicators={
                "glove_usage": True,
                "hair_cap_compliance": True,
                "cross_contamination_control": not has_cross_contact,
                "station_cleanliness": True,
                "sanitization_station_ready": True
            },
            flagged_incidents=incidents,
            summary_report=f"Analyzed {num_frames} video frames extracted at 2-second intervals (duration: {duration_sec:.1f}s, SHA-256: {file_hash[:8] if file_hash else 'N/A'}). Overall hygiene score: {overall_score}/100.",
            recommendations=[
                "Maintain strict color-coded knife and cutting board segregation.",
                "Ensure hourly temperature logs for high-risk chilled prep counters."
            ],
            file_name=fname,
            file_hash=file_hash,
            duration_sec=duration_sec,
            frames_analyzed=num_frames,
            is_sample_demo=is_demo,
            requires_api_key=False
        )

    async def generate_meal_plan(
        self,
        user_profile: Dict[str, Any],
        target_calories: float,
        target_macros: Dict[str, float],
        pantry_items: Optional[List[Dict[str, Any]]] = None,
        plan_type: str = "daily",
        lang: str = "en"
    ) -> MealPlanResult:
        is_veg = user_profile.get("diet_type", "").lower() in ["veg", "vegetarian", "jain", "vegan"]
        allergies = user_profile.get("allergies", [])
        
        cal = max(float(target_calories or 2000.0), 1200.0) # Enforce 1200 kcal safety floor
        protein = float(target_macros.get("protein", 130.0))
        carbs = float(target_macros.get("carbs", 220.0))
        fat = float(target_macros.get("fat", 65.0))

        if is_veg:
            breakfast = MealEntry(meal_type="Breakfast", dish_name="Sprouted Moong Dal & Oats Chilla", calories=cal * 0.25, protein=protein * 0.25, carbs=carbs * 0.28, fat=fat * 0.22, description="Nutritious savory crepe with grated carrots and mint chutney.")
            lunch = MealEntry(meal_type="Lunch", dish_name="Low-Fat Paneer & Quinoa Bowl", calories=cal * 0.35, protein=protein * 0.35, carbs=carbs * 0.32, fat=fat * 0.38, description="Grilled cottage cheese cubes with roasted bell peppers, steamed quinoa, and lemon dressing.")
            dinner = MealEntry(meal_type="Dinner", dish_name="Yellow Dal Tadka with Brown Rice", calories=cal * 0.30, protein=protein * 0.28, carbs=carbs * 0.32, fat=fat * 0.28, description="Homestyle cumin-tempered lentils with 1 bowl of fiber-rich brown rice and cucumber raita.")
            snack = MealEntry(meal_type="Snack", dish_name="Roasted Makhana (Foxnuts) & Greek Yogurt", calories=cal * 0.10, protein=protein * 0.12, carbs=carbs * 0.08, fat=fat * 0.12, description="Lightly toasted foxnuts with Himalayan pink salt and 1 cup Greek yogurt.")
        else:
            breakfast = MealEntry(meal_type="Breakfast", dish_name="Egg White Omelette with Spinach & Toast", calories=cal * 0.25, protein=protein * 0.28, carbs=carbs * 0.22, fat=fat * 0.22, description="3 egg whites, 1 whole egg, wilted baby spinach, and 1 slice whole wheat bread.")
            lunch = MealEntry(meal_type="Lunch", dish_name="Grilled Herb Chicken Breast & Sweet Potato", calories=cal * 0.35, protein=protein * 0.38, carbs=carbs * 0.32, fat=fat * 0.35, description="180g lean chicken breast with rosemary, baked sweet potato wedges, and green beans.")
            dinner = MealEntry(meal_type="Dinner", dish_name="Pan-Seared Salmon with Steamed Asparagus", calories=cal * 0.30, protein=protein * 0.26, carbs=carbs * 0.30, fat=fat * 0.35, description="Omega-3 rich salmon fillet with garlic asparagus and quinoa.")
            snack = MealEntry(meal_type="Snack", dish_name="Whey Protein Shake with Almond Milk", calories=cal * 0.10, protein=protein * 0.08, carbs=carbs * 0.16, fat=fat * 0.08, description="1 scoop isolate protein with unsweetened almond milk.")

        day_plan = DailyMealPlan(
            day="Target Day",
            target_calories=cal,
            meals=[breakfast, lunch, dinner, snack]
        )

        return MealPlanResult(
            plan_title=f"{'Vegetarian ' if is_veg else ''}Macro-Optimized Regimen",
            target_calories=cal,
            target_protein=protein,
            target_carbs=carbs,
            target_fat=fat,
            days=[day_plan],
            grocery_list=["Quinoa", "Greek yogurt", "Baby spinach", "Cumin seeds", "Turmeric"],
            allergen_exclusions_applied=allergies,
            diet_applied="Vegetarian" if is_veg else "Omnivore"
        )
