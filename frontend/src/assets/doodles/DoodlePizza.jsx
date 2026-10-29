import React from 'react';

export default function DoodlePizza({ size = 48, className = '', ...props }) {
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
      {/* Pizza Slice Body */}
      <path
        d="M32 56L10 16C23 11 41 11 54 16L32 56Z"
        fill="#FFD269"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Crust Arc */}
      <path
        d="M10 16C23 10 41 10 54 16C55 12 43 7 32 7C21 7 9 12 10 16Z"
        fill="#E8985E"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Cheese Melt Drips */}
      <path
        d="M16 22C19 25 22 25 25 23C27 26 31 27 34 24C37 27 42 26 44 23"
        stroke="#FFF099"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Pepperoni Slices */}
      <circle cx="28" cy="27" r="5" fill="#FF5A5F" stroke="#0F1B3D" strokeWidth="2" />
      <circle cx="38" cy="35" r="4.5" fill="#FF5A5F" stroke="#0F1B3D" strokeWidth="2" />
      <circle cx="27" cy="42" r="4" fill="#FF5A5F" stroke="#0F1B3D" strokeWidth="2" />

      {/* Basil leaf herbs */}
      <ellipse cx="36" cy="24" rx="2.5" ry="1.5" transform="rotate(-30 36 24)" fill="#3DDC97" stroke="#0F1B3D" strokeWidth="1.2" />
      <ellipse cx="23" cy="35" rx="2.5" ry="1.5" transform="rotate(40 23 35)" fill="#3DDC97" stroke="#0F1B3D" strokeWidth="1.2" />

      {/* Sparkle */}
      <path
        d="M54 28L55 25L56 28L59 29L56 30L55 33L54 30L51 29L54 28Z"
        fill="#FF5A5F"
        stroke="#0F1B3D"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}