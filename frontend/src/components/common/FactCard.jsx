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

  return (
    <div className={`rounded-3xl border-3 border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-xs hover:shadow-xs hover:-translate-y-1 transition-all flex flex-col justify-between ${className}`}>
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-primary)]">
              {fact.category || "Food Science"}
            </span>
            {fact.verified && (
              <span className="flex items-center gap-1 text-[11px] font-black text-emerald-800 dark:text-mint">
                <CheckCircle className="w-3.5 h-3.5 text-mint" />
                <span>Verified</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleFavoriteClick}
              type="button"
              className={`p-1.5 rounded-xl border border-[var(--border-color)] transition-colors cursor-pointer ${
                isFav
                  ? 'text-tomato bg-tomato/20'
                  : 'text-[var(--text-muted)] hover:text-tomato bg-white dark:bg-[var(--bg-card-subtle)]'
              }`}
              title={isFav ? "Saved to favorites" : "Favorite this fact"}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-tomato text-tomato' : ''}`} />
            </button>
            {onNextFact && (
              <button
                onClick={onNextFact}
                type="button"
                className="p-1.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-sunny bg-white dark:bg-[var(--bg-card-subtle)] transition-colors cursor-pointer"
                title="Next Fact"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Fact Body */}
        <div className="flex gap-3">
          <div className="p-2 rounded-2xl bg-sunny/30 border border-[var(--border-color)] text-amber-600 flex-shrink-0 self-start">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <p className="font-display font-bold text-sm text-[var(--text-primary)] leading-relaxed">
              "{fact.fact}"
            </p>
          </div>
        </div>
      </div>

      {fact.source_name && (
        <div className="pt-3 mt-3 border-t-2 border-[var(--border-color)]/10 text-[11px] text-[var(--text-muted)] flex items-center justify-between">
          <span className="truncate max-w-[85%]">
            Source: <strong className="text-[var(--text-primary)]">{fact.source_name}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
