import React from 'react';

export default function DoodleDonut({ size = 48, className = '', ...props }) {
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
      {/* Base Dough Ring */}
      <circle cx="32" cy="32" r="24" fill="#FFD285" stroke="#0F1B3D" strokeWidth="2.5" />

      {/* Pink Strawberry Glaze with Wavy Edges */}
      <path
        d="M32 10C44 10 54 19 55 31C55 33 53 34 51 33C48 32 46 36 44 34C42 32 39 37 36 34C33 31 31 36 28 34C25 32 22 36 20 33C17 30 15 35 12 33C10 31 9 32 9 30C10 18 20 10 32 10Z"
        fill="#FFB38A"
        stroke="#0F1B3D"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Donut Hole */}
      <circle cx="32" cy="32" r="8" fill="#BFE6FF" stroke="#0F1B3D" strokeWidth="2.5" />

      {/* Colorful Sprinkles */}
      <rect x="23" y="16" width="5" height="2" rx="1" transform="rotate(-30 23 16)" fill="#FF5A5F" />
      <rect x="36" y="15" width="5" height="2" rx="1" transform="rotate(20 36 15)" fill="#3DDC97" />
      <rect x="44" y="22" width="5" height="2" rx="1" transform="rotate(-40 44 22)" fill="#8B5CF6" />
      <rect x="46" y="32" width="5" height="2" rx="1" transform="rotate(50 46 32)" fill="#FFC93C" />
      <rect x="18" y="26" width="5" height="2" rx="1" transform="rotate(10 18 26)" fill="#0284C7" />
      <rect x="22" y="36" width="5" height="2" rx="1" transform="rotate(-20 22 36)" fill="#FF5A5F" />
      <rect x="38" y="44" width="5" height="2" rx="1" transform="rotate(40 38 44)" fill="#3DDC97" />

      {/* Sparkle */}
      <path
        d="M52 10L53 7L54 10L57 11L54 12L53 15L52 12L49 11L52 10Z"
        fill="#FF5A5F"
        stroke="#0F1B3D"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}