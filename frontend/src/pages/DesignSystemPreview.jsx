import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Palette,
  Type,
  Layers,
  ArrowRight,
  Check,
  Copy,
  Moon,
  Sun
} from 'lucide-react';
import { ALL_DOODLES } from '../assets/doodles';
import { useTheme } from '../context/ThemeContext';

export default function DesignSystemPreview() {
  const { theme, toggleTheme } = useTheme();
  const [doodleSize, setDoodleSize] = useState(64);
  const [copiedHex, setCopiedHex] = useState('');
  const [selectedDoodle, setSelectedDoodle] = useState(null);

  const colors = [
    { name: 'Sky Light (Canvas)', hex: '#BFE6FF', role: 'Default light background' },
    { name: 'Sky Deep (Gradient)', hex: '#8FD3FF', role: 'Hero gradient end' },
    { name: 'Ink Navy (Borders & Text)', hex: '#0F1B3D', role: '2px solid outlines & headings' },
    { name: 'Card Cream (Surfaces)', hex: '#FFFDF9', role: 'Sticker card background' },
    { name: 'Tomato Red (Recognition)', hex: '#FF5A5F', role: 'Primary action / Food scan' },
    { name: 'Mint (Freshness)', hex: '#3DDC97', role: 'Freshness / Spoilage detection' },
    { name: 'Ocean Teal (Hygiene)', hex: '#0284C7', role: 'Kitchen safety audits' },
    { name: 'Sunny Yellow (Cooking)', hex: '#FFC93C', role: 'Smart cooking assistant' },
    { name: 'Grape (Meal Planner)', hex: '#8B5CF6', role: 'Adaptive diet & grocery' },
    { name: 'Warm Peach (Pantry)', hex: '#FFB38A', role: 'Pantry & expiry tracking' },
    { name: 'Deep Purple (Gym Mode)', hex: '#7C3AED', role: 'Athletic macro telemetry' },
    { name: 'Deep Navy (Dark Canvas)', hex: '#0A1128', role: 'Friendly dark mode background' },
    { name: 'Navy Surface (Dark Card)', hex: '#131F42', role: 'Dark mode card surface' },
  ];

  const handleCopyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(''), 2000);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-200 via-sky-100 to-sky-300 dark:from-dusk-card dark:via-dusk-surface dark:to-dusk-card border-3 border-ink p-8 shadow-sticker">
        {/* Confetti dots */}
        <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-tomato animate-ping" />
        <div className="absolute top-10 right-14 w-2.5 h-2.5 rounded-full bg-sunny" />
        <div className="absolute bottom-6 left-24 w-3.5 h-3.5 rounded-full bg-mint" />
        <div className="absolute bottom-6 right-20 w-3 h-3 rounded-full bg-grape" />

        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border-2 border-ink text-ink text-xs font-bold shadow-sticker-sm">
            <Sparkles className="w-3.5 h-3.5 text-tomato" />
            FoodVerse AI • Design System Specification & Token Catalog
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-ink dark:text-dusk-text tracking-tight">
            Playful Food-First UI Tokens 🎨
          </h1>
          <p className="text-base text-ink-muted dark:text-dusk-muted font-body font-semibold">
            Hand-drawn food doodles, 2px navy sticker outlines, tactile squishy buttons, and chunky rounded typography designed by Anshika Gupta.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-full bg-card dark:bg-dusk-surface border-2 border-ink text-ink dark:text-dusk-text text-xs font-bold shadow-sticker-sm btn-squish flex items-center gap-2 cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-sunny" /> : <Moon className="w-4 h-4 text-grape" />}
              <span>Toggle Theme ({theme})</span>
            </button>
            <Link
              to="/"
              className="px-4 py-2 rounded-full bg-tomato text-white border-2 border-ink text-xs font-bold shadow-sticker-sm btn-squish flex items-center gap-1.5"
            >
              <span>Back to Home</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 1. Original SVG Food Doodle Library */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-ink dark:text-dusk-text flex items-center gap-2">
              <span>🍌</span>
              <span>15 Original Hand-Drawn Food Doodles</span>
            </h2>
            <p className="text-xs text-ink-muted dark:text-dusk-muted font-body">
              Pure React SVG components with 2.5px navy outlines, flat pastel fills, and tiny sparkles (&lt; 3 KB each).
            </p>
          </div>

          {/* Size Stepper */}
          <div className="flex items-center gap-2 bg-card dark:bg-dusk-card border-2 border-ink p-1.5 rounded-full shadow-sticker-sm">
            <span className="text-xs font-bold text-ink dark:text-dusk-text px-2">Size:</span>
            {[32, 48, 64, 80].map((sz) => (
              <button
                key={sz}
                onClick={() => setDoodleSize(sz)}
                className={`px-2.5 py-1 rounded-full text-xs font-extrabold border-2 border-ink btn-squish ${
                  doodleSize === sz
                    ? 'bg-sunny text-ink shadow-sticker-sm'
                    : 'bg-white dark:bg-dusk-surface text-ink-muted'
                }`}
              >
                {sz}px
              </button>
            ))}
          </div>
        </div>

        {/* Doodle Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {ALL_DOODLES.map((doodle) => {
            const Icon = doodle.Component;
            return (
              <button
                key={doodle.id}
                onClick={() => setSelectedDoodle(doodle)}
                className="p-4 rounded-3xl bg-card dark:bg-dusk-card border-2 border-ink shadow-sticker hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-sticker-lg transition-all duration-150 flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <div className="mb-2 group-hover:scale-110 transition-transform duration-200">
                  <Icon size={doodleSize} />
                </div>
                <strong className="text-sm font-display font-bold text-ink dark:text-dusk-text truncate w-full block">
                  {doodle.name}
                </strong>
                <span className="text-[11px] font-bold text-tomato block mt-0.5">
                  {doodle.cal} kcal • {doodle.protein}
                </span>
                <span className="text-[10px] font-semibold text-ink-muted dark:text-dusk-muted mt-1 px-2 py-0.5 rounded-full bg-sky-100 dark:bg-dusk-surface border border-ink/40">
                  &lt;Doodle{doodle.name.replace(/\s+/g, '')} /&gt;
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Color Palette Swatches */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-ink dark:text-dusk-text flex items-center gap-2">
            <Palette className="w-6 h-6 text-tomato" />
            <span>Design Tokens — Palette Swatches</span>
          </h2>
          <p className="text-xs text-ink-muted dark:text-dusk-muted font-body">
            Target reference palette featuring sky blue, deep navy outlines, and food-inspired module accents.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {colors.map((c) => (
            <div
              key={c.name}
              className="p-3 rounded-2xl bg-card dark:bg-dusk-card border-2 border-ink shadow-sticker space-y-2"
            >
              <div
                className="w-full h-14 rounded-xl border-2 border-ink flex items-end justify-end p-1.5"
                style={{ backgroundColor: c.hex }}
              >
                <button
                  onClick={() => handleCopyHex(c.hex)}
                  className="p-1 rounded-md bg-white/90 text-ink hover:scale-110 transition shadow-xs cursor-pointer"
                  title="Copy hex code"
                >
                  {copiedHex === c.hex ? <Check className="w-3.5 h-3.5 text-mint" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div>
                <strong className="text-xs font-display font-bold text-ink dark:text-dusk-text block truncate">
                  {c.name}
                </strong>
                <code className="text-[10px] font-mono font-bold text-ink-muted dark:text-dusk-muted block">
                  {c.hex}
                </code>
                <span className="text-[10px] text-ink-muted/80 dark:text-dusk-muted/80 block leading-tight mt-0.5">
                  {c.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Typography & Bilingual Specimens */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-ink dark:text-dusk-text flex items-center gap-2">
            <Type className="w-6 h-6 text-grape" />
            <span>Typography Specimens (English &amp; हिन्दी)</span>
          </h2>
          <p className="text-xs text-ink-muted dark:text-dusk-muted font-body">
            Chunky display headlines in Fredoka &amp; Baloo 2 paired with legible body typography in Nunito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* English Display */}
          <div className="p-6 rounded-3xl bg-card dark:bg-dusk-card border-2 border-ink shadow-sticker space-y-3">
            <span className="text-xs font-bold text-tomato uppercase tracking-wide">
              Display Typography (Fredoka)
            </span>
            <h3 className="text-3xl font-display font-black text-ink dark:text-dusk-text">
              Hungry? What's on your plate? ✨
            </h3>
            <p className="text-base font-body text-ink-muted dark:text-dusk-muted">
              Tap any food icon to instantly calculate calories, protein, carbs, and micronutrients with hand-drawn warmth.
            </p>
          </div>

          {/* Hindi Devanagari Display */}
          <div className="p-6 rounded-3xl bg-card dark:bg-dusk-card border-2 border-ink shadow-sticker space-y-3">
            <span className="text-xs font-bold text-mint uppercase tracking-wide">
              Devanagari Display (Baloo 2)
            </span>
            <h3 className="text-3xl font-hindi font-bold text-ink dark:text-dusk-text">
              भूख लगी है? आज आपकी थाली में क्या है? 🥞
            </h3>
            <p className="text-base font-hindi text-ink-muted dark:text-dusk-muted">
              किसी भी भोजन पर टैप करें और तुरंत कैलोरी, प्रोटीन, और पोषण संबंधी जानकारी प्राप्त करें।
            </p>
          </div>
        </div>
      </section>

      {/* 4. Button & Sticker Component Styles */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-ink dark:text-dusk-text flex items-center gap-2">
            <Layers className="w-6 h-6 text-sunny" />
            <span>Tactile Sticker Buttons &amp; Pill Badges</span>
          </h2>
          <p className="text-xs text-ink-muted dark:text-dusk-muted font-body">
            Click any button below to test the tactile 2px squish and shadow mechanics.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-card dark:bg-dusk-card border-2 border-ink shadow-sticker flex flex-wrap items-center gap-4">
          <button className="px-6 py-3 rounded-full bg-tomato text-white border-2 border-ink text-sm font-display font-extrabold shadow-sticker btn-squish cursor-pointer">
            📸 Scan a Meal (Primary Filled)
          </button>
          <button className="px-6 py-3 rounded-full bg-card dark:bg-dusk-surface text-ink dark:text-dusk-text border-2 border-dashed border-ink text-sm font-display font-extrabold shadow-sticker btn-squish cursor-pointer">
            🍌 Pick a Food Icon (Dashed Outline)
          </button>
          <button className="px-5 py-2.5 rounded-full bg-mint text-ink border-2 border-ink text-xs font-bold shadow-sticker-sm btn-squish cursor-pointer">
            🟢 Fresh (Traffic-Light)
          </button>
          <button className="px-5 py-2.5 rounded-full bg-sunny text-ink border-2 border-ink text-xs font-bold shadow-sticker-sm btn-squish cursor-pointer">
            🟡 Moderately Fresh
          </button>
          <button className="px-5 py-2.5 rounded-full bg-tomato text-white border-2 border-ink text-xs font-bold shadow-sticker-sm btn-squish cursor-pointer">
            🔴 Spoiled (Alert)
          </button>
          <button className="px-5 py-2.5 rounded-full bg-grape text-white border-2 border-ink text-xs font-bold shadow-sticker-sm btn-squish cursor-pointer">
            ⚡ 21.5g Protein (Gym Mode)
          </button>
        </div>
      </section>

      {/* 5. Animated Loading & State Doodles */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-ink dark:text-dusk-text flex items-center gap-2">
            <span>🥞</span>
            <span>Animated Food Loaders &amp; Empty States</span>
          </h2>
          <p className="text-xs text-ink-muted dark:text-dusk-muted font-body">
            Gentle floating and spinning hand-drawn animations for loading and empty screens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-card dark:bg-dusk-card border-2 border-ink shadow-sticker flex flex-col items-center justify-center text-center space-y-2">
            <div className="animate-pancake-flip">
              {React.createElement(ALL_DOODLES[1].Component, { size: 64 })}
            </div>
            <strong className="text-sm font-display font-bold text-ink dark:text-dusk-text">
              Flipping Pancake Loader
            </strong>
            <span className="text-xs text-ink-muted dark:text-dusk-muted">
              Used during food photo recognition &amp; model reasoning
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-card dark:bg-dusk-card border-2 border-ink shadow-sticker flex flex-col items-center justify-center text-center space-y-2">
            <div className="animate-donut-spin">
              {React.createElement(ALL_DOODLES[10].Component, { size: 64 })}
            </div>
            <strong className="text-sm font-display font-bold text-ink dark:text-dusk-text">
              Spinning Donut Spinner
            </strong>
            <span className="text-xs text-ink-muted dark:text-dusk-muted">
              Used during recipe searches and meal plan generation
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-card dark:bg-dusk-card border-2 border-ink shadow-sticker flex flex-col items-center justify-center text-center space-y-2">
            <div className="animate-float">
              {React.createElement(ALL_DOODLES[11].Component, { size: 64 })}
            </div>
            <strong className="text-sm font-display font-bold text-ink dark:text-dusk-text">
              Gentle Float Doodle
            </strong>
            <span className="text-xs text-ink-muted dark:text-dusk-muted">
              Used for floating decorative hero stickers
            </span>
          </div>
        </div>
      </section>

      {/* Selected Doodle Modal */}
      {selectedDoodle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-card dark:bg-dusk-card border-3 border-ink p-6 shadow-sticker-lg space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-tomato uppercase tracking-wide">
                {selectedDoodle.category}
              </span>
              <button
                onClick={() => setSelectedDoodle(null)}
                className="w-7 h-7 rounded-full bg-sky-100 border border-ink text-ink font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-center py-2">
              {React.createElement(selectedDoodle.Component, { size: 96 })}
            </div>

            <div className="text-center">
              <h3 className="text-xl font-display font-black text-ink dark:text-dusk-text">
                {selectedDoodle.name}
              </h3>
              <p className="text-xs font-body font-bold text-tomato mt-1">
                {selectedDoodle.cal} kcal • {selectedDoodle.protein} Protein
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-sky-100 dark:bg-dusk-surface border border-ink/40 text-xs font-mono text-ink dark:text-dusk-text text-center">
              import &#123; Doodle{selectedDoodle.name.replace(/\s+/g, '')} &#125; from '../assets/doodles';
            </div>

            <button
              onClick={() => setSelectedDoodle(null)}
              className="w-full py-2.5 rounded-full bg-tomato text-white border-2 border-ink font-display font-extrabold text-xs shadow-sticker-sm btn-squish cursor-pointer"
            >
              Done Previewing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}