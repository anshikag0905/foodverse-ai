import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import FoodScan from './pages/FoodScan';
import FreshnessCheck from './pages/FreshnessCheck';
import HygieneMonitor from './pages/HygieneMonitor';
import CookingAssistant from './pages/CookingAssistant';
import MealPlanner from './pages/MealPlanner';
import FoodExplorer from './pages/FoodExplorer';
import PantryTracker from './pages/PantryTracker';
import DidYouKnow from './pages/DidYouKnow';
import GymMode from './pages/GymMode';
import History from './pages/History';
import SettingsPrivacy from './pages/SettingsPrivacy';
import About from './pages/About';
import { aboutConfig } from './config/about';

export default function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fff8fa] via-[#fff4f7] to-[#fff8fa] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/food-scan" element={<FoodScan />} />
            <Route path="/freshness" element={<FreshnessCheck />} />
            <Route path="/hygiene" element={<HygieneMonitor />} />
            <Route path="/cooking" element={<CookingAssistant />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/food-explorer" element={<FoodExplorer />} />
            <Route path="/pantry" element={<PantryTracker />} />
            <Route path="/did-you-know" element={<DidYouKnow />} />
            <Route path="/gym" element={<GymMode />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<SettingsPrivacy />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
