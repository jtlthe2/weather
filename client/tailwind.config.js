module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      transitionTimingFunction: ['hover', 'focus', 'active'],
      padding: ['hover', 'focus', 'active'],
      borderRadius: ['hover', 'focus', 'active'],
      scale: ['hover', 'focus', 'active'],
      outline: ['hover', 'focus', 'active']
    },
  },
  plugins: [],
}
