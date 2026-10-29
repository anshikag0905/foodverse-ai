import React from 'react';
import { Loader2, Inbox, ArrowRight } from 'lucide-react';

export function Loader({
  message = 'Analyzing your input...',
  subtext = 'Processing with multimodal vision AI',
  progress = null,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center space-y-4 ${className}`}>
      <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
        <Loader2 className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-spin" strokeWidth={1.75} />
      </div>

      <div className="space-y-1 max-w-sm">
        <p className="font-semibold text-sm text-[var(--text-primary)]">
          {message}
        </p>
        {subtext && (
          <p className="text-xs text-[var(--text-muted)]">
            {subtext}
          </p>
        )}
      </div>

      {typeof progress === 'number' && (
        <div className="w-48 bg-slate-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function EmptyState({
  title = 'No records found',
  description = 'Upload a photo or search the database to get started.',
  actionLabel = null,
  onAction = null,
  icon: Icon = Inbox,
  className = ''
}) {
  return (
    <div className={`card-base p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto space-y-4 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-[var(--text-muted)] border border-[var(--border-color)]">
        <Icon className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-base text-[var(--text-primary)]">
          {title}
        </h4>
        <p className="text-xs text-[var(--text-muted)] max-w-xs leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="pill-btn-primary text-xs py-2 px-4 cursor-pointer"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

// Backward-compatible alias
export const DoodleEmptyState = EmptyState;
export default Loader;
