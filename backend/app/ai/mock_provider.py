import os
import re
from typing import Optional, List, Dict, Any
from pathlib import Path
from app.ai.base import AIProvider
from app.schemas.ai import (
    FoodItemDetection,
    MacroNutrients,
    FreshnessAnalysisResult,
    HygieneAnalysisResult,
    FlaggedIncident,
    CookingChatResult,
    MealPlanResult,
    DailyMealPlan,
    MealEntry
)

class MockAIProvider(AIProvider):
    """
    Deterministic Mock AI Provider for FoodVerse AI.
    Provides realistic multimodal food intelligence responses without external API keys.
    """

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

        # Spoiled Bread
        if "mold" in path_str or "bread" in path_str:
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

        # Moderately Fresh / Ripe Banana
        elif "banana" in path_str or "ripe" in path_str:
            return FreshnessAnalysisResult(
                item_name="Cavendish Banana",
                status="moderately_fresh",
                confidence=0.93,
                freshness_score=72,
                visual_indicators=[
                    "Yellow peel with brown sugar freckles",
                    "Slight skin softening at extremities",
                    "Zero surface mold or deep bruising"
                ],
                storage_advice="Peel has reached peak sweetness. Eat within 48 hours or peel and freeze for smoothies.",
                consumption_verdict="Safe and optimal for immediate eating or baking banana bread.",
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

    async def analyze_kitchen_video(
        self,
        video_path: str,
        job_id: str,
        lang: str = "en"
    ) -> HygieneAnalysisResult:
        return HygieneAnalysisResult(
            job_id=job_id,
            overall_score=87,
            compliance_status="pass",
            indicators={
                "glove_usage": True,
                "hair_cap_compliance": True,
                "cross_contamination_control": False,
                "station_cleanliness": True,
                "sanitization_station_ready": True
            },
            flagged_incidents=[
                FlaggedIncident(
                    timestamp="00:03s",
                    indicator="Cross-Contamination Warning",
                    status="fail",
                    description="Prep tool contact between poultry station and general prep table without intermediate wipe-down.",
                    severity="high"
                ),
                FlaggedIncident(
                    timestamp="00:08s",
                    indicator="PPE Verification",
                    status="pass",
                    description="Full hair net and disposable apron compliance verified across prep team.",
                    severity="low"
                ),
                FlaggedIncident(
                    timestamp="00:15s",
                    indicator="Station Wipe-down",
                    status="pass",
                    description="Stainless steel cutting table sanitized prior to vegetable processing.",
                    severity="low"
                )
            ],
            summary_report="Overall kitchen hygiene is exemplary (Score: 87/100). Personal protective equipment compliance was 100%. One corrective action needed regarding poultry tool segregation.",
            recommendations=[
                "Implement strict color-coded cutting boards and knives (Red for raw meat, Green for vegetables).",
                "Ensure sanitizing spray bottles are stationed within 2 meters of every cutting zone."
            ]
        )

    async def chat_cooking(
        self,
        query: str,
        history: List[Dict[str, str]],
        pantry_items: Optional[List[Dict[str, Any]]] = None,
        lang: str = "en"
    ) -> CookingChatResult:
        q_clean = query.lower()

        # 1. Maggi / Maggie Noodles
        if "maggi" in q_clean or "maggie" in q_clean or "noodle" in q_clean:
            return CookingChatResult(
                reply="Here is how to prepare delicious, steaming Street-Style Masala Maggi! Follow these steps with the 2-minute timer for peak texture.",
                suggested_recipe_title="Street-Style Masala Maggi 🍜",
                ingredients=[
                    "1 packet Maggi 2-Minute Noodles with Tastemaker",
                    "1.5 cups (350ml) clean water",
                    "1/4 small onion (finely chopped)",
                    "1/4 small tomato (diced)",
                    "1 small green chili (optional for spice)",
                    "1/2 tsp butter or ghee",
                    "Fresh coriander leaves for garnish"
                ],
                instructions=[
                    "Step 1: Heat 1/2 tsp butter in a small saucepan over medium heat; sauté onions and green chili for 1 minute.",
                    "Step 2: Add diced tomatoes and cook for 1 minute until soft and aromatic.",
                    "Step 3: Pour in 1.5 cups of water and bring to a rolling boil.",
                    "Step 4: Break the noodle cake into halves, stir in the Maggi Tastemaker spice blend.",
                    "Step 5: Cook on medium flame for exactly 2 minutes, stirring gently until noodles absorb the savory broth.",
                    "Step 6: Garnish with fresh coriander and enjoy piping hot!"
                ],
                timer_minutes=2,
                substitutions={
                    "butter": "ghee or olive oil",
                    "green chili": "cracked black pepper"
                },
                missing_pantry_items=["Maggi 2-Minute Noodles", "fresh coriander"]
            )

        # 2. Paneer dishes (Paneer Tikka, Paneer Butter Masala)
        elif "paneer" in q_clean:
            return CookingChatResult(
                reply="Here is an aromatic, restaurant-style Quick Tawa Paneer recipe rich in muscle-building protein!",
                suggested_recipe_title="High-Protein Tawa Paneer Sauté 🧀",
                ingredients=[
                    "200g low-fat fresh paneer (cut into cubes)",
                    "1 capsicum / bell pepper (sliced)",
                    "1 medium onion (sliced)",
                    "1 tbsp olive oil or butter",
                    "1/2 tsp cumin, turmeric, and garam masala",
                    "Salt and kasuri methi (fenugreek leaves) to taste"
                ],
                instructions=[
                    "Step 1: Heat oil in a flat tawa or skillet over medium flame.",
                    "Step 2: Add sliced onions and capsicum; toss for 3 minutes on high heat for a smoky char.",
                    "Step 3: Add turmeric, garam masala, and salt; mix well.",
                    "Step 4: Add paneer cubes gently and toss for 2 to 3 minutes until slightly golden on edges.",
                    "Step 5: Crush kasuri methi between palms and sprinkle on top with a squeeze of fresh lemon."
                ],
                timer_minutes=3,
                substitutions={
                    "paneer": "firm tofu for vegan alternative",
                    "kasuri methi": "fresh chopped cilantro"
                },
                missing_pantry_items=["kasuri methi", "fresh lemon"]
            )

        # 3. Potatoes / Aloo Sabzi / What can I make with potatoes
        elif any(k in q_clean for k in ["potato", "aloo", "batata", "sabzi"]):
            return CookingChatResult(
                reply="Potatoes are incredibly versatile! Here is an authentic, comforting Jeera Aloo (Cumin Spiced Potatoes) ready in 8 minutes.",
                suggested_recipe_title="Homestyle Jeera Aloo (Cumin Potatoes) 🥔✨",
                ingredients=[
                    "3 medium potatoes (boiled, peeled, and cubed)",
                    "1 tbsp mustard oil or ghee",
                    "1 tsp whole cumin seeds (jeera)",
                    "1/2 tsp turmeric powder & 1/2 tsp red chili powder",
                    "1/2 tsp dry mango powder (amchur) or lemon juice",
                    "Salt to taste and fresh chopped coriander"
                ],
                instructions=[
                    "Step 1: Heat 1 tbsp oil/ghee in a pan over medium heat. Add cumin seeds and let them splutter for 30 seconds.",
                    "Step 2: Lower the flame, add turmeric and red chili powder; immediately add the boiled potato cubes.",
                    "Step 3: Toss gently for 4-5 minutes until potato edges develop a crispy golden crust.",
                    "Step 4: Sprinkle amchur powder and salt; toss for 1 more minute.",
                    "Step 5: Garnish with fresh coriander and serve hot with rotis or curd!"
                ],
                timer_minutes=5,
                substitutions={
                    "mustard oil": "ghee or olive oil",
                    "amchur": "fresh lemon juice"
                },
                missing_pantry_items=["amchur powder", "fresh coriander"]
            )

        # 4. Banana / Smoothie / What can I make with banana
        elif "banana" in q_clean or "kela" in q_clean or "smoothie" in q_clean:
            return CookingChatResult(
                reply="Bananas make the ultimate natural pre/post-workout snack! Here is a high-protein Creamy Banana Oats Power Smoothie ready in 2 minutes.",
                suggested_recipe_title="Banana Oats Power Fuel Smoothie 🍌🥤",
                ingredients=[
                    "1 ripe banana (sliced)",
                    "1 cup chilled milk (dairy or almond milk)",
                    "2 tbsp rolled oats",
                    "1 tbsp natural peanut butter",
                    "1 scoop Whey protein (optional for 30g+ protein)",
                    "1/4 tsp cinnamon powder and 2 ice cubes"
                ],
                instructions=[
                    "Step 1: Add rolled oats to blender and pulse for 10 seconds into a coarse powder.",
                    "Step 2: Add sliced banana, peanut butter, milk, and protein powder.",
                    "Step 3: Blend on high speed for 45 seconds until silky smooth and creamy.",
                    "Step 4: Pour into a glass, dust with cinnamon, and drink immediately for instant glycogen recovery!"
                ],
                timer_minutes=2,
                substitutions={
                    "milk": "almond, oat, or soy milk",
                    "peanut butter": "almond butter or soaked cashews"
                },
                missing_pantry_items=["peanut butter", "cinnamon powder"]
            )

        # 5. Nutritional Values Q&A
        elif any(k in q_clean for k in ["nutritional value", "nutrition", "nutrients", "calories in", "protein in", "macros"]):
            return CookingChatResult(
                reply="Here is the certified nutritional telemetry breakdown! For a standard medium Banana (118g): 105 kcal, 1.3g Protein, 27g Carbs, 0.4g Fat, 3.1g Dietary Fiber, and 422mg Potassium (vital for muscle contraction). For Aloo Sabzi (150g serving): 138 kcal, 2.4g Protein, 24.5g Carbs, and 3.8g Fat.",
                suggested_recipe_title="Nutritional Telemetry & Macro Breakdown 📊",
                ingredients=[
                    "Banana: 105 kcal | 1.3g Protein | 27g Carbs | 422mg Potassium",
                    "Aloo Sabzi (150g): 138 kcal | 2.4g Protein | 24.5g Carbs | 3.8g Fat",
                    "Soya Chunks (50g): 172 kcal | 26g Protein | 16.5g Carbs | 6.5g Fiber",
                    "Boiled Eggs (2): 144 kcal | 12.6g Protein | 0.8g Carbs | 9.6g Fat",
                    "Chicken Breast (150g): 247 kcal | 46.5g Protein | 0g Carbs | 5.4g Fat"
                ],
                instructions=[
                    "Step 1: Review your daily targets in Gym Mode (BMR / TDEE tracker).",
                    "Step 2: Pair carbohydrates (like bananas or potatoes) with lean proteins (like eggs, whey, or soya) for sustained muscle protein synthesis.",
                    "Step 3: Keep sodium below 2,300mg and drink 35ml of water per kg of body weight."
                ],
                timer_minutes=1,
                substitutions={},
                missing_pantry_items=[]
            )

        # 6. Eggs / Omelette
        elif any(k in q_clean for k in ["egg", "omelette", "anda", "bhurji"]):
            return CookingChatResult(
                reply="Eggs are the gold standard of bioavailability (DIAAS score 1.18). Here is a quick 3-minute Masala Egg Omelette!",
                suggested_recipe_title="Fluffy Masala Herb Omelette 🍳",
                ingredients=[
                    "2 whole eggs + 1 egg white (whisked)",
                    "1/4 small onion & 1/2 tomato (finely chopped)",
                    "1 green chili and fresh coriander",
                    "1 tsp butter or olive oil",
                    "Pinch of turmeric, salt, and black pepper"
                ],
                instructions=[
                    "Step 1: Whisk eggs with onions, chilies, tomatoes, turmeric, and salt for 1 minute until frothy.",
                    "Step 2: Melt butter in a non-stick pan over medium heat.",
                    "Step 3: Pour egg mixture and cook undisturbed for 2 minutes until base is golden.",
                    "Step 4: Flip gently, cook for 1 more minute, fold in half, and serve hot with whole wheat toast!"
                ],
                timer_minutes=3,
                substitutions={"butter": "olive oil"},
                missing_pantry_items=["fresh coriander"]
            )

        # 7. Pasta / Macaroni
        elif "pasta" in q_clean or "macaroni" in q_clean:
            return CookingChatResult(
                reply="Here is a simple, mouthwatering Creamy Garlic & Herb Pasta that comes together in 15 minutes!",
                suggested_recipe_title="Garlic Herb Penne Pasta 🍝",
                ingredients=[
                    "200g penne or macaroni pasta",
                    "2 tbsp extra virgin olive oil",
                    "4 cloves garlic (minced)",
                    "1/2 cup grated parmesan or mozzarella",
                    "1/4 cup reserved pasta boiling water",
                    "Chili flakes and dried oregano"
                ],
                instructions=[
                    "Step 1: Boil salted water in a pot, add pasta and cook for 8-10 minutes until al dente.",
                    "Step 2: Reserve 1/4 cup of starchy pasta water, then drain pasta.",
                    "Step 3: In a pan, warm olive oil and sauté minced garlic on low flame for 1 minute until fragrant.",
                    "Step 4: Toss cooked pasta and reserved water into the garlic oil; stir vigorously to create a silky sauce.",
                    "Step 5: Stir in cheese, chili flakes, and herbs. Serve warm!"
                ],
                timer_minutes=8,
                substitutions={
                    "parmesan": "nutritional yeast or cheddar",
                    "olive oil": "unsalted butter"
                },
                missing_pantry_items=["parmesan cheese", "fresh basil"]
            )

        # Check for expiring items in pantry or general fallback
        expiring = []
        if pantry_items:
            for item in pantry_items:
                if item.get("status") in ["use_soon", "fresh"]:
                    expiring.append(item.get("name"))

        expiring_text = ", ".join(expiring[:3]) if expiring else "fresh ingredients"

        return CookingChatResult(
            reply=f"Here is a chef-crafted recipe designed to turn your ingredients ({expiring_text}) into a wholesome meal!",
            suggested_recipe_title="Nutrient-Rich Skillet Sauté 🍲",
            ingredients=[
                f"2 cups of {expiring[0] if expiring else 'mixed vegetables'}",
                "1 tbsp extra virgin olive oil",
                "1/2 tsp ground cumin and turmeric",
                "Salt and freshly cracked black pepper to taste",
                "Fresh herbs or lemon juice for finishing"
            ],
            instructions=[
                "Step 1: Heat olive oil in a wide skillet over medium heat.",
                "Step 2: Add vegetables and sauté for 5 minutes until tender-crisp.",
                "Step 3: Season with cumin, turmeric, salt, and pepper; toss evenly.",
                "Step 4: Cover and reduce heat to low for 3 minutes to lock in aromatics."
            ],
            timer_minutes=5,
            substitutions={
                "olive oil": "avocado oil or ghee",
                "cumin": "ground coriander or garam masala"
            },
            missing_pantry_items=["fresh cilantro / parsley"]
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
