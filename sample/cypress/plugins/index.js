const browserify = require('@cypress/browserify-preprocessor')
const thenify = require("C:\\work\\cypress-thenify\\index.js")

module.exports = (on) => {
  const options = browserify.defaultOptions
  options.browserifyOptions.transform[1][1].plugins.push([thenify, { total_thenify: 'true' }])
  on('file:preprocessor', browserify(options))
}
