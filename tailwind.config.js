/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Ensures PantryRecipePage.tsx is scanned
    "./src/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        'custom-indigo': '#4B5EAA',
        'custom-emerald': '#10B981',
        'custom-red': '#EF4444',
        'custom-blue': '#3B82F6',
      },
    },
  },
  plugins: [],
};