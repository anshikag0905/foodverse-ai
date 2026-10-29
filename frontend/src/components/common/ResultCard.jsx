import React from 'react';
import { Calendar, Tag, ShieldCheck, AlertCircle, Share2, Download, Sparkles } from 'lucide-react';
import ExplainPanel from './ExplainPanel';
import AllergenAlert from './AllergenAlert';
import ScoreGauge from './ScoreGauge';
import MacroChart from './MacroChart';

export default function ResultCard({
  title,
  subtitle,
  imageUrl,
  category,
  cuisine,
  timestamp,
  healthScore,
  healthScoreExplanation,
  nutrition,
  allergens = [],
  dietConflicts = [],
  uncertainAlerts = [],
  explainCues = [],
  dataSource = "database",
  modelProvider = "mock",
  confidence = 0.95,
  howItWorksText = "",
  onCorrectFood,
  actions = null,
  className = ""
}) {
  return (
    <div className={`rounded-3xl border-3 border-[var(--border-color)] bg-[var(--bg-card)] shadow-xs overflow-hidden transition-all space-y-6 p-6 ${className}`}>
      {/* Top Allergen Warning Banner if conflicts exist */}
      <AllergenAlert
        allergensDetected={allergens}
        dietConflicts={dietConflicts}
        uncertainAlerts={uncertainAlerts}
      />

      {/* Main Title & Image Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-[var(--border-color)]/10">
        <div className="flex items-center gap-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[var(--border-color)] shadow-xs"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-2xl text-[var(--text-primary)] tracking-tight">
                {title}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-mint/30 border border-[var(--border-color)] text-[11px] font-black text-emerald-800 dark:text-mint">
                {(confidence * 100).toFixed(0)}% Match
              </span>
            </div>
            {subtitle && (
              <p className="text-xs font-semibold text-[var(--text-muted)] mt-0.5">
                {subtitle}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {category && (
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-primary)]">
                  {category}
                </span>
              )}
              {cuisine && (
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-peach/20 border border-[var(--border-color)] text-orange-700 dark:text-peach">
                  {cuisine}
                </span>
              )}
              <span className="text-[10px] font-bold text-[var(--text-muted)] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sunny" />
                <span>{dataSource === 'database' ? 'Verified Database' : 'Multimodal Vision'}</span>
              </span>
            </div>
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {actions}
          </div>
        )}
      </div>

      {/* Gauges & Macro Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {healthScore !== undefined && (
          <ScoreGauge
            score={healthScore}
            label="Nutritional Health Score"
            explanation={healthScoreExplanation || "Comprehensive rating based on nutrient density, fiber, and sodium balance."}
          />
        )}
        {nutrition && (
          <MacroChart
            calories={nutrition.calories}
            protein={nutrition.protein}
            carbs={nutrition.carbs}
            fat={nutrition.fat}
            fiber={nutrition.fiber}
            servingSize={nutrition.servingSize}
          />
        )}
      </div>

      {/* Explainability & Transparency Panel */}
      <ExplainPanel
        cues={explainCues}
        dataSource={dataSource}
        modelProvider={modelProvider}
        confidence={confidence}
        howItWorksText={howItWorksText}
        onCorrectFood={onCorrectFood}
        currentFoodName={title}
      />
    </div>
  );
}
