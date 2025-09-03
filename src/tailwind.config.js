// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'lg': '0 10px 30px rgba(0, 0, 0, 0.06)', // Softer, larger shadow
        'xl-blue': '0 10px 40px rgba(66, 153, 225, 0.15)', // Blue-tinted shadow for selected state
      },
      scale: {
        '101': '1.01',
        '102': '1.02',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Slower pulse for skeleton
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '.7' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: 0.6 },
          "50%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};