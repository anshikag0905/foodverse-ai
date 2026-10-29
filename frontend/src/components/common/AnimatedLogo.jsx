import React from 'react';

export default function AnimatedLogo({ size = 36, className = "" }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        {/* Subtle sparkle animation */}
        <g className="animate-pulse">
          <path d="M12 25L15 15L25 12L15 9L12 -1L9 9L-1 12L9 15L12 25Z" fill="#FFC93C" transform="translate(70, 8) scale(0.6)" />
          <circle cx="20" cy="22" r="3" fill="#FF5A5F" />
        </g>

        {/* Outer Avocado Body with gentle bounce */}
        <path
          d="M50 14 C32 14 22 28 22 52 C22 75 34 88 50 88 C66 88 78 75 78 52 C78 28 68 14 50 14 Z"
          fill="#5CB85C"
          stroke="#0F1B3D"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Inner Light Lime Flesh */}
        <path
          d="M50 22 C37 22 29 34 29 53 C29 72 38 82 50 82 C62 82 71 72 71 53 C71 34 63 22 50 22 Z"
          fill="#D4ED91"
        />

        {/* Brown Seed with Shiny Highlight */}
        <circle
          cx="50"
          cy="60"
          r="16"
          fill="#8B5A2B"
          stroke="#0F1B3D"
          strokeWidth="3.5"
        />
        {/* Seed shine */}
        <ellipse cx="45" cy="55" rx="4" ry="2.5" fill="#C49A6C" transform="rotate(-30 45 55)" />

        {/* Cute Blinking / Winking Face */}
        {/* Left Eye (Sparkling open) */}
        <circle cx="43" cy="40" r="3.5" fill="#0F1B3D" />
        <circle cx="41.5" cy="38.5" r="1.2" fill="#FFFFFF" />

        {/* Right Eye (Playful Wink) */}
        <path
          d="M55 40 Q58 36 61 40"
          stroke="#0F1B3D"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cheerful Smile */}
        <path
          d="M47 45 Q51 49 55 45"
          stroke="#0F1B3D"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Pink Blush Cheeks */}
        <ellipse cx="37" cy="44" rx="3" ry="2" fill="#FF8BA7" opacity="0.8" />
        <ellipse cx="63" cy="44" rx="3" ry="2" fill="#FF8BA7" opacity="0.8" />

        {/* Cute Tiny Chef Hat on top */}
        <g transform="translate(38, 2) scale(0.65)">
          <path
            d="M8 22 C0 18 -2 8 8 4 C14 -2 24 -2 30 4 C38 8 36 18 28 22 Z"
            fill="#FFFFFF"
            stroke="#0F1B3D"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <rect
            x="8"
            y="20"
            width="20"
            height="6"
            rx="2"
            fill="#FF5A5F"
            stroke="#0F1B3D"
            strokeWidth="3"
          />
        </g>
      </svg>
    </div>
  );
}
