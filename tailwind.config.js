/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        win95: ['MS Sans Serif', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          blue: '#008CFF',
          pink: '#FF1493',
          yellow: '#FFCC00',
          green: '#00CC66',
          purple: '#9933FF',
          orange: '#FF6600',
        },
        background: {
          dark: '#000000',
          card: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
};