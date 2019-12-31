'use strict'

const fs = require('fs')
const {resolve, projectName} = require('./utils')
// const chokidar = require('chokidar')

let obj = {}
// const chokidarDir = dir => {
//   obj = chokidar.watch(dir, {
//     persistent: true,
//     ignoreInitial: true,
//     ignored: /(^|[\/\\])\../ // 忽略点文件
//   })
// }

const getFileName = filename => {
  let l = (filename || '').split('.')
  return l && l.length && l[0]
}

const createDir = dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)
}

exports.getEntry = htmlPlugin => {
  const root = resolve(`src/view`)
  let files = fs.readdirSync(root)
  files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item))
  const map = {}
  const _l = []
  const dirs = []
  const defaultFile = `${root}/index.js`
  const cacheFileRootPath = resolve(`entry`)
  const defaultHtml = `${root}/index.html`

  if (!htmlPlugin) {
    try {
      let execSync = require('child_process').execSync
      execSync(`rm -rf ${cacheFileRootPath}`)
    } catch (e) {
      console.error(e)
    }
    createDir(cacheFileRootPath)
  }
  files.forEach(item => {
    let state = fs.statSync(`${root}/${item}`)
    if (state.isDirectory()) {
      dirs.push(`${root}/${item}`)
      let subFiles = fs.readdirSync(`${root}/${item}`)
      subFiles = subFiles.filter(sub => sub.endsWith('.vue'))
      subFiles.forEach(sub => {
        const fileName = `${getFileName(sub)}`
        if (htmlPlugin) {
          const html = `${root}/${item}/${getFileName(sub)}.html`
          _l.push({
            template: fs.existsSync(html) ? html : defaultHtml,
            filename: `${projectName()}/${item}/${fileName}.html`,
            chunk: `${fileName}`,
            page: `${projectName()}/${item}/${fileName}.html`
          })
        } else {
          let state = fs.statSync(`${root}/${item}/${sub}`)
          if (state.isFile()) {
            let entry = `${root}/${item}/${fileName}.js`
            if (!fs.existsSync(entry)) {
              entry = `${cacheFileRootPath}/${item}/${fileName}.js`
              var source = fs.readFileSync(defaultFile, {encoding: 'utf8'})
              createDir(`${cacheFileRootPath}/${item}`)
              fs.writeFileSync(entry, `import component from 'src/view/${item}/${fileName}.vue'\n${source}`)
            }
            map[`${fileName}`] = entry
          }
        }
      })
    }
  })
  if (htmlPlugin) {
    return _l
  }
  // process.env.CMD === config.baseENV.dev && chokidarDir(dirs)
  return map
}

exports.obj = obj
