module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      transitionTimingFunction: ['hover', 'focus'],
      padding: ['hover'],
      borderRadius: ['hover']
    },
  },
  plugins: [],
}
