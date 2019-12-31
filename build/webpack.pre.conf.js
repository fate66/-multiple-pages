'use strict'
const config = require('../config')
const merge = require('webpack-merge')
const prodConfig = require('./webpack.prod.conf')

const webpackConfig = merge(prodConfig, {
  module: {
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    // path: config.build.assetsRoot
    // publicPath: config.pre.assetsPublicPath
    // chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
  ]
})

module.exports = webpackConfig
