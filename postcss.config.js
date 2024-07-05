const config = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('autoprefixer'),
    require('postcss-calc'),
    require('cssnano')({
      preset: 'default',
    }),
  ]
}
module.exports = config;