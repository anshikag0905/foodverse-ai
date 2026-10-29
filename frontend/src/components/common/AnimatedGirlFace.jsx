import React, { useState } from 'react';

export default function AnimatedGirlFace({ size = 120, className = "" }) {
  const [isWinking, setIsWinking] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none cursor-pointer group ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsWinking(true)}
      onMouseLeave={() => setIsWinking(false)}
      title="Anshika Gupta - AI / ML Engineer"
      aria-label="Cute college girl character avatar"
    >
      <svg
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <style>
            {`
              @keyframes cute-bob {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-3px) rotate(1.2deg); }
              }
              @keyframes hair-sway {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(-3deg); }
              }
              @keyframes blink-animation {
                0%, 88%, 94%, 100% { transform: scaleY(1); }
                91% { transform: scaleY(0.08); }
              }
              @keyframes blush-pulse {
                0%, 100% { opacity: 0.65; transform: scale(1); }
                50% { opacity: 0.85; transform: scale(1.08); }
              }
              @keyframes sparkle-twinkle {
                0%, 100% { opacity: 0.3; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.2); }
              }
              .head-group {
                animation: cute-bob 3.6s ease-in-out infinite;
                transform-origin: 70px 115px;
              }
              .ponytail {
                animation: hair-sway 2.8s ease-in-out infinite;
                transform-origin: 88px 52px;
              }
              .eye-blink {
                animation: blink-animation 4.2s infinite;
                transform-origin: 70px 68px;
              }
              .blush {
                animation: blush-pulse 2.5s ease-in-out infinite;
                transform-origin: 50px 76px;
              }
              .blush-right {
                animation: blush-pulse 2.5s ease-in-out infinite;
                transform-origin: 90px 76px;
              }
              .sparkle {
                animation: sparkle-twinkle 2s ease-in-out infinite;
              }
            `}
          </style>

          <linearGradient id="bgGlow" x1="0" y1="0" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EEF2FF" />
            <stop offset="1" stopColor="#E0E7FF" />
          </linearGradient>

          <linearGradient id="hoodieGrad" x1="40" y1="95" x2="100" y2="135" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="hairGrad" x1="40" y1="20" x2="100" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#334155" />
            <stop offset="1" stopColor="#1E293B" />
          </linearGradient>

          <linearGradient id="skinGrad" x1="70" y1="40" x2="70" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFE0CE" />
            <stop offset="1" stopColor="#FCD5BD" />
          </linearGradient>
        </defs>

        {/* Soft Circular Backdrop with Gradient Border */}
        <circle cx="70" cy="70" r="66" fill="url(#bgGlow)" stroke="#C7D2FE" strokeWidth="2" />

        {/* Floating Sparkles around avatar */}
        <g className="sparkle">
          <path d="M24 38 L26 44 L32 46 L26 48 L24 54 L22 48 L16 46 L22 44 Z" fill="#FBBF24" />
          <circle cx="118" cy="34" r="2.5" fill="#EC4899" />
          <circle cx="112" cy="100" r="2" fill="#3B82F6" />
        </g>

        {/* Main Head & Torso Group */}
        <g className="head-group">
          {/* Back Ponytail with soft bounce */}
          <g className="ponytail">
            <path
              d="M86 50 C106 42 120 58 116 84 C112 100 98 102 90 86 C88 78 86 64 86 50 Z"
              fill="url(#hairGrad)"
            />
            {/* Cute Yellow Star Scrunchie */}
            <circle cx="88" cy="52" r="7" fill="#F59E0B" />
            <circle cx="88" cy="52" r="4.5" fill="#FBBF24" />
          </g>

          {/* Neck */}
          <path d="M63 90 L63 104 C63 105 77 105 77 104 L77 90 Z" fill="url(#skinGrad)" />
          {/* Neck Shadow */}
          <path d="M63 90 C68 94 72 94 77 90 L77 94 C72 98 68 98 63 94 Z" fill="#E8BBA0" opacity="0.6" />

          {/* College Campus Hoodie */}
          <path
            d="M38 108 C46 102 58 100 70 100 C82 100 94 102 102 108 L110 136 L30 136 Z"
            fill="url(#hoodieGrad)"
          />

          {/* White Drawstrings */}
          <path d="M62 104 Q60 118 63 124" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="63" cy="124" r="1.5" fill="#93C5FD" />
          <path d="M78 104 Q80 118 77 124" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="77" cy="124" r="1.5" fill="#93C5FD" />

          {/* Headphones around neck */}
          <path
            d="M48 94 C48 108 92 108 92 94"
            fill="none"
            stroke="#0F172A"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <rect x="42" y="86" width="9" height="15" rx="4.5" fill="#EC4899" />
          <rect x="89" y="86" width="9" height="15" rx="4.5" fill="#EC4899" />

          {/* Face Shape */}
          <path
            d="M44 64 C44 46 52 38 70 38 C88 38 96 46 96 64 C96 82 86 96 70 96 C54 96 44 82 44 64 Z"
            fill="url(#skinGrad)"
          />

          {/* Ears with Cute Pearl Studs */}
          <ellipse cx="42" cy="68" rx="4.5" ry="6.5" fill="url(#skinGrad)" />
          <circle cx="41" cy="71" r="1.5" fill="#FFFFFF" />
          <ellipse cx="98" cy="68" rx="4.5" ry="6.5" fill="url(#skinGrad)" />
          <circle cx="99" cy="71" r="1.5" fill="#FFFFFF" />

          {/* Hair Side Bangs & Fringe */}
          <path
            d="M44 62 C42 42 54 32 70 32 C86 32 98 42 96 62 C94 50 88 44 80 47 C72 44 64 43 56 47 C50 44 46 50 44 62 Z"
            fill="url(#hairGrad)"
          />
          {/* Soft Hair Wisps */}
          <path d="M44 58 C42 68 45 78 47 84 C48 76 49 68 46 58 Z" fill="url(#hairGrad)" />
          <path d="M96 58 C98 68 95 78 93 84 C92 76 91 68 94 58 Z" fill="url(#hairGrad)" />

          {/* Cute Strawberry Hair Clip */}
          <path d="M51 40 L55 36 L59 40 Z" fill="#EF4444" />
          <circle cx="55" cy="38" r="1" fill="#FFFFFF" />

          {/* Soft Curved Eyebrows */}
          <path d="M54 57 C58 54 63 55 65 57" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M75 57 C77 55 82 54 86 57" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

          {/* Eyes (Anime / Chibi Sparkling Eyes) */}
          <g className={isWinking ? "" : "eye-blink"}>
            {/* Left Eye */}
            <g>
              <ellipse cx="59" cy="68" rx="5.5" ry="7" fill="#1E293B" />
              {/* Highlight Sparkles */}
              <circle cx="57" cy="65.5" r="2.4" fill="#FFFFFF" />
              <circle cx="61" cy="71" r="1.2" fill="#FFFFFF" />
              {/* Top Eyelash */}
              <path d="M52 64 C56 62 63 62 66 65" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              <path d="M64 63 L67 60.5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Right Eye (Winks on Hover) */}
            {isWinking ? (
              <path
                d="M75 69 Q81 63 87 69"
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <g>
                <ellipse cx="81" cy="68" rx="5.5" ry="7" fill="#1E293B" />
                {/* Highlight Sparkles */}
                <circle cx="79" cy="65.5" r="2.4" fill="#FFFFFF" />
                <circle cx="83" cy="71" r="1.2" fill="#FFFFFF" />
                {/* Top Eyelash */}
                <path d="M74 65 C77 62 84 62 88 64" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <path d="M86 63 L89 60.5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            )}
          </g>

          {/* Modern Lightweight Round Glasses */}
          <circle cx="59" cy="68" r="10.5" fill="none" stroke="#3B82F6" strokeWidth="1.75" opacity="0.9" />
          <circle cx="81" cy="68" r="10.5" fill="none" stroke="#3B82F6" strokeWidth="1.75" opacity="0.9" />
          <line x1="69.5" y1="68" x2="70.5" y2="68" stroke="#3B82F6" strokeWidth="2" />
          {/* Glass Lense Glint */}
          <path d="M53 62 L57 66" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          <path d="M75 62 L79 66" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

          {/* Rosy Glowing Blushing Cheeks */}
          <ellipse cx="50" cy="76" rx="5.5" ry="3.5" fill="#FB7185" className="blush" />
          <ellipse cx="90" cy="76" rx="5.5" ry="3.5" fill="#FB7185" className="blush-right" />

          {/* Tiny Cute Button Nose */}
          <circle cx="70" cy="73" r="1.2" fill="#F43F5E" opacity="0.75" />

          {/* Joyful Open Smile */}
          <path
            d="M64 78 Q70 87 76 78 Z"
            fill="#E11D48"
            stroke="#9F1239"
            strokeWidth="1"
          />
          {/* Tongue inside smile */}
          <path
            d="M66 82 Q70 80 74 82 Q70 86 66 82 Z"
            fill="#FDA4AF"
          />
        </g>
      </svg>
    </div>
  );
}
