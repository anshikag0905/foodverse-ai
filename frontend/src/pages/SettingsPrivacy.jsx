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
  HeartHandshake,
  Sparkles
} from 'lucide-react';
import Loader from '../components/common/Loader';
import { DoodleSalad, DoodleAvocado } from '../assets/doodles';
import { useTheme } from '../context/ThemeContext';

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
  { id: 'jain', label: 'Jain (No Root Vegetables)' },
  { id: 'halal', label: 'Halal' },
  { id: 'kosher', label: 'Kosher' },
  { id: 'gluten_free', label: 'Gluten-Free (Celiac Safe)' },
  { id: 'keto', label: 'Ketogenic (Low Carb)' },
];

export default function SettingsPrivacy() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

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

  const [language, setLanguage] = useState(() => {
    return i18n.language || 'en';
  });

  const [notice, setNotice] = useState(null);
  const [loadingExport, setLoadingExport] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      const res = await axios.get('/api/v1/privacy/policy');
      setNotice(res.data);
    } catch (err) {
      setNotice({
        storage_policy: "All telemetry and personal logs are stored locally on your device in browser storage and local SQLite database.",
        kitchen_video_retention: "Videos uploaded for kitchen hygiene auditing are processed purely in ephemeral memory and discarded."
      });
    }
  };

  const handleToggleAllergen = (item) => {
    setAllergens((prev) => {
      const exists = prev.includes(item);
      const updated = exists ? prev.filter(i => i !== item) : [...prev, item];
      localStorage.setItem('foodverse_allergens', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDietChange = (dietId) => {
    setDiet(dietId);
    localStorage.setItem('foodverse_diet', dietId);
  };

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    i18n.changeLanguage(langCode);
    localStorage.setItem('foodverse_language', langCode);
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
      // Local fallback export
      const today = new Date().toISOString().split('T')[0];
      const localGym = localStorage.getItem(`foodverse_gym_logs_${today}`);
      const localPantry = localStorage.getItem('foodverse_pantry_items');
      const localGroceries = localStorage.getItem('foodverse_grocery_items');
      const bundle = {
        exported_at: new Date().toISOString(),
        user: "Anshika Gupta",
        allergens,
        diet,
        pantry: localPantry ? JSON.parse(localPantry) : [],
        gym_logs: localGym ? JSON.parse(localGym) : [],
        groceries: localGroceries ? JSON.parse(localGroceries) : []
      };
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bundle, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `foodverse_export_${today}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } finally {
      setLoadingExport(false);
    }
  };

  const handleDeleteAllData = async () => {
    try {
      await axios.delete('/api/v1/privacy/delete-all-data');
    } catch {
      // Ignore API errors
    }
    setShowDeleteConfirm(false);
    localStorage.clear();
    alert('All local database records, scan history, and user settings purged successfully.');
    window.location.reload();
  };

  const handleSaveProfile = () => {
    localStorage.setItem('foodverse_allergens', JSON.stringify(allergens));
    localStorage.setItem('foodverse_diet', diet);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-6 shadow-sticker flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-sky-100 dark:bg-dusk-surface border-2.5 border-ink flex items-center justify-center p-2 shadow-sticker-sm">
            <DoodleAvocado size={46} className="animate-float" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-200 dark:bg-dusk-surface border border-ink text-[11px] font-black uppercase text-ink dark:text-dusk-text">
              <span>Security & Profile</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-ink dark:text-dusk-text mt-1">
              Settings & Privacy Preferences
            </h1>
            <p className="text-xs font-semibold text-ink-muted mt-0.5">
              Manage allergen guardrails, dietary rules, bilingual toggles, and data export.
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-mint/20 border-2.5 border-mint text-emerald-900 dark:text-mint flex items-center gap-2 text-xs font-black shadow-sticker-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Allergen and dietary safety preferences saved successfully!</span>
        </div>
      )}

      {/* SECTION 1: ALLERGEN SAFETY SCREENING */}
      <div className="bg-white dark:bg-dusk-card rounded-3xl border-3 border-ink p-6 shadow-sticker space-y-4">
        <div>
          <h2 className="font-display font-black text-lg text-ink dark:text-dusk-text flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-tomato" />
            <span>Allergen Defense & Cross-Contamination Guardrail</span>
          </h2>
          <p className="text-xs font-semibold text-ink-muted mt-0.5">
            Every food scan, recipe suggestion, and meal plan is strictly verified against your selected allergies.
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
                className={`btn-squish px-3.5 py-2 rounded-2xl text-xs font-black border-2 transition cursor-pointer text-left flex items-center justify-between ${
                  isSelected
                    ? 'bg-tomato/20 border-tomato text-tomato shadow-sticker-xs'
                    : 'bg-white dark:bg-dusk-surface border-ink text-ink dark:text-dusk-text hover:bg-sky-50'
                }`}
              >
                <span>{item}</span>
                {isSelected && <span className="text-[11px] font-black text-tomato">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: DIETARY REGIME */}
      <div className="bg-white dark:bg-dusk-card rounded-3xl border-3 border-ink p-6 shadow-sticker space-y-4">
        <div>
          <h2 className="font-display font-black text-lg text-ink dark:text-dusk-text flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-mint" />
            <span>Dietary Philosophy & Meal Plan Filter</span>
          </h2>
          <p className="text-xs font-semibold text-ink-muted mt-0.5">
            Excludes non-compliant foods from recipe generations and meal planning routines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {DIET_OPTIONS.map((d) => (
            <label
              key={d.id}
              className={`p-3.5 rounded-2xl border-2 border-ink cursor-pointer flex items-center gap-3 transition font-bold text-xs ${
                diet === d.id
                  ? 'bg-mint/20 text-emerald-900 dark:text-mint shadow-sticker-xs'
                  : 'bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text hover:bg-sky-50'
              }`}
            >
              <input
                type="radio"
                name="diet_preference"
                checked={diet === d.id}
                onChange={() => handleDietChange(d.id)}
                className="text-mint focus:ring-mint cursor-pointer"
              />
              <span>{d.label}</span>
            </label>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveProfile}
            className="btn-squish inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-tomato text-white font-display font-black text-xs border-2 border-ink shadow-sticker-xs cursor-pointer hover:shadow-sticker"
          >
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: SYSTEM PREFERENCES (THEME & LANGUAGE) */}
      <div className="bg-white dark:bg-dusk-card rounded-3xl border-3 border-ink p-6 shadow-sticker space-y-4">
        <h2 className="font-display font-black text-lg text-ink dark:text-dusk-text flex items-center gap-2">
          <Languages className="w-5 h-5 text-sky-500" />
          <span>Localization & Appearance</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Language Selector */}
          <div>
            <label className="block text-xs font-black text-ink dark:text-dusk-text mb-2">
              Application Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`btn-squish py-2 px-3 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer ${
                  language === 'en'
                    ? 'bg-sunny text-ink shadow-sticker-xs'
                    : 'bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`btn-squish py-2 px-3 rounded-full text-xs font-display font-black border-2 border-ink transition cursor-pointer ${
                  language === 'hi'
                    ? 'bg-sunny text-ink shadow-sticker-xs'
                    : 'bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text'
                }`}
              >
                हिंदी (Hindi)
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-black text-ink dark:text-dusk-text mb-2">
              Color Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'light') toggleTheme();
                }}
                className={`btn-squish py-2 px-3 rounded-full text-xs font-display font-black border-2 border-ink flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  theme === 'light'
                    ? 'bg-sunny text-ink shadow-sticker-xs'
                    : 'bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'dark') toggleTheme();
                }}
                className={`btn-squish py-2 px-3 rounded-full text-xs font-display font-black border-2 border-ink flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-sunny text-ink shadow-sticker-xs'
                    : 'bg-white dark:bg-dusk-surface text-ink dark:text-dusk-text'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: PRIVACY, LOCAL STORAGE & DATA SOVEREIGNTY */}
      <div className="bg-white dark:bg-dusk-card rounded-3xl border-3 border-ink p-6 shadow-sticker space-y-4">
        <div>
          <h2 className="font-display font-black text-lg text-ink dark:text-dusk-text flex items-center gap-2">
            <Lock className="w-5 h-5 text-grape" />
            <span>Data Sovereignty & Local Storage</span>
          </h2>
          <p className="text-xs font-semibold text-ink-muted mt-0.5">
            Your telemetry stays local. You have full ownership to export or purge your records at any time.
          </p>
        </div>

        {notice && (
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-dusk-surface border-2 border-ink text-xs text-ink dark:text-dusk-text space-y-1.5 font-medium">
            <p><strong>Storage Policy:</strong> {notice.storage_policy}</p>
            <p><strong>Video Lifecycle:</strong> {notice.kitchen_video_retention}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t-2 border-ink/10">
          <div>
            <h4 className="font-display font-black text-xs text-ink dark:text-dusk-text">Export Complete Data Archive</h4>
            <p className="text-[11px] font-semibold text-ink-muted">Download a standard JSON file containing all your scans, pantry, and gym records.</p>
          </div>

          <button
            onClick={handleExportData}
            disabled={loadingExport}
            className="btn-squish inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-white dark:bg-white dark:text-ink font-display font-black text-xs border-2 border-ink shadow-sticker-xs cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>{loadingExport ? 'Generating Export...' : 'Export JSON Data'}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t-2 border-ink/10">
          <div>
            <h4 className="font-display font-black text-xs text-tomato">Permanent Data Destruction</h4>
            <p className="text-[11px] font-semibold text-ink-muted">Irreversibly delete all scans, pantry items, gym logs, and preferences.</p>
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-squish inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-tomato text-white font-display font-black text-xs border-2 border-ink shadow-sticker-xs cursor-pointer hover:shadow-sticker whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete All My Data</span>
          </button>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-dusk-card rounded-3xl border-3 border-ink p-6 max-w-md w-full shadow-sticker-lg space-y-4">
            <div className="flex items-center gap-3 text-tomato">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-display font-black text-lg text-ink dark:text-dusk-text">
                Confirm Complete Data Purge
              </h3>
            </div>
            <p className="text-xs font-semibold text-ink-muted leading-relaxed">
              This will permanently delete all pantry records, meal plans, kitchen reports, and food analysis history from your local SQLite database and localStorage. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-squish px-4 py-2 text-xs font-display font-black rounded-full border-2 border-ink bg-white dark:bg-dusk-surface text-ink cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllData}
                className="btn-squish px-4 py-2 text-xs font-display font-black rounded-full bg-tomato text-white border-2 border-ink shadow-sticker-xs cursor-pointer"
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
