import React from 'react';

export default function DoodleRamen({ size = 48, className = '', ...props }) {
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
      {/* Steam lines */}
      <path
        d="M22 14C20 11 24 8 22 5M32 13C30 9 34 7 32 4M42 14C40 11 44 8 42 5"
        stroke="#8FD3FF"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Chopsticks sticking out */}
      <path d="M12 24L48 6M10 28L46 10" stroke="#E8985E" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 24L48 6M10 28L46 10" stroke="#0F1B3D" strokeWidth="1.2" strokeLinecap="round" />

      {/* Broth surface */}
      <ellipse cx="32" cy="27" rx="22" ry="7" fill="#FFC93C" stroke="#0F1B3D" strokeWidth="2" />

      {/* Ramen Noodles */}
      <path
        d="M16 26C18 29 22 28 24 26C26 29 30 28 32 26C34 29 38 28 40 26"
        stroke="#FFF0A0"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Half Boiled Egg */}
      <ellipse cx="25" cy="25" rx="6" ry="4.5" fill="#FFFFFF" stroke="#0F1B3D" strokeWidth="1.8" />
      <circle cx="25" cy="25" r="3" fill="#FF5A5F" stroke="#0F1B3D" strokeWidth="1.5" />

      {/* Scallion / Green onions */}
      <circle cx="36" cy="25" r="2" fill="#3DDC97" stroke="#0F1B3D" strokeWidth="1.2" />
      <circle cx="41" cy="28" r="1.8" fill="#3DDC97" stroke="#0F1B3D" strokeWidth="1.2" />

      {/* Ceramic Bowl */}
      <path
        d="M10 27C10 44 19 55 32 55C45 55 54 44 54 27H10Z"
        fill="#FF5A5F"
        stroke="#0F1B3D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Decorative Bowl Stripe */}
      <path
        d="M12 36C18 45 46 45 52 36"
        stroke="#FFFDF9"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Foot ring */}
      <path d="M24 55V58H40V55" fill="#FFFDF9" stroke="#0F1B3D" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}