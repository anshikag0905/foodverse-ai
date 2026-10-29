import React from 'react';

export default function DoodleStrawberry({ size = 48, className = '', ...props }) {
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
      {/* Strawberry Body */}
      <path
        d="M32 58C36 54 50 42 50 27C50 17 40 14 32 17C24 14 14 17 14 27C14 42 28 54 32 58Z"
        fill="#FF5A5F"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Tiny Yellow Seeds */}
      <circle cx="24" cy="27" r="1.5" fill="#FFEA79" stroke="#0F1B3D" strokeWidth="0.8" />
      <circle cx="32" cy="26" r="1.5" fill="#FFEA79" stroke="#0F1B3D" strokeWidth="0.8" />
      <circle cx="40" cy="27" r="1.5" fill="#FFEA79" stroke="#0F1B3D" strokeWidth="0.8" />
      <circle cx="28" cy="34" r="1.5" fill="#FFEA79" stroke="#0F1B3D" strokeWidth="0.8" />
      <circle cx="36" cy="34" r="1.5" fill="#FFEA79" stroke="#0F1B3D" strokeWidth="0.8" />
      <circle cx="25" cy="42" r="1.5" fill="#FFEA79" stroke="#0F1B3D" strokeWidth="0.8" />
      <circle cx="33" cy="43" r="1.5" fill="#FFEA79" stroke="#0F1B3D" strokeWidth="0.8" />
      <circle cx="39" cy="42" r="1.5" fill="#FFEA79" stroke="#0F1B3D" strokeWidth="0.8" />

      {/* Green Leaves on Top */}
      <path
        d="M32 17L32 9M32 17C28 12 21 13 18 16C23 18 28 17 32 17ZM32 17C36 12 43 13 46 16C41 18 36 17 32 17ZM32 17C31 22 32 23 32 24C33 23 34 22 32 17Z"
        fill="#3DDC97"
        stroke="#0F1B3D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cute Sparkle */}
      <path
        d="M48 20L49 17L50 20L53 21L50 22L49 25L48 22L45 21L48 20Z"
        fill="#FFC93C"
        stroke="#0F1B3D"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}