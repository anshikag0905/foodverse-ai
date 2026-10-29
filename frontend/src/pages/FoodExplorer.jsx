import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Compass, Plus, Barcode, ShieldAlert, Check, X, AlertCircle, Globe, ChevronDown, Flame } from 'lucide-react';
import apiClient from '../services/api';
import BarcodeScanner from '../components/common/BarcodeScanner';
import MacroChart from '../components/common/MacroChart';
import AllergenAlert from '../components/common/AllergenAlert';
import { Loader } from '../components/common/Loader';
import { PREDEFINED_FOODS, searchPredefinedFoods } from '../data/predefinedFoods';

const INDIAN_STATES = [
  'All States',
  'Punjab',
  'Gujarat',
  'Maharashtra',
  'Tamil Nadu',
  'Kerala',
  'West Bengal',
  'Rajasthan',
  'Uttar Pradesh',
  'Bihar',
  'Andhra Pradesh',
  'Karnataka',
  'Odisha',
  'Kashmir',
  'Goa',
  'Himachal & Uttarakhand',
  'Assam & North East'
];

export default function FoodExplorer() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All'); // 'All', 'Indian', 'Japanese', 'USA'
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  // Convert PREDEFINED_FOODS into standard explorer format
  const getPredefinedList = () => {
    return PREDEFINED_FOODS.map(item => ({
      id: item.id,
      name: item.name,
      name_hi: item.name_hi || item.name,
      category: item.category,
      cuisine: item.cuisine || 'Global',
      state: item.state || '',
      calories: item.calories,
      protein: item.protein_g,
      carbs: item.carbs_g,
      fat: item.fat_g,
      fiber: item.fiber_g || 0,
      serving_size: item.serving,
      shelf_life_days: 7,
      allergens: item.gym_tags?.includes('dairy') || item.category?.includes('Dairy') ? ['Dairy'] : []
    }));
  };

  useEffect(() => {
    fetchFoods('', 'All', 'All', 'All States');
  }, []);

  const fetchFoods = async (
    query = searchTerm,
    cat = selectedCategory,
    reg = selectedRegion,
    st = selectedState
  ) => {
    setIsLoading(true);
    const predefinedFormatted = getPredefinedList();

    try {
      const params = {
        q: query,
        category: cat !== 'All' ? cat : undefined,
        limit: 100
      };
      const res = await apiClient.get('/foods/search', { params });
      let apiItems = Array.isArray(res) ? res : (res?.items || []);

      // Filter function matching region, state, category, and query
      const matchItem = (item) => {
        const nameMatch = !query ||
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          (item.name_hi && item.name_hi.includes(query)) ||
          (item.aliases && item.aliases.toLowerCase().includes(query.toLowerCase()));

        const catMatch = cat === 'All' || item.category === cat;

        let regMatch = true;
        if (reg === 'Indian') {
          regMatch = (item.cuisine && item.cuisine.toLowerCase().includes('india')) ||
                     (item.category && item.category.toLowerCase().includes('india')) ||
                     Boolean(item.state);
        } else if (reg === 'Japanese') {
          regMatch = (item.cuisine && item.cuisine.toLowerCase().includes('japan')) ||
                     (item.category && item.category.toLowerCase().includes('japan')) ||
                     item.name.toLowerCase().includes('ramen') ||
                     item.name.toLowerCase().includes('sushi') ||
                     item.name.toLowerCase().includes('miso') ||
                     item.name.toLowerCase().includes('edamame');
        } else if (reg === 'USA') {
          regMatch = (item.cuisine && (item.cuisine.toLowerCase().includes('usa') || item.cuisine.toLowerCase().includes('american') || item.cuisine.toLowerCase().includes('global') || item.cuisine.toLowerCase().includes('western'))) ||
                     (item.category && item.category.toLowerCase().includes('american'));
        }

        let stateMatch = true;
        if (reg === 'Indian' && st !== 'All States') {
          stateMatch = item.state === st ||
                       (item.aliases && item.aliases.toLowerCase().includes(st.toLowerCase())) ||
                       (item.category && item.category.toLowerCase().includes(st.toLowerCase()));
        }

        return nameMatch && catMatch && regMatch && stateMatch;
      };

      // Filter apiItems by region/state
      const filteredApiItems = apiItems.filter(matchItem);
      const existingNames = new Set(filteredApiItems.map(f => f.name.toLowerCase()));

      // Filter predefined items by region/state
      const filteredPredefined = predefinedFormatted.filter(item => {
        return matchItem(item) && !existingNames.has(item.name.toLowerCase());
      });

      setFoods([...filteredApiItems, ...filteredPredefined]);
    } catch (err) {
      console.warn("FoodExplorer fallback to predefined database:", err);
      const filtered = predefinedFormatted.filter(item => {
        const nameMatch = !query ||
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          (item.name_hi && item.name_hi.includes(query));

        let regMatch = true;
        if (reg === 'Indian') {
          regMatch = item.cuisine === 'Indian' || Boolean(item.state);
        } else if (reg === 'Japanese') {
          regMatch = item.cuisine === 'Japanese' || item.name.toLowerCase().includes('ramen') || item.name.toLowerCase().includes('sushi');
        } else if (reg === 'USA') {
          regMatch = item.cuisine === 'USA' || item.cuisine === 'Global';
        }

        let stateMatch = true;
        if (reg === 'Indian' && st !== 'All States') {
          stateMatch = item.state === st;
        }

        return nameMatch && regMatch && stateMatch;
      });
      setFoods(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    fetchFoods(val, selectedCategory, selectedRegion, selectedState);
  };

  const handleRegionSelect = (reg) => {
    setSelectedRegion(reg);
    if (reg !== 'Indian') setSelectedState('All States');
    fetchFoods(searchTerm, selectedCategory, reg, 'All States');
  };

  const handleStateSelect = (st) => {
    setSelectedState(st);
    fetchFoods(searchTerm, selectedCategory, selectedRegion, st);
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Module Header */}
      <div className="card-base p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
            <Compass className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
              Food & Regional Nutrition Explorer
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Explore 1,300+ authentic foods across Indian states, Japan, USA, and global fitness diets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setShowScanner(prev => !prev)}
            className="pill-btn-secondary text-xs py-1.5 px-3.5 cursor-pointer inline-flex items-center gap-1.5"
          >
            <Barcode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Barcode Scan</span>
          </button>
          <button
            onClick={() => setShowCustomModal(true)}
            className="pill-btn-primary text-xs py-1.5 px-3.5 cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Food</span>
          </button>
        </div>
      </div>

      {/* Barcode Scanner View */}
      {showScanner && (
        <div className="card-base p-6">
          <BarcodeScanner onScanSuccess={handleBarcodeScanned} />
        </div>
      )}

      {/* Regional Filters */}
      <div className="card-base p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5 mr-1">
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" strokeWidth={1.5} /> Region:
            </span>
            {[
              { id: 'All', label: 'All Cuisines' },
              { id: 'Indian', label: 'India (By States)' },
              { id: 'Japanese', label: 'Japan & Asian' },
              { id: 'USA', label: 'USA & Global' }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRegionSelect(r.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                  selectedRegion === r.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border-[var(--border-color)]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-[var(--text-muted)] font-mono">
            {foods.length} items found
          </span>
        </div>

        {/* State Dropdown if Indian Region is active */}
        {selectedRegion === 'Indian' && (
          <div className="pt-2 border-t border-[var(--border-color)] flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Filter Indian State:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {INDIAN_STATES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStateSelect(st)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] transition cursor-pointer ${
                    selectedState === st
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by food name, state, or ingredients (e.g. Tonkotsu Ramen, Sarson Saag, Texas Brisket, Misal Pav, Pesarattu)..."
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-blue-500 shadow-xs"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
      </div>

      {/* Food Grid / Results */}
      {isLoading ? (
        <Loader message="Searching regional culinary database..." subtext="Querying authentic recipes and nutritional profiles" />
      ) : foods.length === 0 ? (
        <div className="card-base p-12 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h4 className="font-semibold text-base text-[var(--text-primary)]">No Food Matches Found</h4>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            We couldn't find an exact match for "{searchTerm}" in this region. You can register it as a custom food!
          </p>
          <button
            onClick={() => {
              setCustomForm(prev => ({ ...prev, name: searchTerm }));
              setShowCustomModal(true);
            }}
            className="pill-btn-primary text-xs py-2 px-4 cursor-pointer inline-flex items-center gap-1.5"
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
              className="card-base p-5 flex flex-col justify-between gap-3 cursor-pointer hover:border-blue-500/50 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                    {food.state || food.category || food.cuisine}
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                    {Math.round(food.calories)} kcal
                  </span>
                </div>
                <h3 className="font-semibold text-base text-[var(--text-primary)] mt-2 group-hover:text-blue-600 transition-colors">
                  {isHindi && food.name_hi ? food.name_hi : food.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {food.serving_size || '1 standard portion'} • {food.cuisine || 'Global'}
                </p>
              </div>

              {/* Macro Bar */}
              <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-[var(--border-color)] text-center text-xs">
                <div className="p-1 rounded-lg bg-[var(--bg-card-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Protein</span>
                  <strong className="text-[var(--text-primary)] font-mono">{food.protein}g</strong>
                </div>
                <div className="p-1 rounded-lg bg-[var(--bg-card-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Carbs</span>
                  <strong className="text-[var(--text-primary)] font-mono">{food.carbs}g</strong>
                </div>
                <div className="p-1 rounded-lg bg-[var(--bg-card-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Fat</span>
                  <strong className="text-[var(--text-primary)] font-mono">{food.fat}g</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Food Detail Modal */}
      {selectedFood && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedFood(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-xl space-y-5 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-medium uppercase px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                  {selectedFood.state ? `${selectedFood.state} • ` : ''}{selectedFood.cuisine || 'Global'} • {selectedFood.category}
                </span>
                <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mt-1.5">
                  {isHindi && selectedFood.name_hi ? selectedFood.name_hi : selectedFood.name}
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Serving Size: {selectedFood.serving_size || '1 portion (150g)'}
                </p>
              </div>
              <button
                onClick={() => setSelectedFood(null)}
                className="p-1.5 rounded-full hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Macro Breakdown */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400">Calories</span>
                <p className="font-bold text-lg text-[var(--text-primary)] font-mono mt-0.5">
                  {Math.round(selectedFood.calories)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">Protein</span>
                <p className="font-bold text-lg text-[var(--text-primary)] font-mono mt-0.5">
                  {selectedFood.protein}g
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">Carbs</span>
                <p className="font-bold text-lg text-[var(--text-primary)] font-mono mt-0.5">
                  {selectedFood.carbs}g
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">Fat</span>
                <p className="font-bold text-lg text-[var(--text-primary)] font-mono mt-0.5">
                  {selectedFood.fat}g
                </p>
              </div>
            </div>

            {/* Macro Chart */}
            <MacroChart
              protein={selectedFood.protein}
              carbs={selectedFood.carbs}
              fat={selectedFood.fat}
              calories={selectedFood.calories}
            />

            {selectedFood.allergens && selectedFood.allergens.length > 0 && selectedFood.allergens[0] !== 'None' && (
              <AllergenAlert allergens={selectedFood.allergens} />
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedFood(null)}
                className="pill-btn-secondary text-xs py-2 px-5 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Food Modal */}
      {showCustomModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowCustomModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-xl space-y-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="font-semibold text-base text-[var(--text-primary)]">
                Register Custom Food
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-[var(--text-secondary)] block mb-1">Food Name (English)</label>
                <input
                  type="text"
                  required
                  value={customForm.name}
                  onChange={(e) => setCustomForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Soya Bhurji, Oats Pancake"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="font-medium text-[var(--text-secondary)] block mb-1">Hindi Name (Optional)</label>
                <input
                  type="text"
                  value={customForm.name_hi}
                  onChange={(e) => setCustomForm(prev => ({ ...prev, name_hi: e.target.value }))}
                  placeholder="e.g. सोया भुर्जी"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-[var(--text-secondary)] block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    value={customForm.calories}
                    onChange={(e) => setCustomForm(prev => ({ ...prev, calories: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="font-medium text-[var(--text-secondary)] block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={customForm.protein}
                    onChange={(e) => setCustomForm(prev => ({ ...prev, protein: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-[var(--text-secondary)] block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={customForm.carbs}
                    onChange={(e) => setCustomForm(prev => ({ ...prev, carbs: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="font-medium text-[var(--text-secondary)] block mb-1">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={customForm.fat}
                    onChange={(e) => setCustomForm(prev => ({ ...prev, fat: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="pill-btn-secondary text-xs py-1.5 px-3.5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pill-btn-primary text-xs py-1.5 px-4 cursor-pointer"
                >
                  Save Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
