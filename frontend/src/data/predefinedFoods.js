/**
 * Comprehensive authentic regional foods library for FoodVerse AI
 * Covers Japan, USA, and 16 major Indian regions with realistic macros.
 */

export const PREDEFINED_FOODS = [
  {
    "id": "reg_1",
    "name": "Tonkotsu Ramen",
    "name_hi": "\u091f\u094b\u0902\u0915\u094b\u0924\u094d\u0938\u0941 \u0930\u093e\u092e\u0947\u0928",
    "category": "Japanese Noodle",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 large bowl (450g)",
    "calories": 580.0,
    "protein_g": 28.0,
    "carbs_g": 65.0,
    "fat_g": 22.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "high-protein"
    ]
  },
  {
    "id": "reg_2",
    "name": "Shoyu Ramen",
    "name_hi": "\u0936\u094b\u092f\u0941 \u0930\u093e\u092e\u0947\u0928",
    "category": "Japanese Noodle",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 bowl (420g)",
    "calories": 460.0,
    "protein_g": 22.0,
    "carbs_g": 62.0,
    "fat_g": 14.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "balanced"
    ]
  },
  {
    "id": "reg_3",
    "name": "Miso Ramen",
    "name_hi": "\u092e\u093f\u0938\u094b \u0930\u093e\u092e\u0947\u0928",
    "category": "Japanese Noodle",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 bowl (440g)",
    "calories": 520.0,
    "protein_g": 24.0,
    "carbs_g": 68.0,
    "fat_g": 17.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "probiotic"
    ]
  },
  {
    "id": "reg_4",
    "name": "Salmon Nigiri Sushi",
    "name_hi": "\u0938\u0948\u0932\u094d\u092e\u0928 \u0928\u093f\u0917\u093f\u0930\u0940 \u0938\u0941\u0936\u0940",
    "category": "Japanese Sushi",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "2 pcs (70g)",
    "calories": 140.0,
    "protein_g": 9.0,
    "carbs_g": 18.0,
    "fat_g": 3.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "high-protein",
      "omega-3"
    ]
  },
  {
    "id": "reg_5",
    "name": "Tuna Nigiri (Maguro)",
    "name_hi": "\u091f\u0942\u0928\u093e \u0928\u093f\u0917\u093f\u0930\u0940",
    "category": "Japanese Sushi",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "2 pcs (70g)",
    "calories": 125.0,
    "protein_g": 11.0,
    "carbs_g": 18.0,
    "fat_g": 1.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "high-protein",
      "lean"
    ]
  },
  {
    "id": "reg_6",
    "name": "California Roll",
    "name_hi": "\u0915\u0948\u0932\u093f\u092b\u094b\u0930\u094d\u0928\u093f\u092f\u093e \u0930\u094b\u0932",
    "category": "Japanese Sushi",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "6 pcs (160g)",
    "calories": 260.0,
    "protein_g": 8.0,
    "carbs_g": 38.0,
    "fat_g": 7.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "balanced"
    ]
  },
  {
    "id": "reg_7",
    "name": "Spicy Tuna Roll",
    "name_hi": "\u0938\u094d\u092a\u093e\u0907\u0938\u0940 \u091f\u0942\u0928\u093e \u0930\u094b\u0932",
    "category": "Japanese Sushi",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "6 pcs (160g)",
    "calories": 290.0,
    "protein_g": 14.0,
    "carbs_g": 36.0,
    "fat_g": 9.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "high-protein"
    ]
  },
  {
    "id": "reg_8",
    "name": "Salmon Sashimi",
    "name_hi": "\u0938\u0948\u0932\u094d\u092e\u0928 \u0938\u093e\u0936\u093f\u092e\u0940",
    "category": "Japanese Raw Fish",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "5 slices (100g)",
    "calories": 180.0,
    "protein_g": 22.0,
    "carbs_g": 0.0,
    "fat_g": 10.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "keto",
      "high-protein",
      "zero-carb"
    ]
  },
  {
    "id": "reg_9",
    "name": "Tuna Sashimi",
    "name_hi": "\u091f\u0942\u0928\u093e \u0938\u093e\u0936\u093f\u092e\u0940",
    "category": "Japanese Raw Fish",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "5 slices (100g)",
    "calories": 130.0,
    "protein_g": 28.0,
    "carbs_g": 0.0,
    "fat_g": 1.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "keto",
      "high-protein",
      "ultra-lean"
    ]
  },
  {
    "id": "reg_10",
    "name": "Miso Soup with Tofu & Wakame",
    "name_hi": "\u092e\u093f\u0938\u094b \u0938\u0942\u092a \u091f\u094b\u092b\u0942 \u0915\u0947 \u0938\u093e\u0925",
    "category": "Japanese Soup",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 bowl (200ml)",
    "calories": 70.0,
    "protein_g": 5.0,
    "carbs_g": 6.0,
    "fat_g": 2.5,
    "fiber_g": 1.5,
    "gym_tags": [
      "vegetarian",
      "probiotic",
      "low-calorie"
    ]
  },
  {
    "id": "reg_11",
    "name": "Steamed Edamame",
    "name_hi": "\u0909\u092c\u0932\u0947 \u0939\u0941\u090f \u090f\u0921\u093e\u092e\u093e\u092e\u0947",
    "category": "Japanese Appetizer",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 bowl (120g)",
    "calories": 140.0,
    "protein_g": 14.0,
    "carbs_g": 11.0,
    "fat_g": 5.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "vegan",
      "high-protein",
      "high-fiber"
    ]
  },
  {
    "id": "reg_12",
    "name": "Chicken Teriyaki",
    "name_hi": "\u091a\u093f\u0915\u0928 \u0924\u0947\u0930\u093f\u092f\u093e\u0915\u0940",
    "category": "Japanese Main",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 portion (180g)",
    "calories": 320.0,
    "protein_g": 32.0,
    "carbs_g": 14.0,
    "fat_g": 15.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "high-protein"
    ]
  },
  {
    "id": "reg_13",
    "name": "Beef Gyudon",
    "name_hi": "\u092c\u0940\u092b \u0917\u094d\u092f\u0941\u0926\u094b\u0928",
    "category": "Japanese Donburi",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 bowl (380g)",
    "calories": 640.0,
    "protein_g": 26.0,
    "carbs_g": 85.0,
    "fat_g": 20.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "comfort-food"
    ]
  },
  {
    "id": "reg_14",
    "name": "Katsudon (Pork Cutlet Rice Bowl)",
    "name_hi": "\u0915\u093e\u0924\u094d\u0938\u0941\u0926\u094b\u0928",
    "category": "Japanese Donburi",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 bowl (400g)",
    "calories": 720.0,
    "protein_g": 30.0,
    "carbs_g": 92.0,
    "fat_g": 24.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "high-calorie"
    ]
  },
  {
    "id": "reg_15",
    "name": "Chicken Katsu Curry",
    "name_hi": "\u091a\u093f\u0915\u0928 \u0915\u093e\u0924\u094d\u0938\u0941 \u0915\u0930\u0940",
    "category": "Japanese Curry",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 plate (450g)",
    "calories": 760.0,
    "protein_g": 34.0,
    "carbs_g": 98.0,
    "fat_g": 26.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "hearty"
    ]
  },
  {
    "id": "reg_16",
    "name": "Vegetable Tempura",
    "name_hi": "\u0935\u0947\u091c\u093f\u091f\u0947\u092c\u0932 \u0924\u0947\u092e\u094d\u092a\u0941\u0930\u093e",
    "category": "Japanese Appetizer",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 basket (150g)",
    "calories": 280.0,
    "protein_g": 4.0,
    "carbs_g": 34.0,
    "fat_g": 14.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_17",
    "name": "Tempura Ebi (Shrimp)",
    "name_hi": "\u091d\u0940\u0902\u0917\u093e \u0924\u0947\u092e\u094d\u092a\u0941\u0930\u093e",
    "category": "Japanese Appetizer",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "3 pcs (100g)",
    "calories": 210.0,
    "protein_g": 14.0,
    "carbs_g": 16.0,
    "fat_g": 10.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "high-protein"
    ]
  },
  {
    "id": "reg_18",
    "name": "Kitsune Udon",
    "name_hi": "\u0915\u093f\u0924\u094d\u0938\u0941\u0928\u0947 \u0909\u0921\u094b\u0928",
    "category": "Japanese Noodle",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 bowl (420g)",
    "calories": 420.0,
    "protein_g": 15.0,
    "carbs_g": 72.0,
    "fat_g": 7.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_19",
    "name": "Zaru Soba (Cold Buckwheat Noodles)",
    "name_hi": "\u091c\u093c\u093e\u0930\u0942 \u0938\u094b\u092c\u093e",
    "category": "Japanese Noodle",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 serving (220g)",
    "calories": 310.0,
    "protein_g": 13.0,
    "carbs_g": 62.0,
    "fat_g": 2.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "vegan",
      "clean-eating"
    ]
  },
  {
    "id": "reg_20",
    "name": "Okonomiyaki (Osaka Savory Pancake)",
    "name_hi": "\u0913\u0915\u094b\u0928\u094b\u092e\u093f\u092f\u093e\u0915\u0940",
    "category": "Japanese Street Food",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 pancake (280g)",
    "calories": 480.0,
    "protein_g": 18.0,
    "carbs_g": 54.0,
    "fat_g": 20.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "comfort-food"
    ]
  },
  {
    "id": "reg_21",
    "name": "Takoyaki",
    "name_hi": "\u0924\u093e\u0915\u094b\u092f\u093e\u0915\u0940",
    "category": "Japanese Street Food",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "6 balls (180g)",
    "calories": 330.0,
    "protein_g": 12.0,
    "carbs_g": 42.0,
    "fat_g": 12.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "street-snack"
    ]
  },
  {
    "id": "reg_22",
    "name": "Yakitori (Chicken Skewers)",
    "name_hi": "\u092f\u093e\u0915\u093f\u0924\u094b\u0930\u0940",
    "category": "Japanese Grill",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "3 skewers (120g)",
    "calories": 210.0,
    "protein_g": 26.0,
    "carbs_g": 4.0,
    "fat_g": 9.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "high-protein",
      "low-carb"
    ]
  },
  {
    "id": "reg_23",
    "name": "Agedashi Tofu",
    "name_hi": "\u0905\u0917\u0947\u0926\u093e\u0936\u0940 \u091f\u094b\u092b\u0942",
    "category": "Japanese Tofu",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 bowl (180g)",
    "calories": 190.0,
    "protein_g": 11.0,
    "carbs_g": 14.0,
    "fat_g": 10.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_24",
    "name": "Natto with Mustard & Rice",
    "name_hi": "\u0928\u093e\u091f\u094d\u091f\u094b \u091a\u093e\u0935\u0932",
    "category": "Japanese Traditional",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 pack with rice (200g)",
    "calories": 320.0,
    "protein_g": 16.0,
    "carbs_g": 52.0,
    "fat_g": 6.0,
    "fiber_g": 7.0,
    "gym_tags": [
      "probiotic",
      "vegan",
      "superfood"
    ]
  },
  {
    "id": "reg_25",
    "name": "Tamagoyaki (Japanese Rolled Omelette)",
    "name_hi": "\u0924\u093e\u092e\u093e\u0917\u094b\u092f\u093e\u0915\u0940",
    "category": "Japanese Breakfast",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "4 slices (100g)",
    "calories": 150.0,
    "protein_g": 10.0,
    "carbs_g": 6.0,
    "fat_g": 9.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "vegetarian",
      "high-protein"
    ]
  },
  {
    "id": "reg_26",
    "name": "Gyoza (Pan-Seared Dumplings)",
    "name_hi": "\u0917\u094d\u092f\u094b\u091d\u093e",
    "category": "Japanese Appetizer",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "6 pcs (150g)",
    "calories": 310.0,
    "protein_g": 14.0,
    "carbs_g": 32.0,
    "fat_g": 13.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "savory"
    ]
  },
  {
    "id": "reg_27",
    "name": "Unagi Don (Grilled Eel Rice)",
    "name_hi": "\u0909\u0928\u093e\u0917\u0940 \u0926\u094b\u0928",
    "category": "Japanese Donburi",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 bowl (350g)",
    "calories": 680.0,
    "protein_g": 28.0,
    "carbs_g": 82.0,
    "fat_g": 26.0,
    "fiber_g": 1.5,
    "gym_tags": [
      "rich",
      "high-protein"
    ]
  },
  {
    "id": "reg_28",
    "name": "Karaage (Japanese Fried Chicken)",
    "name_hi": "\u0915\u093e\u0930\u093e\u0917\u0947 \u091a\u093f\u0915\u0928",
    "category": "Japanese Appetizer",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "5 pieces (160g)",
    "calories": 390.0,
    "protein_g": 26.0,
    "carbs_g": 16.0,
    "fat_g": 24.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "high-protein",
      "crispy"
    ]
  },
  {
    "id": "reg_29",
    "name": "Sukiyaki Beef & Vegetable Hotpot",
    "name_hi": "\u0938\u0941\u0915\u0940\u092f\u093e\u0915\u0940",
    "category": "Japanese Hotpot",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 pot portion (350g)",
    "calories": 490.0,
    "protein_g": 32.0,
    "carbs_g": 34.0,
    "fat_g": 22.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "high-protein",
      "traditional"
    ]
  },
  {
    "id": "reg_30",
    "name": "Shabu Shabu Pork & Cabbage",
    "name_hi": "\u0936\u093e\u092c\u0941 \u0936\u093e\u092c\u0941",
    "category": "Japanese Hotpot",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 serving (300g)",
    "calories": 380.0,
    "protein_g": 34.0,
    "carbs_g": 12.0,
    "fat_g": 21.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "high-protein",
      "clean-eating"
    ]
  },
  {
    "id": "reg_31",
    "name": "Onigiri (Salmon Rice Ball)",
    "name_hi": "\u0913\u0928\u093f\u0917\u093f\u0930\u0940 \u0938\u0948\u0932\u094d\u092e\u0928",
    "category": "Japanese Snack",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 ball (110g)",
    "calories": 190.0,
    "protein_g": 6.0,
    "carbs_g": 38.0,
    "fat_g": 2.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "grab-and-go"
    ]
  },
  {
    "id": "reg_32",
    "name": "Onigiri (Umeboshi Pickled Plum)",
    "name_hi": "\u0913\u0928\u093f\u0917\u093f\u0930\u0940 \u0909\u092e\u0947\u092c\u094b\u0936\u0940",
    "category": "Japanese Snack",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 ball (110g)",
    "calories": 175.0,
    "protein_g": 3.5,
    "carbs_g": 39.0,
    "fat_g": 0.5,
    "fiber_g": 1.0,
    "gym_tags": [
      "vegan",
      "clean"
    ]
  },
  {
    "id": "reg_33",
    "name": "Chawanmushi (Egg Custard)",
    "name_hi": "\u091a\u093e\u0935\u093e\u0928\u092e\u0941\u0936\u0940",
    "category": "Japanese Appetizer",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 cup (120g)",
    "calories": 95.0,
    "protein_g": 8.0,
    "carbs_g": 4.0,
    "fat_g": 5.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "delicate",
      "high-protein"
    ]
  },
  {
    "id": "reg_34",
    "name": "Seaweed Salad (Hiyashi Wakame)",
    "name_hi": "\u0938\u0940\u0935\u0940\u0921 \u0938\u0932\u093e\u0926",
    "category": "Japanese Salad",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 bowl (100g)",
    "calories": 85.0,
    "protein_g": 2.0,
    "carbs_g": 11.0,
    "fat_g": 4.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegan",
      "mineral-rich"
    ]
  },
  {
    "id": "reg_35",
    "name": "Oden Simmered Daikon & Fishcake",
    "name_hi": "\u0913\u0921\u0947\u0928",
    "category": "Japanese Winter Stew",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 bowl (280g)",
    "calories": 210.0,
    "protein_g": 15.0,
    "carbs_g": 18.0,
    "fat_g": 7.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "low-calorie",
      "comfort"
    ]
  },
  {
    "id": "reg_36",
    "name": "Matcha Green Tea Latte",
    "name_hi": "\u092e\u093e\u091a\u093e \u0932\u093e\u0924\u0947",
    "category": "Japanese Beverage",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 cup (250ml)",
    "calories": 140.0,
    "protein_g": 6.0,
    "carbs_g": 16.0,
    "fat_g": 5.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "antioxidant",
      "vegetarian"
    ]
  },
  {
    "id": "reg_37",
    "name": "Dorayaki (Red Bean Pancake)",
    "name_hi": "\u0921\u094b\u0930\u093e\u092f\u093e\u0915\u0940",
    "category": "Japanese Dessert",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 piece (85g)",
    "calories": 220.0,
    "protein_g": 5.0,
    "carbs_g": 44.0,
    "fat_g": 3.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "sweet",
      "vegetarian"
    ]
  },
  {
    "id": "reg_38",
    "name": "Mochi with Sweet Red Bean (Daifuku)",
    "name_hi": "\u092e\u094b\u091a\u0940 \u0921\u093e\u0907\u092b\u0941\u0915\u0941",
    "category": "Japanese Dessert",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 pc (70g)",
    "calories": 180.0,
    "protein_g": 3.0,
    "carbs_g": 41.0,
    "fat_g": 0.5,
    "fiber_g": 1.5,
    "gym_tags": [
      "gluten-free",
      "vegan"
    ]
  },
  {
    "id": "reg_39",
    "name": "Taiyaki (Fish-Shaped Waffle with Custard)",
    "name_hi": "\u0924\u093e\u0907\u092f\u093e\u0915\u0940",
    "category": "Japanese Street Dessert",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 waffle (90g)",
    "calories": 240.0,
    "protein_g": 5.0,
    "carbs_g": 42.0,
    "fat_g": 6.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_40",
    "name": "Hojicha Roasted Green Tea",
    "name_hi": "\u0939\u094b\u091c\u093f\u091a\u093e \u091a\u093e\u092f",
    "category": "Japanese Beverage",
    "cuisine": "Japanese",
    "state": "Japan",
    "serving": "1 cup (200ml)",
    "calories": 2.0,
    "protein_g": 0.0,
    "carbs_g": 0.5,
    "fat_g": 0.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "zero-calorie",
      "vegan"
    ]
  },
  {
    "id": "reg_41",
    "name": "Texas Smoked Beef Brisket",
    "name_hi": "\u091f\u0947\u0915\u094d\u0938\u093e\u0938 \u0938\u094d\u092e\u094b\u0915\u094d\u0921 \u092c\u0940\u092b \u092c\u094d\u0930\u093f\u0938\u094d\u0915\u0947\u091f",
    "category": "American BBQ",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 portion (180g)",
    "calories": 460.0,
    "protein_g": 42.0,
    "carbs_g": 2.0,
    "fat_g": 31.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "high-protein",
      "keto"
    ]
  },
  {
    "id": "reg_42",
    "name": "Classic American Cheeseburger",
    "name_hi": "\u0905\u092e\u0947\u0930\u093f\u0915\u0928 \u091a\u0940\u091c\u093c\u092c\u0930\u094d\u0917\u0930",
    "category": "American Classic",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 burger (240g)",
    "calories": 560.0,
    "protein_g": 31.0,
    "carbs_g": 44.0,
    "fat_g": 28.0,
    "fiber_g": 2.5,
    "gym_tags": [
      "high-protein",
      "classic"
    ]
  },
  {
    "id": "reg_43",
    "name": "Buffalo Chicken Wings",
    "name_hi": "\u092c\u092b\u093c\u0947\u0932\u094b \u091a\u093f\u0915\u0928 \u0935\u093f\u0902\u0917\u094d\u0938",
    "category": "American Pub",
    "cuisine": "USA",
    "state": "USA",
    "serving": "6 wings (180g)",
    "calories": 420.0,
    "protein_g": 36.0,
    "carbs_g": 4.0,
    "fat_g": 28.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "high-protein",
      "keto-friendly"
    ]
  },
  {
    "id": "reg_44",
    "name": "Creamy Macaroni and Cheese",
    "name_hi": "\u092e\u0948\u0915\u0930\u094b\u0928\u0940 \u090f\u0902\u0921 \u091a\u0940\u091c\u093c",
    "category": "American Comfort",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 bowl (220g)",
    "calories": 490.0,
    "protein_g": 18.0,
    "carbs_g": 52.0,
    "fat_g": 24.0,
    "fiber_g": 2.5,
    "gym_tags": [
      "comfort-food",
      "vegetarian"
    ]
  },
  {
    "id": "reg_45",
    "name": "New England Clam Chowder",
    "name_hi": "\u0915\u094d\u0932\u0948\u092e \u091a\u093e\u0909\u0921\u0930",
    "category": "American Soup",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 bread bowl (300g)",
    "calories": 380.0,
    "protein_g": 16.0,
    "carbs_g": 32.0,
    "fat_g": 21.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "seafood"
    ]
  },
  {
    "id": "reg_46",
    "name": "Philly Cheesesteak",
    "name_hi": "\u092b\u093f\u0932\u0940 \u091a\u0940\u091c\u093c\u0938\u094d\u091f\u0940\u0915",
    "category": "American Sandwich",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 sub (260g)",
    "calories": 620.0,
    "protein_g": 38.0,
    "carbs_g": 48.0,
    "fat_g": 30.0,
    "fiber_g": 2.5,
    "gym_tags": [
      "high-protein"
    ]
  },
  {
    "id": "reg_47",
    "name": "Chicago Deep Dish Pizza",
    "name_hi": "\u0936\u093f\u0915\u093e\u0917\u094b \u0921\u0940\u092a \u0921\u093f\u0936 \u092a\u093f\u091c\u093c\u094d\u091c\u093c\u093e",
    "category": "American Pizza",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 slice (220g)",
    "calories": 480.0,
    "protein_g": 22.0,
    "carbs_g": 46.0,
    "fat_g": 23.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "hearty"
    ]
  },
  {
    "id": "reg_48",
    "name": "California Cobb Salad",
    "name_hi": "\u0915\u0948\u0932\u093f\u092b\u094b\u0930\u094d\u0928\u093f\u092f\u093e \u0915\u0949\u092c \u0938\u0932\u093e\u0926",
    "category": "American Salad",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 large bowl (320g)",
    "calories": 520.0,
    "protein_g": 42.0,
    "carbs_g": 12.0,
    "fat_g": 34.0,
    "fiber_g": 7.0,
    "gym_tags": [
      "high-protein",
      "keto-friendly"
    ]
  },
  {
    "id": "reg_49",
    "name": "Fluffy Buttermilk Pancakes with Maple Syrup",
    "name_hi": "\u092c\u091f\u0930\u092e\u093f\u0932\u094d\u0915 \u092a\u0948\u0928\u0915\u0947\u0915\u094d\u0938",
    "category": "American Breakfast",
    "cuisine": "USA",
    "state": "USA",
    "serving": "3 pancakes (220g)",
    "calories": 450.0,
    "protein_g": 9.0,
    "carbs_g": 78.0,
    "fat_g": 12.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian",
      "sweet"
    ]
  },
  {
    "id": "reg_50",
    "name": "New York Bagel with Smoked Salmon & Cream Cheese",
    "name_hi": "\u0928\u094d\u092f\u0942\u092f\u0949\u0930\u094d\u0915 \u092c\u0947\u0917\u0932 \u0938\u0948\u0932\u094d\u092e\u0928 \u0915\u0947 \u0938\u093e\u0925",
    "category": "American Breakfast",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 bagel (210g)",
    "calories": 460.0,
    "protein_g": 25.0,
    "carbs_g": 54.0,
    "fat_g": 16.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "high-protein"
    ]
  },
  {
    "id": "reg_51",
    "name": "Slow-Cooked Pulled Pork Sandwich",
    "name_hi": "\u092a\u0941\u0932\u0921 \u092a\u094b\u0930\u094d\u0915 \u0938\u0948\u0902\u0921\u0935\u093f\u091a",
    "category": "American BBQ",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 sandwich (230g)",
    "calories": 520.0,
    "protein_g": 32.0,
    "carbs_g": 48.0,
    "fat_g": 21.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "high-protein"
    ]
  },
  {
    "id": "reg_52",
    "name": "Southern Buttermilk Fried Chicken",
    "name_hi": "\u0938\u0926\u0930\u094d\u0928 \u092b\u094d\u0930\u093e\u0907\u0921 \u091a\u093f\u0915\u0928",
    "category": "American Comfort",
    "cuisine": "USA",
    "state": "USA",
    "serving": "2 pieces (200g)",
    "calories": 510.0,
    "protein_g": 36.0,
    "carbs_g": 22.0,
    "fat_g": 30.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "high-protein",
      "crispy"
    ]
  },
  {
    "id": "reg_53",
    "name": "Maryland Crab Cakes",
    "name_hi": "\u092e\u0948\u0930\u0940\u0932\u0948\u0902\u0921 \u0915\u094d\u0930\u0948\u092c \u0915\u0947\u0915\u094d\u0938",
    "category": "American Seafood",
    "cuisine": "USA",
    "state": "USA",
    "serving": "2 cakes (160g)",
    "calories": 310.0,
    "protein_g": 28.0,
    "carbs_g": 11.0,
    "fat_g": 17.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "high-protein",
      "low-carb"
    ]
  },
  {
    "id": "reg_54",
    "name": "Louisiana Seafood Gumbo",
    "name_hi": "\u0932\u0941\u0907\u0938\u093f\u092f\u093e\u0928\u093e \u0917\u092e\u094d\u092c\u094b",
    "category": "Creole & Cajun",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 bowl (350g)",
    "calories": 390.0,
    "protein_g": 26.0,
    "carbs_g": 28.0,
    "fat_g": 19.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "flavorful"
    ]
  },
  {
    "id": "reg_55",
    "name": "New Orleans Jambalaya",
    "name_hi": "\u0928\u094d\u092f\u0942 \u0911\u0930\u0932\u093f\u092f\u0928\u094d\u0938 \u091c\u093e\u092e\u094d\u092c\u093e\u0932\u094d\u092f\u093e",
    "category": "Creole & Cajun",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 bowl (320g)",
    "calories": 480.0,
    "protein_g": 28.0,
    "carbs_g": 56.0,
    "fat_g": 16.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "high-protein"
    ]
  },
  {
    "id": "reg_56",
    "name": "Grilled USDA Prime Ribeye Steak",
    "name_hi": "\u0917\u094d\u0930\u093f\u0932\u094d\u0921 \u0930\u093f\u092c\u0906\u0908 \u0938\u094d\u091f\u0940\u0915",
    "category": "American Steakhouse",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 steak (250g)",
    "calories": 640.0,
    "protein_g": 56.0,
    "carbs_g": 0.0,
    "fat_g": 46.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "keto",
      "high-protein",
      "zero-carb"
    ]
  },
  {
    "id": "reg_57",
    "name": "Oven Roasted Turkey Breast",
    "name_hi": "\u0930\u094b\u0938\u094d\u091f\u0947\u0921 \u091f\u0930\u094d\u0915\u0940 \u092c\u094d\u0930\u0947\u0938\u094d\u091f",
    "category": "American Roast",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 portion (180g)",
    "calories": 240.0,
    "protein_g": 44.0,
    "carbs_g": 0.0,
    "fat_g": 6.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "lean-protein",
      "gym-diet"
    ]
  },
  {
    "id": "reg_58",
    "name": "Loaded Baked Potato with Bacon & Sour Cream",
    "name_hi": "\u0932\u094b\u0921\u0947\u0921 \u092c\u0947\u0915\u094d\u0921 \u092a\u094b\u091f\u0948\u091f\u094b",
    "category": "American Side",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 large (280g)",
    "calories": 390.0,
    "protein_g": 11.0,
    "carbs_g": 56.0,
    "fat_g": 14.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "comfort-food"
    ]
  },
  {
    "id": "reg_59",
    "name": "New York Style Baked Cheesecake",
    "name_hi": "\u0928\u094d\u092f\u0942\u092f\u0949\u0930\u094d\u0915 \u091a\u0940\u091c\u093c\u0915\u0947\u0915",
    "category": "American Dessert",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 slice (125g)",
    "calories": 410.0,
    "protein_g": 7.0,
    "carbs_g": 38.0,
    "fat_g": 26.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "sweet",
      "vegetarian"
    ]
  },
  {
    "id": "reg_60",
    "name": "Warm Grandma Apple Pie",
    "name_hi": "\u0905\u092e\u0947\u0930\u093f\u0915\u0928 \u090f\u092a\u094d\u092a\u0932 \u092a\u093e\u0908",
    "category": "American Dessert",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 slice (140g)",
    "calories": 340.0,
    "protein_g": 3.0,
    "carbs_g": 52.0,
    "fat_g": 14.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "sweet",
      "vegetarian"
    ]
  },
  {
    "id": "reg_61",
    "name": "Florida Key Lime Pie",
    "name_hi": "\u0915\u0940 \u0932\u093e\u0907\u092e \u092a\u093e\u0908",
    "category": "American Dessert",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 slice (120g)",
    "calories": 360.0,
    "protein_g": 6.0,
    "carbs_g": 44.0,
    "fat_g": 18.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "sweet",
      "vegetarian"
    ]
  },
  {
    "id": "reg_62",
    "name": "Southern Pecan Pie",
    "name_hi": "\u092a\u0940\u0915\u0928 \u092a\u093e\u0908",
    "category": "American Dessert",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 slice (115g)",
    "calories": 450.0,
    "protein_g": 5.0,
    "carbs_g": 58.0,
    "fat_g": 23.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "sweet",
      "nutty"
    ]
  },
  {
    "id": "reg_63",
    "name": "Crispy Chicken & Waffles",
    "name_hi": "\u091a\u093f\u0915\u0928 \u090f\u0902\u0921 \u0935\u093e\u092b\u0932\u094d\u0938",
    "category": "American Diner",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 plate (320g)",
    "calories": 680.0,
    "protein_g": 34.0,
    "carbs_g": 76.0,
    "fat_g": 27.0,
    "fiber_g": 2.5,
    "gym_tags": [
      "sweet-and-savory"
    ]
  },
  {
    "id": "reg_64",
    "name": "Classic BLT Sandwich",
    "name_hi": "\u092c\u0940\u090f\u0932\u091f\u0940 \u0938\u0948\u0902\u0921\u0935\u093f\u091a",
    "category": "American Diner",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 sandwich (180g)",
    "calories": 380.0,
    "protein_g": 16.0,
    "carbs_g": 36.0,
    "fat_g": 19.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "classic"
    ]
  },
  {
    "id": "reg_65",
    "name": "Cast Iron Skillet Cornbread",
    "name_hi": "\u0915\u0949\u0930\u094d\u0928\u092c\u094d\u0930\u0947\u0921",
    "category": "American Side",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 square (90g)",
    "calories": 210.0,
    "protein_g": 4.0,
    "carbs_g": 32.0,
    "fat_g": 7.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_66",
    "name": "All-American Beef Hot Dog",
    "name_hi": "\u0905\u092e\u0947\u0930\u093f\u0915\u0928 \u0939\u0949\u091f \u0921\u0949\u0917",
    "category": "American Street Food",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 hotdog (140g)",
    "calories": 310.0,
    "protein_g": 12.0,
    "carbs_g": 26.0,
    "fat_g": 17.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "street-food"
    ]
  },
  {
    "id": "reg_67",
    "name": "San Francisco Clam Sourdough Bread Bowl",
    "name_hi": "\u0938\u0948\u0928 \u092b\u094d\u0930\u093e\u0902\u0938\u093f\u0938\u094d\u0915\u094b \u0938\u0949\u0930\u0921\u094b \u092c\u094d\u0930\u0947\u0921",
    "category": "American Bakery",
    "cuisine": "USA",
    "state": "USA",
    "serving": "2 slices (100g)",
    "calories": 220.0,
    "protein_g": 8.0,
    "carbs_g": 44.0,
    "fat_g": 1.0,
    "fiber_g": 2.5,
    "gym_tags": [
      "vegan",
      "gut-friendly"
    ]
  },
  {
    "id": "reg_68",
    "name": "Creamy Mashed Potatoes with Brown Gravy",
    "name_hi": "\u092e\u0948\u0936\u094d\u0921 \u092a\u094b\u091f\u0948\u091f\u094b\u091c",
    "category": "American Side",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 cup (210g)",
    "calories": 230.0,
    "protein_g": 4.0,
    "carbs_g": 34.0,
    "fat_g": 9.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_69",
    "name": "Crispy Golden Tater Tots",
    "name_hi": "\u091f\u0930 \u091f\u091f\u094d\u0938",
    "category": "American Snack",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 portion (120g)",
    "calories": 260.0,
    "protein_g": 3.0,
    "carbs_g": 33.0,
    "fat_g": 13.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegan"
    ]
  },
  {
    "id": "reg_70",
    "name": "Sweet Potato Fries",
    "name_hi": "\u0936\u0915\u0930\u0915\u0902\u0926 \u092b\u094d\u0930\u093e\u0907\u091c\u093c",
    "category": "American Side",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 basket (130g)",
    "calories": 220.0,
    "protein_g": 2.5,
    "carbs_g": 36.0,
    "fat_g": 8.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegan",
      "fiber-rich"
    ]
  },
  {
    "id": "reg_71",
    "name": "Slow-Smoked St. Louis Pork Ribs",
    "name_hi": "\u0938\u094d\u092e\u094b\u0915\u094d\u0921 \u092a\u094b\u0930\u094d\u0915 \u0930\u093f\u092c\u094d\u0938",
    "category": "American BBQ",
    "cuisine": "USA",
    "state": "USA",
    "serving": "4 ribs (250g)",
    "calories": 580.0,
    "protein_g": 38.0,
    "carbs_g": 16.0,
    "fat_g": 40.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "high-protein"
    ]
  },
  {
    "id": "reg_72",
    "name": "Creamy New York Spinach & Artichoke Dip",
    "name_hi": "\u0938\u094d\u092a\u093f\u0928\u091a \u0906\u0930\u094d\u091f\u0940\u091a\u094b\u0915 \u0921\u093f\u092a",
    "category": "American Appetizer",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 bowl with chips (180g)",
    "calories": 360.0,
    "protein_g": 10.0,
    "carbs_g": 28.0,
    "fat_g": 23.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_73",
    "name": "Maine Lobster Roll",
    "name_hi": "\u092e\u0947\u0928 \u0932\u0949\u092c\u0938\u094d\u091f\u0930 \u0930\u094b\u0932",
    "category": "American Seafood",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 roll (180g)",
    "calories": 420.0,
    "protein_g": 28.0,
    "carbs_g": 36.0,
    "fat_g": 19.0,
    "fiber_g": 1.5,
    "gym_tags": [
      "seafood",
      "delicacy"
    ]
  },
  {
    "id": "reg_74",
    "name": "Campfire S'mores",
    "name_hi": "\u0938\u094d\u092e\u0949\u0930\u094d\u0938",
    "category": "American Campfire",
    "cuisine": "USA",
    "state": "USA",
    "serving": "2 s'mores (75g)",
    "calories": 280.0,
    "protein_g": 3.0,
    "carbs_g": 46.0,
    "fat_g": 10.0,
    "fiber_g": 1.5,
    "gym_tags": [
      "sweet"
    ]
  },
  {
    "id": "reg_75",
    "name": "Peanut Butter and Jelly Sandwich",
    "name_hi": "\u092a\u0940\u0928\u091f \u092c\u091f\u0930 \u091c\u0947\u0932\u0940 \u0938\u0948\u0902\u0921\u0935\u093f\u091a",
    "category": "American Classic",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 sandwich (120g)",
    "calories": 370.0,
    "protein_g": 12.0,
    "carbs_g": 48.0,
    "fat_g": 16.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "plant-protein",
      "vegetarian"
    ]
  },
  {
    "id": "reg_76",
    "name": "Avocado Toast on Multigrain with Poached Egg",
    "name_hi": "\u090f\u0935\u094b\u0915\u0948\u0921\u094b \u091f\u094b\u0938\u094d\u091f \u0905\u0902\u0921\u0947 \u0915\u0947 \u0938\u093e\u0925",
    "category": "Modern American",
    "cuisine": "USA",
    "state": "USA",
    "serving": "2 slices (180g)",
    "calories": 360.0,
    "protein_g": 16.0,
    "carbs_g": 28.0,
    "fat_g": 21.0,
    "fiber_g": 7.0,
    "gym_tags": [
      "healthy-fats",
      "high-protein"
    ]
  },
  {
    "id": "reg_77",
    "name": "Overnight Oats with Chia Seeds & Almonds",
    "name_hi": "\u0913\u0935\u0930\u0928\u093e\u0907\u091f \u0913\u091f\u094d\u0938 \u092c\u093e\u0926\u093e\u092e \u0915\u0947 \u0938\u093e\u0925",
    "category": "Healthy Breakfast",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 jar (250g)",
    "calories": 320.0,
    "protein_g": 12.0,
    "carbs_g": 46.0,
    "fat_g": 10.0,
    "fiber_g": 9.0,
    "gym_tags": [
      "high-fiber",
      "vegan",
      "heart-healthy"
    ]
  },
  {
    "id": "reg_78",
    "name": "Greek Yogurt Parfait with Granola & Honey",
    "name_hi": "\u0917\u094d\u0930\u0940\u0915 \u092f\u094b\u0917\u0930\u094d\u091f \u092a\u0930\u092b\u0947\u091f",
    "category": "Healthy Breakfast",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 bowl (220g)",
    "calories": 260.0,
    "protein_g": 21.0,
    "carbs_g": 34.0,
    "fat_g": 4.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "high-protein",
      "probiotic"
    ]
  },
  {
    "id": "reg_79",
    "name": "Grilled Salmon Fillet with Asparagus",
    "name_hi": "\u0917\u094d\u0930\u093f\u0932\u094d\u0921 \u0938\u0948\u0932\u094d\u092e\u0928 \u0936\u0924\u093e\u0935\u0930\u0940 \u0915\u0947 \u0938\u093e\u0925",
    "category": "American Dinner",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 portion (220g)",
    "calories": 380.0,
    "protein_g": 42.0,
    "carbs_g": 4.0,
    "fat_g": 21.0,
    "fiber_g": 2.5,
    "gym_tags": [
      "high-protein",
      "omega-3",
      "keto"
    ]
  },
  {
    "id": "reg_80",
    "name": "Chocolate Chip Cookie",
    "name_hi": "\u091a\u0949\u0915\u0932\u0947\u091f \u091a\u093f\u092a \u0915\u0941\u0915\u0940",
    "category": "American Bakery",
    "cuisine": "USA",
    "state": "USA",
    "serving": "1 large (60g)",
    "calories": 260.0,
    "protein_g": 3.0,
    "carbs_g": 35.0,
    "fat_g": 12.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "sweet",
      "vegetarian"
    ]
  },
  {
    "id": "reg_81",
    "name": "Sarson ka Saag",
    "name_hi": "\u0938\u0930\u0938\u094b\u0902 \u0915\u093e \u0938\u093e\u0917",
    "category": "Indian Sabzi",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 5.0,
    "carbs_g": 14.0,
    "fat_g": 10.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "vegetarian",
      "high-fiber",
      "iron-rich"
    ]
  },
  {
    "id": "reg_82",
    "name": "Makki ki Roti",
    "name_hi": "\u092e\u0915\u094d\u0915\u0947 \u0915\u0940 \u0930\u094b\u091f\u0940",
    "category": "Indian Bread",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 3.5,
    "carbs_g": 34.0,
    "fat_g": 3.5,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegetarian",
      "gluten-free"
    ]
  },
  {
    "id": "reg_83",
    "name": "Dal Makhani",
    "name_hi": "\u0926\u093e\u0932 \u092e\u0916\u0928\u0940",
    "category": "Indian Dal",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 320.0,
    "protein_g": 13.0,
    "carbs_g": 36.0,
    "fat_g": 14.0,
    "fiber_g": 8.0,
    "gym_tags": [
      "vegetarian",
      "high-protein"
    ]
  },
  {
    "id": "reg_84",
    "name": "Amritsari Kulcha",
    "name_hi": "\u0905\u092e\u0943\u0924\u0938\u0930\u0940 \u0915\u0941\u0932\u094d\u091a\u093e",
    "category": "Indian Bread",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 280.0,
    "protein_g": 6.0,
    "carbs_g": 44.0,
    "fat_g": 9.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_85",
    "name": "Chole Bhature",
    "name_hi": "\u091b\u094b\u0932\u0947 \u092d\u091f\u0942\u0930\u0947",
    "category": "Indian Feast",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 520.0,
    "protein_g": 16.0,
    "carbs_g": 68.0,
    "fat_g": 21.0,
    "fiber_g": 9.0,
    "gym_tags": [
      "vegetarian",
      "hearty"
    ]
  },
  {
    "id": "reg_86",
    "name": "Paneer Butter Masala",
    "name_hi": "\u092a\u0928\u0940\u0930 \u092c\u091f\u0930 \u092e\u0938\u093e\u0932\u093e",
    "category": "Indian Curry",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 360.0,
    "protein_g": 18.0,
    "carbs_g": 14.0,
    "fat_g": 26.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian",
      "high-protein"
    ]
  },
  {
    "id": "reg_87",
    "name": "Rajma Chawal",
    "name_hi": "\u0930\u093e\u091c\u092e\u093e \u091a\u093e\u0935\u0932",
    "category": "Indian Main",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 410.0,
    "protein_g": 15.0,
    "carbs_g": 68.0,
    "fat_g": 8.0,
    "fiber_g": 10.0,
    "gym_tags": [
      "vegetarian",
      "complete-protein"
    ]
  },
  {
    "id": "reg_88",
    "name": "Kadhi Pakora",
    "name_hi": "\u0915\u0922\u093c\u0940 \u092a\u0915\u094b\u0921\u093c\u093e",
    "category": "Indian Curry",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 8.0,
    "carbs_g": 24.0,
    "fat_g": 14.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian",
      "probiotic"
    ]
  },
  {
    "id": "reg_89",
    "name": "Punjabi Baingan Bharta",
    "name_hi": "\u092c\u0948\u0902\u0917\u0928 \u092d\u0930\u0924\u093e",
    "category": "Indian Sabzi",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 130.0,
    "protein_g": 3.0,
    "carbs_g": 15.0,
    "fat_g": 7.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "vegan",
      "low-calorie"
    ]
  },
  {
    "id": "reg_90",
    "name": "Amritsari Fish Tikka",
    "name_hi": "\u0905\u092e\u0943\u0924\u0938\u0930\u0940 \u092b\u093f\u0936 \u091f\u093f\u0915\u094d\u0915\u093e",
    "category": "Indian Starter",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 28.0,
    "carbs_g": 6.0,
    "fat_g": 11.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "high-protein",
      "pescatarian"
    ]
  },
  {
    "id": "reg_91",
    "name": "Tandoori Chicken",
    "name_hi": "\u0924\u0902\u0926\u0942\u0930\u0940 \u091a\u093f\u0915\u0928",
    "category": "Indian Grill",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 290.0,
    "protein_g": 38.0,
    "carbs_g": 3.0,
    "fat_g": 14.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "high-protein",
      "keto-friendly"
    ]
  },
  {
    "id": "reg_92",
    "name": "Butter Chicken (Murgh Makhani)",
    "name_hi": "\u092c\u091f\u0930 \u091a\u093f\u0915\u0928",
    "category": "Indian Curry",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 440.0,
    "protein_g": 32.0,
    "carbs_g": 16.0,
    "fat_g": 28.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "high-protein"
    ]
  },
  {
    "id": "reg_93",
    "name": "Aloo Gobi Punjabi Style",
    "name_hi": "\u0906\u0932\u0942 \u0917\u094b\u092d\u0940",
    "category": "Indian Sabzi",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 150.0,
    "protein_g": 4.0,
    "carbs_g": 22.0,
    "fat_g": 5.5,
    "fiber_g": 4.5,
    "gym_tags": [
      "vegan",
      "gluten-free"
    ]
  },
  {
    "id": "reg_94",
    "name": "Bhindi Do Pyaza",
    "name_hi": "\u092d\u093f\u0902\u0921\u0940 \u0926\u094b \u092a\u094d\u092f\u093e\u091c\u093c\u093e",
    "category": "Indian Sabzi",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 140.0,
    "protein_g": 3.5,
    "carbs_g": 18.0,
    "fat_g": 6.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "vegan"
    ]
  },
  {
    "id": "reg_95",
    "name": "Shahi Paneer",
    "name_hi": "\u0936\u093e\u0939\u0940 \u092a\u0928\u0940\u0930",
    "category": "Indian Curry",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 380.0,
    "protein_g": 16.0,
    "carbs_g": 16.0,
    "fat_g": 28.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian",
      "rich"
    ]
  },
  {
    "id": "reg_96",
    "name": "Palak Paneer",
    "name_hi": "\u092a\u093e\u0932\u0915 \u092a\u0928\u0940\u0930",
    "category": "Indian Curry",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 16.0,
    "carbs_g": 9.0,
    "fat_g": 16.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "vegetarian",
      "high-protein",
      "keto"
    ]
  },
  {
    "id": "reg_97",
    "name": "Pindi Chana",
    "name_hi": "\u092a\u093f\u0902\u0921\u0940 \u091a\u0928\u093e",
    "category": "Indian Curry",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 14.0,
    "carbs_g": 38.0,
    "fat_g": 6.0,
    "fiber_g": 9.0,
    "gym_tags": [
      "vegan",
      "high-protein"
    ]
  },
  {
    "id": "reg_98",
    "name": "Matar Paneer",
    "name_hi": "\u092e\u091f\u0930 \u092a\u0928\u0940\u0930",
    "category": "Indian Curry",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 280.0,
    "protein_g": 14.0,
    "carbs_g": 22.0,
    "fat_g": 15.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_99",
    "name": "Sweet Punjabi Lassi",
    "name_hi": "\u092e\u0940\u0920\u0940 \u092a\u0902\u091c\u093e\u092c\u0940 \u0932\u0938\u094d\u0938\u0940",
    "category": "Indian Drink",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 8.0,
    "carbs_g": 32.0,
    "fat_g": 9.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "vegetarian",
      "probiotic"
    ]
  },
  {
    "id": "reg_100",
    "name": "Salted Mint Chaas",
    "name_hi": "\u0928\u092e\u0915\u0940\u0928 \u091b\u093e\u091b",
    "category": "Indian Drink",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 60.0,
    "protein_g": 4.0,
    "carbs_g": 5.0,
    "fat_g": 2.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "low-calorie",
      "probiotic"
    ]
  },
  {
    "id": "reg_101",
    "name": "Atta Pinni",
    "name_hi": "\u0906\u091f\u093e \u092a\u093f\u0928\u094d\u0928\u0940",
    "category": "Indian Sweet",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 210.0,
    "protein_g": 4.0,
    "carbs_g": 24.0,
    "fat_g": 11.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian",
      "energy"
    ]
  },
  {
    "id": "reg_102",
    "name": "Besan Ladoo",
    "name_hi": "\u092c\u0947\u0938\u0928 \u0932\u0921\u094d\u0921\u0942",
    "category": "Indian Sweet",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 190.0,
    "protein_g": 4.0,
    "carbs_g": 23.0,
    "fat_g": 10.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_103",
    "name": "Gajar ka Halwa",
    "name_hi": "\u0917\u093e\u091c\u0930 \u0915\u093e \u0939\u0932\u0935\u093e",
    "category": "Indian Sweet",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 280.0,
    "protein_g": 6.0,
    "carbs_g": 36.0,
    "fat_g": 13.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_104",
    "name": "Punjabi Samosa",
    "name_hi": "\u092a\u0902\u091c\u093e\u092c\u0940 \u0938\u092e\u094b\u0938\u093e",
    "category": "Indian Snack",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 4.5,
    "carbs_g": 32.0,
    "fat_g": 13.0,
    "fiber_g": 2.5,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_105",
    "name": "Tandoori Roti",
    "name_hi": "\u0924\u0902\u0926\u0942\u0930\u0940 \u0930\u094b\u091f\u0940",
    "category": "Indian Bread",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 120.0,
    "protein_g": 4.0,
    "carbs_g": 24.0,
    "fat_g": 1.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegan",
      "clean"
    ]
  },
  {
    "id": "reg_106",
    "name": "Aloo Paratha with White Butter",
    "name_hi": "\u0906\u0932\u0942 \u092a\u0930\u093e\u0920\u093e \u092e\u0915\u094d\u0916\u0928 \u0915\u0947 \u0938\u093e\u0925",
    "category": "Indian Breakfast",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 320.0,
    "protein_g": 6.0,
    "carbs_g": 42.0,
    "fat_g": 14.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_107",
    "name": "Paneer Paratha",
    "name_hi": "\u092a\u0928\u0940\u0930 \u092a\u0930\u093e\u0920\u093e",
    "category": "Indian Breakfast",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 340.0,
    "protein_g": 15.0,
    "carbs_g": 36.0,
    "fat_g": 15.0,
    "fiber_g": 3.5,
    "gym_tags": [
      "vegetarian",
      "high-protein"
    ]
  },
  {
    "id": "reg_108",
    "name": "Gobhi Paratha",
    "name_hi": "\u0917\u094b\u092d\u0940 \u092a\u0930\u093e\u0920\u093e",
    "category": "Indian Breakfast",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 6.0,
    "carbs_g": 38.0,
    "fat_g": 9.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_109",
    "name": "Mooli Paratha",
    "name_hi": "\u092e\u0942\u0932\u0940 \u092a\u0930\u093e\u0920\u093e",
    "category": "Indian Breakfast",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 5.0,
    "carbs_g": 36.0,
    "fat_g": 8.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_110",
    "name": "Methi Malai Matar",
    "name_hi": "\u092e\u0947\u0925\u0940 \u092e\u0932\u093e\u0908 \u092e\u091f\u0930",
    "category": "Indian Curry",
    "cuisine": "Indian",
    "state": "Punjab",
    "serving": "1 standard portion",
    "calories": 310.0,
    "protein_g": 8.0,
    "carbs_g": 22.0,
    "fat_g": 21.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_111",
    "name": "Khaman Dhokla",
    "name_hi": "\u0916\u092e\u0928 \u0922\u094b\u0915\u0932\u093e",
    "category": "Gujarati Snack",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 140.0,
    "protein_g": 5.0,
    "carbs_g": 22.0,
    "fat_g": 4.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegan",
      "steamed",
      "low-calorie"
    ]
  },
  {
    "id": "reg_112",
    "name": "White Khatta Dhokla",
    "name_hi": "\u0916\u091f\u094d\u091f\u093e \u0922\u094b\u0915\u0932\u093e",
    "category": "Gujarati Snack",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 130.0,
    "protein_g": 4.5,
    "carbs_g": 23.0,
    "fat_g": 2.5,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegan",
      "fermented"
    ]
  },
  {
    "id": "reg_113",
    "name": "Methi Thepla",
    "name_hi": "\u092e\u0947\u0925\u0940 \u0925\u0947\u092a\u0932\u093e",
    "category": "Gujarati Bread",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 120.0,
    "protein_g": 3.5,
    "carbs_g": 19.0,
    "fat_g": 4.0,
    "fiber_g": 2.5,
    "gym_tags": [
      "vegetarian",
      "travel-friendly"
    ]
  },
  {
    "id": "reg_114",
    "name": "Khandvi",
    "name_hi": "\u0916\u093e\u0902\u0921\u0935\u0940",
    "category": "Gujarati Snack",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 6.0,
    "carbs_g": 18.0,
    "fat_g": 7.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian",
      "gluten-free"
    ]
  },
  {
    "id": "reg_115",
    "name": "Surati Undhiyu",
    "name_hi": "\u0938\u0942\u0930\u0924\u0940 \u0909\u0902\u0927\u093f\u092f\u0942",
    "category": "Gujarati Specialty",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 280.0,
    "protein_g": 7.0,
    "carbs_g": 34.0,
    "fat_g": 13.0,
    "fiber_g": 8.0,
    "gym_tags": [
      "vegetarian",
      "winter-special"
    ]
  },
  {
    "id": "reg_116",
    "name": "Handvo",
    "name_hi": "\u0939\u093e\u0902\u0921\u0935\u094b",
    "category": "Gujarati Snack",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 210.0,
    "protein_g": 8.0,
    "carbs_g": 28.0,
    "fat_g": 8.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegetarian",
      "baked"
    ]
  },
  {
    "id": "reg_117",
    "name": "Fafda with Kadi & Sambharo",
    "name_hi": "\u092b\u093e\u092b\u0921\u093c\u093e \u091c\u0932\u0947\u092c\u0940",
    "category": "Gujarati Breakfast",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 290.0,
    "protein_g": 6.0,
    "carbs_g": 32.0,
    "fat_g": 16.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_118",
    "name": "Gujarati Kadi",
    "name_hi": "\u0917\u0941\u091c\u0930\u093e\u0924\u0940 \u0915\u0922\u093c\u0940",
    "category": "Gujarati Curry",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 110.0,
    "protein_g": 4.0,
    "carbs_g": 12.0,
    "fat_g": 5.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "vegetarian",
      "probiotic"
    ]
  },
  {
    "id": "reg_119",
    "name": "Dal Dhokli",
    "name_hi": "\u0926\u093e\u0932 \u0922\u094b\u0915\u0932\u0940",
    "category": "Gujarati Meal",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 320.0,
    "protein_g": 11.0,
    "carbs_g": 56.0,
    "fat_g": 6.0,
    "fiber_g": 7.0,
    "gym_tags": [
      "vegetarian",
      "comfort-food"
    ]
  },
  {
    "id": "reg_120",
    "name": "Sev Tameta Nu Shaak",
    "name_hi": "\u0938\u0947\u0935 \u091f\u092e\u0947\u091f\u093e \u0928\u0941 \u0936\u093e\u0915",
    "category": "Gujarati Sabzi",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 5.0,
    "carbs_g": 24.0,
    "fat_g": 12.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_121",
    "name": "Ringan No Olo (Kathiyawadi Baingan)",
    "name_hi": "\u0930\u093f\u0902\u0917\u0923 \u0928\u094b \u0913\u0933\u094b",
    "category": "Gujarati Sabzi",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 140.0,
    "protein_g": 3.0,
    "carbs_g": 16.0,
    "fat_g": 7.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "vegan"
    ]
  },
  {
    "id": "reg_122",
    "name": "Bajra No Rotlo",
    "name_hi": "\u092c\u093e\u091c\u0930\u093e \u0928\u094b \u0930\u094b\u091f\u0932\u094b",
    "category": "Gujarati Bread",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 190.0,
    "protein_g": 4.5,
    "carbs_g": 36.0,
    "fat_g": 4.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "vegetarian",
      "gluten-free"
    ]
  },
  {
    "id": "reg_123",
    "name": "Kutchi Dabeli",
    "name_hi": "\u0915\u091a\u094d\u091b\u0940 \u0926\u093e\u092c\u0947\u0932\u0940",
    "category": "Gujarati Street Food",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 310.0,
    "protein_g": 6.0,
    "carbs_g": 48.0,
    "fat_g": 11.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_124",
    "name": "Surati Locho",
    "name_hi": "\u0938\u0942\u0930\u0924\u0940 \u0932\u094b\u091a\u094b",
    "category": "Gujarati Street Food",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 8.0,
    "carbs_g": 28.0,
    "fat_g": 11.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_125",
    "name": "Patra (Alu Vadi)",
    "name_hi": "\u092a\u093e\u0924\u094d\u0930\u093e",
    "category": "Gujarati Snack",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 170.0,
    "protein_g": 4.0,
    "carbs_g": 24.0,
    "fat_g": 6.5,
    "fiber_g": 3.5,
    "gym_tags": [
      "vegan",
      "iron-rich"
    ]
  },
  {
    "id": "reg_126",
    "name": "Lilva Kachori",
    "name_hi": "\u0932\u0940\u0932\u0935\u093e \u0915\u091a\u094c\u0930\u0940",
    "category": "Gujarati Snack",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 5.0,
    "carbs_g": 26.0,
    "fat_g": 13.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_127",
    "name": "Methi Muthia",
    "name_hi": "\u092e\u0947\u0925\u0940 \u092e\u0941\u0920\u093f\u092f\u093e",
    "category": "Gujarati Snack",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 130.0,
    "protein_g": 4.0,
    "carbs_g": 18.0,
    "fat_g": 4.5,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegan",
      "healthy"
    ]
  },
  {
    "id": "reg_128",
    "name": "Gujarati Sweet Toor Dal",
    "name_hi": "\u0917\u0941\u091c\u0930\u093e\u0924\u0940 \u0926\u093e\u0932",
    "category": "Gujarati Dal",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 150.0,
    "protein_g": 7.0,
    "carbs_g": 24.0,
    "fat_g": 3.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegan"
    ]
  },
  {
    "id": "reg_129",
    "name": "Khakhra (Methi & Jeera)",
    "name_hi": "\u0916\u093e\u0916\u0930\u093e",
    "category": "Gujarati Snack",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 105.0,
    "protein_g": 3.0,
    "carbs_g": 18.0,
    "fat_g": 2.5,
    "fiber_g": 2.5,
    "gym_tags": [
      "vegan",
      "low-fat"
    ]
  },
  {
    "id": "reg_130",
    "name": "Kesar Shrikhand",
    "name_hi": "\u0915\u0947\u0938\u0930 \u0936\u094d\u0930\u0940\u0916\u0902\u0921",
    "category": "Gujarati Sweet",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 9.0,
    "carbs_g": 32.0,
    "fat_g": 11.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "vegetarian",
      "probiotic"
    ]
  },
  {
    "id": "reg_131",
    "name": "Mohanthal",
    "name_hi": "\u092e\u094b\u0939\u0928\u0925\u093e\u0932",
    "category": "Gujarati Sweet",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 270.0,
    "protein_g": 5.0,
    "carbs_g": 34.0,
    "fat_g": 13.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_132",
    "name": "Sukhdi (Gor Papdi)",
    "name_hi": "\u0938\u0941\u0916\u0921\u093c\u0940",
    "category": "Gujarati Sweet",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 4.0,
    "carbs_g": 32.0,
    "fat_g": 11.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian",
      "iron-rich"
    ]
  },
  {
    "id": "reg_133",
    "name": "Ghatiya",
    "name_hi": "\u0917\u093e\u0902\u0920\u093f\u092f\u093e",
    "category": "Gujarati Snack",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 5.0,
    "carbs_g": 22.0,
    "fat_g": 13.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegan"
    ]
  },
  {
    "id": "reg_134",
    "name": "Bhavnagari Gathiya",
    "name_hi": "\u092d\u093e\u0935\u0928\u0917\u0930\u0940 \u0917\u093e\u0902\u0920\u093f\u092f\u093e",
    "category": "Gujarati Snack",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 230.0,
    "protein_g": 5.0,
    "carbs_g": 23.0,
    "fat_g": 13.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegan"
    ]
  },
  {
    "id": "reg_135",
    "name": "Papad Nu Shaak",
    "name_hi": "\u092a\u093e\u092a\u0921\u093c \u0928\u0941 \u0936\u093e\u0915",
    "category": "Gujarati Sabzi",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 140.0,
    "protein_g": 6.0,
    "carbs_g": 14.0,
    "fat_g": 7.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian",
      "quick-meal"
    ]
  },
  {
    "id": "reg_136",
    "name": "Mag Nu Shaak (Whole Green Moong)",
    "name_hi": "\u092e\u0917 \u0928\u0941 \u0936\u093e\u0915",
    "category": "Gujarati Sabzi",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 11.0,
    "carbs_g": 28.0,
    "fat_g": 3.0,
    "fiber_g": 7.0,
    "gym_tags": [
      "vegan",
      "high-protein"
    ]
  },
  {
    "id": "reg_137",
    "name": "Kansar",
    "name_hi": "\u0915\u0902\u0938\u093e\u0930",
    "category": "Gujarati Sweet",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 4.0,
    "carbs_g": 38.0,
    "fat_g": 6.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_138",
    "name": "Dudhi Halwa",
    "name_hi": "\u0926\u0942\u0927\u0940 \u0939\u0932\u0935\u093e",
    "category": "Gujarati Sweet",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 190.0,
    "protein_g": 4.0,
    "carbs_g": 28.0,
    "fat_g": 7.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_139",
    "name": "Chorafali",
    "name_hi": "\u091a\u094b\u0930\u093e\u092b\u0932\u0940",
    "category": "Gujarati Snack",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 4.0,
    "carbs_g": 24.0,
    "fat_g": 8.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegan"
    ]
  },
  {
    "id": "reg_140",
    "name": "Khichdi with Chaas & Kadhi",
    "name_hi": "\u0916\u093f\u091a\u0921\u093c\u0940 \u091b\u093e\u091b",
    "category": "Gujarati Dinner",
    "cuisine": "Indian",
    "state": "Gujarat",
    "serving": "1 standard portion",
    "calories": 280.0,
    "protein_g": 9.0,
    "carbs_g": 48.0,
    "fat_g": 6.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegetarian",
      "gut-friendly"
    ]
  },
  {
    "id": "reg_141",
    "name": "Kolhapuri Misal Pav",
    "name_hi": "\u0915\u094b\u0932\u094d\u0939\u093e\u092a\u0941\u0930\u0940 \u092e\u093f\u0938\u0933 \u092a\u093e\u0935",
    "category": "Maharashtrian Breakfast",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 420.0,
    "protein_g": 14.0,
    "carbs_g": 58.0,
    "fat_g": 16.0,
    "fiber_g": 7.0,
    "gym_tags": [
      "vegetarian",
      "high-protein"
    ]
  },
  {
    "id": "reg_142",
    "name": "Mumbai Vada Pav",
    "name_hi": "\u092e\u0941\u0902\u092c\u0908 \u0935\u0921\u093c\u093e \u092a\u093e\u0935",
    "category": "Maharashtrian Street Food",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 290.0,
    "protein_g": 6.0,
    "carbs_g": 42.0,
    "fat_g": 11.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian",
      "street-icon"
    ]
  },
  {
    "id": "reg_143",
    "name": "Puran Poli",
    "name_hi": "\u092a\u0942\u0930\u0923 \u092a\u094b\u0933\u0940",
    "category": "Maharashtrian Sweet",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 280.0,
    "protein_g": 7.0,
    "carbs_g": 52.0,
    "fat_g": 6.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegetarian",
      "festive"
    ]
  },
  {
    "id": "reg_144",
    "name": "Mumbai Pav Bhaji",
    "name_hi": "\u092a\u093e\u0935 \u092d\u093e\u091c\u0940",
    "category": "Maharashtrian Street Food",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 450.0,
    "protein_g": 11.0,
    "carbs_g": 62.0,
    "fat_g": 18.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "vegetarian",
      "comfort-food"
    ]
  },
  {
    "id": "reg_145",
    "name": "Sabudana Khichdi",
    "name_hi": "\u0938\u093e\u092c\u0941\u0926\u093e\u0928\u093e \u0916\u093f\u091a\u0921\u093c\u0940",
    "category": "Maharashtrian Vrat",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 340.0,
    "protein_g": 6.0,
    "carbs_g": 56.0,
    "fat_g": 12.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian",
      "gluten-free"
    ]
  },
  {
    "id": "reg_146",
    "name": "Kanda Poha",
    "name_hi": "\u0915\u093e\u0902\u0926\u093e \u092a\u094b\u0939\u093e",
    "category": "Maharashtrian Breakfast",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 5.0,
    "carbs_g": 36.0,
    "fat_g": 7.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegan",
      "iron-rich"
    ]
  },
  {
    "id": "reg_147",
    "name": "Thalipeeth",
    "name_hi": "\u0925\u093e\u0932\u0940\u092a\u0940\u0920",
    "category": "Maharashtrian Breakfast",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 210.0,
    "protein_g": 7.0,
    "carbs_g": 32.0,
    "fat_g": 6.5,
    "fiber_g": 5.0,
    "gym_tags": [
      "vegetarian",
      "multigrain"
    ]
  },
  {
    "id": "reg_148",
    "name": "Pithla Bhakri",
    "name_hi": "\u092a\u093f\u0920\u0932\u0902 \u092d\u093e\u0915\u0930\u0940",
    "category": "Maharashtrian Main",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 310.0,
    "protein_g": 11.0,
    "carbs_g": 52.0,
    "fat_g": 6.5,
    "fiber_g": 7.0,
    "gym_tags": [
      "vegan",
      "rustic"
    ]
  },
  {
    "id": "reg_149",
    "name": "Bharli Vangi (Stuffed Eggplant)",
    "name_hi": "\u092d\u0930\u0932\u0940 \u0935\u093e\u0902\u0917\u0940",
    "category": "Maharashtrian Sabzi",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 5.0,
    "carbs_g": 18.0,
    "fat_g": 15.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "vegan",
      "gluten-free"
    ]
  },
  {
    "id": "reg_150",
    "name": "Solkadhi",
    "name_hi": "\u0938\u094b\u0932\u0915\u0922\u0940",
    "category": "Maharashtrian Drink",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 110.0,
    "protein_g": 2.0,
    "carbs_g": 8.0,
    "fat_g": 8.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "vegan",
      "digestive"
    ]
  },
  {
    "id": "reg_151",
    "name": "Ukadiche Modak",
    "name_hi": "\u0909\u0915\u0921\u0940\u091a\u0947 \u092e\u094b\u0926\u0915",
    "category": "Maharashtrian Sweet",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 2.5,
    "carbs_g": 32.0,
    "fat_g": 3.5,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian",
      "steamed"
    ]
  },
  {
    "id": "reg_152",
    "name": "Kothimbir Vadi",
    "name_hi": "\u0915\u094b\u0925\u093f\u0902\u092c\u0940\u0930 \u0935\u0921\u0940",
    "category": "Maharashtrian Snack",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 6.0,
    "carbs_g": 22.0,
    "fat_g": 8.0,
    "fiber_g": 3.5,
    "gym_tags": [
      "vegan",
      "herbal"
    ]
  },
  {
    "id": "reg_153",
    "name": "Alu Vadi (Patra)",
    "name_hi": "\u0905\u0933\u0942 \u0935\u0921\u0940",
    "category": "Maharashtrian Snack",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 4.0,
    "carbs_g": 22.0,
    "fat_g": 6.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegan"
    ]
  },
  {
    "id": "reg_154",
    "name": "Zunka Bhakar",
    "name_hi": "\u091d\u0941\u0923\u0915\u093e \u092d\u093e\u0915\u0930",
    "category": "Maharashtrian Rustic",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 320.0,
    "protein_g": 12.0,
    "carbs_g": 54.0,
    "fat_g": 7.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "vegan"
    ]
  },
  {
    "id": "reg_155",
    "name": "Kolhapuri Tambda Rassa",
    "name_hi": "\u0924\u093e\u0902\u092c\u0921\u093e \u0930\u0938\u094d\u0938\u093e",
    "category": "Maharashtrian Non-Veg",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 22.0,
    "carbs_g": 4.0,
    "fat_g": 15.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "high-protein",
      "keto"
    ]
  },
  {
    "id": "reg_156",
    "name": "Kolhapuri Pandhra Rassa",
    "name_hi": "\u092a\u093e\u0902\u0922\u0930\u093e \u0930\u0938\u094d\u0938\u093e",
    "category": "Maharashtrian Non-Veg",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 18.0,
    "carbs_g": 6.0,
    "fat_g": 14.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "keto",
      "high-protein"
    ]
  },
  {
    "id": "reg_157",
    "name": "Bombil Fry (Bombay Duck)",
    "name_hi": "\u092c\u094b\u0902\u092c\u093f\u0932 \u092b\u094d\u0930\u093e\u092f",
    "category": "Maharashtrian Seafood",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 26.0,
    "carbs_g": 8.0,
    "fat_g": 12.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "high-protein",
      "crispy"
    ]
  },
  {
    "id": "reg_158",
    "name": "Malvani Fish Curry (Surmai)",
    "name_hi": "\u092e\u093e\u0932\u0935\u0923\u0940 \u0938\u0941\u0930\u092e\u0908 \u0915\u0930\u0940",
    "category": "Maharashtrian Seafood",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 310.0,
    "protein_g": 32.0,
    "carbs_g": 6.0,
    "fat_g": 18.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "high-protein",
      "omega-3"
    ]
  },
  {
    "id": "reg_159",
    "name": "Kande Pohe Chivda",
    "name_hi": "\u092a\u094b\u0939\u093e \u091a\u093f\u0935\u0921\u093c\u093e",
    "category": "Maharashtrian Snack",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 3.0,
    "carbs_g": 24.0,
    "fat_g": 6.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegan",
      "low-fat"
    ]
  },
  {
    "id": "reg_160",
    "name": "Batata Vada",
    "name_hi": "\u092c\u091f\u093e\u091f\u093e \u0935\u0921\u093c\u093e",
    "category": "Maharashtrian Snack",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 3.5,
    "carbs_g": 26.0,
    "fat_g": 7.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_161",
    "name": "Matki Chi Usal",
    "name_hi": "\u092e\u091f\u0915\u0940 \u0909\u0938\u0933",
    "category": "Maharashtrian Sabzi",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 190.0,
    "protein_g": 10.0,
    "carbs_g": 26.0,
    "fat_g": 5.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "vegan",
      "high-protein"
    ]
  },
  {
    "id": "reg_162",
    "name": "Varan Bhaat with Ghee & Lemon",
    "name_hi": "\u0935\u0930\u0923 \u092d\u093e\u0924",
    "category": "Maharashtrian Comfort",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 320.0,
    "protein_g": 10.0,
    "carbs_g": 56.0,
    "fat_g": 7.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegetarian",
      "sattvic"
    ]
  },
  {
    "id": "reg_163",
    "name": "Amboli",
    "name_hi": "\u0918\u093e\u0935\u0923\u0947 / \u0906\u0902\u092c\u094b\u0933\u0940",
    "category": "Maharashtrian Breakfast",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 4.5,
    "carbs_g": 32.0,
    "fat_g": 2.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegan",
      "gluten-free"
    ]
  },
  {
    "id": "reg_164",
    "name": "Kaju Kothimbir Vadi",
    "name_hi": "\u0915\u093e\u091c\u0942 \u0915\u094b\u0925\u093f\u0902\u092c\u0940\u0930 \u0935\u0921\u0940",
    "category": "Maharashtrian Snack",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 7.0,
    "carbs_g": 24.0,
    "fat_g": 11.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_165",
    "name": "Sabudana Vada",
    "name_hi": "\u0938\u093e\u092c\u0941\u0926\u093e\u0928\u093e \u0935\u0921\u093c\u093e",
    "category": "Maharashtrian Vrat",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 4.0,
    "carbs_g": 34.0,
    "fat_g": 12.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_166",
    "name": "Shev Bhaji (Khandeshi Style)",
    "name_hi": "\u0936\u0947\u0935 \u092d\u093e\u091c\u0940",
    "category": "Maharashtrian Curry",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 320.0,
    "protein_g": 8.0,
    "carbs_g": 28.0,
    "fat_g": 20.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_167",
    "name": "Dahi Misal",
    "name_hi": "\u0926\u0939\u0940 \u092e\u093f\u0938\u0933",
    "category": "Maharashtrian Breakfast",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 380.0,
    "protein_g": 14.0,
    "carbs_g": 52.0,
    "fat_g": 14.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_168",
    "name": "Amrakhand",
    "name_hi": "\u0906\u092e\u094d\u0930\u0916\u0902\u0921",
    "category": "Maharashtrian Sweet",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 270.0,
    "protein_g": 8.0,
    "carbs_g": 38.0,
    "fat_g": 10.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "vegetarian",
      "probiotic"
    ]
  },
  {
    "id": "reg_169",
    "name": "Bhakri (Jowar / Sorghum)",
    "name_hi": "\u091c\u094d\u0935\u093e\u0930\u0940\u091a\u0940 \u092d\u093e\u0915\u0930\u0940",
    "category": "Maharashtrian Bread",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 140.0,
    "protein_g": 4.0,
    "carbs_g": 30.0,
    "fat_g": 1.5,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegan",
      "gluten-free",
      "low-gi"
    ]
  },
  {
    "id": "reg_170",
    "name": "Kharvas (Junnu)",
    "name_hi": "\u0916\u0930\u0935\u0938",
    "category": "Maharashtrian Sweet",
    "cuisine": "Indian",
    "state": "Maharashtra",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 11.0,
    "carbs_g": 14.0,
    "fat_g": 7.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "vegetarian",
      "high-protein"
    ]
  },
  {
    "id": "reg_171",
    "name": "Madurai Masala Dosa",
    "name_hi": "\u092e\u0926\u0941\u0930\u0948 \u092e\u0938\u093e\u0932\u093e \u0921\u094b\u0938\u093e",
    "category": "Tamil Breakfast",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 320.0,
    "protein_g": 7.0,
    "carbs_g": 54.0,
    "fat_g": 9.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegan",
      "gluten-free"
    ]
  },
  {
    "id": "reg_172",
    "name": "Steamed Soft Idli with Sambar",
    "name_hi": "\u0907\u0921\u0932\u0940 \u0938\u093e\u0902\u092d\u0930",
    "category": "Tamil Breakfast",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 210.0,
    "protein_g": 8.0,
    "carbs_g": 42.0,
    "fat_g": 2.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "vegan",
      "low-fat",
      "fermented"
    ]
  },
  {
    "id": "reg_173",
    "name": "Crispy Medu Vada",
    "name_hi": "\u092e\u0947\u0926\u0941 \u0935\u0921\u093c\u093e",
    "category": "Tamil Snack",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 5.0,
    "carbs_g": 18.0,
    "fat_g": 10.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegan",
      "high-protein"
    ]
  },
  {
    "id": "reg_174",
    "name": "Ven Pongal",
    "name_hi": "\u0935\u0947\u0928 \u092a\u094b\u0902\u0917\u0932",
    "category": "Tamil Breakfast",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 320.0,
    "protein_g": 8.0,
    "carbs_g": 46.0,
    "fat_g": 12.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegetarian",
      "comfort"
    ]
  },
  {
    "id": "reg_175",
    "name": "Sweet Sakkarai Pongal",
    "name_hi": "\u0938\u0915\u094d\u0915\u0930\u093e\u0908 \u092a\u094b\u0902\u0917\u0932",
    "category": "Tamil Sweet",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 310.0,
    "protein_g": 5.0,
    "carbs_g": 58.0,
    "fat_g": 8.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian",
      "festive"
    ]
  },
  {
    "id": "reg_176",
    "name": "Chettinad Chicken Pepper Fry",
    "name_hi": "\u091a\u0947\u091f\u094d\u091f\u093f\u0928\u093e\u0921 \u091a\u093f\u0915\u0928",
    "category": "Tamil Non-Veg",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 340.0,
    "protein_g": 38.0,
    "carbs_g": 6.0,
    "fat_g": 18.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "high-protein",
      "keto-friendly"
    ]
  },
  {
    "id": "reg_177",
    "name": "Milagu Rasam (Black Pepper Rasam)",
    "name_hi": "\u092e\u093f\u0932\u0947\u0917\u0941 \u0930\u0938\u092e",
    "category": "Tamil Soup",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 50.0,
    "protein_g": 1.5,
    "carbs_g": 8.0,
    "fat_g": 1.5,
    "fiber_g": 1.0,
    "gym_tags": [
      "vegan",
      "immunity-booster"
    ]
  },
  {
    "id": "reg_178",
    "name": "Tomato Rasam",
    "name_hi": "\u091f\u092e\u093e\u091f\u0930 \u0930\u0938\u092e",
    "category": "Tamil Soup",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 60.0,
    "protein_g": 2.0,
    "carbs_g": 9.0,
    "fat_g": 2.0,
    "fiber_g": 1.5,
    "gym_tags": [
      "vegan"
    ]
  },
  {
    "id": "reg_179",
    "name": "Onion Uthappam",
    "name_hi": "\u092a\u094d\u092f\u093e\u091c \u0909\u0924\u094d\u0924\u092a\u092e",
    "category": "Tamil Breakfast",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 6.0,
    "carbs_g": 46.0,
    "fat_g": 6.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegan",
      "gluten-free"
    ]
  },
  {
    "id": "reg_180",
    "name": "Kothu Parotta",
    "name_hi": "\u0915\u094b\u0925\u0942 \u092a\u0930\u094b\u091f\u093e",
    "category": "Tamil Street Food",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 440.0,
    "protein_g": 12.0,
    "carbs_g": 62.0,
    "fat_g": 16.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_181",
    "name": "Chettinad Meen Varuval (Fish Fry)",
    "name_hi": "\u092e\u0940\u0928 \u0935\u0930\u0941\u0935\u0932",
    "category": "Tamil Seafood",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 30.0,
    "carbs_g": 4.0,
    "fat_g": 14.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "high-protein",
      "pescatarian"
    ]
  },
  {
    "id": "reg_182",
    "name": "Avial (Tamil Style)",
    "name_hi": "\u0905\u0935\u093f\u092f\u0932",
    "category": "Tamil Curry",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 4.5,
    "carbs_g": 16.0,
    "fat_g": 11.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "vegetarian",
      "nutrient-dense"
    ]
  },
  {
    "id": "reg_183",
    "name": "Poriyal (Beans & Carrot)",
    "name_hi": "\u092c\u0940\u0928\u094d\u0938 \u0917\u093e\u091c\u0930 \u092a\u094b\u0930\u093f\u092f\u093e\u0932",
    "category": "Tamil Side",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 90.0,
    "protein_g": 2.5,
    "carbs_g": 12.0,
    "fat_g": 3.5,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegan",
      "low-calorie"
    ]
  },
  {
    "id": "reg_184",
    "name": "Curd Rice (Thayir Sadam)",
    "name_hi": "\u0926\u0939\u0940 \u091a\u093e\u0935\u0932",
    "category": "Tamil Comfort",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 7.0,
    "carbs_g": 38.0,
    "fat_g": 7.0,
    "fiber_g": 1.5,
    "gym_tags": [
      "vegetarian",
      "probiotic"
    ]
  },
  {
    "id": "reg_185",
    "name": "Lemon Rice (Elumichai Sadam)",
    "name_hi": "\u0928\u0940\u0902\u092c\u0942 \u091a\u093e\u0935\u0932",
    "category": "Tamil Rice",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 5.0,
    "carbs_g": 46.0,
    "fat_g": 7.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegan",
      "gluten-free"
    ]
  },
  {
    "id": "reg_186",
    "name": "Puliyodharai (Tamarind Rice)",
    "name_hi": "\u0907\u092e\u0932\u0940 \u091a\u093e\u0935\u0932",
    "category": "Tamil Rice",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 290.0,
    "protein_g": 6.0,
    "carbs_g": 52.0,
    "fat_g": 8.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegan"
    ]
  },
  {
    "id": "reg_187",
    "name": "Sambar (Drumstick & Shallot)",
    "name_hi": "\u0938\u093e\u0902\u092d\u0930",
    "category": "Tamil Dal",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 130.0,
    "protein_g": 6.0,
    "carbs_g": 20.0,
    "fat_g": 3.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegan",
      "high-fiber"
    ]
  },
  {
    "id": "reg_188",
    "name": "Mor Kuzhambu",
    "name_hi": "\u092e\u094b\u0930 \u0915\u0941\u091d\u092e\u094d\u092c\u0942",
    "category": "Tamil Curry",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 140.0,
    "protein_g": 5.0,
    "carbs_g": 12.0,
    "fat_g": 8.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian",
      "probiotic"
    ]
  },
  {
    "id": "reg_189",
    "name": "Chettinad Mushroom Biryani",
    "name_hi": "\u092e\u0936\u0930\u0942\u092e \u092c\u093f\u0930\u092f\u093e\u0928\u0940",
    "category": "Tamil Rice",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 380.0,
    "protein_g": 9.0,
    "carbs_g": 64.0,
    "fat_g": 10.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "vegan",
      "aromatic"
    ]
  },
  {
    "id": "reg_190",
    "name": "Vatha Kuzhambu",
    "name_hi": "\u0935\u0925\u093e \u0915\u0941\u091d\u092e\u094d\u092c\u0942",
    "category": "Tamil Curry",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 120.0,
    "protein_g": 2.0,
    "carbs_g": 18.0,
    "fat_g": 5.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegan"
    ]
  },
  {
    "id": "reg_191",
    "name": "Mysore Pak (Ghee)",
    "name_hi": "\u092e\u0948\u0938\u0942\u0930 \u092a\u093e\u0915",
    "category": "Tamil Sweet",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 290.0,
    "protein_g": 4.0,
    "carbs_g": 34.0,
    "fat_g": 16.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_192",
    "name": "Filter Coffee (Madras Kaapi)",
    "name_hi": "\u092e\u0926\u094d\u0930\u093e\u0938 \u092b\u093f\u0932\u094d\u091f\u0930 \u0915\u0949\u092b\u0940",
    "category": "Tamil Beverage",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 95.0,
    "protein_g": 3.5,
    "carbs_g": 11.0,
    "fat_g": 4.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_193",
    "name": "Paniyaram (Savory)",
    "name_hi": "\u092e\u0938\u093e\u0932\u093e \u092a\u0928\u093f\u092f\u093e\u0930\u092e",
    "category": "Tamil Snack",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 5.0,
    "carbs_g": 32.0,
    "fat_g": 4.0,
    "fiber_g": 2.5,
    "gym_tags": [
      "vegan",
      "healthy"
    ]
  },
  {
    "id": "reg_194",
    "name": "Sweet Paniyaram",
    "name_hi": "\u092e\u0940\u0920\u093e \u092a\u0928\u093f\u092f\u093e\u0930\u092e",
    "category": "Tamil Snack",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 210.0,
    "protein_g": 4.0,
    "carbs_g": 42.0,
    "fat_g": 3.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian"
    ]
  },
  {
    "id": "reg_195",
    "name": "Adai (Mixed Lentil Dosa)",
    "name_hi": "\u0905\u0921\u093e\u0908 \u0921\u094b\u0938\u093e",
    "category": "Tamil Breakfast",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 12.0,
    "carbs_g": 38.0,
    "fat_g": 6.5,
    "fiber_g": 6.0,
    "gym_tags": [
      "vegan",
      "high-protein"
    ]
  },
  {
    "id": "reg_196",
    "name": "Paruppu Urundai Kuzhambu",
    "name_hi": "\u0932\u0947\u0902\u091f\u0932 \u092c\u0949\u0932\u094d\u0938 \u0915\u0930\u0940",
    "category": "Tamil Curry",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 11.0,
    "carbs_g": 26.0,
    "fat_g": 8.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "vegan",
      "high-protein"
    ]
  },
  {
    "id": "reg_197",
    "name": "Thalicha Thayir Pachadi",
    "name_hi": "\u0930\u093e\u092f\u0924\u093e",
    "category": "Tamil Side",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 75.0,
    "protein_g": 3.5,
    "carbs_g": 6.0,
    "fat_g": 4.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "vegetarian",
      "probiotic"
    ]
  },
  {
    "id": "reg_198",
    "name": "Kozhukkattai",
    "name_hi": "\u0915\u094b\u091d\u0941\u0915\u091f\u094d\u091f\u0908",
    "category": "Tamil Sweet",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 150.0,
    "protein_g": 2.5,
    "carbs_g": 30.0,
    "fat_g": 3.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegetarian",
      "steamed"
    ]
  },
  {
    "id": "reg_199",
    "name": "Idiyappam with Coconut Milk",
    "name_hi": "\u0907\u0921\u093f\u092f\u093e\u092a\u094d\u092a\u092e",
    "category": "Tamil Breakfast",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 230.0,
    "protein_g": 4.0,
    "carbs_g": 46.0,
    "fat_g": 4.5,
    "fiber_g": 2.0,
    "gym_tags": [
      "vegan",
      "gluten-free"
    ]
  },
  {
    "id": "reg_200",
    "name": "Appam with Vegetable Stew",
    "name_hi": "\u0905\u092a\u094d\u092a\u092e \u0938\u094d\u091f\u0942",
    "category": "Tamil Breakfast",
    "cuisine": "Indian",
    "state": "Tamil Nadu",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 5.0,
    "carbs_g": 44.0,
    "fat_g": 8.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "vegan",
      "gluten-free"
    ]
  },
  {
    "id": "reg_201",
    "name": "Kerala Puttu & Kadala Curry",
    "name_hi": "\u092a\u0941\u091f\u094d\u091f\u0942 \u0915\u0921\u093e\u0932\u093e \u0915\u0930\u0940",
    "category": "Kerala Breakfast",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 320.0,
    "protein_g": 12.0,
    "carbs_g": 58.0,
    "fat_g": 6.0,
    "fiber_g": 8.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_202",
    "name": "Appam with Kerala Chicken Stew",
    "name_hi": "\u0905\u092a\u094d\u092a\u092e \u091a\u093f\u0915\u0928 \u0938\u094d\u091f\u0942",
    "category": "Kerala Main",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 360.0,
    "protein_g": 26.0,
    "carbs_g": 42.0,
    "fat_g": 10.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_203",
    "name": "Kerala Sadya Avial",
    "name_hi": "\u0905\u0935\u093f\u092f\u0932",
    "category": "Kerala Vegetable",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 170.0,
    "protein_g": 4.0,
    "carbs_g": 15.0,
    "fat_g": 11.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_204",
    "name": "Malabar Parotta with Beef Roast",
    "name_hi": "\u092e\u093e\u0932\u093e\u092c\u093e\u0930 \u092a\u0930\u094b\u091f\u093e",
    "category": "Kerala Specialty",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 490.0,
    "protein_g": 28.0,
    "carbs_g": 52.0,
    "fat_g": 21.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_205",
    "name": "Fish Molee (Meen Moilee)",
    "name_hi": "\u092b\u093f\u0936 \u092e\u094b\u0907\u0932\u0940",
    "category": "Kerala Seafood",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 310.0,
    "protein_g": 30.0,
    "carbs_g": 8.0,
    "fat_g": 18.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_206",
    "name": "Karimeen Pollichathu",
    "name_hi": "\u0915\u0930\u093f\u092e\u0940\u0928 \u092a\u094b\u0932\u094d\u0932\u093f\u091a\u0925\u0941",
    "category": "Kerala Seafood",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 280.0,
    "protein_g": 32.0,
    "carbs_g": 6.0,
    "fat_g": 14.0,
    "fiber_g": 1.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_207",
    "name": "Kerala Banana Chips (Nendran)",
    "name_hi": "\u0915\u0947\u0932\u093e \u091a\u093f\u092a\u094d\u0938",
    "category": "Kerala Snack",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 2.0,
    "carbs_g": 28.0,
    "fat_g": 12.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_208",
    "name": "Pazham Pori (Banana Fritters)",
    "name_hi": "\u092a\u091c\u094d\u0939\u092e \u092a\u094b\u0930\u0940",
    "category": "Kerala Snack",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 3.0,
    "carbs_g": 44.0,
    "fat_g": 7.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_209",
    "name": "Thalassery Chicken Biryani",
    "name_hi": "\u0925\u093e\u0932\u0938\u094d\u0938\u0947\u0930\u0940 \u092c\u093f\u0930\u092f\u093e\u0928\u0940",
    "category": "Kerala Rice",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 480.0,
    "protein_g": 32.0,
    "carbs_g": 62.0,
    "fat_g": 12.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_210",
    "name": "Palada Payasam",
    "name_hi": "\u092a\u093e\u0932\u0926\u093e \u092a\u093e\u092f\u0938\u092e",
    "category": "Kerala Sweet",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 290.0,
    "protein_g": 6.0,
    "carbs_g": 44.0,
    "fat_g": 10.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_211",
    "name": "Erissery (Pumpkin & Red Beans)",
    "name_hi": "\u090f\u0930\u0940\u0938\u094d\u0938\u0947\u0930\u0940",
    "category": "Kerala Curry",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 190.0,
    "protein_g": 6.0,
    "carbs_g": 28.0,
    "fat_g": 7.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_212",
    "name": "Thoran (Cabbage & Coconut)",
    "name_hi": "\u0925\u094b\u0930\u0928",
    "category": "Kerala Side",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 85.0,
    "protein_g": 2.5,
    "carbs_g": 10.0,
    "fat_g": 4.0,
    "fiber_g": 3.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_213",
    "name": "Olan",
    "name_hi": "\u0913\u0932\u0928",
    "category": "Kerala Curry",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 130.0,
    "protein_g": 4.0,
    "carbs_g": 14.0,
    "fat_g": 7.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_214",
    "name": "Meen Vattichathu (Spicy Red Fish)",
    "name_hi": "\u0915\u0947\u0930\u0932 \u092b\u093f\u0936 \u0915\u0930\u0940",
    "category": "Kerala Seafood",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 28.0,
    "carbs_g": 4.0,
    "fat_g": 12.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_215",
    "name": "Unniyappam",
    "name_hi": "\u0909\u0928\u094d\u0928\u093f\u092f\u092a\u094d\u092a\u092e",
    "category": "Kerala Sweet",
    "cuisine": "Indian",
    "state": "Kerala",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 2.5,
    "carbs_g": 34.0,
    "fat_g": 4.5,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_216",
    "name": "Shorshe Ilish",
    "name_hi": "\u0936\u0949\u0930\u094d\u0936 \u0907\u0932\u093f\u0936",
    "category": "West Bengal Seafood",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 340.0,
    "protein_g": 28.0,
    "carbs_g": 4.0,
    "fat_g": 24.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_217",
    "name": "Kolkata Macher Jhol",
    "name_hi": "\u092e\u093e\u091b\u0947\u0930 \u091d\u094b\u0932",
    "category": "West Bengal Seafood",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 24.0,
    "carbs_g": 12.0,
    "fat_g": 9.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_218",
    "name": "Kosha Mangsho",
    "name_hi": "\u0915\u0936\u093e \u092e\u093e\u0902\u0917\u0936\u094b",
    "category": "West Bengal Meat",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 440.0,
    "protein_g": 36.0,
    "carbs_g": 10.0,
    "fat_g": 28.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_219",
    "name": "Luchi with Chholar Dal",
    "name_hi": "\u0932\u0942\u091a\u0940 \u091b\u094b\u0932\u093e\u0930 \u0926\u093e\u0932",
    "category": "West Bengal Breakfast",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 410.0,
    "protein_g": 11.0,
    "carbs_g": 56.0,
    "fat_g": 17.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_220",
    "name": "Aloo Posto",
    "name_hi": "\u0906\u0932\u0942 \u092a\u094b\u0938\u094d\u0924\u094b",
    "category": "West Bengal Sabzi",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 5.0,
    "carbs_g": 26.0,
    "fat_g": 11.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_221",
    "name": "Mishti Doi",
    "name_hi": "\u092e\u093f\u0937\u094d\u091f\u0940 \u0926\u094b\u0908",
    "category": "West Bengal Sweet",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 210.0,
    "protein_g": 7.0,
    "carbs_g": 28.0,
    "fat_g": 8.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_222",
    "name": "Kolkata Rasgulla",
    "name_hi": "\u0930\u0938\u0917\u0941\u0932\u094d\u0932\u093e",
    "category": "West Bengal Sweet",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 140.0,
    "protein_g": 4.0,
    "carbs_g": 30.0,
    "fat_g": 1.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_223",
    "name": "Sandesh (Nolen Gur)",
    "name_hi": "\u0938\u0949\u0902\u0926\u0947\u0936",
    "category": "West Bengal Sweet",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 6.0,
    "carbs_g": 22.0,
    "fat_g": 6.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_224",
    "name": "Shukto",
    "name_hi": "\u0936\u0941\u0915\u094d\u0924\u094b",
    "category": "West Bengal Vegetable",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 140.0,
    "protein_g": 4.0,
    "carbs_g": 18.0,
    "fat_g": 6.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_225",
    "name": "Dhokar Dalna",
    "name_hi": "\u0927\u094b\u0915\u0930 \u0926\u093e\u0932\u0928\u093e",
    "category": "West Bengal Curry",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 12.0,
    "carbs_g": 28.0,
    "fat_g": 12.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_226",
    "name": "Beguni",
    "name_hi": "\u092c\u0947\u0917\u0941\u0928\u0940",
    "category": "West Bengal Snack",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 170.0,
    "protein_g": 3.0,
    "carbs_g": 20.0,
    "fat_g": 9.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_227",
    "name": "Chingri Malai Curry",
    "name_hi": "\u091a\u093f\u0902\u0917\u0930\u0940 \u092e\u0932\u093e\u0908 \u0915\u0930\u0940",
    "category": "West Bengal Seafood",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 320.0,
    "protein_g": 26.0,
    "carbs_g": 8.0,
    "fat_g": 20.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_228",
    "name": "Radhabhallavi with Alur Dom",
    "name_hi": "\u0930\u093e\u0927\u093e\u092c\u0932\u094d\u0932\u092d\u0940",
    "category": "West Bengal Breakfast",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 380.0,
    "protein_g": 10.0,
    "carbs_g": 54.0,
    "fat_g": 15.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_229",
    "name": "Patishapta",
    "name_hi": "\u092a\u093e\u091f\u0940\u0936\u093e\u092a\u094d\u091f\u093e",
    "category": "West Bengal Sweet",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 190.0,
    "protein_g": 4.0,
    "carbs_g": 32.0,
    "fat_g": 6.0,
    "fiber_g": 1.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_230",
    "name": "Cholar Dal with Narkel",
    "name_hi": "\u091b\u094b\u0932\u093e\u0930 \u0926\u093e\u0932",
    "category": "West Bengal Dal",
    "cuisine": "Indian",
    "state": "West Bengal",
    "serving": "1 standard portion",
    "calories": 210.0,
    "protein_g": 9.0,
    "carbs_g": 32.0,
    "fat_g": 6.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_231",
    "name": "Dal Baati Churma",
    "name_hi": "\u0926\u093e\u0932 \u092c\u093e\u091f\u0940 \u091a\u0942\u0930\u092e\u093e",
    "category": "Rajasthan Feast",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 580.0,
    "protein_g": 18.0,
    "carbs_g": 76.0,
    "fat_g": 24.0,
    "fiber_g": 9.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_232",
    "name": "Gatte ki Sabzi",
    "name_hi": "\u0917\u091f\u094d\u091f\u0947 \u0915\u0940 \u0938\u092c\u094d\u091c\u093c\u0940",
    "category": "Rajasthan Curry",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 9.0,
    "carbs_g": 22.0,
    "fat_g": 13.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_233",
    "name": "Ker Sangri",
    "name_hi": "\u0915\u0947\u0930 \u0938\u093e\u0902\u0917\u0930\u0940",
    "category": "Rajasthan Delicacy",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 190.0,
    "protein_g": 5.0,
    "carbs_g": 24.0,
    "fat_g": 9.0,
    "fiber_g": 8.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_234",
    "name": "Laal Maas",
    "name_hi": "\u0932\u093e\u0932 \u092e\u093e\u0902\u0938",
    "category": "Rajasthan Meat",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 410.0,
    "protein_g": 36.0,
    "carbs_g": 4.0,
    "fat_g": 28.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_235",
    "name": "Pyaaz ki Kachori (Jodhpur)",
    "name_hi": "\u092a\u094d\u092f\u093e\u091c \u0915\u091a\u094c\u0921\u093c\u0940",
    "category": "Rajasthan Snack",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 290.0,
    "protein_g": 5.0,
    "carbs_g": 36.0,
    "fat_g": 15.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_236",
    "name": "Rajasthani Ghevar (Malai)",
    "name_hi": "\u0918\u0947\u0935\u0930",
    "category": "Rajasthan Sweet",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 380.0,
    "protein_g": 6.0,
    "carbs_g": 52.0,
    "fat_g": 18.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_237",
    "name": "Mirchi Bada (Jodhpur)",
    "name_hi": "\u092e\u093f\u0930\u094d\u091a\u0940 \u092c\u0921\u093c\u093e",
    "category": "Rajasthan Snack",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 4.0,
    "carbs_g": 28.0,
    "fat_g": 11.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_238",
    "name": "Bajra Roti with Lehsun Chutney",
    "name_hi": "\u092c\u093e\u091c\u0930\u093e \u0930\u094b\u091f\u0940 \u0932\u0939\u0938\u0941\u0928 \u091a\u091f\u0928\u0940",
    "category": "Rajasthan Bread",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 210.0,
    "protein_g": 5.0,
    "carbs_g": 38.0,
    "fat_g": 5.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_239",
    "name": "Papad ki Sabzi",
    "name_hi": "\u092a\u093e\u092a\u0921\u093c \u0915\u0940 \u0938\u092c\u094d\u091c\u093c\u0940",
    "category": "Rajasthan Curry",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 150.0,
    "protein_g": 6.0,
    "carbs_g": 14.0,
    "fat_g": 8.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_240",
    "name": "Mawa Kachori",
    "name_hi": "\u092e\u093e\u0935\u093e \u0915\u091a\u094c\u0930\u0940",
    "category": "Rajasthan Sweet",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 340.0,
    "protein_g": 6.0,
    "carbs_g": 44.0,
    "fat_g": 16.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_241",
    "name": "Bikaneri Bhujia",
    "name_hi": "\u092c\u0940\u0915\u093e\u0928\u0947\u0930\u0940 \u092d\u0941\u091c\u093f\u092f\u093e",
    "category": "Rajasthan Snack",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 7.0,
    "carbs_g": 26.0,
    "fat_g": 15.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_242",
    "name": "Rajasthani Kadhi with Pakora",
    "name_hi": "\u0930\u093e\u091c\u0938\u094d\u0925\u093e\u0928\u0940 \u0915\u0922\u093c\u0940",
    "category": "Rajasthan Curry",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 5.0,
    "carbs_g": 16.0,
    "fat_g": 9.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_243",
    "name": "Safed Maas",
    "name_hi": "\u0938\u092b\u0947\u0926 \u092e\u093e\u0902\u0938",
    "category": "Rajasthan Meat",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 380.0,
    "protein_g": 32.0,
    "carbs_g": 6.0,
    "fat_g": 25.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_244",
    "name": "Mohan Maas",
    "name_hi": "\u092e\u094b\u0939\u0928 \u092e\u093e\u0902\u0938",
    "category": "Rajasthan Meat",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 420.0,
    "protein_g": 34.0,
    "carbs_g": 6.0,
    "fat_g": 29.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_245",
    "name": "Kalakand (Alwar)",
    "name_hi": "\u0905\u0932\u0935\u0930 \u0915\u093e \u0915\u0932\u093e\u0915\u0902\u0926",
    "category": "Rajasthan Sweet",
    "cuisine": "Indian",
    "state": "Rajasthan",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 8.0,
    "carbs_g": 30.0,
    "fat_g": 12.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_246",
    "name": "Lucknowi Awadhi Biryani",
    "name_hi": "\u0905\u0935\u0927\u0940 \u092c\u093f\u0930\u092f\u093e\u0928\u0940",
    "category": "Uttar Pradesh Rice",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 460.0,
    "protein_g": 28.0,
    "carbs_g": 58.0,
    "fat_g": 14.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_247",
    "name": "Galouti Kebab",
    "name_hi": "\u0917\u0932\u094c\u091f\u0940 \u0915\u092c\u093e\u092c",
    "category": "Uttar Pradesh Starter",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 280.0,
    "protein_g": 24.0,
    "carbs_g": 4.0,
    "fat_g": 19.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_248",
    "name": "Tunday Kebab with Roomali Roti",
    "name_hi": "\u091f\u0941\u0902\u0921\u0947 \u0915\u092c\u093e\u092c\u0940",
    "category": "Uttar Pradesh Main",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 380.0,
    "protein_g": 28.0,
    "carbs_g": 32.0,
    "fat_g": 18.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_249",
    "name": "Bedmi Puri with Rasedar Aloo",
    "name_hi": "\u092c\u0947\u0921\u092e\u0940 \u092a\u0942\u0930\u0940 \u0906\u0932\u0942",
    "category": "Uttar Pradesh Breakfast",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 430.0,
    "protein_g": 10.0,
    "carbs_g": 58.0,
    "fat_g": 18.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_250",
    "name": "Banarasi Dum Aloo",
    "name_hi": "\u092c\u0928\u093e\u0930\u0938\u0940 \u0926\u092e \u0906\u0932\u0942",
    "category": "Uttar Pradesh Sabzi",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 290.0,
    "protein_g": 8.0,
    "carbs_g": 28.0,
    "fat_g": 17.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_251",
    "name": "Banarasi Tamatar Chaat",
    "name_hi": "\u091f\u092e\u093e\u091f\u0930 \u091a\u093e\u091f",
    "category": "Uttar Pradesh Street Food",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 3.0,
    "carbs_g": 32.0,
    "fat_g": 5.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_252",
    "name": "Moradabadi Moong Dal Chaat",
    "name_hi": "\u092e\u0941\u0930\u093e\u0926\u093e\u092c\u093e\u0926\u0940 \u0926\u093e\u0932",
    "category": "Uttar Pradesh Healthy Snack",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 190.0,
    "protein_g": 11.0,
    "carbs_g": 26.0,
    "fat_g": 5.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_253",
    "name": "Agra Petha (Kesar)",
    "name_hi": "\u0906\u0917\u0930\u093e \u0915\u093e \u092a\u0947\u0920\u093e",
    "category": "Uttar Pradesh Sweet",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 140.0,
    "protein_g": 1.0,
    "carbs_g": 35.0,
    "fat_g": 0.2,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_254",
    "name": "Mathura ke Pede",
    "name_hi": "\u092e\u0925\u0941\u0930\u093e \u0915\u0947 \u092a\u0947\u0921\u093c\u0947",
    "category": "Uttar Pradesh Sweet",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 230.0,
    "protein_g": 6.0,
    "carbs_g": 32.0,
    "fat_g": 9.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_255",
    "name": "Tehri (Awadhi Veg Rice)",
    "name_hi": "\u0924\u0939\u0930\u0940",
    "category": "Uttar Pradesh Rice",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 310.0,
    "protein_g": 7.0,
    "carbs_g": 56.0,
    "fat_g": 7.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_256",
    "name": "Shahi Tukda (Lucknowi)",
    "name_hi": "\u0936\u093e\u0939\u0940 \u091f\u0941\u0915\u0921\u093c\u093e",
    "category": "Uttar Pradesh Sweet",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 360.0,
    "protein_g": 6.0,
    "carbs_g": 48.0,
    "fat_g": 17.0,
    "fiber_g": 1.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_257",
    "name": "Malaiyyo (Banarasi Winter Foam)",
    "name_hi": "\u092e\u0932\u0907\u092f\u094b",
    "category": "Uttar Pradesh Sweet",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 5.0,
    "carbs_g": 20.0,
    "fat_g": 7.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_258",
    "name": "Kakori Kebab",
    "name_hi": "\u0915\u093e\u0915\u094b\u0930\u0940 \u0915\u092c\u093e\u092c",
    "category": "Uttar Pradesh Starter",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 290.0,
    "protein_g": 26.0,
    "carbs_g": 3.0,
    "fat_g": 20.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_259",
    "name": "Baati Chokha (Purvanchal)",
    "name_hi": "\u092c\u093e\u091f\u0940 \u091a\u094b\u0916\u093e",
    "category": "Uttar Pradesh Main",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 360.0,
    "protein_g": 9.0,
    "carbs_g": 58.0,
    "fat_g": 10.0,
    "fiber_g": 7.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_260",
    "name": "Nihari with Kulcha",
    "name_hi": "\u0928\u093f\u0939\u093e\u0930\u0940 \u0915\u0941\u0932\u094d\u091a\u093e",
    "category": "Uttar Pradesh Main",
    "cuisine": "Indian",
    "state": "Uttar Pradesh",
    "serving": "1 standard portion",
    "calories": 480.0,
    "protein_g": 38.0,
    "carbs_g": 28.0,
    "fat_g": 26.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_261",
    "name": "Litti Chokha with Ghee",
    "name_hi": "\u0932\u093f\u091f\u094d\u091f\u0940 \u091a\u094b\u0916\u093e",
    "category": "Bihar Traditional",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 390.0,
    "protein_g": 14.0,
    "carbs_g": 62.0,
    "fat_g": 11.0,
    "fiber_g": 9.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_262",
    "name": "Sattu ka Paratha",
    "name_hi": "\u0938\u0924\u094d\u0924\u0942 \u0915\u093e \u092a\u0930\u093e\u0920\u093e",
    "category": "Bihar Breakfast",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 10.0,
    "carbs_g": 42.0,
    "fat_g": 6.5,
    "fiber_g": 6.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_263",
    "name": "Bihari Sattu Sharbat (Namkeen)",
    "name_hi": "\u0938\u0924\u094d\u0924\u0942 \u0915\u093e \u0936\u0930\u092c\u0924",
    "category": "Bihar Drink",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 140.0,
    "protein_g": 8.0,
    "carbs_g": 24.0,
    "fat_g": 1.5,
    "fiber_g": 5.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_264",
    "name": "Thekua",
    "name_hi": "\u0920\u0947\u0915\u0941\u0906",
    "category": "Bihar Sweet",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 3.5,
    "carbs_g": 34.0,
    "fat_g": 8.5,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_265",
    "name": "Bihari Champaran Meat (Ahuna)",
    "name_hi": "\u091a\u0902\u092a\u093e\u0930\u0923 \u092e\u091f\u0928",
    "category": "Bihar Meat",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 440.0,
    "protein_g": 36.0,
    "carbs_g": 6.0,
    "fat_g": 31.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_266",
    "name": "Bihari Fish Curry (Rohu)",
    "name_hi": "\u092c\u093f\u0939\u093e\u0930\u0940 \u092e\u091b\u0932\u0940 \u0915\u0930\u0940",
    "category": "Bihar Seafood",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 26.0,
    "carbs_g": 6.0,
    "fat_g": 15.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_267",
    "name": "Dal Pitha",
    "name_hi": "\u0926\u093e\u0932 \u092a\u0940\u0920\u093e",
    "category": "Bihar Snack",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 8.0,
    "carbs_g": 34.0,
    "fat_g": 1.5,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_268",
    "name": "Chana Ghugni (Bihari Style)",
    "name_hi": "\u091a\u0928\u093e \u0918\u0941\u0918\u0928\u0940",
    "category": "Bihar Breakfast",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 11.0,
    "carbs_g": 34.0,
    "fat_g": 5.0,
    "fiber_g": 8.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_269",
    "name": "Khaja (Silao)",
    "name_hi": "\u0938\u093f\u0932\u093e\u0935 \u0915\u093e \u0916\u093e\u091c\u093e",
    "category": "Bihar Sweet",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 280.0,
    "protein_g": 3.5,
    "carbs_g": 44.0,
    "fat_g": 11.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_270",
    "name": "Parwal ki Mithai",
    "name_hi": "\u092a\u0930\u0935\u0932 \u0915\u0940 \u092e\u093f\u0920\u093e\u0908",
    "category": "Bihar Sweet",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 5.0,
    "carbs_g": 38.0,
    "fat_g": 8.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_271",
    "name": "Bihari Kadhi Badi",
    "name_hi": "\u0915\u0922\u093c\u0940 \u092c\u0921\u093c\u0940",
    "category": "Bihar Curry",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 230.0,
    "protein_g": 8.0,
    "carbs_g": 22.0,
    "fat_g": 12.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_272",
    "name": "Bihari Pua / Malpua",
    "name_hi": "\u092a\u0941\u0906",
    "category": "Bihar Sweet",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 4.0,
    "carbs_g": 42.0,
    "fat_g": 9.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_273",
    "name": "Tilkut (Gaya)",
    "name_hi": "\u0924\u093f\u0932\u0915\u0942\u091f",
    "category": "Bihar Sweet",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 6.0,
    "carbs_g": 28.0,
    "fat_g": 13.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_274",
    "name": "Anarsa with Khus Khus",
    "name_hi": "\u0905\u0928\u0930\u0938\u093e",
    "category": "Bihar Sweet",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 3.0,
    "carbs_g": 36.0,
    "fat_g": 8.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_275",
    "name": "Oal ki Chutney (Elephant Yam)",
    "name_hi": "\u0913\u0932 \u0915\u0940 \u091a\u091f\u0928\u0940",
    "category": "Bihar Condiment",
    "cuisine": "Indian",
    "state": "Bihar",
    "serving": "1 standard portion",
    "calories": 80.0,
    "protein_g": 2.0,
    "carbs_g": 14.0,
    "fat_g": 2.5,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_276",
    "name": "Hyderabadi Dum Biryani",
    "name_hi": "\u0939\u0948\u0926\u0930\u093e\u092c\u093e\u0926\u0940 \u092c\u093f\u0930\u092f\u093e\u0928\u0940",
    "category": "Andhra Pradesh Rice",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 510.0,
    "protein_g": 32.0,
    "carbs_g": 64.0,
    "fat_g": 15.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_277",
    "name": "Gongura Mutton Curry",
    "name_hi": "\u0917\u094b\u0902\u0917\u0942\u0930\u093e \u092e\u091f\u0928",
    "category": "Andhra Pradesh Meat",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 380.0,
    "protein_g": 34.0,
    "carbs_g": 6.0,
    "fat_g": 25.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_278",
    "name": "Gongura Pachadi",
    "name_hi": "\u0917\u094b\u0902\u0917\u0942\u0930\u093e \u092a\u091a\u0921\u093c\u0940",
    "category": "Andhra Pradesh Condiment",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 90.0,
    "protein_g": 2.0,
    "carbs_g": 8.0,
    "fat_g": 6.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_279",
    "name": "Andhra Pesarattu with Upma",
    "name_hi": "\u092a\u0947\u0938\u0930\u091f\u094d\u091f\u0942 \u0909\u092a\u092e\u093e",
    "category": "Andhra Pradesh Breakfast",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 310.0,
    "protein_g": 14.0,
    "carbs_g": 52.0,
    "fat_g": 6.5,
    "fiber_g": 7.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_280",
    "name": "Natu Kodi Pulusu (Country Chicken)",
    "name_hi": "\u0928\u093e\u091f\u0942 \u0915\u094b\u0921\u093c\u0940 \u092a\u0941\u0932\u0941\u0938\u0941",
    "category": "Andhra Pradesh Curry",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 320.0,
    "protein_g": 34.0,
    "carbs_g": 4.0,
    "fat_g": 18.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_281",
    "name": "Andhra Royyala Vepudu (Prawn Fry)",
    "name_hi": "\u092a\u094d\u0930\u0949\u0928 \u0935\u0947\u092a\u0941\u0921\u0941",
    "category": "Andhra Pradesh Seafood",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 32.0,
    "carbs_g": 4.0,
    "fat_g": 13.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_282",
    "name": "Gutti Vankaya Koora",
    "name_hi": "\u0917\u0941\u091f\u094d\u091f\u0940 \u0935\u0902\u0915\u093e\u092f \u0915\u0942\u0930",
    "category": "Andhra Pradesh Sabzi",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 230.0,
    "protein_g": 5.0,
    "carbs_g": 18.0,
    "fat_g": 16.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_283",
    "name": "Andhra Pappu Charu",
    "name_hi": "\u092a\u092a\u094d\u092a\u0942 \u091a\u093e\u0930\u0941",
    "category": "Andhra Pradesh Dal",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 140.0,
    "protein_g": 6.0,
    "carbs_g": 22.0,
    "fat_g": 3.5,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_284",
    "name": "Mirchi Bajji (Andhra Cut Mirchi)",
    "name_hi": "\u092e\u093f\u0930\u094d\u091a\u0940 \u092d\u091c\u094d\u091c\u0940",
    "category": "Andhra Pradesh Snack",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 210.0,
    "protein_g": 4.0,
    "carbs_g": 24.0,
    "fat_g": 11.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_285",
    "name": "Pootharekulu (Paper Sweet)",
    "name_hi": "\u092a\u0942\u0925\u093e\u0930\u0947\u0915\u0941\u0932\u0941",
    "category": "Andhra Pradesh Sweet",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 3.0,
    "carbs_g": 38.0,
    "fat_g": 9.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_286",
    "name": "Bobbatlu (Puran Poli)",
    "name_hi": "\u092c\u094b\u092c\u094d\u092c\u091f\u094d\u0932\u0941",
    "category": "Andhra Pradesh Sweet",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 6.0,
    "carbs_g": 48.0,
    "fat_g": 6.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_287",
    "name": "Ulava Charu",
    "name_hi": "\u0909\u0932\u0935\u093e \u091a\u093e\u0930\u0941",
    "category": "Andhra Pradesh Soup",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 9.0,
    "carbs_g": 22.0,
    "fat_g": 4.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_288",
    "name": "Kakarakaya Vepudu (Bitter Gourd)",
    "name_hi": "\u0915\u0930\u0947\u0932\u093e \u0935\u0947\u092a\u0941\u0921\u0941",
    "category": "Andhra Pradesh Side",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 120.0,
    "protein_g": 3.0,
    "carbs_g": 14.0,
    "fat_g": 6.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_289",
    "name": "Pulihora (Andhra Tamarind Rice)",
    "name_hi": "\u092a\u0941\u0932\u093f\u0939\u094b\u0930\u093e",
    "category": "Andhra Pradesh Rice",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 280.0,
    "protein_g": 6.0,
    "carbs_g": 50.0,
    "fat_g": 7.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_290",
    "name": "Qubani ka Meetha",
    "name_hi": "\u0916\u0941\u092c\u093e\u0928\u0940 \u0915\u093e \u092e\u0940\u0920\u093e",
    "category": "Andhra Pradesh Sweet",
    "cuisine": "Indian",
    "state": "Andhra Pradesh",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 3.0,
    "carbs_g": 44.0,
    "fat_g": 4.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_291",
    "name": "Bisi Bele Bath",
    "name_hi": "\u092c\u093f\u0938\u0940 \u092c\u0947\u0932\u0947 \u092c\u093e\u0925",
    "category": "Karnataka Meal",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 340.0,
    "protein_g": 9.0,
    "carbs_g": 58.0,
    "fat_g": 8.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_292",
    "name": "Mysore Masala Dosa",
    "name_hi": "\u092e\u0948\u0938\u0942\u0930 \u092e\u0938\u093e\u0932\u093e \u0921\u094b\u0938\u093e",
    "category": "Karnataka Breakfast",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 340.0,
    "protein_g": 7.0,
    "carbs_g": 56.0,
    "fat_g": 10.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_293",
    "name": "Neer Dosa with Coconut Chutney",
    "name_hi": "\u0928\u0940\u0930 \u0921\u094b\u0938\u093e",
    "category": "Karnataka Breakfast",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 3.5,
    "carbs_g": 36.0,
    "fat_g": 2.5,
    "fiber_g": 1.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_294",
    "name": "Maddur Vada",
    "name_hi": "\u092e\u0926\u094d\u0926\u0942\u0930 \u0935\u0921\u093c\u093e",
    "category": "Karnataka Snack",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 230.0,
    "protein_g": 4.0,
    "carbs_g": 26.0,
    "fat_g": 12.0,
    "fiber_g": 2.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_295",
    "name": "Ragi Mudde with Bassaru",
    "name_hi": "\u0930\u093e\u0917\u0940 \u092e\u0941\u0921\u094d\u0921\u0947",
    "category": "Karnataka Traditional",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 7.0,
    "carbs_g": 54.0,
    "fat_g": 2.0,
    "fiber_g": 8.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_296",
    "name": "Mangalorean Ghee Roast (Chicken/Paneer)",
    "name_hi": "\u0918\u0940 \u0930\u094b\u0938\u094d\u091f",
    "category": "Karnataka Specialty",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 380.0,
    "protein_g": 32.0,
    "carbs_g": 6.0,
    "fat_g": 26.0,
    "fiber_g": 1.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_297",
    "name": "Mangalorean Fish Curry (Kori Rotti)",
    "name_hi": "\u092e\u0902\u0917\u0932\u094b\u0930\u093f\u092f\u0928 \u092b\u093f\u0936 \u0915\u0930\u0940",
    "category": "Karnataka Seafood",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 340.0,
    "protein_g": 30.0,
    "carbs_g": 22.0,
    "fat_g": 16.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_298",
    "name": "Coorg Pandi Curry",
    "name_hi": "\u0915\u0942\u0930\u094d\u0917 \u0915\u0930\u0940",
    "category": "Karnataka Specialty",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 410.0,
    "protein_g": 32.0,
    "carbs_g": 4.0,
    "fat_g": 30.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_299",
    "name": "Dharwad Pedha",
    "name_hi": "\u0927\u093e\u0930\u0935\u093e\u0921\u093c \u092a\u0947\u0921\u093c\u093e",
    "category": "Karnataka Sweet",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 6.0,
    "carbs_g": 32.0,
    "fat_g": 10.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_300",
    "name": "Mysore Pak (Authentic Karnataka)",
    "name_hi": "\u092e\u0948\u0938\u0942\u0930 \u092a\u093e\u0915",
    "category": "Karnataka Sweet",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 310.0,
    "protein_g": 4.0,
    "carbs_g": 36.0,
    "fat_g": 17.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_301",
    "name": "Akki Roti with Chutney",
    "name_hi": "\u0905\u0915\u094d\u0915\u0940 \u0930\u094b\u091f\u0940",
    "category": "Karnataka Breakfast",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 210.0,
    "protein_g": 4.0,
    "carbs_g": 42.0,
    "fat_g": 3.5,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_302",
    "name": "Chiroti with Almond Milk",
    "name_hi": "\u091a\u093f\u0930\u094b\u091f\u0940",
    "category": "Karnataka Sweet",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 4.0,
    "carbs_g": 38.0,
    "fat_g": 11.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_303",
    "name": "Obbattu (Holige)",
    "name_hi": "\u0913\u092c\u094d\u092c\u091f\u094d\u091f\u0941",
    "category": "Karnataka Sweet",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 250.0,
    "protein_g": 5.0,
    "carbs_g": 46.0,
    "fat_g": 6.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_304",
    "name": "Vangi Bath",
    "name_hi": "\u0935\u093e\u0902\u0917\u0940 \u092c\u093e\u0925",
    "category": "Karnataka Rice",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 310.0,
    "protein_g": 6.0,
    "carbs_g": 54.0,
    "fat_g": 8.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_305",
    "name": "Udupi Tomato Rasam (Saaru)",
    "name_hi": "\u0909\u0921\u0941\u092a\u0940 \u0938\u093e\u0930\u0942",
    "category": "Karnataka Soup",
    "cuisine": "Indian",
    "state": "Karnataka",
    "serving": "1 standard portion",
    "calories": 85.0,
    "protein_g": 3.0,
    "carbs_g": 14.0,
    "fat_g": 2.5,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_306",
    "name": "Odisha Dalma",
    "name_hi": "\u0913\u0921\u093f\u0936\u093e \u0926\u093e\u0932\u092e\u093e",
    "category": "Odisha Traditional",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 190.0,
    "protein_g": 8.0,
    "carbs_g": 32.0,
    "fat_g": 4.0,
    "fiber_g": 7.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_307",
    "name": "Chhena Poda",
    "name_hi": "\u091b\u0947\u0928\u093e \u092a\u094b\u0921\u093c\u093e",
    "category": "Odisha Sweet",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 9.0,
    "carbs_g": 32.0,
    "fat_g": 9.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_308",
    "name": "Rasabali",
    "name_hi": "\u0930\u0938\u092c\u093e\u0932\u0940",
    "category": "Odisha Sweet",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 8.0,
    "carbs_g": 34.0,
    "fat_g": 10.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_309",
    "name": "Pakhala Bhata with Badi Chura",
    "name_hi": "\u092a\u0916\u093e\u0932\u093e \u092d\u093e\u0924",
    "category": "Odisha Meal",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 6.0,
    "carbs_g": 44.0,
    "fat_g": 3.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_310",
    "name": "Santula",
    "name_hi": "\u0938\u0902\u0924\u0941\u0932\u093e",
    "category": "Odisha Vegetable",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 110.0,
    "protein_g": 3.0,
    "carbs_g": 16.0,
    "fat_g": 4.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_311",
    "name": "Macha Besara (Mustard Fish)",
    "name_hi": "\u092e\u093e\u091b\u093e \u092c\u0947\u0938\u0930\u093e",
    "category": "Odisha Seafood",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 26.0,
    "carbs_g": 6.0,
    "fat_g": 13.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_312",
    "name": "Chhena Gaja",
    "name_hi": "\u091b\u0947\u0928\u093e \u0917\u091c\u093e",
    "category": "Odisha Sweet",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 270.0,
    "protein_g": 7.0,
    "carbs_g": 36.0,
    "fat_g": 11.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_313",
    "name": "Puri Khaja (Jagannath Temple)",
    "name_hi": "\u092a\u0941\u0930\u0940 \u0916\u093e\u091c\u093e",
    "category": "Odisha Sweet",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 290.0,
    "protein_g": 3.5,
    "carbs_g": 46.0,
    "fat_g": 11.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_314",
    "name": "Kakara Pitha",
    "name_hi": "\u0915\u093e\u0915\u0930\u093e \u092a\u0940\u0920\u093e",
    "category": "Odisha Sweet",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 230.0,
    "protein_g": 4.0,
    "carbs_g": 38.0,
    "fat_g": 7.5,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_315",
    "name": "Arisa Pitha",
    "name_hi": "\u0905\u0930\u093f\u0938\u093e \u092a\u0940\u0920\u093e",
    "category": "Odisha Sweet",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 3.0,
    "carbs_g": 42.0,
    "fat_g": 5.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_316",
    "name": "Chhena Jhili",
    "name_hi": "\u091b\u0947\u0928\u093e \u091d\u093f\u0932\u0940",
    "category": "Odisha Sweet",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 250.0,
    "protein_g": 6.0,
    "carbs_g": 36.0,
    "fat_g": 9.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_317",
    "name": "Besara (Mixed Vegetable in Mustard)",
    "name_hi": "\u092c\u0947\u0938\u0930\u093e",
    "category": "Odisha Curry",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 150.0,
    "protein_g": 4.0,
    "carbs_g": 20.0,
    "fat_g": 6.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_318",
    "name": "Alu Potala Rasa",
    "name_hi": "\u0906\u0932\u0942 \u092a\u094b\u091f\u093e\u0932\u093e \u0930\u0938\u093e",
    "category": "Odisha Sabzi",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 170.0,
    "protein_g": 4.0,
    "carbs_g": 22.0,
    "fat_g": 7.5,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_319",
    "name": "Ghanta Tarkari",
    "name_hi": "\u0918\u093e\u0902\u091f\u093e \u0924\u0930\u0915\u093e\u0930\u0940",
    "category": "Odisha Curry",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 190.0,
    "protein_g": 6.0,
    "carbs_g": 28.0,
    "fat_g": 7.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_320",
    "name": "Badi Chura",
    "name_hi": "\u092c\u0921\u093c\u0940 \u091a\u0942\u0930\u093e",
    "category": "Odisha Condiment",
    "cuisine": "Indian",
    "state": "Odisha",
    "serving": "1 standard portion",
    "calories": 120.0,
    "protein_g": 6.0,
    "carbs_g": 12.0,
    "fat_g": 5.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_321",
    "name": "Kashmiri Rogan Josh",
    "name_hi": "\u0930\u094b\u0917\u0928 \u091c\u094b\u0936",
    "category": "Kashmir Meat",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 420.0,
    "protein_g": 34.0,
    "carbs_g": 4.0,
    "fat_g": 30.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_322",
    "name": "Kashmiri Dum Aloo",
    "name_hi": "\u0915\u0936\u094d\u092e\u0940\u0930\u0940 \u0926\u092e \u0906\u0932\u0942",
    "category": "Kashmir Curry",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 5.0,
    "carbs_g": 28.0,
    "fat_g": 15.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_323",
    "name": "Gushtaba",
    "name_hi": "\u0917\u0941\u0936\u094d\u0924\u093e\u092c\u093e",
    "category": "Kashmir Meat",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 380.0,
    "protein_g": 32.0,
    "carbs_g": 6.0,
    "fat_g": 26.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_324",
    "name": "Rista",
    "name_hi": "\u0930\u093f\u0938\u094d\u0924\u093e",
    "category": "Kashmir Meat",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 390.0,
    "protein_g": 34.0,
    "carbs_g": 4.0,
    "fat_g": 27.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_325",
    "name": "Yakhni (Mutton/Lotus Stem)",
    "name_hi": "\u092f\u0916\u0928\u0940",
    "category": "Kashmir Curry",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 290.0,
    "protein_g": 26.0,
    "carbs_g": 6.0,
    "fat_g": 18.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_326",
    "name": "Nadru Yakhni (Lotus Stem)",
    "name_hi": "\u0928\u0926\u0930\u0942 \u092f\u0916\u0928\u0940",
    "category": "Kashmir Vegetarian",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 4.0,
    "carbs_g": 22.0,
    "fat_g": 8.5,
    "fiber_g": 5.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_327",
    "name": "Kashmiri Kahwa",
    "name_hi": "\u0915\u0936\u094d\u092e\u0940\u0930\u0940 \u0915\u0939\u0935\u093e",
    "category": "Kashmir Drink",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 70.0,
    "protein_g": 2.0,
    "carbs_g": 10.0,
    "fat_g": 2.5,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_328",
    "name": "Modur Pulao",
    "name_hi": "\u092e\u094b\u0926\u0941\u0930 \u092a\u0941\u0932\u093e\u0935",
    "category": "Kashmir Rice",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 340.0,
    "protein_g": 5.0,
    "carbs_g": 58.0,
    "fat_g": 11.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_329",
    "name": "Sheermal (Kashmiri Bread)",
    "name_hi": "\u0936\u0940\u0930\u092e\u093e\u0932",
    "category": "Kashmir Bread",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 6.0,
    "carbs_g": 38.0,
    "fat_g": 7.5,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_330",
    "name": "Tabak Maaz",
    "name_hi": "\u0924\u092c\u0915 \u092e\u093e\u091c\u093c",
    "category": "Kashmir Meat",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 460.0,
    "protein_g": 36.0,
    "carbs_g": 0.0,
    "fat_g": 35.0,
    "fiber_g": 0.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_331",
    "name": "Kashmiri Haakh",
    "name_hi": "\u0939\u093e\u0916",
    "category": "Kashmir Sabzi",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 95.0,
    "protein_g": 3.0,
    "carbs_g": 8.0,
    "fat_g": 6.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_332",
    "name": "Nadru Monje",
    "name_hi": "\u0928\u0926\u0930\u0942 \u092e\u094b\u0902\u091c\u0947",
    "category": "Kashmir Snack",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 170.0,
    "protein_g": 3.0,
    "carbs_g": 24.0,
    "fat_g": 7.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_333",
    "name": "Tujji (Kashmiri Seekh Tikka)",
    "name_hi": "\u0924\u0941\u091c\u094d\u091c\u0940",
    "category": "Kashmir Starter",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 280.0,
    "protein_g": 30.0,
    "carbs_g": 2.0,
    "fat_g": 17.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_334",
    "name": "Lavasa (Kashmiri Naan)",
    "name_hi": "\u0932\u0935\u093e\u0938\u093e",
    "category": "Kashmir Bread",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 140.0,
    "protein_g": 4.0,
    "carbs_g": 28.0,
    "fat_g": 1.5,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_335",
    "name": "Choek Vangun (Sour Eggplant)",
    "name_hi": "\u091a\u094b\u0915 \u0935\u093e\u0902\u0917\u0941\u0928",
    "category": "Kashmir Sabzi",
    "cuisine": "Indian",
    "state": "Kashmir",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 3.0,
    "carbs_g": 18.0,
    "fat_g": 9.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_336",
    "name": "Goan Fish Curry with Rice",
    "name_hi": "\u0917\u094b\u0905\u0928 \u092b\u093f\u0936 \u0915\u0930\u0940",
    "category": "Goa Seafood",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 340.0,
    "protein_g": 30.0,
    "carbs_g": 18.0,
    "fat_g": 16.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_337",
    "name": "Pork / Chicken Vindaloo",
    "name_hi": "\u0935\u093f\u0902\u0921\u093e\u0932\u0942",
    "category": "Goa Specialty",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 420.0,
    "protein_g": 34.0,
    "carbs_g": 6.0,
    "fat_g": 29.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_338",
    "name": "Chicken Xacuti",
    "name_hi": "\u091a\u093f\u0915\u0928 \u0936\u093e\u0915\u0941\u0924\u0940",
    "category": "Goa Curry",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 380.0,
    "protein_g": 36.0,
    "carbs_g": 8.0,
    "fat_g": 23.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_339",
    "name": "Goan Prawn Balch\u00e3o",
    "name_hi": "\u092a\u094d\u0930\u0949\u0928 \u092c\u093e\u0932\u091a\u093e\u0935",
    "category": "Goa Seafood",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 28.0,
    "carbs_g": 8.0,
    "fat_g": 13.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_340",
    "name": "Bebinca",
    "name_hi": "\u092c\u0947\u092c\u093f\u0902\u0915\u093e",
    "category": "Goa Sweet",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 320.0,
    "protein_g": 5.0,
    "carbs_g": 42.0,
    "fat_g": 15.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_341",
    "name": "Pao with Ross Omelette",
    "name_hi": "\u0930\u0949\u0938 \u0911\u092e\u0932\u0947\u091f",
    "category": "Goa Breakfast",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 420.0,
    "protein_g": 22.0,
    "carbs_g": 44.0,
    "fat_g": 18.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_342",
    "name": "Goan Sorpotel",
    "name_hi": "\u0938\u094b\u0930\u092a\u094b\u0924\u0947\u0932",
    "category": "Goa Meat",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 410.0,
    "protein_g": 34.0,
    "carbs_g": 4.0,
    "fat_g": 29.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_343",
    "name": "Fish Caldin (Caldeen)",
    "name_hi": "\u092b\u093f\u0936 \u0915\u0948\u0932\u0926\u0940\u0928",
    "category": "Goa Seafood",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 270.0,
    "protein_g": 26.0,
    "carbs_g": 6.0,
    "fat_g": 16.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_344",
    "name": "Khatkhate (Goan Veg Stew)",
    "name_hi": "\u0916\u0924\u0916\u0924\u0947",
    "category": "Goa Curry",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 5.0,
    "carbs_g": 24.0,
    "fat_g": 8.0,
    "fiber_g": 6.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_345",
    "name": "Goan Poee Bread",
    "name_hi": "\u092a\u094b\u0908",
    "category": "Goa Bread",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 150.0,
    "protein_g": 5.0,
    "carbs_g": 30.0,
    "fat_g": 1.5,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_346",
    "name": "Serradura (Macau-Goan Sawdust Pudding)",
    "name_hi": "\u0938\u0947\u0930\u093e\u0926\u0941\u0930\u093e",
    "category": "Goa Sweet",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 280.0,
    "protein_g": 4.0,
    "carbs_g": 32.0,
    "fat_g": 16.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_347",
    "name": "Crab Xec Xec",
    "name_hi": "\u0915\u094d\u0930\u0948\u092c \u0936\u0947\u0915 \u0936\u0947\u0915",
    "category": "Goa Seafood",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 290.0,
    "protein_g": 28.0,
    "carbs_g": 8.0,
    "fat_g": 16.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_348",
    "name": "Alle Belle (Goan Coconut Pancakes)",
    "name_hi": "\u0906\u0932\u0947 \u092c\u0947\u0932\u0947",
    "category": "Goa Sweet",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 210.0,
    "protein_g": 4.0,
    "carbs_g": 34.0,
    "fat_g": 6.5,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_349",
    "name": "Feni Infused Prawns",
    "name_hi": "\u092b\u0947\u0928\u0940 \u092a\u094d\u0930\u0949\u0928\u094d\u0938",
    "category": "Goa Starter",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 26.0,
    "carbs_g": 2.0,
    "fat_g": 11.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_350",
    "name": "Samarachi Kodi (Dry Prawn Curry)",
    "name_hi": "\u0938\u0941\u0916\u0940 \u091d\u0940\u0902\u0917\u093e \u0915\u0930\u0940",
    "category": "Goa Seafood",
    "cuisine": "Indian",
    "state": "Goa",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 24.0,
    "carbs_g": 6.0,
    "fat_g": 13.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_351",
    "name": "Himachali Madra (Chana Madra)",
    "name_hi": "\u091a\u0928\u093e \u092e\u0926\u094d\u0930\u093e",
    "category": "Himachal & Uttarakhand Traditional",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 280.0,
    "protein_g": 11.0,
    "carbs_g": 32.0,
    "fat_g": 12.0,
    "fiber_g": 7.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_352",
    "name": "Siddu with Ghee",
    "name_hi": "\u0938\u093f\u0921\u094d\u0921\u0942",
    "category": "Himachal & Uttarakhand Traditional",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 320.0,
    "protein_g": 8.0,
    "carbs_g": 52.0,
    "fat_g": 9.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_353",
    "name": "Babru (Himachali Kachori)",
    "name_hi": "\u092c\u092c\u0930\u0942",
    "category": "Himachal & Uttarakhand Bread",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 260.0,
    "protein_g": 7.0,
    "carbs_g": 38.0,
    "fat_g": 9.5,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_354",
    "name": "Tudkiya Bhath",
    "name_hi": "\u0924\u0941\u0921\u093c\u0915\u093f\u092f\u093e \u092d\u093e\u0924",
    "category": "Himachal & Uttarakhand Rice",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 310.0,
    "protein_g": 8.0,
    "carbs_g": 54.0,
    "fat_g": 7.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_355",
    "name": "Bhey (Crisp Spicy Lotus Stem)",
    "name_hi": "\u092d\u0947\u092f",
    "category": "Himachal & Uttarakhand Sabzi",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 3.5,
    "carbs_g": 22.0,
    "fat_g": 7.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_356",
    "name": "Kafuli (Garhwali Greens)",
    "name_hi": "\u0915\u092b\u0942\u0932\u0940",
    "category": "Himachal & Uttarakhand Vegetable",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 120.0,
    "protein_g": 4.5,
    "carbs_g": 12.0,
    "fat_g": 6.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_357",
    "name": "Chainsoo (Roasted Urad Dal Curry)",
    "name_hi": "\u091a\u0948\u0902\u0938\u0942",
    "category": "Himachal & Uttarakhand Dal",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 220.0,
    "protein_g": 14.0,
    "carbs_g": 28.0,
    "fat_g": 6.0,
    "fiber_g": 8.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_358",
    "name": "Phaanu (Mixed Dal Souffl\u00e9 Stew)",
    "name_hi": "\u092b\u093e\u0923\u0942",
    "category": "Himachal & Uttarakhand Dal",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 210.0,
    "protein_g": 13.0,
    "carbs_g": 26.0,
    "fat_g": 6.5,
    "fiber_g": 7.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_359",
    "name": "Bhatt ki Churkani",
    "name_hi": "\u092d\u091f\u094d\u091f \u0915\u0940 \u091a\u0941\u0921\u093c\u0915\u093e\u0928\u0940",
    "category": "Himachal & Uttarakhand Dal",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 18.0,
    "carbs_g": 24.0,
    "fat_g": 8.0,
    "fiber_g": 8.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_360",
    "name": "Jhangora ki Kheer",
    "name_hi": "\u091d\u0902\u0917\u094b\u0930\u093e \u0915\u0940 \u0916\u0940\u0930",
    "category": "Himachal & Uttarakhand Sweet",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 210.0,
    "protein_g": 5.0,
    "carbs_g": 34.0,
    "fat_g": 6.5,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_361",
    "name": "Singori (Kumaoni Sweet)",
    "name_hi": "\u0938\u093f\u0902\u0917\u094b\u0930\u0940",
    "category": "Himachal & Uttarakhand Sweet",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 180.0,
    "protein_g": 6.0,
    "carbs_g": 24.0,
    "fat_g": 7.0,
    "fiber_g": 0.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_362",
    "name": "Kumaoni Raita (Mustard Cucumber)",
    "name_hi": "\u092a\u0939\u093e\u0921\u093c\u0940 \u0930\u093e\u092f\u0924\u093e",
    "category": "Himachal & Uttarakhand Side",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 80.0,
    "protein_g": 3.5,
    "carbs_g": 6.0,
    "fat_g": 4.5,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_363",
    "name": "Aloo ke Gutke with Bhang Chutney",
    "name_hi": "\u0906\u0932\u0942 \u0915\u0947 \u0917\u0941\u091f\u0915\u0947",
    "category": "Himachal & Uttarakhand Sabzi",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 190.0,
    "protein_g": 3.0,
    "carbs_g": 26.0,
    "fat_g": 8.5,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_364",
    "name": "Mittha (Himachali Sweet Rice)",
    "name_hi": "\u092e\u0940\u0920\u093e \u091a\u093e\u0935\u0932",
    "category": "Himachal & Uttarakhand Sweet",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 280.0,
    "protein_g": 4.0,
    "carbs_g": 52.0,
    "fat_g": 6.5,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_365",
    "name": "Dubuk (Lentil Porridge)",
    "name_hi": "\u0921\u0941\u092c\u0941\u0915",
    "category": "Himachal & Uttarakhand Dal",
    "cuisine": "Indian",
    "state": "Himachal & Uttarakhand",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 9.0,
    "carbs_g": 22.0,
    "fat_g": 4.0,
    "fiber_g": 5.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_366",
    "name": "Assamese Masor Tenga",
    "name_hi": "\u092e\u093e\u0938\u094b\u0930 \u091f\u0947\u0902\u0917\u093e",
    "category": "Assam & North East Seafood",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 190.0,
    "protein_g": 24.0,
    "carbs_g": 6.0,
    "fat_g": 8.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_367",
    "name": "Assam Khaar (Omita Khaar)",
    "name_hi": "\u0916\u093e\u0930",
    "category": "Assam & North East Traditional",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 90.0,
    "protein_g": 2.0,
    "carbs_g": 14.0,
    "fat_g": 2.5,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_368",
    "name": "Duck Meat with Ash Gourd",
    "name_hi": "\u0939\u093e\u0901\u0939\u094b\u0930 \u092e\u093e\u0902\u0939",
    "category": "Assam & North East Meat",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 380.0,
    "protein_g": 34.0,
    "carbs_g": 4.0,
    "fat_g": 26.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_369",
    "name": "Aloo Pitika with Mustard Oil",
    "name_hi": "\u0906\u0932\u0942 \u092a\u093f\u091f\u093f\u0915\u093e",
    "category": "Assam & North East Side",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 140.0,
    "protein_g": 2.5,
    "carbs_g": 24.0,
    "fat_g": 4.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_370",
    "name": "Til Pitha",
    "name_hi": "\u0924\u093f\u0932 \u092a\u0940\u0920\u093e",
    "category": "Assam & North East Sweet",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 160.0,
    "protein_g": 3.0,
    "carbs_g": 30.0,
    "fat_g": 3.5,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_371",
    "name": "Steamed Chicken Momos",
    "name_hi": "\u091a\u093f\u0915\u0928 \u092e\u094b\u092e\u094b",
    "category": "Assam & North East Dumpling",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 240.0,
    "protein_g": 18.0,
    "carbs_g": 28.0,
    "fat_g": 6.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_372",
    "name": "Tibetan Thukpa (Noodle Soup)",
    "name_hi": "\u0925\u0941\u0915\u092a\u093e",
    "category": "Assam & North East Soup",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 310.0,
    "protein_g": 14.0,
    "carbs_g": 52.0,
    "fat_g": 5.0,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_373",
    "name": "Naga Smoked Pork with Bamboo Shoot",
    "name_hi": "\u0928\u093e\u0917\u093e \u092a\u094b\u0930\u094d\u0915",
    "category": "Assam & North East Meat",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 440.0,
    "protein_g": 32.0,
    "carbs_g": 2.0,
    "fat_g": 34.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_374",
    "name": "Manipur Eromba",
    "name_hi": "\u090f\u0930\u094b\u092e\u094d\u092c\u093e",
    "category": "Assam & North East Traditional",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 110.0,
    "protein_g": 6.0,
    "carbs_g": 16.0,
    "fat_g": 2.5,
    "fiber_g": 4.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_375",
    "name": "Meghalaya Jadoh",
    "name_hi": "\u091c\u093e\u0926\u094b\u0939",
    "category": "Assam & North East Rice",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 390.0,
    "protein_g": 22.0,
    "carbs_g": 54.0,
    "fat_g": 10.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_376",
    "name": "Tripura Chakhwi",
    "name_hi": "\u091a\u093e\u0916\u0935\u0940",
    "category": "Assam & North East Vegetable",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 120.0,
    "protein_g": 4.0,
    "carbs_g": 18.0,
    "fat_g": 3.5,
    "fiber_g": 5.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_377",
    "name": "Sikkim Gundruk Soup",
    "name_hi": "\u0917\u0941\u0928\u094d\u0926\u094d\u0930\u0941\u0915",
    "category": "Assam & North East Soup",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 75.0,
    "protein_g": 4.0,
    "carbs_g": 10.0,
    "fat_g": 2.0,
    "fiber_g": 3.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_378",
    "name": "Pork with Black Sesame (Dohneiiong)",
    "name_hi": "\u0926\u094b\u0939\u0928\u0947\u0908\u092f\u094b\u0902\u0917",
    "category": "Assam & North East Meat",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 420.0,
    "protein_g": 30.0,
    "carbs_g": 4.0,
    "fat_g": 32.0,
    "fiber_g": 2.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_379",
    "name": "Pani Pitha",
    "name_hi": "\u092a\u093e\u0928\u0940 \u092a\u0940\u0920\u093e",
    "category": "Assam & North East Breakfast",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 150.0,
    "protein_g": 3.0,
    "carbs_g": 32.0,
    "fat_g": 1.5,
    "fiber_g": 1.5,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  },
  {
    "id": "reg_380",
    "name": "Bhut Jolokia Chicken Curry",
    "name_hi": "\u092d\u0942\u0924 \u091c\u094b\u0932\u094b\u0915\u093f\u092f\u093e \u091a\u093f\u0915\u0928",
    "category": "Assam & North East Meat",
    "cuisine": "Indian",
    "state": "Assam & North East",
    "serving": "1 standard portion",
    "calories": 310.0,
    "protein_g": 36.0,
    "carbs_g": 4.0,
    "fat_g": 17.0,
    "fiber_g": 1.0,
    "gym_tags": [
      "regional heritage",
      "authentic"
    ]
  }
];

export function searchPredefinedFoods(query, limit = 50) {
  if (!query || !query.trim()) return PREDEFINED_FOODS.slice(0, limit);
  const q = query.toLowerCase().trim();
  return PREDEFINED_FOODS.filter(item => 
    item.name.toLowerCase().includes(q) ||
    (item.name_hi && item.name_hi.includes(q)) ||
    (item.state && item.state.toLowerCase().includes(q)) ||
    item.category.toLowerCase().includes(q) ||
    item.cuisine.toLowerCase().includes(q)
  ).slice(0, limit);
}
