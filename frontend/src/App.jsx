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
import DesignSystemPreview from './pages/DesignSystemPreview';
import { aboutConfig } from './config/about';

export default function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#BFE6FF] via-[#A5DEFF] to-[#8FD3FF] dark:from-[#0A1128] dark:via-[#131F42] dark:to-[#0A1128] text-[#0F1B3D] dark:text-[#F0F4FF] transition-colors duration-200 font-sans">
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
            <Route path="/design" element={<DesignSystemPreview />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
