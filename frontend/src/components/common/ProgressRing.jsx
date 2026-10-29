import React from 'react';

export default function ProgressRing({
  label = "Protein",
  current = 80,
  target = 120,
  unit = "g",
  color = "#8b5cf6", // Gym violet by default
  size = 90,
  strokeWidth = 8,
  className = ""
}) {
  const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800 fill-transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="fill-transparent transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
            {percentage}%
          </span>
        </div>
      </div>
      <div className="mt-2">
        <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</h5>
        <span className="text-[11px] text-slate-400">
          {current}/{target}{unit}
        </span>
      </div>
    </div>
  );
}
