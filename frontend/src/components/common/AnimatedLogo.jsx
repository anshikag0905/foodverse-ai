import React from 'react';

/**
 * AnimatedLogo
 * Modern, clean, professional health-tech emblem:
 * A stylized pulsing nutrition shield / lens ring with smooth breathing animation.
 */
export default function AnimatedLogo({ size = 32, className = "" }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="FoodVerse AI Logo"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <filter id="subtle-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#2563EB" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer breathing ring */}
        <circle
          cx="24"
          cy="24"
          r="21"
          stroke="url(#logo-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="90 35"
          className="origin-center animate-[spin_8s_linear_infinite]"
        />

        {/* Inner balanced diet arcs */}
        <path
          d="M24 10C16.268 10 10 16.268 10 24C10 31.732 16.268 38 24 38"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-70"
        />
        <path
          d="M24 14C29.5228 14 34 18.4772 34 24C34 29.5228 29.5228 34 24 34"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />

        {/* Core health star / spark */}
        <path
          d="M24 18L25.5 22.5L30 24L25.5 25.5L24 30L22.5 25.5L18 24L22.5 22.5L24 18Z"
          fill="url(#logo-grad)"
          filter="url(#subtle-glow)"
          className="origin-center animate-pulse"
        />
      </svg>
    </div>
  );
}
