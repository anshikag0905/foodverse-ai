import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Compass, Plus, Barcode, ShieldAlert, Check, X, AlertCircle, Sparkles } from 'lucide-react';
import apiClient from '../services/api';
import BarcodeScanner from '../components/common/BarcodeScanner';
import MacroChart from '../components/common/MacroChart';
import AllergenAlert from '../components/common/AllergenAlert';
import { Loader } from '../components/common/Loader';
import { DoodleSalad, DoodleAvocado } from '../assets/doodles';

export default function FoodExplorer() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [cuisines, setCuisines] = useState(['All']);
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: '',
    name_hi: '',
    category: 'Prepared Dish',
    cuisine: 'Custom',
    calories: 200,
    protein: 10,
    carbs: 25,
    fat: 5,
    allergens: '',
    diet_tags: 'Vegetarian'
  });

  const isHindi = i18n.language?.startsWith('hi');

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, cuis] = await Promise.all([
          apiClient.get('/foods/categories'),
          apiClient.get('/foods/cuisines')
        ]);
        setCategories(['All', ...(Array.isArray(cats) ? cats : [])]);
        setCuisines(['All', ...(Array.isArray(cuis) ? cuis : [])]);
      } catch (err) {
        setCategories(['All', 'Produce', 'Dairy', 'Grains', 'Prepared Dish', 'Fruits', 'Gym Protein']);
      }
    };
    fetchMetadata();
    fetchFoods('', 'All', 'All');
  }, []);

  const fetchFoods = async (query = searchTerm, cat = selectedCategory, cui = selectedCuisine) => {
    setIsLoading(true);
    try {
      const params = {
        q: query,
        category: cat !== 'All' ? cat : undefined,
        cuisine: cui !== 'All' ? cui : undefined,
        limit: 30
      };
      const res = await apiClient.get('/foods/search', { params });
      setFoods(res);
    } catch (err) {
      // Local fallback food data
      const sampleList = [
        { id: 1, name: "Honeycrisp Apple", name_hi: "सेब", category: "Produce", cuisine: "Global", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, serving_size: "1 apple", shelf_life_days: 14, allergens: [] },
        { id: 2, name: "Grilled Paneer Tikka", name_hi: "पनीर टिक्का", category: "Prepared Dish", cuisine: "North Indian", calories: 285, protein: 21.5, carbs: 11.2, fat: 17.8, fiber: 3.5, serving_size: "1 plate", shelf_life_days: 3, allergens: ["Dairy"] },
        { id: 3, name: "Ripe Banana", name_hi: "केला", category: "Produce", cuisine: "Tropical", calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1, serving_size: "1 medium", shelf_life_days: 5, allergens: [] },
        { id: 4, name: "Rolled Oats Bowl", name_hi: "ओट्स", category: "Grains", cuisine: "Breakfast", calories: 190, protein: 6, carbs: 34, fat: 3.5, fiber: 5, serving_size: "1 bowl", shelf_life_days: 180, allergens: [] },
        { id: 5, name: "Steamed Edamame", name_hi: "सोयाबीन फली", category: "Produce", cuisine: "Asian", calories: 122, protein: 11.9, carbs: 8.9, fat: 5.2, fiber: 5.2, serving_size: "1 cup", shelf_life_days: 7, allergens: ["Soy"] },
        { id: 6, name: "Brown Basmati Rice", name_hi: "ब्राउन राइस", category: "Grains", cuisine: "Indian", calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, serving_size: "1 cup cooked", shelf_life_days: 365, allergens: [] }
      ];
      const filtered = sampleList.filter(f => !query || f.name.toLowerCase().includes(query.toLowerCase()));
      setFoods(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    fetchFoods(val, selectedCategory, selectedCuisine);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    fetchFoods(searchTerm, cat, selectedCuisine);
  };

  const handleBarcodeScanned = async (barcode) => {
    setShowScanner(false);
    try {
      const foodItem = await apiClient.get(`/foods/barcode/${barcode}`);
      setSelectedFood(foodItem);
    } catch (err) {
      alert(`Barcode ${barcode} not found in database.`);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/foods/custom', {
        ...customForm,
        allergens: customForm.allergens.split(',').map(s => s.trim()).filter(Boolean)
      });
      setShowCustomModal(false);
      fetchFoods(customForm.name);
    } catch (err) {
      // Local fallback save
      setFoods(prev => [{ id: Date.now(), ...customForm, allergens: [] }, ...prev]);
      setShowCustomModal(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* =========================================================================
          MODULE HEADER BAND (TEAL ACCENT + DOODLE SALAD)
          ========================================================================= */}
      <div className="rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-6 shadow-sticker flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-teal/20 border-2.5 border-ink flex items-center justify-center p-2 shadow-sticker-sm">
            <DoodleSalad size={46} className="animate-float" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal/20 border border-ink text-[11px] font-black uppercase text-teal">
              <span>Database Directory</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-ink dark:text-dusk-text mt-1">
              Food Explorer & Nutrition Registry
            </h1>
            <p className="text-xs font-semibold text-ink-muted mt-0.5">
              Search 20,000+ verified foods, regional dishes, and barcodes with instant macro calculations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => setShowScanner(!showScanner)}
            className="btn-squish inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display font-black bg-white dark:bg-dusk-surface border-2 border-ink text-ink dark:text-dusk-text shadow-sticker-xs cursor-pointer hover:border-tomato"
          >
            <Barcode className="w-4 h-4 text-tomato" />
            <span>Scan Barcode</span>
          </button>
          <button
            onClick={() => setShowCustomModal(true)}
            className="btn-squish inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display font-black bg-teal text-white border-2 border-ink shadow-sticker-xs cursor-pointer hover:shadow-sticker"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          3-STEP "HOW IT WORKS" STRIP
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-ink dark:text-dusk-text">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-dusk-card border-2 border-ink shadow-sticker-xs flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-teal text-white border border-ink flex items-center justify-center font-display font-black text-xs flex-shrink-0">
            1
          </span>
          <span>Search dish name, ingredient, or barcode</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-dusk-card border-2 border-ink shadow-sticker-xs flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-sunny text-ink border border-ink flex items-center justify-center font-display font-black text-xs flex-shrink-0">
            2
          </span>
          <span>Filter by Produce, Dairy, Grains, or Cuisines</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-dusk-card border-2 border-ink shadow-sticker-xs flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-mint text-ink border border-ink flex items-center justify-center font-display font-black text-xs flex-shrink-0">
            3
          </span>
          <span>Inspect calibrated macros, shelf-life & allergen tags</span>
        </div>
      </div>

      {/* Barcode Scanner Drawer */}
      {showScanner && (
        <div className="p-6 rounded-3xl border-3 border-ink bg-white dark:bg-dusk-card shadow-sticker">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-black text-base text-ink dark:text-dusk-text flex items-center gap-2">
              <Barcode className="w-5 h-5 text-tomato" />
              <span>Camera Barcode Scanner</span>
            </h3>
            <button
              onClick={() => setShowScanner(false)}
              className="p-1.5 rounded-xl border border-ink hover:bg-tomato hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <BarcodeScanner onScanSuccess={handleBarcodeScanned} />
        </div>
      )}

      {/* Search Input & Category Filter Pills */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search foods, ingredients, or regional dishes (e.g. Paneer Tikka, Apple, Quinoa, Banana)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-xs sm:text-sm font-bold border-2.5 border-ink bg-white dark:bg-dusk-card text-ink dark:text-dusk-text placeholder:text-ink-muted shadow-sticker-xs focus:outline-none focus:border-teal"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="font-black text-ink-muted flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`btn-squish px-3.5 py-1 rounded-full whitespace-nowrap transition-all font-display font-black text-xs border-2 border-ink cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal text-white shadow-sticker-xs'
                  : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-teal/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Grid / Results */}
      {isLoading ? (
        <Loader message="Searching nutritional database with FTS5..." type="donut" />
      ) : foods.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border-3 border-ink bg-white dark:bg-dusk-card shadow-sticker space-y-3">
          <AlertCircle className="w-10 h-10 text-sunny mx-auto" />
          <h4 className="font-display font-black text-base text-ink dark:text-dusk-text">No Food Matches Found</h4>
          <p className="text-xs font-semibold text-ink-muted max-w-sm mx-auto">
            We couldn't find an exact database match for "{searchTerm}". You can register it as a custom food!
          </p>
          <button
            onClick={() => {
              setCustomForm(prev => ({ ...prev, name: searchTerm }));
              setShowCustomModal(true);
            }}
            className="btn-squish inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-display font-black bg-teal text-white border-2 border-ink shadow-sticker-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register "{searchTerm}"</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <div
              key={food.id}
              onClick={() => setSelectedFood(food)}
              className="p-5 rounded-3xl border-3 border-ink bg-white dark:bg-dusk-card shadow-sticker hover:shadow-sticker-lg hover:-translate-y-1 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-black text-ink dark:text-dusk-text text-base leading-snug">
                    {isHindi && food.name_hi ? food.name_hi : food.name}
                  </h3>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-tomato/20 border border-ink text-tomato">
                    {Math.round(food.calories)} kcal
                  </span>
                </div>
                {food.name_hi && !isHindi && (
                  <p className="text-xs text-ink-muted font-bold">{food.name_hi}</p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-dusk-surface border border-ink text-ink dark:text-dusk-text">
                    {food.category}
                  </span>
                  {food.cuisine && (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-peach/20 border border-ink text-orange-800 dark:text-peach">
                      {food.cuisine}
                    </span>
                  )}
                </div>
              </div>

              {/* Macro Bar summary */}
              <div className="pt-3 mt-3 border-t-2 border-ink/10 flex items-center justify-between text-xs font-bold text-ink-muted">
                <span>P: <strong className="text-grape">{food.protein}g</strong></span>
                <span>C: <strong className="text-amber-600">{food.carbs}g</strong></span>
                <span>F: <strong className="text-orange-600">{food.fat}g</strong></span>
                <span>Fib: <strong className="text-mint">{food.fiber}g</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedFood && (
        <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-dusk-card rounded-3xl border-3 border-ink shadow-sticker-lg p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display font-black text-2xl text-ink dark:text-dusk-text">
                  {selectedFood.name}
                </h2>
                {selectedFood.name_hi && (
                  <p className="text-xs font-bold text-tomato mt-0.5">
                    {selectedFood.name_hi}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-dusk-surface border border-ink text-ink dark:text-dusk-text">
                    {selectedFood.category}
                  </span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-peach/20 border border-ink text-orange-800 dark:text-peach">
                    {selectedFood.cuisine}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedFood(null)}
                className="p-1.5 rounded-full border-2 border-ink hover:bg-tomato hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedFood.allergens && selectedFood.allergens.length > 0 && (
              <AllergenAlert allergensDetected={selectedFood.allergens} />
            )}

            <MacroChart
              calories={selectedFood.calories}
              protein={selectedFood.protein}
              carbs={selectedFood.carbs}
              fat={selectedFood.fat}
              fiber={selectedFood.fiber}
              servingSize={selectedFood.serving_size}
            />

            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-dusk-surface border-2 border-ink text-xs space-y-1 text-ink dark:text-dusk-text font-semibold">
              <p><strong>Storage Advice:</strong> {selectedFood.storage_hint || "Store in a cool dry place or refrigerate at 4°C."}</p>
              <p><strong>Estimated Shelf Life:</strong> {selectedFood.shelf_life_days || 7} days</p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Food Creation Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCustomSubmit}
            className="w-full max-w-lg bg-white dark:bg-dusk-card rounded-3xl border-3 border-ink shadow-sticker-lg p-6 md:p-8 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b-2 border-ink/10">
              <h3 className="font-display font-black text-lg text-ink dark:text-dusk-text">
                Register Custom Food Entry
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="p-1 rounded-full border border-ink hover:bg-tomato hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-black text-ink dark:text-dusk-text mb-1">
                  Dish Name (English)
                </label>
                <input
                  type="text"
                  required
                  value={customForm.name}
                  onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-ink dark:text-dusk-text mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={customForm.calories}
                    onChange={(e) => setCustomForm({ ...customForm, calories: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-ink dark:text-dusk-text mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={customForm.protein}
                    onChange={(e) => setCustomForm({ ...customForm, protein: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-ink dark:text-dusk-text mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={customForm.carbs}
                    onChange={(e) => setCustomForm({ ...customForm, carbs: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-ink dark:text-dusk-text mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    value={customForm.fat}
                    onChange={(e) => setCustomForm({ ...customForm, fat: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-squish w-full py-3 rounded-full bg-teal text-white font-display font-black text-xs border-2 border-ink shadow-sticker-xs cursor-pointer mt-2"
              >
                Save to Database
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
