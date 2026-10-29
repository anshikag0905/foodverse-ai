import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Compass, Plus, Barcode, ShieldAlert, Check, X, AlertCircle } from 'lucide-react';
import apiClient from '../services/api';
import BarcodeScanner from '../components/common/BarcodeScanner';
import MacroChart from '../components/common/MacroChart';
import AllergenAlert from '../components/common/AllergenAlert';
import { Loader } from '../components/common/Loader';

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

  // Load categories and initial food list
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, cuis] = await Promise.all([
          apiClient.get('/foods/categories'),
          apiClient.get('/foods/cuisines')
        ]);
        setCategories(['All', ...cats]);
        setCuisines(['All', ...cuis]);
      } catch (err) {
        console.error('Failed to load metadata', err);
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
      setFoods(res.items || []);
    } catch (err) {
      console.error(err);
      setFoods([]);
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

  const handleCuisineSelect = (cui) => {
    setSelectedCuisine(cui);
    fetchFoods(searchTerm, selectedCategory, cui);
  };

  const handleBarcodeScanned = async (code) => {
    setShowScanner(false);
    setIsLoading(true);
    try {
      const item = await apiClient.get(`/foods/barcode/${code}`);
      setSelectedFood(item);
    } catch (err) {
      alert(`Barcode ${code} not found in database. You can register it below!`);
      setCustomForm(prev => ({ ...prev, barcode: code }));
      setShowCustomModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...customForm,
        calories: Number(customForm.calories),
        protein: Number(customForm.protein),
        carbs: Number(customForm.carbs),
        fat: Number(customForm.fat),
        allergens: customForm.allergens ? customForm.allergens.split(',').map(s => s.trim()) : [],
        diet_tags: customForm.diet_tags ? customForm.diet_tags.split(',').map(s => s.trim()) : []
      };
      const created = await apiClient.post('/foods/custom', payload);
      setShowCustomModal(false);
      setSelectedFood(created);
      fetchFoods(customForm.name);
    } catch (err) {
      alert(err.message || 'Error saving custom food.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Compass className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <span>{t('nav.food_explorer')}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Search 20,000+ global food items, regional dishes, and barcodes with FTS5 full-text precision.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScanner(!showScanner)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 shadow-sm transition-all"
          >
            <Barcode className="w-4 h-4 text-emerald-600" />
            <span>Scan Barcode</span>
          </button>
          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Food</span>
          </button>
        </div>
      </div>

      {/* Barcode Scanner Modal Drawer */}
      {showScanner && (
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Barcode className="w-5 h-5 text-emerald-600" />
              <span>Camera Barcode Scanner</span>
            </h3>
            <button
              onClick={() => setShowScanner(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <BarcodeScanner onScanSuccess={handleBarcodeScanned} />
        </div>
      )}

      {/* Search Bar & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search foods, ingredients, or regional dishes (e.g., Paneer, Masala Dosa, Quinoa, Apple, Hummus)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          {categories.slice(0, 10).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all font-medium ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Grid / Results */}
      {isLoading ? (
        <Loader message="Searching nutritional database with FTS5..." />
      ) : foods.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Food Matches Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            We couldn't find an exact database match for "{searchTerm}". You can add it as a custom food entry!
          </p>
          <button
            onClick={() => {
              setCustomForm(prev => ({ ...prev, name: searchTerm }));
              setShowCustomModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white"
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
              className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft hover:shadow-md hover:border-emerald-500/50 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">
                    {isHindi && food.name_hi ? food.name_hi : food.name}
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {Math.round(food.calories)} kcal
                  </span>
                </div>
                {food.name_hi && !isHindi && (
                  <p className="text-xs text-slate-400 font-medium">{food.name_hi}</p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {food.category}
                  </span>
                  {food.cuisine && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {food.cuisine}
                    </span>
                  )}
                </div>
              </div>

              {/* Macro Bar summary */}
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>P: <strong>{food.protein}g</strong></span>
                <span>C: <strong>{food.carbs}g</strong></span>
                <span>F: <strong>{food.fat}g</strong></span>
                <span>Fib: <strong>{food.fiber}g</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedFood && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {selectedFood.name}
                </h2>
                {selectedFood.name_hi && (
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {selectedFood.name_hi}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {selectedFood.category}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {selectedFood.cuisine}
                  </span>
                  {selectedFood.barcode && (
                    <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      UPC: {selectedFood.barcode}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedFood(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Allergen Alert if allergens exist */}
            {selectedFood.allergens && selectedFood.allergens.length > 0 && (
              <AllergenAlert allergensDetected={selectedFood.allergens} />
            )}

            {/* Macro Chart */}
            <MacroChart
              calories={selectedFood.calories}
              protein={selectedFood.protein}
              carbs={selectedFood.carbs}
              fat={selectedFood.fat}
              fiber={selectedFood.fiber}
              servingSize={selectedFood.serving_size}
            />

            {/* Storage Hint & Meta */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <p><strong>Storage Advice:</strong> {selectedFood.storage_hint || "Refrigerate at 4°C."}</p>
              <p><strong>Estimated Shelf Life:</strong> {selectedFood.shelf_life_days} days</p>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                Source: {selectedFood.source} ({selectedFood.license})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Food Creation Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCustomSubmit}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Register Custom Food Entry
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2 space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Food Name (English)*</label>
                <input
                  type="text"
                  required
                  value={customForm.name}
                  onChange={e => setCustomForm({ ...customForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Hindi Name / Alias</label>
                <input
                  type="text"
                  value={customForm.name_hi}
                  onChange={e => setCustomForm({ ...customForm, name_hi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Barcode (optional)</label>
                <input
                  type="text"
                  value={customForm.barcode || ''}
                  onChange={e => setCustomForm({ ...customForm, barcode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Calories (kcal per 100g)*</label>
                <input
                  type="number"
                  required
                  value={customForm.calories}
                  onChange={e => setCustomForm({ ...customForm, calories: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Protein (g)*</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={customForm.protein}
                  onChange={e => setCustomForm({ ...customForm, protein: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Carbs (g)*</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={customForm.carbs}
                  onChange={e => setCustomForm({ ...customForm, carbs: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Fat (g)*</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={customForm.fat}
                  onChange={e => setCustomForm({ ...customForm, fat: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Allergens (comma-separated, e.g. peanuts, dairy)</label>
                <input
                  type="text"
                  value={customForm.allergens}
                  onChange={e => setCustomForm({ ...customForm, allergens: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              >
                Save Food
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
