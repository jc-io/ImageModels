/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'primary': '#2E2E2E',
      'second': '#2E2E2E',
      'third': '#2E2E2E',
      'forth': '#2E2E2E',
      'fifth': '#2E2E2E',
      'button': '#090088',
      'buttonHover': '#03002e',
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      gray: colors.gray,
      pink: colors.pink,

      white: colors.white,
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

