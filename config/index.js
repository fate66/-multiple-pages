'use strict'
// Template version: 1.3.1
const path = require('path')
module.exports = {
  baseENV: {
    dev: 'dev',
    daily: 'daily',
    pre: 'pre',
    production: 'production',
    analyz: 'analyz'
  },
  dev: {
    // Paths
    assetsPublicPath: '/',
    contentBase: path.resolve(`dist`),
    // Various Dev Server settings
    host: 'me.fangxin.com', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    
    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,
    
    /**
     * Source Maps
     */
    
    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',
    
    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,
    
    cssSourceMap: true
  },
  daily: {
    assetsPublicPath: '/'
  },
  pre: {
    env: '"pre"',
    assetsPublicPath: '/',
    projectName: '{{cndName}}pre'
  },
  build: {
    env: '"production"',
    assetsRoot: path.resolve('dist'),
    projectName: '{{cndName}}',
    assetsSubDirectory: 'yunyinghuodong',
    assetsPublicPath: '/',
    /**
     * Source Maps
     */
    
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',
    
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  }
}
