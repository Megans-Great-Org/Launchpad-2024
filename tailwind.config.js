/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        myCustomColor: '#FF5733',
        anotherCustomColor: '#8A2BE2',
        blue: {
          100: '#86CCEC',
          200: '#75BFDE',
          300: '#64B1D6',
          400: '#53A4C8',
          500: '#4296BA',
          600: '#3080A0',
          700: '#1B6C86',
          800: '#05546C',
          900: '#004055',
        },
      },
      fontFamily: {
        mono: ['Monospace', 'monaco', 'monospace'],
      },
    },
  },
  plugins: [],
};