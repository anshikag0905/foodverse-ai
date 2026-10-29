/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB', // Primary royal blue accent
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        navy: {
          900: '#0F1B3D', // Deep navy primary text on blue theme
          800: '#16244D',
          700: '#1E2F5D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 27, 61, 0.05), 0 1px 2px -1px rgba(15, 27, 61, 0.03)',
        'card-hover': '0 4px 12px 0 rgba(15, 27, 61, 0.08), 0 2px 4px -1px rgba(15, 27, 61, 0.04)',
        'elevated': '0 10px 25px -3px rgba(15, 27, 61, 0.08), 0 4px 6px -4px rgba(15, 27, 61, 0.04)',
      },
    },
  },
  plugins: [],
}
