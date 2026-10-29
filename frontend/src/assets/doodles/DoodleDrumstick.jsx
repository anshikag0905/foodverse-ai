import React from 'react';

export default function DoodleDrumstick({ size = 48, className = '', ...props }) {
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
      {/* Bone Knobs (Bottom Left) */}
      <circle cx="16" cy="46" r="4.5" fill="#FFFFFF" stroke="#0F1B3D" strokeWidth="2.2" />
      <circle cx="12" cy="52" r="4.5" fill="#FFFFFF" stroke="#0F1B3D" strokeWidth="2.2" />

      {/* Bone Shaft */}
      <path
        d="M16 46L27 35"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M16 46L27 35"
        stroke="#0F1B3D"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Roasted Golden Chicken Meat Bulb */}
      <path
        d="M23 37C20 30 24 16 35 12C47 7 57 18 55 30C53 41 38 45 30 43C26 42 24 40 23 37Z"
        fill="#FFD285"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Crispy Roasted Skin Layer Highlight */}
      <path
        d="M27 34C25 29 28 19 36 15C45 11 53 19 51 28C49 37 38 40 32 38"
        fill="#FFB38A"
        stroke="#0F1B3D"
        strokeWidth="1.8"
      />

      {/* Roast Glaze Specks */}
      <circle cx="34" cy="24" r="1.5" fill="#E8985E" />
      <circle cx="43" cy="26" r="1.5" fill="#E8985E" />
      <circle cx="37" cy="32" r="1.5" fill="#E8985E" />

      {/* Herb Garnish Sprig on top */}
      <ellipse cx="44" cy="14" rx="3" ry="1.8" transform="rotate(-30 44 14)" fill="#3DDC97" stroke="#0F1B3D" strokeWidth="1.2" />
      <ellipse cx="49" cy="18" rx="3" ry="1.8" transform="rotate(20 49 18)" fill="#3DDC97" stroke="#0F1B3D" strokeWidth="1.2" />

      {/* Sparkle */}
      <path
        d="M12 20L13 17L14 20L17 21L14 22L13 25L12 22L9 21L12 20Z"
        fill="#FFC93C"
        stroke="#0F1B3D"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}