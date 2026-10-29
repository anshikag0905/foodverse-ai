import React, { useState } from 'react';
import { Lightbulb, Heart, Shuffle, CheckCircle, ExternalLink, Bookmark } from 'lucide-react';

export default function FactCard({
  fact = {
    id: 1,
    fact: "Bananas produce ethylene gas, which accelerates the ripening of other nearby fruits like apples and avocados.",
    category: "Freshness & Storage",
    source_name: "USDA Agricultural Research Service",
    verified: true,
    is_favorite: false
  },
  onFavoriteToggle,
  onNextFact,
  compact = false,
  className = ""
}) {
  const [isFav, setIsFav] = useState(fact.is_favorite || false);

  const handleFavoriteClick = () => {
    const nextState = !isFav;
    setIsFav(nextState);
    if (onFavoriteToggle) onFavoriteToggle(fact.id, nextState);
  };

  const categoryColors = {
    "Nutrition": "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    "Freshness & Storage": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    "Food Safety": "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
    "Cooking Science": "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
    "Culture & History": "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
    "Fitness": "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
  };

  const badgeClass = categoryColors[fact.category] || "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";

  return (
    <div className={`rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft transition-all ${className}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${badgeClass}`}>
            {fact.category || "Food Science"}
          </span>
          {fact.verified && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-3 h-3" />
              <span>Verified Fact</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleFavoriteClick}
            type="button"
            className={`p-1.5 rounded-xl transition-colors ${
              isFav
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/60'
                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isFav ? "Saved to favorites" : "Favorite this fact"}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
          {onNextFact && (
            <button
              onClick={onNextFact}
              type="button"
              className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Next Fact"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Fact Body */}
      <div className="flex gap-3">
        <div className="p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex-shrink-0 self-start">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
            {fact.fact}
          </p>
          {fact.source_name && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <span>Source:</span>
              <strong className="text-slate-600 dark:text-slate-400 font-semibold">{fact.source_name}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
