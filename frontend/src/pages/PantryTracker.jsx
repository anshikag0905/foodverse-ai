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
  ChefHat,
  ArrowRight
} from 'lucide-react';
import ExpiryBadge from '../components/common/ExpiryBadge';
import BarcodeScanner from '../components/common/BarcodeScanner';
import Loader from '../components/common/Loader';

const SEED_PANTRY_ITEMS = [
  {
    id: 1,
    name: 'Whole Milk (Organic)',
    category: 'Dairy',
    quantity: 1,
    unit: 'liters',
    storage_location: 'fridge',
    days_shelf_life: 7,
    status: 'Fresh',
    days_remaining: 5,
    purchase_date: new Date(Date.now() - 2 * 86400000).toISOString(),
    expiry_date: new Date(Date.now() + 5 * 86400000).toISOString(),
    is_active: true
  },
  {
    id: 2,
    name: 'Fresh Baby Spinach',
    category: 'Produce',
    quantity: 200,
    unit: 'grams',
    storage_location: 'fridge',
    days_shelf_life: 5,
    status: 'Use Soon',
    days_remaining: 1,
    purchase_date: new Date(Date.now() - 4 * 86400000).toISOString(),
    expiry_date: new Date(Date.now() + 1 * 86400000).toISOString(),
    is_active: true
  },
  {
    id: 3,
    name: 'Ripe Bananas',
    category: 'Produce',
    quantity: 6,
    unit: 'pcs',
    storage_location: 'shelf',
    days_shelf_life: 6,
    status: 'Fresh',
    days_remaining: 4,
    purchase_date: new Date(Date.now() - 1 * 86400000).toISOString(),
    expiry_date: new Date(Date.now() + 4 * 86400000).toISOString(),
    is_active: true
  },
  {
    id: 4,
    name: 'Greek Yogurt (Plain)',
    category: 'Dairy',
    quantity: 400,
    unit: 'grams',
    storage_location: 'fridge',
    days_shelf_life: 14,
    status: 'Fresh',
    days_remaining: 9,
    purchase_date: new Date(Date.now() - 3 * 86400000).toISOString(),
    expiry_date: new Date(Date.now() + 9 * 86400000).toISOString(),
    is_active: true
  },
  {
    id: 5,
    name: 'Brown Basmati Rice',
    category: 'Grains',
    quantity: 1,
    unit: 'kg',
    storage_location: 'shelf',
    days_shelf_life: 180,
    status: 'Fresh',
    days_remaining: 150,
    purchase_date: new Date(Date.now() - 15 * 86400000).toISOString(),
    expiry_date: new Date(Date.now() + 150 * 86400000).toISOString(),
    is_active: true
  }
];

const SEED_GROCERIES = [
  { id: 101, name: 'Free-range Eggs (Dozen)', category: 'Dairy & Eggs', is_bought: false },
  { id: 102, name: 'Rolled Oats (1kg)', category: 'Grains', is_bought: false },
  { id: 103, name: 'Natural Peanut Butter', category: 'Spreads', is_bought: true },
  { id: 104, name: 'Whey Protein Isolate', category: 'Supplements', is_bought: false }
];

const getLocalPantry = () => {
  try {
    const raw = localStorage.getItem('foodverse_pantry_items');
    return raw ? JSON.parse(raw) : SEED_PANTRY_ITEMS;
  } catch {
    return SEED_PANTRY_ITEMS;
  }
};

