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
        // Sky Blue Canvas
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BFE6FF', // Target reference sky blue
          300: '#A5DEFF',
          400: '#8FD3FF', // Target reference deep sky
          500: '#38BDF8',
          600: '#0284C7',
          light: '#BFE6FF',
          deep: '#8FD3FF',
          soft: '#EAF6FF',
        },
        // Deep Navy Ink & Borders
        ink: {
          DEFAULT: '#0F1B3D',
          navy: '#0F1B3D',
          muted: '#4A5568',
          light: '#718096',
        },
        // Card Surfaces
        card: {
          DEFAULT: '#FFFDF9',
          cream: '#FFFDF9',
          white: '#FFFFFF',
        },
        // Playful Module Accents
        tomato: {
          DEFAULT: '#FF5A5F', // Food Recognition (Red)
          light: '#FFEAEA',
          dark: '#E0484D',
        },
        mint: {
          DEFAULT: '#3DDC97', // Freshness (Mint)
          light: '#E8FBF2',
          dark: '#2CB87C',
        },
        teal: {
          DEFAULT: '#0284C7', // Hygiene (Teal/Ocean)
          light: '#E0F2FE',
          dark: '#0369A1',
        },
        sunny: {
          DEFAULT: '#FFC93C', // Cooking (Sunny Yellow)
          light: '#FFF8E6',
          dark: '#E0AE2C',
        },
        grape: {
          DEFAULT: '#8B5CF6', // Meal Planner (Grape)
          light: '#F3E8FF',
          dark: '#7C3AED',
        },
        peach: {
          DEFAULT: '#FFB38A', // Pantry (Peach)
          light: '#FFF1E8',
          dark: '#E8986D',
        },
        // Friendly Deep Navy Dark Mode
        dusk: {
          bg: '#0A1128',
          card: '#131F42',
          surface: '#1C2B59',
          border: '#2A3C72',
          text: '#F0F4FF',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        display: ['"Fredoka"', '"Baloo 2"', 'sans-serif'],
        body: ['"Nunito"', 'sans-serif'],
        sans: ['"Nunito"', 'sans-serif'],
        hindi: ['"Baloo 2"', '"Noto Sans Devanagari"', 'sans-serif'],
        cute: ['"Fredoka"', '"Quicksand"', 'cursive', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
        'pill': '9999px',
      },
      boxShadow: {
        'sticker': '4px 4px 0px #0F1B3D',
        'sticker-sm': '2px 2px 0px #0F1B3D',
        'sticker-lg': '6px 6px 0px #0F1B3D',
        'sticker-dark': '4px 4px 0px rgba(0, 0, 0, 0.8)',
        'sticker-dark-sm': '2px 2px 0px rgba(0, 0, 0, 0.8)',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}
