import React from 'react';

export default function DoodleAvocado({ size = 48, className = '', ...props }) {
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
      {/* Outer Dark Green Skin */}
      <path
        d="M32 8C20 8 13 22 13 36C13 49 21 57 32 57C43 57 51 49 51 36C51 22 44 8 32 8Z"
        fill="#2A7A4E"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Creamy Light Green Flesh */}
      <path
        d="M32 12C23 12 17 24 17 36C17 46 23 53 32 53C41 53 47 46 47 36C47 24 41 12 32 12Z"
        fill="#C4F4A2"
        stroke="#0F1B3D"
        strokeWidth="2"
      />

      {/* Inner Golden Ring */}
      <ellipse cx="32" cy="38" rx="13" ry="13" fill="#E8F9B6" />

      {/* Brown Seed / Pit */}
      <circle cx="32" cy="38" r="9.5" fill="#8F5835" stroke="#0F1B3D" strokeWidth="2.2" />

      {/* Seed Highlight */}
      <path
        d="M29 33C31 31 34 31 36 32"
        stroke="#B87C52"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Sparkle */}
      <path
        d="M48 16L49 13L50 16L53 17L50 18L49 21L48 18L45 17L48 16Z"
        fill="#FFC93C"
        stroke="#0F1B3D"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}