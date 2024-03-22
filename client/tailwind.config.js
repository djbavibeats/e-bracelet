/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Swiss721' ]
    },
    extend: {
      fontFamily: {
        eurostile: 'Eurostile'
      },
      colors: {
        chasered: '#D53148'
      }
    },
  },
  plugins: [],
}

