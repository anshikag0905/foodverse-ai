import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from './context/ThemeContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MobileTabBar from './components/layout/MobileTabBar';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import FoodScan from './pages/FoodScan';
import FreshnessCheck from './pages/FreshnessCheck';
import HygieneMonitor from './pages/HygieneMonitor';
import MealPlanner from './pages/MealPlanner';
import FoodExplorer from './pages/FoodExplorer';
import PantryTracker from './pages/PantryTracker';
import DidYouKnow from './pages/DidYouKnow';
import GymMode from './pages/GymMode';
import History from './pages/History';
import SettingsPrivacy from './pages/SettingsPrivacy';
import About from './pages/About';
import DesignSystemPreview from './pages/DesignSystemPreview';

function AppContent() {
  const { theme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const getThemeBg = () => {
    if (theme === 'black') {
      return 'bg-[#0A0A0A] text-[#F8FAFC]';
    }
    if (theme === 'white') {
      return 'bg-[#F8FAFC] text-[#0F172A]';
    }
    // Blue theme: sky-blue page background gradient
    return 'bg-gradient-to-b from-[#DCEEFF] to-[#BFE0FF] text-[#0F1B3D]';
  };

  return (
    <div className={`min-h-screen flex flex-col ${getThemeBg()} transition-colors duration-200 font-sans`}>
      {/* Sticky Top Header */}
      <Header
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Main Layout */}
      <div className="flex-1 flex w-full">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10 max-w-[1200px] mx-auto w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/food-scan" element={<FoodScan />} />
            <Route path="/freshness" element={<FreshnessCheck />} />
            <Route path="/hygiene" element={<HygieneMonitor />} />
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

      {/* Mobile Tab Bar */}
      <MobileTabBar />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
