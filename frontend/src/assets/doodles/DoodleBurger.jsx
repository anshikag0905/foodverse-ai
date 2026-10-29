import React from 'react';

export default function DoodleBurger({ size = 48, className = '', ...props }) {
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
      {/* Top Bun */}
      <path
        d="M10 28C10 16 19.8 11 32 11C44.2 11 54 16 54 28H10Z"
        fill="#FFD285"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sesame Seeds */}
      <ellipse cx="22" cy="18" rx="1.5" ry="2.5" transform="rotate(-30 22 18)" fill="#FFF4D0" stroke="#0F1B3D" strokeWidth="1" />
      <ellipse cx="32" cy="16" rx="1.5" ry="2.5" fill="#FFF4D0" stroke="#0F1B3D" strokeWidth="1" />
      <ellipse cx="42" cy="19" rx="1.5" ry="2.5" transform="rotate(30 42 19)" fill="#FFF4D0" stroke="#0F1B3D" strokeWidth="1" />

      {/* Tomato Layer */}
      <rect x="12" y="29" width="40" height="4" rx="2" fill="#FF5A5F" stroke="#0F1B3D" strokeWidth="2" />

      {/* Cheese Melt Layer */}
      <path
        d="M11 34H53L48 40L42 34L35 41L27 34L19 40L11 34Z"
        fill="#FFEA79"
        stroke="#0F1B3D"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Meat Patty */}
      <rect x="9" y="38" width="46" height="7" rx="3.5" fill="#995D3F" stroke="#0F1B3D" strokeWidth="2.5" />

      {/* Wavy Lettuce */}
      <path
        d="M8 46C12 44 14 48 18 46C22 44 24 48 28 46C32 44 34 48 38 46C42 44 44 48 48 46C52 44 54 47 56 46"
        stroke="#3DDC97"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Bottom Bun */}
      <path
        d="M12 49H52C52 54 44 57 32 57C20 57 12 54 12 49Z"
        fill="#FFD285"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}