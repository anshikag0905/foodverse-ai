import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Compass, Plus, Barcode, ShieldAlert, Check, X, AlertCircle, Sparkles, Globe } from 'lucide-react';
import apiClient from '../services/api';
import BarcodeScanner from '../components/common/BarcodeScanner';
import MacroChart from '../components/common/MacroChart';
import AllergenAlert from '../components/common/AllergenAlert';
import { Loader } from '../components/common/Loader';
import { DoodleSalad, DoodleAvocado } from '../assets/doodles';
import { PREDEFINED_FOODS, searchPredefinedFoods } from '../data/predefinedFoods';

export default function FoodExplorer() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All'); // 'All', 'Indian', 'Japanese', 'USA'
  const [categories, setCategories] = useState(['All', 'Gym Protein', 'Fruits & Carbs', 'Indian Sabzi', 'Indian Dal', 'Japanese Noodle', 'Japanese Sushi', 'Dairy & Probiotics']);
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

  // Convert PREDEFINED_FOODS format to FoodExplorer standard format
  const getPredefinedList = () => {
    return PREDEFINED_FOODS.map(item => ({
      id: item.id,
      name: item.name,
      name_hi: item.name_hi || item.name,
      category: item.category,
      cuisine: item.cuisine || 'Global',
      calories: item.calories,
      protein: item.protein_g,
      carbs: item.carbs_g,
      fat: item.fat_g,
      fiber: item.fiber_g || 0,
      serving_size: item.serving,
      shelf_life_days: 7,
      allergens: item.gym_tags?.includes('dairy') || item.category.includes('Dairy') ? ['Dairy'] : []
    }));
  };

  useEffect(() => {
    fetchFoods('', 'All', 'All');
  }, []);

  const fetchFoods = async (query = searchTerm, cat = selectedCategory, reg = selectedRegion) => {
    setIsLoading(true);
    const predefinedFormatted = getPredefinedList();

    try {
      const params = {
        q: query,
        category: cat !== 'All' ? cat : undefined,
        limit: 50
      };
      const res = await apiClient.get('/foods/search', { params });
      let apiItems = Array.isArray(res) ? res : (res?.items || []);

      // Merge API results with rich predefined foods (deduplicating by name)
      const existingNames = new Set(apiItems.map(f => f.name.toLowerCase()));
      const filteredPredefined = predefinedFormatted.filter(item => {
        const matchesQuery = !query || 
          item.name.toLowerCase().includes(query.toLowerCase()) || 
          (item.name_hi && item.name_hi.includes(query));
        const matchesCat = cat === 'All' || item.category === cat;
        const matchesReg = reg === 'All' || 
          (reg === 'Indian' && (item.cuisine?.toLowerCase().includes('india') || item.category.toLowerCase().includes('india'))) ||
          (reg === 'Japanese' && item.cuisine?.toLowerCase().includes('japan')) ||
          (reg === 'USA' && (item.cuisine?.toLowerCase().includes('western') || item.cuisine?.toLowerCase().includes('global')));
        return matchesQuery && matchesCat && matchesReg && !existingNames.has(item.name.toLowerCase());
      });

      setFoods([...apiItems, ...filteredPredefined]);
    } catch (err) {
      // Local fallback using full rich predefined database
      const filtered = predefinedFormatted.filter(item => {
        const matchesQuery = !query || 
          item.name.toLowerCase().includes(query.toLowerCase()) || 
          (item.name_hi && item.name_hi.includes(query));
        const matchesCat = cat === 'All' || item.category === cat;
        const matchesReg = reg === 'All' || 
          (reg === 'Indian' && (item.cuisine?.toLowerCase().includes('india') || item.category.toLowerCase().includes('india'))) ||
          (reg === 'Japanese' && item.cuisine?.toLowerCase().includes('japan')) ||
          (reg === 'USA' && (item.cuisine?.toLowerCase().includes('western') || item.cuisine?.toLowerCase().includes('global')));
        return matchesQuery && matchesCat && matchesReg;
      });
      setFoods(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    fetchFoods(val, selectedCategory, selectedRegion);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    fetchFoods(searchTerm, cat, selectedRegion);
  };

  const handleRegionSelect = (reg) => {
    setSelectedRegion(reg);
    fetchFoods(searchTerm, selectedCategory, reg);
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
    const newEntry = {
      id: Date.now(),
      name: customForm.name,
      name_hi: customForm.name_hi || customForm.name,
      category: customForm.category,
      cuisine: customForm.cuisine,
      calories: parseFloat(customForm.calories) || 0,
      protein: parseFloat(customForm.protein) || 0,
      carbs: parseFloat(customForm.carbs) || 0,
      fat: parseFloat(customForm.fat) || 0,
      fiber: 0,
      serving_size: '1 serving (150g)',
      shelf_life_days: 5,
      allergens: customForm.allergens ? customForm.allergens.split(',').map(s => s.trim()) : []
    };
    try {
      await apiClient.post('/foods/custom', customForm);
    } catch (err) {
      console.warn('Saved custom food locally');
    }
    setFoods(prev => [newEntry, ...prev]);
    setShowCustomModal(false);
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
              <span>USDA & Regional Intelligence</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-ink dark:text-dusk-text mt-1">
              Food & Nutrition Explorer
            </h1>
            <p className="text-xs font-semibold text-ink-muted mt-0.5">
              Explore 1,000+ authentic foods from India 🇮🇳, Japan 🇯🇵, USA 🇺🇸, and global fitness diets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto flex-wrap">
          <button
            onClick={() => setShowScanner(prev => !prev)}
            className="btn-squish inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-dusk-surface border-2 border-ink text-xs font-display font-black text-ink dark:text-dusk-text shadow-sticker-xs cursor-pointer hover:shadow-sticker"
          >
            <Barcode className="w-4 h-4 text-teal" />
            <span>Barcode Scan</span>
          </button>
          <button
            onClick={() => setShowCustomModal(true)}
            className="btn-squish inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-teal text-white border-2 border-ink text-xs font-display font-black shadow-sticker-xs cursor-pointer hover:shadow-sticker"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Food</span>
          </button>
        </div>
      </div>

      {/* Barcode Scanner Modal Dropdown */}
      {showScanner && (
        <div className="p-6 rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink shadow-sticker">
          <BarcodeScanner onScanSuccess={handleBarcodeScanned} />
        </div>
      )}

      {/* Regional Quick Filter Pills (India, Japan, USA, All) */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-black text-ink-muted flex items-center gap-1.5 mr-1">
          <Globe className="w-4 h-4 text-teal" /> Region:
        </span>
        {[
          { id: 'All', label: '🌐 All Regions' },
          { id: 'Indian', label: '🇮🇳 India & Desi Gym' },
          { id: 'Japanese', label: '🇯🇵 Japan & Ramen' },
          { id: 'USA', label: '🇺🇸 USA & Fitness' }
        ].map((r) => (
          <button
            key={r.id}
            onClick={() => handleRegionSelect(r.id)}
            className={`btn-squish px-4 py-1.5 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer ${
              selectedRegion === r.id
                ? 'bg-ink text-white shadow-sticker-xs'
                : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-ink/5'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Search Input & Category Filter Pills */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search foods (e.g. Banana, Aloo Sabzi, Soya Chunks, Ramen, Paneer, Whey, Edamame)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-xs sm:text-sm font-bold border-2.5 border-ink bg-white dark:bg-dusk-card text-ink dark:text-dusk-text placeholder:text-ink-muted shadow-sticker-xs focus:outline-none focus:border-teal"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="font-black text-ink-muted flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
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
        <Loader message="Searching nutritional database..." type="donut" />
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
          {foods.map((food, idx) => (
            <div
              key={food.id || idx}
              onClick={() => setSelectedFood(food)}
              className="btn-squish p-5 rounded-3xl border-2.5 border-ink bg-white dark:bg-dusk-card shadow-sticker hover:border-teal transition-all cursor-pointer flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal/15 text-teal border border-ink">
                    {food.category || 'Food'}
                  </span>
                  <span className="text-xs font-black text-tomato">
                    {Math.round(food.calories)} kcal
                  </span>
                </div>
                <h3 className="font-display font-black text-base text-ink dark:text-dusk-text mt-2 group-hover:text-teal transition-colors">
                  {isHindi && food.name_hi ? food.name_hi : food.name}
                </h3>
                <p className="text-xs font-semibold text-ink-muted">
                  {food.serving_size || '1 serving'} • {food.cuisine || 'Global'}
                </p>
              </div>

              {/* Macro Pills Bar */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t-2 border-ink/10 text-center text-[11px] font-black">
                <div className="p-1 rounded-xl bg-grape/10 text-grape">
                  P: {food.protein}g
                </div>
                <div className="p-1 rounded-xl bg-amber-500/10 text-amber-600">
                  C: {food.carbs}g
                </div>
                <div className="p-1 rounded-xl bg-orange-500/10 text-orange-600">
                  F: {food.fat}g
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Food Detail Bottom Sheet / Modal */}
      {selectedFood && (
        <div
          className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedFood(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-6 shadow-sticker space-y-5 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal/20 text-teal border border-ink">
                  {selectedFood.cuisine || 'Global'} • {selectedFood.category}
                </span>
                <h2 className="font-display font-black text-2xl text-ink dark:text-dusk-text mt-1.5">
                  {isHindi && selectedFood.name_hi ? selectedFood.name_hi : selectedFood.name}
                </h2>
                <p className="text-xs font-semibold text-ink-muted">
                  Serving Size: {selectedFood.serving_size || '1 portion (150g)'}
                </p>
              </div>
              <button
                onClick={() => setSelectedFood(null)}
                className="btn-squish p-1.5 rounded-full border-2 border-ink text-ink dark:text-dusk-text hover:bg-tomato hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nutrition Macro Chart */}
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-dusk-surface border-2 border-ink">
              <MacroChart
                calories={selectedFood.calories}
                protein={selectedFood.protein}
                carbs={selectedFood.carbs}
                fat={selectedFood.fat}
                fiber={selectedFood.fiber || 0}
              />
            </div>

            {/* Allergens warning */}
            {selectedFood.allergens && selectedFood.allergens.length > 0 && (
              <AllergenAlert allergens={selectedFood.allergens} />
            )}

            <button
              onClick={() => setSelectedFood(null)}
              className="btn-squish w-full py-3 rounded-full bg-ink text-white dark:bg-dusk-surface font-display font-black text-xs border-2 border-ink shadow-sticker-xs cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Food Modal */}
      {showCustomModal && (
        <div
          className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowCustomModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-6 shadow-sticker space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-lg text-ink dark:text-dusk-text">
                Register New Custom Food
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="btn-squish p-1.5 rounded-full border-2 border-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                  Food Name
                </label>
                <input
                  type="text"
                  required
                  value={customForm.name}
                  onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                  placeholder="e.g. Masala Oats with Eggs"
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    required
                    value={customForm.calories}
                    onChange={(e) => setCustomForm({ ...customForm, calories: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={customForm.protein}
                    onChange={(e) => setCustomForm({ ...customForm, protein: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={customForm.carbs}
                    onChange={(e) => setCustomForm({ ...customForm, carbs: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink dark:text-dusk-text mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={customForm.fat}
                    onChange={(e) => setCustomForm({ ...customForm, fat: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-ink bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-squish w-full py-3 rounded-full bg-teal text-white font-display font-black text-xs border-2 border-ink shadow-sticker-xs cursor-pointer mt-2"
              >
                Save to Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
