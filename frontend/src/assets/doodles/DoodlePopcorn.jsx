import React from 'react';

export default function DoodlePopcorn({ size = 48, className = '', ...props }) {
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
      {/* Overflowing Fluffy Popcorn Kernels */}
      {/* Background kernels */}
      <circle cx="20" cy="18" r="6" fill="#FFF4D0" stroke="#0F1B3D" strokeWidth="2" />
      <circle cx="32" cy="13" r="7" fill="#FFEA79" stroke="#0F1B3D" strokeWidth="2" />
      <circle cx="44" cy="18" r="6" fill="#FFF4D0" stroke="#0F1B3D" strokeWidth="2" />

      {/* Foreground kernels */}
      <circle cx="16" cy="24" r="6" fill="#FFEA79" stroke="#0F1B3D" strokeWidth="2" />
      <circle cx="26" cy="22" r="6.5" fill="#FFFDF9" stroke="#0F1B3D" strokeWidth="2" />
      <circle cx="38" cy="21" r="6.5" fill="#FFF4D0" stroke="#0F1B3D" strokeWidth="2" />
      <circle cx="48" cy="24" r="6" fill="#FFEA79" stroke="#0F1B3D" strokeWidth="2" />

      {/* Popcorn Box (Trapezoid) */}
      <path
        d="M16 28L20 58H44L48 28H16Z"
        fill="#FFFFFF"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Red Stripes on box */}
      <path d="M22 28L25 58H29L27 28H22Z" fill="#FF5A5F" stroke="#0F1B3D" strokeWidth="1.5" />
      <path d="M35 28L35 58H39L41 28H35Z" fill="#FF5A5F" stroke="#0F1B3D" strokeWidth="1.5" />

      {/* Scalloped Rim on top of box */}
      <path
        d="M15 28C18 29 21 27 24 28C27 29 30 27 33 28C36 29 39 27 42 28C45 29 48 27 49 28"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Flying kernel piece */}
      <circle cx="53" cy="14" r="3.5" fill="#FFEA79" stroke="#0F1B3D" strokeWidth="1.5" />
    </svg>
  );
}