'use strict'
const path = require('path')
const config = require('../config')
const packageConfig = require('../package.json')
const fs = require('fs')

const resolve = dir => {
  let _p = dir ? path.join(__dirname, '..', dir) : path.join(__dirname, '..')
  return _p
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      // return ExtractTextPlugin.extract({
      //   use: loaders,
      //   fallback: 'vue-style-loader'
      // })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {indentedSyntax: true}),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

exports.resolve = resolve
exports.getEntry = htmlPlugin => {
  let map = {}
  let _l = []
  let pages = []
  // try {
  //   pages = fs.readFileSync(resolve('manifest.json'), 'utf8')
  //   pages = JSON.parse(pages)['page']
  // } catch (e) {
  //   console.error(e)
  // }
  let files = fs.readdirSync(resolve('src/view'))
  files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item))
  files.forEach(item => {
    let state = fs.statSync(resolve(`src/view/${item}`))
    if (state.isDirectory() && ((pages && Array.isArray(pages) && !pages.includes(item)) || process.env.CMD === config.baseENV.dev)) {
      if (htmlPlugin) {
        _l.push({
          template: resolve(`src/view/${item}/index.html`),
          filename: `../pages/${item}.html`,
          chunk: `js/${item}`,
          page: `${item}.html`
        })
      } else {
        map[`js/${item}`] = resolve(`src/view/${item}/index.js`)
      }
    }
  })
  if (htmlPlugin) {
    return _l
  }
  return map
}
exports.copy = obj => {
  let res
  if (typeof obj === 'object') {
    res = {}
    for (let p in obj) {
      if (typeof obj[p] === 'object') {
        res[p] = this.copy(obj[p])
      } else {
        res[p] = obj[p]
      }
    }
  } else {
    res = obj
  }
  return res
}

exports.projectName = () => {
  return process.env.CMD == config.baseENV.production ? config.build.projectName : config.pre.projectName
}
