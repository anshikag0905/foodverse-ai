import React from 'react';
import { AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AllergenAlert({
  allergensDetected = [],
  dietConflicts = [],
  uncertainAlerts = [],
  className = ""
}) {
  const { t } = useTranslation();

  const hasDirectAllergens = allergensDetected.length > 0;
  const hasDietConflicts = dietConflicts.length > 0;
  const hasUncertain = uncertainAlerts.length > 0;

  if (!hasDirectAllergens && !hasDietConflicts && !hasUncertain) {
    return null;
  }

  return (
    <div
      role="alert"
      className={`p-4 md:p-5 rounded-2xl border transition-all ${
        hasDirectAllergens
          ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
          : hasDietConflicts
          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
          : 'bg-orange-50 dark:bg-orange-950/50 border-orange-300 dark:border-orange-800 text-orange-900 dark:text-orange-100'
      } shadow-soft ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl flex-shrink-0 ${
          hasDirectAllergens
            ? 'bg-rose-600 text-white'
            : 'bg-amber-500 text-white'
        }`}>
          <ShieldAlert className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-wider">
              {t('allergen_alert.title')}
            </h4>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide bg-rose-200 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200">
              High Priority Warning
            </span>
          </div>

          {/* Direct Allergen Matches */}
          {hasDirectAllergens && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                Direct Allergy Conflict Found:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {allergensDetected.map((allergen, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white shadow-xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Contains {allergen}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Diet Incompatibilities */}
          {hasDietConflicts && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                Dietary Preference Conflict:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {dietConflicts.map((diet, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200"
                  >
                    Conflicts with {diet}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* May Contain / Uncertainty */}
          {hasUncertain && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {t('allergen_alert.may_contain')}:
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                {uncertainAlerts.join(', ')}
              </p>
            </div>
          )}

          {/* Physical Label Disclaimer */}
          <div className="pt-2 border-t border-rose-200 dark:border-rose-800/80 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{t('allergen_alert.read_labels')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
