import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Sun, Moon, Globe, Utensils, ShieldCheck, Video, 
  Sparkles, Calendar, Package, Compass, Dumbbell, 
  Info, History, Settings, ExternalLink, Github, Mail, Lightbulb
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { aboutConfig } from './config/about';

// Placeholder Pages (will be fully implemented in subsequent steps)
function DashboardPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('nav.dashboard')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Multimodal food intelligence, inventory tracking, and safety overview.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
            <Utensils className="w-5 h-5" />
            <span>Food Recognition</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Scan meal photos or barcodes to get instant nutrition and health scores.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-3 text-amber-500 font-semibold mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span>Freshness & Spoilage</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Computer vision analyzes surface discoloration to prevent food waste.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center gap-3 text-violet-500 font-semibold mb-2">
            <Dumbbell className="w-5 h-5" />
            <span>Gym Mode</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            BMR/TDEE calculations, protein progress rings, and athletic nutrition.
          </p>
        </div>
      </div>
    </div>
  );
}

function GenericModulePage({ title, description, icon: Icon }) {
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{description}</p>
        </div>
      </div>
      <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 text-sm">
        Module scaffold ready for implementation.
      </div>
    </div>
  );
}

function NavigationBar() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('hi') ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
  };

  const navLinks = [
    { to: '/', label: t('nav.dashboard'), icon: Sparkles },
    { to: '/food-scan', label: t('nav.food_scan'), icon: Utensils },
    { to: '/freshness', label: t('nav.freshness'), icon: ShieldCheck },
    { to: '/hygiene', label: t('nav.hygiene'), icon: Video },
    { to: '/cooking', label: t('nav.cooking'), icon: Sparkles },
    { to: '/meal-planner', label: t('nav.meal_planner'), icon: Calendar },
    { to: '/pantry', label: t('nav.pantry'), icon: Package },
    { to: '/food-explorer', label: t('nav.food_explorer'), icon: Compass },
    { to: '/did-you-know', label: t('nav.did_you_know'), icon: Lightbulb },
    { to: '/gym', label: t('nav.gym_mode'), icon: Dumbbell },
    { to: '/history', label: t('nav.history'), icon: History },
    { to: '/settings', label: t('nav.settings'), icon: Settings },
    { to: '/about', label: t('nav.about'), icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      {/* Demo Mode Notice Banner */}
      <div className="bg-emerald-600 text-white text-xs font-medium px-4 py-1.5 text-center flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
        <span>{t('common.demo_banner')}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                FoodVerse
              </span>
              <span className="text-xs font-semibold ml-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                AI Agent
              </span>
            </div>
          </Link>

          {/* Quick Actions (Theme & Language) */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{i18n.language.startsWith('hi') ? 'English' : 'हिन्दी'}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Links */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none text-xs font-medium border-t border-slate-100 dark:border-slate-800/60">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  active
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(aboutConfig.links.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div>
          <span>{aboutConfig.footerText}</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={aboutConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <button
            onClick={copyEmail}
            className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>{copied ? 'Copied!' : 'Email'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <NavigationBar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/food-scan" element={<GenericModulePage title={t('nav.food_scan')} description="Multimodal Dish Identification & Nutritional Analysis" icon={Utensils} />} />
            <Route path="/freshness" element={<GenericModulePage title={t('nav.freshness')} description="Color, Texture & Spoilage Classification" icon={ShieldCheck} />} />
            <Route path="/hygiene" element={<GenericModulePage title={t('nav.hygiene')} description="Commercial Kitchen Video Analysis & Compliance Reports" icon={Video} />} />
            <Route path="/cooking" element={<GenericModulePage title={t('nav.cooking')} description="Contextual Cooking Assistant & Recipe Suggestion" icon={Sparkles} />} />
            <Route path="/meal-planner" element={<GenericModulePage title={t('nav.meal_planner')} description="Personalized Adaptive Meal Regimens" icon={Calendar} />} />
            <Route path="/pantry" element={<GenericModulePage title={t('nav.pantry')} description="Inventory, Expiry Warnings & Food-Waste Tracking" icon={Package} />} />
            <Route path="/food-explorer" element={<GenericModulePage title={t('nav.food_explorer')} description="FTS5 Full-Text Nutritional Database Explorer" icon={Compass} />} />
            <Route path="/did-you-know" element={<GenericModulePage title={t('nav.did_you_know')} description="Curated Food Science & Hygiene Fact Directory" icon={Lightbulb} />} />
            <Route path="/gym" element={<GenericModulePage title={t('nav.gym_mode')} description="BMR/TDEE Calculator & Protein Target Progress" icon={Dumbbell} />} />
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
