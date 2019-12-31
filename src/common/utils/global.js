(function (window) {
  const config = require('../../../config')
  window.log = function (...msg) {
    if (process.env.NODE_ENV == config.baseENV.dev) {
      console.log(...msg)
    }
  }
})(window)
