import React from 'react';
import { Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { DoodleDonut, DoodlePancakes, DoodlePizza, DoodleSalad } from '../../assets/doodles';

export function Loader({
  message = 'Cooking up answers...',
  subtext = 'Analyzing food with multimodal intelligence ✨',
  type = 'donut', // 'donut' | 'pancake'
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-4 text-center ${className}`}>
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-white dark:bg-dusk-surface border-3 border-ink flex items-center justify-center p-2.5 shadow-sticker">
          {type === 'pancake' ? (
            <div className="animate-pancake-flip">
              <DoodlePancakes size={52} />
            </div>
          ) : (
            <div className="animate-donut-spin">
              <DoodleDonut size={52} />
            </div>
          )}
        </div>
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-sunny border-2 border-ink flex items-center justify-center shadow-xs">
          <Sparkles className="w-3 h-3 text-ink" />
        </div>
      </div>
      <div>
        <p className="font-display font-black text-sm text-ink dark:text-dusk-text">
          {message}
        </p>
        {subtext && (
          <p className="text-xs font-semibold text-ink-muted mt-0.5">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

export function DoodleEmptyState({
  title = 'Nothing here yet!',
  description = 'Snap a photo or add an item to start tracking.',
  actionLabel = 'Get Started',
  onAction,
  Doodle = DoodleSalad,
  className = ''
}) {
  return (
    <div className={`rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-8 text-center shadow-sticker flex flex-col items-center justify-center max-w-md mx-auto space-y-4 ${className}`}>
      <div className="w-20 h-20 rounded-3xl bg-sky-100 dark:bg-dusk-surface border-2.5 border-ink flex items-center justify-center p-2 shadow-sticker-sm animate-float">
        <Doodle size={52} />
      </div>
      <div>
        <h4 className="font-display font-black text-lg text-ink dark:text-dusk-text">
          {title}
        </h4>
        <p className="text-xs font-semibold text-ink-muted mt-1 max-w-xs">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn-squish inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-tomato text-white border-2 border-ink text-xs font-display font-black shadow-sticker-xs cursor-pointer hover:shadow-sticker"
        >
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}

export function DoodleErrorState({
  title = 'Oops, something went sideways!',
  description = 'We encountered a momentary glitch. Tap retry to run local deterministic AI.',
  onRetry,
  className = ''
}) {
  return (
    <div className={`rounded-3xl bg-white dark:bg-dusk-card border-3 border-ink p-8 text-center shadow-sticker flex flex-col items-center justify-center max-w-md mx-auto space-y-4 ${className}`}>
      <div className="w-20 h-20 rounded-3xl bg-tomato/20 border-2.5 border-ink flex items-center justify-center p-2 shadow-sticker-sm">
        <DoodlePizza size={52} className="rotate-12" />
      </div>
      <div>
        <h4 className="font-display font-black text-lg text-ink dark:text-dusk-text">
          {title}
        </h4>
        <p className="text-xs font-semibold text-ink-muted mt-1 max-w-xs">
          {description}
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn-squish inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sunny text-ink border-2 border-ink text-xs font-display font-black shadow-sticker-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-sky-200/50 dark:bg-dusk-surface rounded-2xl border border-ink/20 ${className}`} />
  );
}

export default Loader;
