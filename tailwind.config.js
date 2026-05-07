/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
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
