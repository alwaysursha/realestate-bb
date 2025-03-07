/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'nudge': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(8px)' },
          '75%': { transform: 'translateX(-8px)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'nudge': 'nudge 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} 