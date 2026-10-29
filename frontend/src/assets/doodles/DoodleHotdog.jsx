import React from 'react';

export default function DoodleHotdog({ size = 48, className = '', ...props }) {
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
      {/* Bottom bun */}
      <path
        d="M12 40C12 47 22 51 36 49L52 38C56 34 56 29 51 26C45 22 38 25 32 30L17 38C13 39 12 40 12 40Z"
        fill="#FFD285"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sausage / Frankfurter */}
      <rect
        x="6"
        y="25"
        width="52"
        height="12"
        rx="6"
        transform="rotate(-20 32 31)"
        fill="#FF5A5F"
        stroke="#0F1B3D"
        strokeWidth="2.5"
      />

      {/* Top bun edge */}
      <path
        d="M10 32C10 25 18 20 28 20L44 26"
        stroke="#FFD285"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M10 32C10 25 18 20 28 20L44 26"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Mustard squiggle */}
      <path
        d="M12 37C15 33 18 39 22 35C26 31 29 37 33 33C37 29 40 35 44 31C48 27 50 31 53 28"
        stroke="#FFEA79"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Little Sparkle */}
      <path
        d="M50 12L51 9L52 12L55 13L52 14L51 17L50 14L47 13L50 12Z"
        fill="#FFC93C"
        stroke="#0F1B3D"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}