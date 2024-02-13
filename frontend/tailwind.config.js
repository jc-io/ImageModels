/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'primary': '#4a4e4d',
      'second': '#0e9aa7',
      'third': '#3da4ab',
      'forth': '#f6cd61',
      'fifth': '#fe8a71',
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      gray: colors.gray,
      pink: colors.pink,

      // white: colors.white,
      // gray: colors.gray,
      lime: colors.lime,
      rose: colors.rose,

      // indigo: colors.indigo,
      // yellow: colors.yellow,
      blue: colors.blue,



    },
    extend: {},
  },
  plugins: [],
}

