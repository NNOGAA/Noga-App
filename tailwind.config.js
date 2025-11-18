/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'brand-green': '#4CAF50',
        'active-brand-green': '#3d8b40',
        'brand-dark-blue': '#1A1A40',
        'active-brand-dark-blue': '#12122d',
      },
    },
  },
  plugins: [],
};

