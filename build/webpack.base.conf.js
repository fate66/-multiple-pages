'use strict'
const utils = require('./utils')
const {getEntry} = require('./entry')
const config = require('../config')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPlugin = process.env.CMD === config.baseENV.dev ? require('html-webpack-plugin-for-multihtml') : require('html-webpack-plugin')
// const VueLoaderPlugin = require('vue-loader/lib/plugin')
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [utils.resolve('src'), utils.resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

const createConfigRule = () => ({
  test: /\.scss$/,
  use: ['style-loader', 'css-loader', 'sass-loader', {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      config: {
        path: 'postcss.config.js'
      }
    }
  }, {
    loader: 'sass-resources-loader',
    options: {
      // Provide path to the file with resources
      resources: utils.resolve('src/static/css/base.scss')
    }
  }]
})

let plugins = [
  // new VueLoaderPlugin()
]
const _htmls = getEntry(true).map(item => {
  plugins.push(new HtmlWebpackPlugin({
    // favicon: './src/images/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
    filename: item.filename,
    template: item.template, // html模板路径
    inject: 'body',
    hash: false,
    multihtmlCache: true, // 解决多页面打包慢
    chunks: [item.chunk, `vendor`],
    minify: process.env.CMD === config.baseENV.production ? {
      removeComments: true,
      collapseWhitespace: true
      // ignoreCustomFragments:[
      //   //     regexp  //不处理 正则匹配到的 内容
      // ]
    } : false
  }))
  return item
})
let base = {
  context: utils.resolve(),
  entry: getEntry(),
  output: {
    path: `${config.build.assetsRoot}`,
    filename: `${utils.projectName()}/js/[name].[chunkhash].js`,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      // 'vue$': 'vue/dist/vue.esm.js',
      '@': utils.resolve('src'),
      'src': utils.resolve('src')
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      ...(process.env.CMD === config.baseENV.dev ? [createConfigRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader?cacheDirectory'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: `${utils.projectName()}/img/[name].[hash:7].[ext]`,
              limit: 10000
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {}
          }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: `${utils.projectName()}/img/[name].[hash:7].[ext]`
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: `${utils.projectName()}/img/[name].[hash:7].[ext]`
          }
        }
      }
    ]
  },
  plugins
  // node: {
  //   // prevent webpack from injecting useless setImmediate polyfill because Vue
  //   // source contains it (although only uses it if it's native).
  //   setImmediate: false,
  //   // prevent webpack from injecting mocks to Node native modules
  //   // that does not make sense for the client
  //   dgram: 'empty',
  //   fs: 'empty',
  //   net: 'empty',
  //   tls: 'empty',
  //   child_process: 'empty'
  // }
}
if (process.env.CMD === config.baseENV.dev) {
  base._htmls = _htmls
}
module.exports = base
