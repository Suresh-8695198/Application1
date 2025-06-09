/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-purple': '#6B46C1',
        'light-purple': '#D6BCFA',
        'neutral-dark': '#1A1A2E',
        'accent-yellow': '#FBBF24',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(107, 70, 193, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(107, 70, 193, 1)' },
        },
      },
      animation: {
        sparkle: 'sparkle 1.5s infinite',
        glow: 'glow 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};