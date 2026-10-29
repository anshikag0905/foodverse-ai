import React from 'react';
import { Sparkles } from 'lucide-react';

export function Loader({ message = "Processing multimodal inputs...", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-3 ${className}`}>
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-200 dark:border-emerald-950 border-t-emerald-600 dark:border-t-emerald-400 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 animate-pulse">
        {message}
      </p>
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-28 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
      </div>
    </div>
  );
}
