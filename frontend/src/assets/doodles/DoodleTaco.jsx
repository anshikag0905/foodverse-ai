import React from 'react';

export default function DoodleTaco({ size = 48, className = '', ...props }) {
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
      {/* Back Tortilla */}
      <path
        d="M10 46C10 24 20 16 34 16C46 16 54 26 54 46"
        fill="#FFD285"
        stroke="#0F1B3D"
        strokeWidth="2.5"
      />

      {/* Meat & Seasoning Filling */}
      <path
        d="M14 42C14 28 22 23 34 23C44 23 50 30 50 42"
        fill="#995D3F"
        stroke="#0F1B3D"
        strokeWidth="2"
      />

      {/* Wavy Shredded Lettuce */}
      <path
        d="M14 36C18 32 20 38 24 34C28 30 30 36 34 32C38 28 40 34 44 30C48 26 50 32 52 28"
        stroke="#3DDC97"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Cheese cubes and diced tomatoes */}
      <rect x="23" y="27" width="5" height="5" rx="1" fill="#FF5A5F" stroke="#0F1B3D" strokeWidth="1.5" />
      <rect x="36" y="26" width="5" height="5" rx="1" fill="#FFC93C" stroke="#0F1B3D" strokeWidth="1.5" />
      <rect x="44" y="32" width="4" height="4" rx="1" fill="#FF5A5F" stroke="#0F1B3D" strokeWidth="1.2" />

      {/* Front Crunchy Taco Shell Fold */}
      <path
        d="M10 46C10 49 18 52 32 52C46 52 54 49 54 46C54 36 46 32 32 32C18 32 10 36 10 46Z"
        fill="#FFEA79"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Shell crispy toast specks */}
      <circle cx="24" cy="42" r="1.5" fill="#E8985E" />
      <circle cx="34" cy="44" r="1.5" fill="#E8985E" />
      <circle cx="43" cy="41" r="1.5" fill="#E8985E" />
    </svg>
  );
}