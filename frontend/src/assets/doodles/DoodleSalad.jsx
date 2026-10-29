import React from 'react';

export default function DoodleSalad({ size = 48, className = '', ...props }) {
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
      {/* Greens Heap */}
      <path
        d="M14 30C12 25 14 18 20 17C24 16 26 20 30 17C34 14 40 15 42 19C46 16 52 19 51 25C51 28 47 30 45 31"
        fill="#3DDC97"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Fresh Tomatoes */}
      <circle cx="24" cy="22" r="4.5" fill="#FF5A5F" stroke="#0F1B3D" strokeWidth="2" />
      <circle cx="39" cy="21" r="4.5" fill="#FF5A5F" stroke="#0F1B3D" strokeWidth="2" />

      {/* Cucumber Slices */}
      <ellipse cx="32" cy="24" rx="4.5" ry="3.5" fill="#A7F3D0" stroke="#0F1B3D" strokeWidth="2" />
      <circle cx="32" cy="24" r="2" fill="#3DDC97" stroke="#0F1B3D" strokeWidth="1" />

      {/* Carrot Strip */}
      <path d="M19 25L27 28" stroke="#FFC93C" strokeWidth="2.5" strokeLinecap="round" />

      {/* Salad Bowl Body */}
      <path
        d="M10 29C10 45 19 56 32 56C45 56 54 45 54 29H10Z"
        fill="#8FD3FF"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Bowl Rim */}
      <ellipse cx="32" cy="29" rx="22" ry="5.5" fill="#BFE6FF" stroke="#0F1B3D" strokeWidth="2.2" />

      {/* Sparkle */}
      <path
        d="M12 11L13 8L14 11L17 12L14 13L13 16L12 13L9 12L12 11Z"
        fill="#3DDC97"
        stroke="#0F1B3D"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}