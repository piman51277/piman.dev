module.exports = {
  purge: [
    './layouts/**/*.handlebars',
    './partials/**/*.handlebars',
    './views/**/*.handlebars',
    './projects/**/*.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['disabled']
    },
  },
  plugins: [],
};
