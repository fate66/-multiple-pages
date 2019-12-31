const {spawn, execSync} = require('child_process')
const {resolve} = require('./utils')
const chokidar = require('chokidar')

var p = {}
var cache = {}

const runDev = () => {
  p = spawn('npm', ['run', 'dev:v'], {
    stdio: [process.stdin, process.stdout, process.stderr]
  })
}
runDev()

const nextTick = () => {
  if (Object.keys(cache).length) {
    Reflect.deleteProperty(cache, p.pid)
    execSync(`kill ${p.pid}`)
    runDev()
  }
}

const checkExtend = path => {
  if (path.endsWith('.vue')) {
    cache[p.pid] = p
    setTimeout(nextTick, 30)
  }
}
chokidar.watch(resolve(`src/view`), {
  persistent: true,
  ignoreInitial: true,
  depth: 1,
  ignored: /(^|[\/\\])\../ // 忽略点文件
}).on('add', path => {
  console.log('---------添加文件------------')
  console.log(path)
  checkExtend(path)
}).on('unlink', path => {
  console.log('---------删除文件------------')
  console.log(path)
  checkExtend(path)
})
