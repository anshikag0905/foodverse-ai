import React from 'react';

export default function AnimatedGirlFace({ size = 110, className = "" }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <style>
            {`
              @keyframes blink-eyes {
                0%, 90%, 100% { transform: scaleY(1); }
                95% { transform: scaleY(0.1); }
              }
              @keyframes float-girl {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-3px) rotate(1.5deg); }
              }
              @keyframes sparkle-twinkle {
                0%, 100% { opacity: 0.3; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.2); }
              }
              .girl-head {
                animation: float-girl 3.5s ease-in-out infinite;
                transform-origin: 60px 100px;
              }
              .blinking-eyes {
                animation: blink-eyes 4s infinite;
                transform-origin: 60px 58px;
              }
              .sparkle-star {
                animation: sparkle-twinkle 2s ease-in-out infinite;
              }
            `}
          </style>
        </defs>

        {/* Background Soft Glow / Sticker Backing */}
        <circle cx="60" cy="60" r="54" fill="#FFE5EC" stroke="#0F1B3D" strokeWidth="3" />

        {/* Twinkling Stars */}
        <g className="sparkle-star">
          <path d="M18 28 L20 22 L26 20 L20 18 L18 12 L16 18 L10 20 L16 22 Z" fill="#FFC93C" />
          <path d="M102 36 L104 31 L109 29 L104 27 L102 22 L100 27 L95 29 L100 31 Z" fill="#FF5A5F" />
        </g>

        {/* Animated Girl Head Group */}
        <g className="girl-head">
          {/* Back Ponytail */}
          <path
            d="M72 44 C88 38 98 52 95 72 C92 84 82 86 74 74 Z"
            fill="#23192D"
            stroke="#0F1B3D"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Cute Yellow Ponytail Scrunchie */}
          <ellipse cx="74" cy="46" rx="6" ry="8" fill="#FFC93C" stroke="#0F1B3D" strokeWidth="2.5" />

          {/* Neck */}
          <rect x="54" y="80" width="12" height="15" rx="3" fill="#FAD2B8" stroke="#0F1B3D" strokeWidth="3" />

          {/* Collar / Hoodie Top */}
          <path
            d="M40 92 C46 88 56 86 60 86 C64 86 74 88 80 92 L86 108 L34 108 Z"
            fill="#FF5A5F"
            stroke="#0F1B3D"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Inner Teal Shirt Accent */}
          <polygon points="54,86 66,86 60,96" fill="#3DDC97" stroke="#0F1B3D" strokeWidth="2" />

          {/* Head Shape */}
          <ellipse
            cx="60"
            cy="60"
            rx="25"
            ry="27"
            fill="#FAD2B8"
            stroke="#0F1B3D"
            strokeWidth="3.5"
          />

          {/* Ears */}
          <circle cx="35" cy="62" r="5" fill="#FAD2B8" stroke="#0F1B3D" strokeWidth="2.5" />
          <circle cx="85" cy="62" r="5" fill="#FAD2B8" stroke="#0F1B3D" strokeWidth="2.5" />
          {/* Tiny Cute Earring */}
          <circle cx="34" cy="65" r="1.8" fill="#FFC93C" stroke="#0F1B3D" strokeWidth="1" />
          <circle cx="86" cy="65" r="1.8" fill="#FFC93C" stroke="#0F1B3D" strokeWidth="1" />

          {/* Front Hair Bangs */}
          <path
            d="M36 54 C35 38 48 32 60 32 C72 32 85 38 84 54 C79 46 72 44 65 47 C57 44 48 46 36 54 Z"
            fill="#23192D"
            stroke="#0F1B3D"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Hair Side Fringe */}
          <path
            d="M36 52 C35 60 37 68 39 72 C40 68 40 60 41 54 Z"
            fill="#23192D"
          />
          <path
            d="M84 52 C85 60 83 68 81 72 C80 68 80 60 79 54 Z"
            fill="#23192D"
          />

          {/* Eyebrows */}
          <path d="M47 50 Q52 47 56 49" stroke="#0F1B3D" strokeWidth="2" strokeLinecap="round" />
          <path d="M64 49 Q68 47 73 50" stroke="#0F1B3D" strokeWidth="2" strokeLinecap="round" />

          {/* Eyes (Smooth blinking animation) */}
          <g className="blinking-eyes">
            {/* Left Eye */}
            <ellipse cx="51" cy="58" rx="4.5" ry="5.5" fill="#0F1B3D" />
            <circle cx="49.5" cy="56" r="1.8" fill="#FFFFFF" />
            <circle cx="52.5" cy="59.5" r="0.9" fill="#FFFFFF" />

            {/* Right Eye */}
            <ellipse cx="69" cy="58" rx="4.5" ry="5.5" fill="#0F1B3D" />
            <circle cx="67.5" cy="56" r="1.8" fill="#FFFFFF" />
            <circle cx="70.5" cy="59.5" r="0.9" fill="#FFFFFF" />
          </g>

          {/* Cute Round Glasses */}
          <circle cx="51" cy="58" r="9" fill="none" stroke="#8B5CF6" strokeWidth="2.5" opacity="0.95" />
          <circle cx="69" cy="58" r="9" fill="none" stroke="#8B5CF6" strokeWidth="2.5" opacity="0.95" />
          <path d="M60 58 L60 58" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="59.5" y1="58" x2="60.5" y2="58" stroke="#8B5CF6" strokeWidth="3" />

          {/* Rosy Cheeks */}
          <ellipse cx="43" cy="65" rx="4.5" ry="2.8" fill="#FF8BA7" opacity="0.7" />
          <ellipse cx="77" cy="65" rx="4.5" ry="2.8" fill="#FF8BA7" opacity="0.7" />

          {/* Cute Nose */}
          <path d="M59 62 Q60 65 62 64" stroke="#D39879" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Cheerful Friendly Smile */}
          <path
            d="M54 69 Q60 76 66 69"
            stroke="#0F1B3D"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="#FF5A5F"
          />
        </g>
      </svg>
    </div>
  );
}
