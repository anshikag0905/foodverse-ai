import React from 'react';

export default function DoodlePie({ size = 48, className = '', ...props }) {
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
      {/* Pie Slice Bottom / Side Crust */}
      <path
        d="M12 40L38 54L54 28L12 40Z"
        fill="#FF5A5F"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Berry Filling Layer inside slice */}
      <path
        d="M14 39L38 52L52 28L14 39Z"
        fill="#E0484D"
      />

      {/* Top Crust Surface */}
      <path
        d="M12 40L28 16C40 20 48 24 54 28L12 40Z"
        fill="#FFD285"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Back Crimped Fluted Crust */}
      <path
        d="M28 16C31 15 33 18 36 17C39 16 41 19 44 19C47 19 49 22 51 22C53 23 54 26 54 28"
        stroke="#E8985E"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M28 16C31 15 33 18 36 17C39 16 41 19 44 19C47 19 49 22 51 22C53 23 54 26 54 28"
        stroke="#0F1B3D"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Steam cut slits on top */}
      <path d="M26 31L34 26M33 34L41 29" stroke="#E8985E" strokeWidth="2" strokeLinecap="round" />

      {/* Whipped Cream Dollop */}
      <ellipse cx="26" cy="31" rx="5" ry="4" fill="#FFFFFF" stroke="#0F1B3D" strokeWidth="1.8" />
      <path d="M26 27C27 24 25 24 26 22" stroke="#0F1B3D" strokeWidth="1.5" strokeLinecap="round" />

      {/* Sparkle */}
      <path
        d="M12 18L13 15L14 18L17 19L14 20L13 23L12 20L9 19L12 18Z"
        fill="#FFC93C"
        stroke="#0F1B3D"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}