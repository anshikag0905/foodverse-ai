import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  Shield,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Languages,
  Moon,
  Sun,
  Laptop,
  Lock,
  HeartHandshake
} from 'lucide-react';
import Loader from '../components/common/Loader';

const ALLERGEN_OPTIONS = [
  'Peanuts',
  'Tree Nuts',
  'Milk / Lactose',
  'Eggs',
  'Wheat / Gluten',
  'Soy',
  'Fish',
  'Shellfish',
  'Sesame',
  'Mustard',
  'Sulfites'
];

const DIET_OPTIONS = [
  { id: 'omnivore', label: 'Omnivore (No Restrictions)' },
  { id: 'vegetarian', label: 'Vegetarian (Lacto-Ovo)' },
  { id: 'vegan', label: 'Vegan (Strict Plant-Based)' },
  { id: 'jain', label: 'Jain (No Root Vegetables/Garlic/Onion)' },
  { id: 'halal', label: 'Halal' },
  { id: 'kosher', label: 'Kosher' },
  { id: 'gluten_free', label: 'Gluten-Free (Celiac Safe)' },
  { id: 'keto', label: 'Ketogenic (Low Carb)' },
];

export default function SettingsPrivacy() {
  const { t, i18n } = useTranslation();

  // Local state persisted in localStorage
  const [allergens, setAllergens] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('foodverse_allergens') || '["Peanuts"]');
    } catch {
      return ['Peanuts'];
    }
  });

  const [diet, setDiet] = useState(() => {
    return localStorage.getItem('foodverse_diet') || 'omnivore';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('foodverse_theme') || 'system';
  });

  const [language, setLanguage] = useState(() => {
    return i18n.language || 'en';
  });

  const [notice, setNotice] = useState(null);
  const [loadingExport, setLoadingExport] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchPrivacyNotice();
  }, []);

  const fetchPrivacyNotice = async () => {
    try {
      const res = await axios.get('/api/v1/privacy/notice');
      setNotice(res.data);
    } catch (err) {
      console.error('Failed to fetch privacy notice:', err);
    }
  };

  const handleToggleAllergen = (item) => {
    setAllergens(prev => {
      const next = prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item];
      localStorage.setItem('foodverse_allergens', JSON.stringify(next));
      return next;
    });
  };

  const handleDietChange = (val) => {
    setDiet(val);
    localStorage.setItem('foodverse_diet', val);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('foodverse_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('foodverse_language', lang);
  };

  const handleExportData = async () => {
    setLoadingExport(true);
    try {
      const res = await axios.get('/api/v1/privacy/export');
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `foodverse_data_export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Data export failed. Please try again.');
    } finally {
      setLoadingExport(false);
    }
  };

  const handleDeleteAllData = async () => {
    try {
      await axios.delete('/api/v1/privacy/delete-all-data');
      setShowDeleteConfirm(false);
      localStorage.clear();
      alert('All local database records, scan history, and user settings purged successfully.');
      window.location.reload();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete records.');
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem('foodverse_allergens', JSON.stringify(allergens));
    localStorage.setItem('foodverse_diet', diet);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Settings className="w-3.5 h-3.5" />
          User Profile & Privacy Sovereignty
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings & Privacy
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Manage allergen alerts, dietary rules, bilingual preferences, and export or purge your local records.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4" />
          Allergen and dietary safety preferences saved successfully!
        </div>
      )}

      {/* SECTION 1: ALLERGEN SAFETY SCREENING */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Allergen Defense & Cross-Contamination Filter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every food photo, recipe, barcode scan, and meal plan is screened against these selected allergies.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
          {ALLERGEN_OPTIONS.map((item) => {
            const isSelected = allergens.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => handleToggleAllergen(item)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-left flex items-center justify-between ${
                  isSelected
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-800 text-rose-700 dark:text-rose-300 shadow-2xs'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{item}</span>
                {isSelected && <span className="text-[10px] font-black text-rose-600">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: DIETARY REGIME */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Dietary Philosophy & Meal Plan Filter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Excludes non-compliant foods from recommendations and triggers safety banners on conflicting foods.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {DIET_OPTIONS.map((d) => (
            <label
              key={d.id}
              className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition ${
                diet === d.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="diet_preference"
                checked={diet === d.id}
                onChange={() => handleDietChange(d.id)}
                className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs font-bold">{d.label}</span>
            </label>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveProfile}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* SECTION 3: SYSTEM PREFERENCES (THEME & LANGUAGE) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Languages className="w-5 h-5 text-sky-500" />
          Localization & Appearance
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Language Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Application Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  language === 'hi'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                हिंदी (Hindi)
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Color Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition ${
                  theme === 'light'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition ${
                  theme === 'dark'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition ${
                  theme === 'system'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" /> System
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: PRIVACY, LOCAL STORAGE & DATA SOVEREIGNTY */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-violet-500" />
            Data Sovereignty & Retention Governance
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your telemetry stays local. Commercial kitchen videos are automatically pruned from temporary disk storage.
          </p>
        </div>

        {notice && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
            <p><strong>Storage Policy:</strong> {notice.storage_policy}</p>
            <p><strong>Video Lifecycle:</strong> {notice.kitchen_video_retention}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Export Complete Data Archive</h4>
            <p className="text-[11px] text-slate-500">Download a standard JSON file containing all your scans, pantry, and gym records.</p>
          </div>

          <button
            onClick={handleExportData}
            disabled={loadingExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs shadow-sm hover:opacity-90 whitespace-nowrap transition"
          >
            <Download className="w-4 h-4" />
            {loadingExport ? 'Generating Export...' : 'Export JSON Data'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="font-bold text-xs text-rose-600 dark:text-rose-400">Permanent Data Destruction</h4>
            <p className="text-[11px] text-slate-500">Irreversibly delete all scans, pantry items, gym logs, and preferences.</p>
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 whitespace-nowrap transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete All My Data
          </button>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-300 dark:border-rose-900 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Confirm Complete Data Purge
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This will permanently delete all pantry records, meal plans, kitchen reports, and food analysis history from your local SQLite database. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllData}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition"
              >
                Yes, Purge Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