const saveLocalPantry = (items) => {
  try {
    localStorage.setItem('foodverse_pantry_items', JSON.stringify(items));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
};

const getLocalGroceries = () => {
  try {
    const raw = localStorage.getItem('foodverse_grocery_items');
    return raw ? JSON.parse(raw) : SEED_GROCERIES;
  } catch {
    return SEED_GROCERIES;
  }
};

const saveLocalGroceries = (items) => {
  try {
    localStorage.setItem('foodverse_grocery_items', JSON.stringify(items));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
};

export default function PantryTracker() {
  const [items, setItems] = useState(getLocalPantry);
  const [groceries, setGroceries] = useState(getLocalGroceries);
  const [wasteSummary, setWasteSummary] = useState(null);
  const [loading, setLoading] = useState(false);
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
    try {
      const res = await axios.get('/api/v1/pantry');
      if (res.data && res.data.length > 0) {
        setItems(res.data);
        saveLocalPantry(res.data);
      }
    } catch (err) {
      console.warn('Pantry API offline, using local persistent pantry:', err);
    }
  };

  const fetchGroceries = async () => {
    try {
      const res = await axios.get('/api/v1/grocery');
      if (res.data && res.data.length > 0) {
        setGroceries(res.data);
        saveLocalGroceries(res.data);
      }
    } catch (err) {
      console.warn('Grocery API offline, using local persistent groceries:', err);
    }
  };

  const fetchWasteSummary = async () => {
    try {
      const res = await axios.get('/api/v1/pantry/waste-summary');
      setWasteSummary(res.data);
    } catch (err) {
      // Local fallback calculation
      const current = getLocalPantry();
      const wasted = current.filter(i => i.status === 'Expired').length;
      const total = current.length;
      setWasteSummary({
        total_items_tracked: total,
        items_consumed: Math.max(0, total - wasted),
        items_wasted: wasted,
        waste_rate_percent: total > 0 ? Math.round((wasted / total) * 100) : 0,
        estimated_money_wasted_usd: wasted * 3.5
      });
    }
  };

  const handleSeedDemo = async () => {
    setItems(SEED_PANTRY_ITEMS);
    saveLocalPantry(SEED_PANTRY_ITEMS);
    try {
      await axios.post('/api/v1/pantry/seed-demo');
    } catch (err) {
      console.warn('API seed demo fallback:', err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    const shelfLife = parseInt(newItem.days_shelf_life) || 7;
    let expDate = null;
    let daysRemaining = shelfLife;
    let itemStatus = 'Fresh';

    if (newItem.expiry_date) {
      const parsedExp = new Date(newItem.expiry_date);
      expDate = parsedExp.toISOString();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      parsedExp.setHours(0, 0, 0, 0);
      daysRemaining = Math.ceil((parsedExp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysRemaining < 0) {
        itemStatus = 'Expired';
      } else if (daysRemaining <= 2) {
        itemStatus = 'Use Soon';
      } else {
        itemStatus = 'Fresh';
      }
    } else {
      expDate = new Date(Date.now() + shelfLife * 86400000).toISOString();
      daysRemaining = shelfLife;
      itemStatus = shelfLife <= 2 ? 'Use Soon' : 'Fresh';
    }

    const createdItem = {
      id: Date.now(),
      name: newItem.name.trim(),
      category: newItem.category,
      quantity: parseFloat(newItem.quantity) || 1,
      unit: newItem.unit,
      storage_location: newItem.storage_location,
      days_shelf_life: shelfLife,
      purchase_date: new Date().toISOString(),
      expiry_date: expDate,
      days_remaining: daysRemaining,
      status: itemStatus,
      is_active: true
    };

    // 1. Immediately update state and save to localStorage
    const updated = [createdItem, ...items];
    setItems(updated);
    saveLocalPantry(updated);
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

    // 2. Post to backend in background
    try {
      await axios.post('/api/v1/pantry', {
        name: createdItem.name,
        category: createdItem.category,
        quantity: createdItem.quantity,
        unit: createdItem.unit,
        storage_location: createdItem.storage_location,
        days_shelf_life: createdItem.days_shelf_life,
        expiry_date: createdItem.expiry_date
      });
    } catch (err) {
      console.warn('Backend offline, pantry item safely persisted locally:', err);
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
    const updated = items.map(item => item.id === id ? { ...item, status: 'Consumed', is_active: false } : item);
    setItems(updated);
    saveLocalPantry(updated);
    try {
      await axios.post(`/api/v1/pantry/${id}/use`);
    } catch (err) {
      console.warn('API sync deferred for mark used:', err);
    }
  };

  const handleMarkWasted = async (id) => {
    const updated = items.map(item => item.id === id ? { ...item, status: 'Expired', is_active: false } : item);
    setItems(updated);
    saveLocalPantry(updated);
    try {
      await axios.post(`/api/v1/pantry/${id}/waste`);
    } catch (err) {
      console.warn('API sync deferred for mark wasted:', err);
    }
  };

  const handleDeleteItem = async (id) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    saveLocalPantry(updated);
    try {
      await axios.delete(`/api/v1/pantry/${id}`);
    } catch (err) {
      console.warn('API sync deferred for delete:', err);
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
      console.warn('Backend recipe suggestion offline, providing smart suggestions:', err);
      setRecipeData({
        expiring_ingredients_used: ['Fresh Baby Spinach', 'Whole Milk (Organic)'],
        suggested_recipes: [
          {
            title: 'Creamy Garlic Spinach & Ricotta Pasta',
            match_percentage: 92,
            prep_time_minutes: 15,
            cook_time_minutes: 15,
            missing_ingredients: ['Pasta', 'Garlic', 'Parmesan'],
            instructions: [
              'Boil pasta in salted water until al dente.',
              'Saute fresh baby spinach in a warm pan with a touch of olive oil.',
              'Pour in milk and simmer until velvety, then toss with pasta!'
            ]
          },
          {
            title: 'Fluffy Green Power Spinach Omelet',
            match_percentage: 88,
            prep_time_minutes: 5,
            cook_time_minutes: 8,
            missing_ingredients: ['Eggs', 'Butter'],
            instructions: [
              'Whisk 2 eggs with a splash of milk.',
              'Fold in tender baby spinach leaves.',
              'Cook gently on medium-low until golden and fluffy!'
            ]
          }
        ]
      });
    } finally {
      setLoadingRecipes(false);
    }
  };

  // Add missing ingredients to grocery
  const handleAddMissingToGrocery = async (missingIngredients) => {
    const newItems = missingIngredients.map((name, i) => ({
      id: Date.now() + i,
      name,
      category: 'Pantry Recipe Need',
      is_bought: false
    }));
    const updated = [...groceries, ...newItems];
    setGroceries(updated);
    saveLocalGroceries(updated);
    alert(`Added ${missingIngredients.length} item(s) to your Grocery List!`);
    try {
      await axios.post('/api/v1/grocery/add-missing', { ingredients: missingIngredients });
    } catch (err) {
      console.warn('API missing items deferred:', err);
    }
  };

  // Grocery functions
  const handleAddGrocery = async (e) => {
    e.preventDefault();
    if (!newGroceryName.trim()) return;
    const newItem = {
      id: Date.now(),
      name: newGroceryName.trim(),
      category: 'Custom',
      is_bought: false,
      quantity: 1,
      unit: 'pcs'
    };
    const updated = [newItem, ...groceries];
    setGroceries(updated);
    saveLocalGroceries(updated);
    setNewGroceryName('');
    try {
      await axios.post('/api/v1/grocery', {
        name: newItem.name,
        quantity: 1,
        unit: 'pcs',
        category: 'Custom'
      });
    } catch (err) {
      console.warn('API grocery save deferred:', err);
    }
  };

  const handleToggleGroceryChecked = async (item) => {
    const updated = groceries.map(g => g.id === item.id ? { ...g, is_bought: !g.is_bought } : g);
    setGroceries(updated);
    saveLocalGroceries(updated);
    try {
      await axios.put(`/api/v1/grocery/${item.id}`, { checked: !item.is_bought });
    } catch (err) {
      console.warn('API grocery toggle deferred:', err);
    }
  };

  const handleDeleteGrocery = async (id) => {
    const updated = groceries.filter(g => g.id !== id);
    setGroceries(updated);
    saveLocalGroceries(updated);
    try {
      await axios.delete(`/api/v1/grocery/${id}`);
    } catch (err) {
      console.warn('API grocery delete deferred:', err);
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Module Header */}
      <div className="card-base p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
            <Package className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
              Pantry & Expiry Tracker
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Track fridge and shelf expiration countdowns, scan barcodes, and eliminate household food waste.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
          <button
            type="button"
            onClick={() => setShowBarcodeScanner(true)}
            className="pill-btn-secondary text-xs py-1.5 px-3.5 cursor-pointer"
          >
            <Barcode className="w-4 h-4 text-tomato" />
            <span>Barcode</span>
          </button>
          <button
            onClick={handleSeedDemo}
            className="btn-squish inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display font-black bg-white dark:bg-dusk-surface border-2 border-ink text-ink dark:text-dusk-text shadow-sticker-xs cursor-pointer hover:border-peach"
            title="Populate demo items"
          >
            <RefreshCw className="w-3.5 h-3.5 text-peach" />
            <span>Seed Pantry</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-squish inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-display font-black bg-peach text-ink border-2 border-ink shadow-sticker-xs cursor-pointer hover:shadow-sticker"
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
          <span className="w-6 h-6 rounded-full bg-peach text-ink border border-ink flex items-center justify-center font-display font-black text-xs flex-shrink-0">
            1
          </span>
          <span>Log items manually, scan barcodes, or import from scans</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-dusk-card border-2 border-ink shadow-sticker-xs flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-sunny text-ink border border-ink flex items-center justify-center font-display font-black text-xs flex-shrink-0">
            2
          </span>
          <span>Automatic countdown alerts for Fridge, Freezer & Shelf</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-dusk-card border-2 border-ink shadow-sticker-xs flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-mint text-ink border border-ink flex items-center justify-center font-display font-black text-xs flex-shrink-0">
            3
          </span>
          <span>Tap "Cook From Pantry" to turn expiring foods into meals</span>
        </div>
      </div>

      {/* Hero Expiring Banner */}
      {expiringItems.length > 0 && (
        <div className="bg-amber-100 dark:bg-amber-950/60 border-2.5 border-ink rounded-3xl p-5 shadow-sticker-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-sunny border-2 border-ink shadow-xs">
              <AlertTriangle className="w-5 h-5 text-ink" />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-ink dark:text-amber-200 flex items-center gap-2">
                <span>{expiringItems.length} item(s) expiring soon or expired</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-ink font-bold text-ink">
                  Urgent
                </span>
              </h3>
              <p className="text-xs font-semibold text-ink/80 dark:text-amber-300 mt-0.5">
                Top items: <span className="font-bold text-amber-900 dark:text-amber-100">{expiringItems.slice(0, 3).map(i => i.name).join(', ')}</span>. Use first to prevent kitchen waste!
              </p>
            </div>
          </div>
          <button
            onClick={handleSuggestRecipes}
            className="btn-squish inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sunny text-ink font-display font-black text-xs border-2 border-ink shadow-sticker-xs cursor-pointer whitespace-nowrap"
          >
            <ChefHat className="w-4 h-4" />
            <span>View Recipes for Expiring Items</span>
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('all')}
          className={`btn-squish flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-peach text-ink shadow-sticker-xs'
              : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-peach/10'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>All Items ({activeItems.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('fridge')}
          className={`btn-squish flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
            activeTab === 'fridge'
              ? 'bg-peach text-ink shadow-sticker-xs'
              : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-peach/10'
          }`}
        >
          <Refrigerator className="w-4 h-4 text-sky-500" />
          <span>Fridge ({activeItems.filter(i => i.storage_location === 'fridge').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('freezer')}
          className={`btn-squish flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
            activeTab === 'freezer'
              ? 'bg-peach text-ink shadow-sticker-xs'
              : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-peach/10'
          }`}
        >
          <Snowflake className="w-4 h-4 text-blue-500" />
          <span>Freezer ({activeItems.filter(i => i.storage_location === 'freezer').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('shelf')}
          className={`btn-squish flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
            activeTab === 'shelf'
              ? 'bg-peach text-ink shadow-sticker-xs'
              : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-peach/10'
          }`}
        >
          <Archive className="w-4 h-4 text-amber-500" />
          <span>Shelf ({activeItems.filter(i => i.storage_location === 'shelf').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('grocery')}
          className={`btn-squish flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
            activeTab === 'grocery'
              ? 'bg-peach text-ink shadow-sticker-xs'
              : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-peach/10'
          }`}
        >
          <ShoppingCart className="w-4 h-4 text-grape" />
          <span>Grocery List ({groceries.filter(g => !g.checked).length})</span>
        </button>
        <button
          onClick={() => setActiveTab('waste')}
          className={`btn-squish flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer whitespace-nowrap ${
            activeTab === 'waste'
              ? 'bg-peach text-ink shadow-sticker-xs'
              : 'bg-white dark:bg-dusk-card text-ink dark:text-dusk-text hover:bg-peach/10'
          }`}
        >
          <Flame className="w-4 h-4 text-tomato" />
          <span>Waste Tracker</span>
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
                        daysLeft={
                          item.expiry_date
                            ? Math.ceil((new Date(item.expiry_date).getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24))
                            : item.days_remaining
                        }
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
