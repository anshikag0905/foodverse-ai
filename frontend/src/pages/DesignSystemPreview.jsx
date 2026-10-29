import React, { useState } from 'react';
import {
  Palette,
  Type,
  Layers,
  Check,
  Copy,
  Moon,
  Sun,
  Cloud,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  ArrowRight,
  Search,
  Scan,
  ShieldAlert,
  Video
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ScoreGauge from '../components/common/ScoreGauge';
import { EmptyState, Loader } from '../components/common/Loader';

export default function DesignSystemPreview() {
  const { theme, setTheme } = useTheme();
  const [copiedHex, setCopiedHex] = useState('');

  const themes = [
    {
      id: 'blue',
      name: 'Sky Blue (Default)',
      bg: 'linear-gradient(180deg, #DCEEFF 0%, #BFE0FF 100%)',
      card: '#FFFFFF',
      text: '#0F1B3D',
      accent: '#2563EB',
      border: '#E2E8F0',
      description: 'Calm sky-blue canvas with high-contrast white cards, deep navy text, and royal blue accent.'
    },
    {
      id: 'white',
      name: 'Pure White',
      bg: '#F8FAFC',
      card: '#FFFFFF',
      text: '#0F172A',
      accent: '#2563EB',
      border: '#E2E8F0',
      description: 'Fintech/health light theme with soft slate surfaces, near-black text, and royal blue accent.'
    },
    {
      id: 'black',
      name: 'True Black',
      bg: '#0A0A0A',
      card: '#141414',
      text: '#F8FAFC',
      accent: '#3B82F6',
      border: '#262626',
      description: 'Deep OLED black mode with subtle neutral borders, high-contrast white text, and vivid blue accent.'
    }
  ];

  const colorTokens = [
    { name: 'Accent Primary', hex: '#2563EB', role: 'Main CTA, links, focus rings' },
    { name: 'Accent Hover', hex: '#1D4ED8', role: 'Active & hover state for primary buttons' },
    { name: 'Navy 900 (Text)', hex: '#0F1B3D', role: 'Primary typography on Blue theme' },
    { name: 'Slate 900 (Text)', hex: '#0F172A', role: 'Primary typography on White theme' },
    { name: 'Slate 600 (Muted)', hex: '#475569', role: 'Subtitles, secondary labels, metadata' },
    { name: 'Border Subtle', hex: '#E2E8F0', role: '1px card borders and table dividers' },
    { name: 'Status Success', hex: '#10B981', role: 'Fresh status, hygiene pass, high protein' },
    { name: 'Status Warning', hex: '#F59E0B', role: 'Use soon, moderate freshness, hygiene warning' },
    { name: 'Status Danger', hex: '#EF4444', role: 'Spoiled produce, critical hygiene failure' },
  ];

  const handleCopyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(''), 2000);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="card-base p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-700 dark:text-blue-300">
          <Palette className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>FoodVerse AI Design System Catalog</span>
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
          Design Tokens & Components Specification
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Clean, modern, trustworthy health dashboard design system. 16px rounded cards, 1px thin borders, subtle soft shadows, pill buttons, and verified WCAG AA contrast across 3 themes.
        </p>

        {/* Live Theme Switcher on Design Page */}
        <div className="pt-2 flex items-center gap-2">
          <span className="text-xs font-medium text-[var(--text-muted)]">Active Theme:</span>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                theme === t.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Three Theme Comparison Cards */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
          1. Three Working Themes (WCAG AA Compliant)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((t) => (
            <div
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                theme === t.id
                  ? 'border-blue-500 ring-2 ring-blue-500/30'
                  : 'border-[var(--border-color)]'
              }`}
              style={{
                background: t.card,
                color: t.text
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm">{t.name}</span>
                {theme === t.id && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-semibold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs opacity-75 mb-4 leading-relaxed">
                {t.description}
              </p>
              <div className="space-y-1.5 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="opacity-60">Canvas:</span>
                  <span>{t.id === 'blue' ? '#DCEEFF -> #BFE0FF' : (t.id === 'white' ? '#F8FAFC' : '#0A0A0A')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Card:</span>
                  <span>{t.card}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Accent:</span>
                  <span style={{ color: t.accent }}>{t.accent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Color Palette Tokens */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
          2. Color Palette Tokens
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {colorTokens.map((c) => (
            <div
              key={c.name}
              onClick={() => handleCopyHex(c.hex)}
              className="card-base-hover p-3 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg shrink-0 border border-black/10"
                  style={{ backgroundColor: c.hex }}
                />
                <div>
                  <p className="font-semibold text-xs text-[var(--text-primary)]">{c.name}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{c.role}</p>
                </div>
              </div>
              <span className="font-mono text-xs text-[var(--text-muted)]">
                {copiedHex === c.hex ? 'Copied' : c.hex}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Typography Hierarchy */}
      <section className="card-base p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
          3. Typography Hierarchy
        </h2>
        <div className="space-y-3 divide-y divide-[var(--border-color)]">
          <div className="pt-2">
            <span className="text-[10px] uppercase font-mono text-[var(--text-faint)]">Display Large (Plus Jakarta Sans 800)</span>
            <p className="font-display font-extrabold text-3xl text-[var(--text-primary)]">
              Hungry? What's on your plate?
            </p>
          </div>
          <div className="pt-3">
            <span className="text-[10px] uppercase font-mono text-[var(--text-faint)]">Hindi Display (Noto Sans Devanagari 700)</span>
            <p className="font-hindi font-bold text-2xl text-[var(--text-primary)]">
              भूख लगी है? आपकी थाली में क्या है?
            </p>
          </div>
          <div className="pt-3">
            <span className="text-[10px] uppercase font-mono text-[var(--text-faint)]">Heading Section (Inter 600)</span>
            <p className="font-semibold text-base text-[var(--text-primary)]">
              Food Recognition & Multi-Item Plate Localizer
            </p>
          </div>
          <div className="pt-3">
            <span className="text-[10px] uppercase font-mono text-[var(--text-faint)]">Body Regular (Inter 400)</span>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Accepts meal photos, commercial kitchen videos, and food text queries through unified endpoints backed by Google Gemini Vision.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Button & Action Pill Components */}
      <section className="card-base p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
          4. Buttons & Pill Actions
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="pill-btn-primary">
            <span>Primary Action</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
          <button type="button" className="pill-btn-secondary">
            <span>Secondary Action</span>
          </button>
          <button type="button" className="pill-btn-secondary border-dashed">
            <span>Outline Action</span>
          </button>
          <button type="button" disabled className="pill-btn-primary opacity-50 cursor-not-allowed">
            <span>Disabled State</span>
          </button>
        </div>
      </section>

      {/* 5. Status Badges & Rubrics */}
      <section className="card-base p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
          5. Status Badges & Compliance Indicators
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Fresh & Optimal (Grade A)</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-medium">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Use Soon / Peak Ripeness</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 font-medium">
            <XCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Spoiled / Critical Violation</span>
          </div>
        </div>
      </section>

      {/* 6. Clean Empty State Preview */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
          6. Clean Empty State (No Illustrations or Emojis)
        </h2>
        <EmptyState
          icon={Scan}
          title="Component Empty State Preview"
          description="Consistent typography, subtle borders, and clear call-to-action button without cartoons."
          actionLabel="Primary Action"
          onAction={() => {}}
        />
      </section>
    </div>
  );
}
