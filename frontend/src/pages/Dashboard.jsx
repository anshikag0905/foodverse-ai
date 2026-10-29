import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Utensils,
  ShieldCheck,
  Video,
  Sparkles,
  Calendar,
  Package,
  Dumbbell,
  Lightbulb,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Zap,
  Droplets,
  Camera
} from 'lucide-react';
import FoodStickerPicker from '../components/common/FoodStickerPicker';
import ExpiryBadge from '../components/common/ExpiryBadge';
import {
  DoodleBanana,
  DoodlePancakes,
  DoodleBurrito,
  DoodlePizza,
  DoodleBurger,
  DoodleHotdog,
  DoodleRamen,
  DoodleSalad,
  DoodleTaco,
  DoodlePopcorn,
  DoodleDonut,
  DoodleAvocado,
  DoodleStrawberry,
  DoodlePie,
  DoodleDrumstick
} from '../assets/doodles';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gymSummary, setGymSummary] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const calculateLiveGymMacros = () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const localLogsRaw = localStorage.getItem(`foodverse_gym_logs_${todayStr}`);
      const logs = localLogsRaw ? JSON.parse(localLogsRaw) : [];
      const cal = logs.reduce((acc, l) => acc + (parseFloat(l.calories) || 0), 0);
      const prot = logs.reduce((acc, l) => acc + (parseFloat(l.protein_g) || 0), 0);
      const carbs = logs.reduce((acc, l) => acc + (parseFloat(l.carbs_g) || 0), 0);
      const fat = logs.reduce((acc, l) => acc + (parseFloat(l.fat_g) || 0), 0);
      setGymSummary({ calories: Math.round(cal), protein: Math.round(prot), carbs: Math.round(carbs), fat: Math.round(fat) });
      return { cal, prot, carbs, fat, count: logs.length };
    } catch {
      return { cal: 0, prot: 0, carbs: 0, fat: 0, count: 0 };
    }
  };

  const fetchDashboardSummary = async () => {
    setLoading(true);
    const liveGym = calculateLiveGymMacros();

    try {
      const res = await axios.get('/api/v1/dashboard/summary', { timeout: 4000 });
      setData(res.data);
    } catch (err) {
      console.warn('Dashboard summary using offline fallback:', err);
      // Fallback data
      setData({
        stats: {
          total_scans: 14 + liveGym.count,
          today_scans: liveGym.count || 2,
          active_pantry_items: 8,
          expiring_pantry_count: 2,
        },
        alerts: [
          {
            id: 'alert-1',
            severity: 'warning',
            title: '2 Pantry Items Expiring Soon (Whole Milk, Baby Spinach)',
            message: 'Tap "Cook from Pantry" to turn expiring foods into zero-waste meals.',
            link: '/cooking'
          }
        ],
        recent_analyses: [
          {
            id: 1,
            analysis_type: 'food_scan',
            item_name: 'Grilled Salmon with Brown Rice',
            score: 95,
            data_source: 'Database verified',
            time: '15m ago'
          },
          {
            id: 2,
            analysis_type: 'freshness',
            item_name: 'Fresh Red Apple',
            score: 91,
            data_source: 'Biomarker AI',
            time: '2h ago'
          }
        ],
        expiring_items: [
          { id: 1, name: 'Whole Milk', storage_location: 'Fridge', days_remaining: 1, status: 'use_soon' },
          { id: 2, name: 'Baby Spinach', storage_location: 'Fridge', days_remaining: 2, status: 'use_soon' },
        ],
        featured_fact: {
          fact: 'Air-popped popcorn contains more polyphenol antioxidants than apples, because whole corn hull protects nutrient density.',
          category: 'Food Science'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToPicker = () => {
    const el = document.getElementById('food-sticker-picker');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isHindi = i18n?.language === 'hi';

  const stats = data?.stats || {};
  const alerts = data?.alerts || [];
  const recent = data?.recent_analyses || [];
  const expiring = data?.expiring_items || [];
  const fact = data?.featured_fact;

  // 6 Primary Modules
  const MODULES = [
    {
      title: 'Food Recognition',
      desc: 'Snap any dish to get instant calibrated calories, macros & allergen guardrails.',
      to: '/food-scan',
      accent: 'bg-tomato',
      accentSoft: 'bg-tomato/15',
      textColor: 'text-tomato',
      Doodle: DoodlePizza,
      tag: 'Snap & Track'
    },
    {
      title: 'Freshness Check',
      desc: 'Inspect fruit and veggie freshness with visual decay and shelf-life prediction.',
      to: '/freshness',
      accent: 'bg-mint',
      accentSoft: 'bg-mint/20',
      textColor: 'text-emerald-600',
      Doodle: DoodleAvocado,
      tag: 'Zero Waste'
    },
    {
      title: 'Kitchen Hygiene',
      desc: 'Inspect cooking surfaces, food safety habits, and kitchen sanitation scores.',
      to: '/hygiene',
      accent: 'bg-teal',
      accentSoft: 'bg-teal/20',
      textColor: 'text-teal',
      Doodle: DoodleSalad,
      tag: 'Sanitation'
    },
    {
      title: 'Smart Cooking',
      desc: 'Get tasty, step-by-step recipes and hands-free timers from your pantry items.',
      to: '/cooking',
      accent: 'bg-sunny',
      accentSoft: 'bg-sunny/25',
      textColor: 'text-amber-600',
      Doodle: DoodleRamen,
      tag: 'Chef AI'
    },
    {
      title: 'Meal Planner',
      desc: 'Plan healthy weekly meals tailored to your diet, goals, and grocery shopping list.',
      to: '/meal-planner',
      accent: 'bg-grape',
      accentSoft: 'bg-grape/20',
      textColor: 'text-grape',
      Doodle: DoodlePancakes,
      tag: 'Weekly Diet'
    },
    {
      title: 'Pantry & Expiry',
      desc: 'Track groceries in your fridge & pantry with automatic spoilage countdowns.',
      to: '/pantry',
      accent: 'bg-peach',
      accentSoft: 'bg-peach/25',
      textColor: 'text-orange-600',
      Doodle: DoodlePopcorn,
      tag: 'Inventory'
    }
  ];

  return (
    <div className="space-y-10">
      {/* =========================================================================
          HERO SECTION (DIRECT TARGET REFERENCE MATCH - IMAGE 5)
          Sky blue canvas, floating food doodles, big bold friendly headline & pill buttons
          ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl sm:rounded-[36px] bg-gradient-to-b from-[#BFE6FF] via-[#A6DDFF] to-[#8FD3FF] dark:from-[#111C3A] dark:via-[#16254E] dark:to-[#0E172F] border-3 border-ink p-6 sm:p-10 lg:p-14 shadow-sticker-lg text-center select-none">
        {/* Confetti-like pastel dots */}
        <div className="absolute top-6 left-12 w-3 h-3 rounded-full bg-tomato/70 border border-ink/40 pointer-events-none" />
        <div className="absolute top-16 right-20 w-2.5 h-2.5 rounded-full bg-sunny border border-ink/40 pointer-events-none" />
        <div className="absolute bottom-8 left-28 w-3 h-3 rounded-full bg-mint border border-ink/40 pointer-events-none" />
        <div className="absolute bottom-14 right-32 w-2 h-2 rounded-full bg-grape/70 border border-ink/40 pointer-events-none" />
        <div className="absolute top-28 left-1/4 w-2 h-2 rounded-full bg-peach border border-ink/40 pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-2.5 h-2.5 rounded-full bg-sky-300 border border-ink/40 pointer-events-none" />

        {/* Floating Cute Doodles Scattered Around Hero (as seen in Image 5) */}
        <div className="hidden md:block absolute top-4 left-6 pointer-events-none animate-float opacity-90 hover:opacity-100 transition-opacity">
          <DoodlePancakes size={72} />
        </div>
        <div className="hidden lg:block absolute top-3 left-1/4 pointer-events-none -rotate-12 opacity-85">
          <DoodleBurrito size={64} />
        </div>
        <div className="hidden md:block absolute top-4 right-8 pointer-events-none animate-float opacity-90" style={{ animationDelay: '1s' }}>
          <DoodlePie size={70} />
        </div>
        <div className="hidden lg:block absolute top-2 right-1/4 pointer-events-none rotate-12 opacity-85">
          <DoodleRamen size={68} />
        </div>

        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-4 pointer-events-none -rotate-6 opacity-95">
          <DoodlePizza size={78} />
        </div>
        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none rotate-12 opacity-95">
          <DoodleHotdog size={74} />
        </div>

        <div className="hidden md:block absolute bottom-4 left-8 pointer-events-none rotate-6 opacity-90">
          <DoodleBurger size={70} />
        </div>
        <div className="hidden lg:block absolute bottom-3 left-1/3 pointer-events-none -rotate-6 opacity-85">
          <DoodleTaco size={64} />
        </div>
        <div className="hidden md:block absolute bottom-4 right-8 pointer-events-none -rotate-6 opacity-90">
          <DoodleDonut size={68} />
        </div>
        <div className="hidden lg:block absolute bottom-3 right-1/3 pointer-events-none rotate-6 opacity-85">
          <DoodlePopcorn size={66} />
        </div>

        {/* Central Hero Headline and Call to Action */}
        <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-dusk-surface/90 border-2 border-ink text-xs font-black shadow-sticker-sm text-ink dark:text-dusk-text">
            <Sparkles className="w-3.5 h-3.5 text-sunny" />
            <span>FoodVerse AI ✨ Your food, made simple</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-ink dark:text-white tracking-tight leading-tight">
            {isHindi ? 'भूख लगी है?' : 'Hungry?'}
            <br />
            <span className="text-tomato">
              {isHindi ? 'आपकी थाली में क्या है?' : "What's on your plate?"}
            </span>
          </h1>

          <p className="font-sans font-bold text-sm sm:text-base text-ink/80 dark:text-slate-200 max-w-lg mx-auto">
            {isHindi
              ? 'किसी भी खाने की फोटो लें या नीचे दिए गए फूड आइकॉन को टैप करें। तुरंत कैलोरी, ताजगी और रेसिपी पाएं!'
              : 'Snap a meal photo or pick a food icon below for instant calories, freshness ratings, and zero-waste recipes.'}
          </p>

          {/* Two Pill Buttons: Filled + Dashed Outline (Like Image 5) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/food-scan"
              className="btn-squish w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-tomato text-white border-2.5 border-ink font-display font-black text-sm tracking-wide shadow-sticker hover:shadow-sticker-lg cursor-pointer transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>{isHindi ? 'खाना स्कैन करें' : 'SCAN A MEAL'}</span>
            </Link>

            <button
              type="button"
              onClick={scrollToPicker}
              className="btn-squish w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/95 dark:bg-dusk-card text-ink dark:text-dusk-text border-2.5 border-dashed border-ink font-display font-black text-sm tracking-wide shadow-sticker hover:shadow-sticker-lg cursor-pointer transition-all"
            >
              <span>🍌</span>
              <span>{isHindi ? 'फूड आइकॉन चुनें' : 'SELECT A FOOD ICON'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOD STICKER PICKER SECTION
          15 Hand-drawn SVG doodle stickers with wrapped text & macro popup
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sunny/30 border border-ink text-[11px] font-black uppercase text-ink">
              <span>Quick Tap Food Picker</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-ink dark:text-dusk-text mt-1">
              Tap Any Food to Inspect & Log
            </h2>
          </div>
          <p className="text-xs font-bold text-ink-muted">
            Tap a card to view macros, facts & 1-click log to Gym or Pantry
          </p>
        </div>

        {/* 15 Sticker Cards Grid */}
        <FoodStickerPicker onFoodLogged={calculateLiveGymMacros} />
      </section>

      {/* =========================================================================
          ACTIVE HIGH-PRIORITY ALERTS (IF ANY)
          ========================================================================= */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-3xl bg-amber-100 dark:bg-amber-950/60 border-2.5 border-ink shadow-sticker-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-sunny border-2 border-ink">
                  <AlertTriangle className="w-5 h-5 text-ink flex-shrink-0" />
                </div>
                <div>
                  <h4 className="font-display font-black text-sm text-ink dark:text-amber-200">
                    {alert.title}
                  </h4>
                  <p className="text-xs font-semibold text-ink/80 dark:text-amber-300 mt-0.5">
                    {alert.message}
                  </p>
                </div>
              </div>
              {alert.link && (
                <Link
                  to={alert.link}
                  className="btn-squish inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-dusk-surface border-2 border-ink text-xs font-black text-ink shadow-sticker-xs hover:shadow-sticker cursor-pointer whitespace-nowrap self-end sm:self-auto"
                >
                  Cook Zero-Waste <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          TODAY'S LIVE GYM MACROS STRIP
          Reflects logged items instantly with live totals & target indicators
          ========================================================================= */}
      <section className="rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-5 sm:p-6 shadow-sticker space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-grape/20 border-2 border-ink flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-grape" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-ink dark:text-dusk-text">
                Today's Gym & Macro Fuel
              </h3>
              <p className="text-xs font-semibold text-ink-muted">
                Live daily intake from food scans and logged stickers
              </p>
            </div>
          </div>
          <Link
            to="/gym"
            className="btn-squish inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-grape text-white border-2 border-ink text-xs font-black shadow-sticker-xs cursor-pointer"
          >
            Open Gym Mode <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-tomato/15 border-2 border-ink">
            <div className="flex items-center justify-between text-tomato mb-1">
              <span className="text-xs font-extrabold uppercase">Calories</span>
              <Flame className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-2xl text-ink">
                {gymSummary.calories}
              </span>
              <span className="text-[11px] font-bold text-ink-muted">/ 2,300 kcal</span>
            </div>
            <div className="w-full bg-white dark:bg-dusk-surface rounded-full h-2 mt-2 border border-ink overflow-hidden">
              <div
                className="bg-tomato h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (gymSummary.calories / 2300) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-grape/15 border-2 border-ink">
            <div className="flex items-center justify-between text-grape mb-1">
              <span className="text-xs font-extrabold uppercase">Protein</span>
              <Dumbbell className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-2xl text-ink">
                {gymSummary.protein}g
              </span>
              <span className="text-[11px] font-bold text-ink-muted">/ 140g target</span>
            </div>
            <div className="w-full bg-white dark:bg-dusk-surface rounded-full h-2 mt-2 border border-ink overflow-hidden">
              <div
                className="bg-grape h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (gymSummary.protein / 140) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sunny/20 border-2 border-ink">
            <div className="flex items-center justify-between text-amber-600 mb-1">
              <span className="text-xs font-extrabold uppercase">Carbs</span>
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-2xl text-ink">
                {gymSummary.carbs}g
              </span>
              <span className="text-[11px] font-bold text-ink-muted">/ 250g target</span>
            </div>
            <div className="w-full bg-white dark:bg-dusk-surface rounded-full h-2 mt-2 border border-ink overflow-hidden">
              <div
                className="bg-sunny h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (gymSummary.carbs / 250) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-peach/20 border-2 border-ink">
            <div className="flex items-center justify-between text-orange-600 mb-1">
              <span className="text-xs font-extrabold uppercase">Fats</span>
              <Droplets className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-2xl text-ink">
                {gymSummary.fat}g
              </span>
              <span className="text-[11px] font-bold text-ink-muted">/ 70g target</span>
            </div>
            <div className="w-full bg-white dark:bg-dusk-surface rounded-full h-2 mt-2 border border-ink overflow-hidden">
              <div
                className="bg-peach h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (gymSummary.fat / 70) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6 PRIMARY MODULE CARDS (STICKER STYLE WITH DOODLES)
          Plain English, large tap targets, colorful borders
          ========================================================================= */}
      <section className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-mint/30 border border-ink text-[11px] font-black uppercase text-ink">
            <span>Explore All Consoles</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-ink dark:text-dusk-text mt-1">
            Multimodal Food Intelligence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((mod) => {
            const ModDoodle = mod.Doodle;
            return (
              <div
                key={mod.title}
                className="rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-5 shadow-sticker hover:shadow-sticker-lg hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`w-14 h-14 rounded-2xl ${mod.accentSoft} border-2 border-ink flex items-center justify-center p-2 shadow-xs`}
                    >
                      <ModDoodle size={38} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-dusk-surface border border-ink text-[10px] font-black uppercase text-ink dark:text-dusk-text">
                      {mod.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-xl text-ink dark:text-dusk-text">
                    {mod.title}
                  </h3>
                  <p className="text-xs font-semibold text-ink-muted mt-1 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t-2 border-ink/10 flex items-center justify-between">
                  <Link
                    to={mod.to}
                    className={`btn-squish inline-flex items-center gap-1.5 px-4 py-2 rounded-full ${mod.accent} text-white border-2 border-ink text-xs font-display font-black shadow-sticker-xs cursor-pointer`}
                  >
                    <span>Open Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          PANTRY USE-SOON STRIP & DID YOU KNOW FOOD SCIENCE CARD
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pantry Use Soon Strip */}
        <div className="rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-5 shadow-sticker flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-peach" />
                <h3 className="font-display font-black text-lg text-ink dark:text-dusk-text">
                  Use Soon From Pantry
                </h3>
              </div>
              <Link to="/pantry" className="text-xs font-black text-peach hover:underline">
                View all ({expiring.length})
              </Link>
            </div>

            <div className="space-y-2">
              {expiring.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-sky-50 dark:bg-dusk-surface border-2 border-ink flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-peach border border-ink" />
                    <div>
                      <h5 className="font-display font-bold text-xs text-ink dark:text-dusk-text">
                        {item.name}
                      </h5>
                      <span className="text-[10px] font-semibold text-ink-muted">
                        Stored in {item.storage_location}
                      </span>
                    </div>
                  </div>
                  <ExpiryBadge daysLeft={item.days_remaining} status={item.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t-2 border-ink/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-muted">
              Prevent spoilage with zero waste
            </span>
            <Link
              to="/cooking"
              className="btn-squish inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sunny text-ink border-2 border-ink text-xs font-black shadow-sticker-xs cursor-pointer"
            >
              Cook These Now <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Rotating Did You Know Card */}
        <div className="rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-5 shadow-sticker flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-display font-black text-lg text-ink dark:text-dusk-text">
                  Food Science Fact
                </h3>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-sunny/30 border border-ink text-ink">
                {fact?.category || 'Nutrient Tip'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-sunny/15 border-2 border-ink text-xs font-medium text-ink dark:text-dusk-text leading-relaxed">
              "{fact?.fact || 'Bananas produce natural ethylene gas that speeds up the ripening of adjacent fruits.'}"
            </div>
          </div>

          <div className="pt-3 mt-3 border-t-2 border-ink/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-muted">
              Curated by Anshika Gupta
            </span>
            <Link
              to="/did-you-know"
              className="btn-squish inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-dusk-surface border-2 border-ink text-xs font-black text-ink shadow-sticker-xs cursor-pointer"
            >
              Explore 50+ Facts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
