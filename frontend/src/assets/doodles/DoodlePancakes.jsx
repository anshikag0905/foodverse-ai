import React from 'react';

export default function DoodlePancakes({ size = 48, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Butter Cube on top */}
      <rect
        x="26"
        y="12"
        width="12"
        height="10"
        rx="2"
        fill="#FFEA79"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M26 15L32 18L38 15"
        stroke="#0F1B3D"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Syrup Drip */}
      <path
        d="M29 22C29 27 34 28 34 32C34 35 32 37 32 37"
        stroke="#FFB38A"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Top Pancake */}
      <ellipse
        cx="32"
        cy="24"
        rx="22"
        ry="8"
        fill="#FFE2A4"
        stroke="#0F1B3D"
        strokeWidth="2.5"
      />
      {/* Middle Pancake */}
      <path
        d="M10 32C10 36.4 19.8 40 32 40C44.2 40 54 36.4 54 32"
        fill="#FFD285"
        stroke="#0F1B3D"
        strokeWidth="2.5"
      />
      <ellipse cx="32" cy="32" rx="22" ry="8" fill="#FFD285" stroke="#0F1B3D" strokeWidth="2.5" />

      {/* Bottom Pancake */}
      <path
        d="M9 40C9 45 19.3 49 32 49C44.7 49 55 45 55 40"
        fill="#E8B35A"
        stroke="#0F1B3D"
        strokeWidth="2.5"
      />
      <ellipse cx="32" cy="40" rx="23" ry="8.5" fill="#FFD285" stroke="#0F1B3D" strokeWidth="2.5" />

      {/* Plate */}
      <path
        d="M6 50C6 55.5 17.6 60 32 60C46.4 60 58 55.5 58 50"
        fill="#FFFFFF"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Sparkle */}
      <path
        d="M52 14L53.5 10L55 14L59 15.5L55 17L53.5 21L52 17L48 15.5L52 14Z"
        fill="#FF5A5F"
        stroke="#0F1B3D"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}