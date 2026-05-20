/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ini akan mendeteksi app.jsx maupun App.jsx di dalam folder src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}