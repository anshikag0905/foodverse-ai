import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MobileTabBar from './components/layout/MobileTabBar';
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

export default function App() {
  const { t } = useTranslation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#BFE6FF] via-[#A5DEFF] to-[#8FD3FF] dark:from-[#0A1128] dark:via-[#131F42] dark:to-[#0A1128] text-ink dark:text-[#F0F4FF] transition-colors duration-200 font-sans">
        {/* Sticky Header with Logo, Ctrl+K search, Status Dot, Lang & Theme */}
        <Header
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Main Body with Left Collapsible Sidebar on Desktop */}
        <div className="flex-1 flex w-full">
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          />

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10 max-w-7xl mx-auto w-full overflow-x-hidden">
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
        </div>

        {/* Global Footer */}
        <Footer />

        {/* Mobile Fixed Bottom Navigation Bar */}
        <MobileTabBar />
      </div>
    </BrowserRouter>
  );
}
