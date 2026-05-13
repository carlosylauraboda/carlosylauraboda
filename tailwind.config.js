/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Bricolage Grotesque"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        olive: '#525E3F',
        'olive-deep': '#3a4530',
        sage: '#C9D2C6',
        orange: '#F39200',
        pink: { DEFAULT: '#ED6F94', deep: '#d35779' },
        cream: '#EEE5D8',
        ink: '#1d1f1a',
        boda: {
          cream: '#F8F4EE',
          ink: '#2C2A26',
          accent: '#A88A5C',
        },
      },
    },
  },
  plugins: [],
};
