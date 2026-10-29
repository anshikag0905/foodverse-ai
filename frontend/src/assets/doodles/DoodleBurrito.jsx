import React from 'react';

export default function DoodleBurrito({ size = 48, className = '', ...props }) {
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
      {/* Foil wrap base */}
      <path
        d="M14 42L28 56C30 58 34 58 36 56L52 40C54 38 54 34 52 32L38 18L14 42Z"
        fill="#E2E8F0"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Foil folds line */}
      <path d="M26 30L38 42M32 24L44 36" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

      {/* Tortilla Peeking */}
      <path
        d="M14 42L38 18C40 16 43 16 45 18L49 22C51 24 51 27 49 29L25 53"
        fill="#FFE8B5"
        stroke="#0F1B3D"
        strokeWidth="2.5"
      />

      {/* Filling peeking out at top left */}
      {/* Greens */}
      <path
        d="M20 18C17 14 13 15 11 19C9 23 13 26 16 25"
        fill="#3DDC97"
        stroke="#0F1B3D"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Tomatoes & Rice */}
      <circle cx="21" cy="14" r="3.5" fill="#FF5A5F" stroke="#0F1B3D" strokeWidth="2" />
      <circle cx="27" cy="15" r="3" fill="#FFC93C" stroke="#0F1B3D" strokeWidth="1.8" />
      <circle cx="25" cy="20" r="2.5" fill="#FFFFFF" stroke="#0F1B3D" strokeWidth="1.5" />

      {/* Cute Sparkle */}
      <path
        d="M10 8L11 5L12 8L15 9L12 10L11 13L10 10L7 9L10 8Z"
        fill="#3DDC97"
        stroke="#0F1B3D"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}