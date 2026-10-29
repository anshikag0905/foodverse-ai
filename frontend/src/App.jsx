import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Utensils, ShieldCheck, Video, Sparkles, Calendar,
  Package, Compass, Lightbulb, Dumbbell, History, Settings, Info
} from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FoodScan from './pages/FoodScan';
import FreshnessCheck from './pages/FreshnessCheck';
import HygieneMonitor from './pages/HygieneMonitor';
import CookingAssistant from './pages/CookingAssistant';
import MealPlanner from './pages/MealPlanner';
import FoodExplorer from './pages/FoodExplorer';
import { aboutConfig } from './config/about';

// Placeholder view for remaining pages
function GenericModulePage({ title, description, icon: Icon, accent = "emerald" }) {
  const isGym = accent === "gym";
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3.5 rounded-2xl ${
          isGym
            ? 'bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400'
            : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
        }`}>
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{description}</p>
        </div>
      </div>
      <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
        Module scaffold initialized with design tokens, explainability cues, allergen rules, and bilingual localization.
      </div>
    </div>
  );
}

function DashboardOverview() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('nav.dashboard')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Multimodal food intelligence, inventory tracking, and safety overview.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold mb-2">
            <Utensils className="w-5 h-5" />
            <span>Food Recognition</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Scan meal photos or barcodes to get instant nutrition, macro breakdown, and health scores.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-amber-500 font-bold mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span>Freshness & Spoilage</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Computer vision analyzes surface discoloration and texture decay to prevent food waste.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-violet-500 font-bold mb-2">
            <Dumbbell className="w-5 h-5" />
            <span>Gym Mode</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            BMR/TDEE calculations, protein progress rings, training splits, and athletic nutrition.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/food-scan" element={<FoodScan />} />
            <Route path="/freshness" element={<FreshnessCheck />} />
            <Route path="/hygiene" element={<HygieneMonitor />} />
            <Route path="/cooking" element={<CookingAssistant />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/food-explorer" element={<FoodExplorer />} />
            <Route path="/pantry" element={<GenericModulePage title={t('nav.pantry')} description="Inventory, Expiry Warnings & Food-Waste Tracking" icon={Package} />} />
            <Route path="/did-you-know" element={<GenericModulePage title={t('nav.did_you_know')} description="Curated Food Science & Hygiene Fact Directory" icon={Lightbulb} />} />
            <Route path="/gym" element={<GenericModulePage title={t('nav.gym_mode')} description="BMR/TDEE Calculator & Protein Target Progress" icon={Dumbbell} accent="gym" />} />
            <Route path="/history" element={<GenericModulePage title={t('nav.history')} description="Multimodal Scan Archive & Export Center" icon={History} />} />
            <Route path="/settings" element={<GenericModulePage title={t('nav.settings')} description="User Preferences, Allergens & Privacy Controls" icon={Settings} />} />
            <Route path="/about" element={<GenericModulePage title={t('nav.about')} description={aboutConfig.project.tagline} icon={Info} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
