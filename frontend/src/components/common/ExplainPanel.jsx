import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Cpu, Database, Eye, Check, Edit3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ExplainPanel({
  cues = [],
  dataSource = "database", // "database" | "ai_estimate"
  modelProvider = "mock",
  confidence = 0.95,
  howItWorksText = "",
  onCorrectFood,
  currentFoodName = "",
  className = ""
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [correctionInput, setCorrectionInput] = useState(currentFoodName);

  const isLowConfidence = confidence < 0.70;

  const handleSaveCorrection = (e) => {
    e.preventDefault();
    if (correctionInput.trim() && onCorrectFood) {
      onCorrectFood(correctionInput.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-hidden text-xs ${className}`}>
      {/* Low confidence warning & user correction bar */}
      {isLowConfidence && (
        <div className="p-3 bg-amber-500/15 border-b border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span className="font-semibold">Uncertain match ({Math.round(confidence * 100)}% confidence). Please verify or correct below:</span>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-[11px] self-start sm:self-auto transition-all"
            >
              <Edit3 className="w-3 h-3" />
              <span>Correct Food</span>
            </button>
          ) : null}
        </div>
      )}

      {/* Food Correction Form */}
      {isEditing && (
        <form onSubmit={handleSaveCorrection} className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 flex gap-2">
          <input
            type="text"
            value={correctionInput}
            onChange={(e) => setCorrectionInput(e.target.value)}
            placeholder="Type correct dish name..."
            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Header with Badges & Accordion Toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Data Source Badge */}
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold ${
            dataSource === "database"
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              : 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
          }`}>
            {dataSource === "database" ? <Database className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
            <span>{dataSource === "database" ? t('common.source_database') : t('common.source_ai')}</span>
          </span>

          {/* Model Provider */}
          <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
            <Cpu className="w-3 h-3 text-slate-400" />
            <span>Model: {modelProvider.toUpperCase()}</span>
          </span>

          {/* Confidence Indicator */}
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">
            {t('common.confidence')}: <strong className="text-slate-700 dark:text-slate-200">{Math.round(confidence * 100)}%</strong>
          </span>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <span>{t('common.why_this_result')}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Explanation Body */}
      {isOpen && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          {/* Visual/Audio/Text cues */}
          <div>
            <h5 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
              <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Multimodal Cues & Features Detected:</span>
            </h5>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cues.length > 0 ? (
                cues.map((cue, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{cue}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">No specific cues reported.</li>
              )}
            </ul>
          </div>

          {/* How it works plain-language tooltip */}
          {howItWorksText && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <p><strong>How it works:</strong> {howItWorksText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
