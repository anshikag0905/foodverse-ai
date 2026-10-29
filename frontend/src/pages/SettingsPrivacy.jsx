import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  Shield,
  ShieldCheck,
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
import AnimatedGirlFace from '../components/common/AnimatedGirlFace';
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
        storage_policy: "All food logs and personal records are stored locally on your device in browser storage and local SQLite database.",
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
      <div className="card-base p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
            <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-200 dark:bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[11px] font-black uppercase text-[var(--text-primary)]">
              <span>Security & Profile</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[var(--text-primary)] mt-1">
              Settings & Privacy Preferences
            </h1>
            <p className="text-xs font-semibold text-[var(--text-muted)] mt-0.5">
              Manage allergen guardrails, dietary rules, bilingual toggles, and data export.
            </p>
          </div>
        </div>
      </div>

      {/* STUDENT / CREATOR PROFILE CARD */}
      <div className="rounded-3xl bg-[var(--bg-card)] border-3 border-[var(--border-color)] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl overflow-hidden border-3 border-[var(--border-color)] shadow-xs flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-200">
              <AnimatedGirlFace size={110} />
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-mint text-[var(--text-primary)] border-2 border-[var(--border-color)] text-[10px] font-black uppercase shadow-xs">
              Online
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="font-display font-black text-2xl text-[var(--text-primary)]">
                  Anshika Gupta
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-grape/15 text-grape border border-grape/30 text-[11px] font-extrabold">
                  Verified Creator
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-tomato/15 text-tomato border border-tomato/30 text-[11px] font-extrabold">
                  AI & ML • LNCT
                </span>
              </div>
              <p className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                Lakshmi Narain College of Technology (LNCT), Bhopal • AIML Specialization
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-center">
              <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] font-black uppercase text-[var(--text-muted)] block">Current Diet</span>
                <span className="text-xs font-display font-black text-[var(--text-primary)] capitalize">{diet}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] font-black uppercase text-[var(--text-muted)] block">Gym Target</span>
                <span className="text-xs font-display font-black text-grape">140g P • 2.3k kcal</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] font-black uppercase text-[var(--text-muted)] block">Allergen Shield</span>
                <span className="text-xs font-display font-black text-tomato">{allergens.length} active</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                <span className="text-[10px] font-black uppercase text-[var(--text-muted)] block">Safety Score</span>
                <span className="text-xs font-display font-black text-emerald-600">98 / 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-mint/20 border-2.5 border-mint text-emerald-900 dark:text-mint flex items-center gap-2 text-xs font-black shadow-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Allergen and dietary safety preferences saved successfully!</span>
        </div>
      )}

      {/* SECTION 1: ALLERGEN SAFETY SCREENING */}
      <div className="bg-[var(--bg-card)] rounded-3xl border-3 border-[var(--border-color)] p-6 shadow-xs space-y-4">
        <div>
          <h2 className="font-display font-black text-lg text-[var(--text-primary)] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-tomato" />
            <span>Allergen Defense & Cross-Contamination Guardrail</span>
          </h2>
          <p className="text-xs font-semibold text-[var(--text-muted)] mt-0.5">
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
                    ? 'bg-tomato/20 border-tomato text-tomato shadow-xs'
                    : 'bg-white dark:bg-[var(--bg-card-subtle)] border-[var(--border-color)] text-[var(--text-primary)] hover:bg-sky-50'
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
      <div className="bg-[var(--bg-card)] rounded-3xl border-3 border-[var(--border-color)] p-6 shadow-xs space-y-4">
        <div>
          <h2 className="font-display font-black text-lg text-[var(--text-primary)] flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-mint" />
            <span>Dietary Philosophy & Meal Plan Filter</span>
          </h2>
          <p className="text-xs font-semibold text-[var(--text-muted)] mt-0.5">
            Excludes non-compliant foods from recipe generations and meal planning routines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {DIET_OPTIONS.map((d) => (
            <label
              key={d.id}
              className={`p-3.5 rounded-2xl border-2 border-[var(--border-color)] cursor-pointer flex items-center gap-3 transition font-bold text-xs ${
                diet === d.id
                  ? 'bg-mint/20 text-emerald-900 dark:text-mint shadow-xs'
                  : 'bg-white dark:bg-[var(--bg-card-subtle)] text-[var(--text-primary)] hover:bg-sky-50'
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
            className="btn-squish inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-tomato text-white font-display font-black text-xs border-2 border-[var(--border-color)] shadow-xs cursor-pointer hover:shadow-xs"
          >
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: SYSTEM PREFERENCES (THEME & LANGUAGE) */}
      <div className="bg-[var(--bg-card)] rounded-3xl border-3 border-[var(--border-color)] p-6 shadow-xs space-y-4">
        <h2 className="font-display font-black text-lg text-[var(--text-primary)] flex items-center gap-2">
          <Languages className="w-5 h-5 text-sky-500" />
          <span>Localization & Appearance</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Language Selector */}
          <div>
            <label className="block text-xs font-black text-[var(--text-primary)] mb-2">
              Application Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`btn-squish py-2 px-3 rounded-full text-xs font-display font-black border-2 border-[var(--border-color)] transition cursor-pointer ${
                  language === 'en'
                    ? 'bg-sunny text-[var(--text-primary)] shadow-xs'
                    : 'bg-white dark:bg-[var(--bg-card-subtle)] text-[var(--text-primary)]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`btn-squish py-2 px-3 rounded-full text-xs font-display font-black border-2 border-[var(--border-color)] transition cursor-pointer ${
                  language === 'hi'
                    ? 'bg-sunny text-[var(--text-primary)] shadow-xs'
                    : 'bg-white dark:bg-[var(--bg-card-subtle)] text-[var(--text-primary)]'
                }`}
              >
                हिंदी (Hindi)
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-black text-[var(--text-primary)] mb-2">
              Color Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'light') toggleTheme();
                }}
                className={`btn-squish py-2 px-3 rounded-full text-xs font-display font-black border-2 border-[var(--border-color)] flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  theme === 'light'
                    ? 'bg-sunny text-[var(--text-primary)] shadow-xs'
                    : 'bg-white dark:bg-[var(--bg-card-subtle)] text-[var(--text-primary)]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'dark') toggleTheme();
                }}
                className={`btn-squish py-2 px-3 rounded-full text-xs font-display font-black border-2 border-[var(--border-color)] flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-sunny text-[var(--text-primary)] shadow-xs'
                    : 'bg-white dark:bg-[var(--bg-card-subtle)] text-[var(--text-primary)]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: PRIVACY, LOCAL STORAGE & DATA SOVEREIGNTY */}
      <div className="bg-[var(--bg-card)] rounded-3xl border-3 border-[var(--border-color)] p-6 shadow-xs space-y-4">
        <div>
          <h2 className="font-display font-black text-lg text-[var(--text-primary)] flex items-center gap-2">
            <Lock className="w-5 h-5 text-grape" />
            <span>Data Sovereignty & Local Storage</span>
          </h2>
          <p className="text-xs font-semibold text-[var(--text-muted)] mt-0.5">
            Your data stays local. You have full ownership to export or purge your records at any time.
          </p>
        </div>

        {notice && (
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-[var(--bg-card-subtle)] border-2 border-[var(--border-color)] text-xs text-[var(--text-primary)] space-y-1.5 font-medium">
            <p><strong>Storage Policy:</strong> {notice.storage_policy}</p>
            <p><strong>Video Lifecycle:</strong> {notice.kitchen_video_retention}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t-2 border-[var(--border-color)]/10">
          <div>
            <h4 className="font-display font-black text-xs text-[var(--text-primary)]">Export Complete Data Archive</h4>
            <p className="text-[11px] font-semibold text-[var(--text-muted)]">Download a standard JSON file containing all your scans, pantry, and gym records.</p>
          </div>

          <button
            onClick={handleExportData}
            disabled={loadingExport}
            className="btn-squish inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-white dark:bg-white dark:text-[var(--text-primary)] font-display font-black text-xs border-2 border-[var(--border-color)] shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>{loadingExport ? 'Generating Export...' : 'Export JSON Data'}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t-2 border-[var(--border-color)]/10">
          <div>
            <h4 className="font-display font-black text-xs text-tomato">Permanent Data Destruction</h4>
            <p className="text-[11px] font-semibold text-[var(--text-muted)]">Irreversibly delete all scans, pantry items, gym logs, and preferences.</p>
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-squish inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-tomato text-white font-display font-black text-xs border-2 border-[var(--border-color)] shadow-xs cursor-pointer hover:shadow-xs whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete All My Data</span>
          </button>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
          <div className="bg-[var(--bg-card)] rounded-3xl border-3 border-[var(--border-color)] p-6 max-w-md w-full shadow-xs space-y-4">
            <div className="flex items-center gap-3 text-tomato">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-display font-black text-lg text-[var(--text-primary)]">
                Confirm Complete Data Purge
              </h3>
            </div>
            <p className="text-xs font-semibold text-[var(--text-muted)] leading-relaxed">
              This will permanently delete all pantry records, meal plans, kitchen reports, and food analysis history from your local SQLite database and localStorage. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-squish px-4 py-2 text-xs font-display font-black rounded-full border-2 border-[var(--border-color)] bg-white dark:bg-[var(--bg-card-subtle)] text-[var(--text-primary)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllData}
                className="btn-squish px-4 py-2 text-xs font-display font-black rounded-full bg-tomato text-white border-2 border-[var(--border-color)] shadow-xs cursor-pointer"
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
