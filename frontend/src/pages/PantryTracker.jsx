import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Refrigerator,
  Snowflake,
  Archive,
  ShoppingCart,
  Sparkles,
  Barcode,
  Calendar,
  Filter,
  RefreshCw,
  ChefHat
} from 'lucide-react';
import ExpiryBadge from '../components/common/ExpiryBadge';
import BarcodeScanner from '../components/common/BarcodeScanner';
import Loader from '../components/common/Loader';

export default function PantryTracker() {
  const [items, setItems] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [wasteSummary, setWasteSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'fridge', 'freezer', 'shelf', 'grocery', 'waste'

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeData, setRecipeData] = useState(null);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Produce',
    quantity: 1,
    unit: 'pcs',
    storage_location: 'fridge',
    days_shelf_life: 7,
    expiry_date: '',
  });

  // New grocery item input
  const [newGroceryName, setNewGroceryName] = useState('');

  useEffect(() => {
    fetchPantryData();
    fetchGroceries();
    fetchWasteSummary();
  }, []);

  const fetchPantryData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/v1/pantry');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch pantry items:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroceries = async () => {
    try {
      const res = await axios.get('/api/v1/grocery');
      setGroceries(res.data);
    } catch (err) {
      console.error('Failed to fetch grocery items:', err);
    }
  };

  const fetchWasteSummary = async () => {
    try {
      const res = await axios.get('/api/v1/pantry/waste-summary');
      setWasteSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch waste summary:', err);
    }
  };

  const handleSeedDemo = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/v1/pantry/seed-demo');
      setItems(res.data);
      await fetchWasteSummary();
    } catch (err) {
      console.error('Failed to seed demo pantry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    try {
      const payload = {
        name: newItem.name.trim(),
        category: newItem.category,
        quantity: parseFloat(newItem.quantity) || 1,
        unit: newItem.unit,
        storage_location: newItem.storage_location,
        days_shelf_life: parseInt(newItem.days_shelf_life) || 7,
      };
      if (newItem.expiry_date) {
        payload.expiry_date = new Date(newItem.expiry_date).toISOString();
      }

      await axios.post('/api/v1/pantry', payload);
      setShowAddModal(false);
      setNewItem({
        name: '',
        category: 'Produce',
        quantity: 1,
        unit: 'pcs',
        storage_location: 'fridge',
        days_shelf_life: 7,
        expiry_date: '',
      });
      fetchPantryData();
      fetchWasteSummary();
    } catch (err) {
      console.error('Failed to add pantry item:', err);
    }
  };

  const handleBarcodeDetected = (code) => {
    setShowBarcodeScanner(false);
    // Lookup barcode
    axios.get(`/api/v1/foods/barcode/${code}`)
      .then((res) => {
        if (res.data && res.data.food) {
          const f = res.data.food;
          setNewItem(prev => ({
            ...prev,
            name: f.name,
            category: f.category || 'General',
          }));
          setShowAddModal(true);
        } else {
          setNewItem(prev => ({ ...prev, name: `Scanned Item (${code})` }));
          setShowAddModal(true);
        }
      })
      .catch(() => {
        setNewItem(prev => ({ ...prev, name: `Scanned Item (${code})` }));
        setShowAddModal(true);
      });
  };

  const handleMarkUsed = async (id) => {
    try {
      await axios.post(`/api/v1/pantry/${id}/use`);
      fetchPantryData();
      fetchWasteSummary();
    } catch (err) {
      console.error('Failed to mark used:', err);
    }
  };

  const handleMarkWasted = async (id) => {
    try {
      await axios.post(`/api/v1/pantry/${id}/waste`);
      fetchPantryData();
      fetchWasteSummary();
    } catch (err) {
      console.error('Failed to mark wasted:', err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`/api/v1/pantry/${id}`);
      fetchPantryData();
      fetchWasteSummary();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  // Recipe suggestion from expiring
  const handleSuggestRecipes = async () => {
    setLoadingRecipes(true);
    setShowRecipeModal(true);
    try {
      const res = await axios.get('/api/v1/pantry/suggest-recipes');
      setRecipeData(res.data);
    } catch (err) {
      console.error('Failed to get recipes:', err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  // Add missing ingredients to grocery
  const handleAddMissingToGrocery = async (missingIngredients) => {
    try {
      await axios.post('/api/v1/grocery/add-missing', { ingredients: missingIngredients });
      fetchGroceries();
      alert(`Added ${missingIngredients.length} item(s) to your Grocery List!`);
    } catch (err) {
      console.error('Failed to add missing ingredients:', err);
    }
  };

  // Grocery functions
  const handleAddGrocery = async (e) => {
    e.preventDefault();
    if (!newGroceryName.trim()) return;
    try {
      await axios.post('/api/v1/grocery', {
        name: newGroceryName.trim(),
        quantity: 1,
        unit: 'pcs',
        category: 'Custom'
      });
      setNewGroceryName('');
      fetchGroceries();
    } catch (err) {
      console.error('Failed to add grocery:', err);
    }
  };

  const handleToggleGroceryChecked = async (item) => {
    try {
      await axios.put(`/api/v1/grocery/${item.id}`, { checked: !item.checked });
      fetchGroceries();
    } catch (err) {
      console.error('Failed to update grocery:', err);
    }
  };

  const handleDeleteGrocery = async (id) => {
    try {
      await axios.delete(`/api/v1/grocery/${id}`);
      fetchGroceries();
    } catch (err) {
      console.error('Failed to delete grocery:', err);
    }
  };

  const handleClearCheckedGroceries = async () => {
    try {
      await axios.post('/api/v1/grocery/clear-checked');
      fetchGroceries();
    } catch (err) {
      console.error('Failed to clear checked groceries:', err);
    }
  };

  // Filter items
  const activeItems = items.filter(it => !it.used_this_month && !it.wasted);
  const expiringItems = activeItems.filter(it => it.status === 'use_soon' || it.status === 'expired');

  const filteredItems = activeItems.filter(it => {
    if (activeTab === 'fridge') return it.storage_location === 'fridge';
    if (activeTab === 'freezer') return it.storage_location === 'freezer';
    if (activeTab === 'shelf') return it.storage_location === 'shelf';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Package className="w-3.5 h-3.5" />
            Zero-Waste Smart Kitchen
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pantry & Expiry Tracker
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Real-time shelf-life tracking, automated expiry warnings, and zero-waste recipe recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowBarcodeScanner(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
          >
            <Barcode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Scan Barcode
          </button>
          <button
            onClick={handleSeedDemo}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
            title="Populate realistic demo items (milk, spinach, bread, paneer, oats)"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            Seed Demo Pantry
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            Add Food Item
          </button>
        </div>
      </div>

      {/* Hero Expiring Banner / Action Center */}
      {expiringItems.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{expiringItems.length} item(s) expiring soon or expired</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-semibold">
                  Action Recommended
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Top urgent: <span className="font-semibold text-amber-600 dark:text-amber-400">{expiringItems.slice(0, 3).map(i => i.name).join(', ')}</span>. Use these first to prevent kitchen food waste.
              </p>
            </div>
          </div>
          <button
            onClick={handleSuggestRecipes}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 whitespace-nowrap transition"
          >
            <ChefHat className="w-4 h-4" />
            Cook From My Pantry
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'all'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          All Items ({activeItems.length})
        </button>
        <button
          onClick={() => setActiveTab('fridge')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'fridge'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Refrigerator className="w-4 h-4 text-sky-500" />
          Fridge ({activeItems.filter(i => i.storage_location === 'fridge').length})
        </button>
        <button
          onClick={() => setActiveTab('freezer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'freezer'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Snowflake className="w-4 h-4 text-blue-400" />
          Freezer ({activeItems.filter(i => i.storage_location === 'freezer').length})
        </button>
        <button
          onClick={() => setActiveTab('shelf')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'shelf'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Archive className="w-4 h-4 text-amber-500" />
          Shelf / Cupboard ({activeItems.filter(i => i.storage_location === 'shelf').length})
        </button>
        <button
          onClick={() => setActiveTab('grocery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'grocery'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4 text-purple-500" />
          Grocery List ({groceries.filter(g => !g.checked).length})
        </button>
        <button
          onClick={() => setActiveTab('waste')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === 'waste'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="w-4 h-4 text-rose-500" />
          Food Waste Tracker
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader text="Loading your kitchen inventory..." />
        </div>
      ) : activeTab === 'grocery' ? (
        /* GROCERY LIST TAB */
        <div className="space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Smart Grocery Checklist
            </h2>
            {groceries.some(g => g.checked) && (
              <button
                onClick={handleClearCheckedGroceries}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Clear Checked Items
              </button>
            )}
          </div>

          {/* Add Grocery Input */}
          <form onSubmit={handleAddGrocery} className="flex gap-2">
            <input
              type="text"
              value={newGroceryName}
              onChange={(e) => setNewGroceryName(e.target.value)}
              placeholder="Add item e.g. Extra Virgin Olive Oil, Brown Eggs..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition"
            >
              Add
            </button>
          </form>

          {/* Grocery items list */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
            {groceries.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                No items in your grocery list. Add one above or use "Cook from my Pantry" to import missing recipe ingredients.
              </div>
            ) : (
              groceries.map((g) => (
                <div
                  key={g.id}
                  className={`p-4 flex items-center justify-between transition ${
                    g.checked ? 'bg-slate-50 dark:bg-slate-800/40 text-slate-400' : ''
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={g.checked}
                      onChange={() => handleToggleGroceryChecked(g)}
                      className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className={`text-sm font-medium ${g.checked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {g.name}
                    </span>
                    {g.category && g.category !== 'Custom' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-semibold">
                        {g.category}
                      </span>
                    )}
                  </label>
                  <button
                    onClick={() => handleDeleteGrocery(g.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : activeTab === 'waste' ? (
        /* FOOD WASTE TRACKER TAB */
        <div className="space-y-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Items Tracked</span>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {wasteSummary?.total_tracked || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Items Consumed</span>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {wasteSummary?.used_count || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase">Items Wasted</span>
              <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                {wasteSummary?.wasted_count || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">Kitchen Waste Rate</span>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {wasteSummary?.waste_percentage || 0}%
              </p>
            </div>
          </div>

          {/* Feedback message card */}
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Kitchen Sustainability Insight</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {wasteSummary?.message || "Keep logging consumed and discarded items to build long-term sustainability metrics."}
              </p>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Food Conservation Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">FIFO Storage Rule</span>
                Keep older purchases in front of newer items so they are reached first before their expiry date.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Freezer Preservation</span>
                Breads, berries, cooked beans, and chopped herbs can be frozen immediately to halt microbial decay for months.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Crisper Temperature</span>
                Maintain refrigerator crisper drawers between 1°C and 4°C to preserve vitamin C and leaf moisture.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* PANTRY INVENTORY GRID */
        <div className="space-y-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">No food items found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                No items logged in this storage category. Click "Add Food Item" or use "Seed Demo Pantry" to test with pre-filled groceries.
              </p>
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={handleSeedDemo}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                >
                  Seed Demo Items
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
                >
                  Add Food Item
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.category} • {item.quantity} {item.unit}
                        </span>
                      </div>
                      <ExpiryBadge
                        expiryDate={item.expiry_date}
                        daysLeft={item.days_remaining}
                        status={item.status}
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 capitalize font-medium">
                        {item.storage_location === 'fridge' && <Refrigerator className="w-3 h-3 text-sky-500" />}
                        {item.storage_location === 'freezer' && <Snowflake className="w-3 h-3 text-blue-400" />}
                        {item.storage_location === 'shelf' && <Archive className="w-3 h-3 text-amber-500" />}
                        {item.storage_location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Exp: {new Date(item.expiry_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMarkUsed(item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 transition"
                        title="Mark consumed (adds to sustainability score)"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Used
                      </button>
                      <button
                        onClick={() => handleMarkWasted(item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 transition"
                        title="Mark spoiled/wasted"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Wasted
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD ITEM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Add Food to Pantry
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Food Name
                </label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Greek Yogurt, Sourdough Bread..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Produce">Produce</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Meat & Seafood">Meat & Seafood</option>
                    <option value="Grains">Grains</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Storage Location
                  </label>
                  <select
                    value={newItem.storage_location}
                    onChange={(e) => setNewItem({ ...newItem, storage_location: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="fridge">Fridge</option>
                    <option value="freezer">Freezer</option>
                    <option value="shelf">Shelf / Cupboard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    placeholder="pcs, g, kg, liter"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Shelf Life (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newItem.days_shelf_life}
                    onChange={(e) => setNewItem({ ...newItem, days_shelf_life: e.target.value, expiry_date: '' })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Specific Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newItem.expiry_date}
                    onChange={(e) => setNewItem({ ...newItem, expiry_date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BARCODE SCANNER MODAL */}
      {showBarcodeScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Scan Food Barcode
              </h3>
              <button
                onClick={() => setShowBarcodeScanner(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <BarcodeScanner
              onDetected={handleBarcodeDetected}
              onClose={() => setShowBarcodeScanner(false)}
            />
          </div>
        </div>
      )}

      {/* COOK FROM MY PANTRY RECIPES MODAL */}
      {showRecipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-2xl w-full shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Zero-Waste Recipe Recommendations
                </h3>
              </div>
              <button
                onClick={() => setShowRecipeModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {loadingRecipes ? (
              <div className="py-12 flex justify-center">
                <Loader text="Crafting delicious recipes to use your expiring ingredients..." />
              </div>
            ) : recipeData?.recipes ? (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {recipeData.recipes.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {rec.title}
                      </h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold whitespace-nowrap">
                        ⏱ {rec.prep_time || '10m'} prep • {rec.cook_time || '15m'} cook
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                      "{rec.explanation}"
                    </p>

                    <div className="text-xs space-y-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        Pantry Ingredients Used:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {rec.pantry_ingredients_used?.map((ing, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]"
                          >
                            ✓ {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {rec.missing_ingredients && rec.missing_ingredients.length > 0 && (
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-700/60">
                        <div className="text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            Missing ({rec.missing_ingredients.length}):
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {rec.missing_ingredients.join(', ')}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAddMissingToGrocery(rec.missing_ingredients)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs whitespace-nowrap shadow-sm transition"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add Missing to Grocery
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                No recipes could be generated at this time.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
