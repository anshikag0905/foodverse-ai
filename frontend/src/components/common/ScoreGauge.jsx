import React from 'react';

export default function ScoreGauge({
  score = 85,
  maxScore = 100,
  label = "Health Score",
  explanation = "",
  size = "md", // "sm", "md", "lg"
  className = ""
}) {
  const percentage = Math.min(Math.max(Math.round((score / maxScore) * 100), 0), 100);

  // Determine color scheme
  let strokeColor = "#10b981"; // Emerald
  let bgColor = "bg-emerald-50 dark:bg-emerald-950/40";
  let textColor = "text-emerald-700 dark:text-emerald-300";
  let badgeText = "Excellent";

  if (percentage < 60) {
    strokeColor = "#f43f5e"; // Rose
    bgColor = "bg-rose-50 dark:bg-rose-950/40";
    textColor = "text-rose-700 dark:text-rose-300";
    badgeText = "Needs Attention";
  } else if (percentage < 80) {
    strokeColor = "#f59e0b"; // Amber
    bgColor = "bg-amber-50 dark:bg-amber-950/40";
    textColor = "text-amber-700 dark:text-amber-300";
    badgeText = "Moderate";
  }

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft flex items-center gap-4 ${className}`}>
      {/* SVG Circular Dial */}
      <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="9"
            className="text-slate-100 dark:text-slate-800 fill-transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="fill-transparent transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">
            {score}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">/100</span>
        </div>
      </div>

      {/* Metric Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</h4>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${bgColor} ${textColor}`}>
            {badgeText}
          </span>
        </div>
        {explanation && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {explanation}
          </p>
        )}
      </div>
    </div>
  );
}
