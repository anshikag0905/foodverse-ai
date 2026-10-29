import React from 'react';
import { Calendar, Tag, ShieldCheck, AlertCircle, Share2, Download } from 'lucide-react';
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
    <div className={`rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft overflow-hidden transition-all space-y-6 p-6 ${className}`}>
      {/* Top Allergen Warning Banner if conflicts exist */}
      <AllergenAlert
        allergensDetected={allergens}
        dietConflicts={dietConflicts}
        uncertainAlerts={uncertainAlerts}
      />

      {/* Main Title & Image Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
            />
          )}
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {subtitle}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {category && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {category}
                </span>
              )}
              {cuisine && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  {cuisine}
                </span>
              )}
              {timestamp && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(timestamp).toLocaleDateString()}</span>
                </span>
              )}
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
