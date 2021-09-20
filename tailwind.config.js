module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
    scrollbar: ['rounded']
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
