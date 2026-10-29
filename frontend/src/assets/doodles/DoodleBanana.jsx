import React from 'react';

export default function DoodleBanana({ size = 48, className = '', ...props }) {
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
      {/* Sparkle */}
      <path
        d="M52 14L53.5 10L55 14L59 15.5L55 17L53.5 21L52 17L48 15.5L52 14Z"
        fill="#FFC93C"
        stroke="#0F1B3D"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Stem */}
      <path
        d="M16 17C14.5 15.5 12 15 10 16L12 21C13.5 20 15 19.5 16 21L16 17Z"
        fill="#8FD3FF"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Outer Banana Body */}
      <path
        d="M13 19C18 19 32 23 44 35C53 44 54 53 52 56C50 59 41 58 32 49C20 37 16 25 13 19Z"
        fill="#FFEA79"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner Banana Ridge & Belly Highlight */}
      <path
        d="M14 20C22 24 35 32 43 45"
        stroke="#0F1B3D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M19 25C26 29 37 38 43 48"
        fill="none"
        stroke="#FFF4A3"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Tip */}
      <circle cx="51.5" cy="55.5" r="2.5" fill="#8FD3FF" stroke="#0F1B3D" strokeWidth="2" />
    </svg>
  );
}