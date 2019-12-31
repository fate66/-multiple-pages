'use strict'
const config = require('../config')
const merge = require('webpack-merge')
const prodConfig = require('./webpack.prod.conf')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const webpackConfig = merge(prodConfig, {
  module: {},
  devtool: config.dev.productionSourceMap ? config.dev.devtool : false,
  plugins: []
})
webpackConfig.plugins = webpackConfig.plugins.filter(item => {
  return !(item instanceof UglifyJsPlugin)
})
module.exports = webpackConfig
