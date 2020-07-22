const fs = require('fs')
const path = require('path')
const {resolve} = require('./utils')
const envDir = process.argv[process.argv.length - 1] == 'pre' ? 'pre' : ''
const root = resolve(`dist/ipub${envDir}`)
const root2 = resolve(`dist/debug${envDir}`)
const jsDir = path.join(root, 'js')
const cssDir = path.join(root, 'css')
const css_list = fs.readdirSync(cssDir).map(cs => {
    return {css_name: sourceName(cs), css_path: `/ipub${envDir}/css/${cs}`}
})
const js_list = fs.readdirSync(jsDir).map(js => {
    return {js_name: sourceName(js), js_path: `/ipub${envDir}/js/${js}`}
})

const vendor_path = js_list.find(item => item.js_name == 'vendor').js_path

function sourceName(file) {
    return file.split('.')[0]
}

function toHtml(css, js) {
    return `<!DOCTYPE html>
    <html>
    <head>
    <title>放心选</title>
    <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
        <meta content="telephone=no" name="format-detection"/>
        <meta name="apple-touch-fullscreen" content="yes"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
        <link href="https://si.geilicdn.com/fxx7524341-3d140000016955f72d120a217216-unadjust_1025_1025.png" rel="shortcut icon" type="image/x-icon"/>
        <!-- auto-css -->
<!--        <link href="${css}" rel="stylesheet">-->
        
        </head>
        <body>
        <div class="content">
        <div id="app"></div>
        </div>
        <script type="text/javascript">
            window.addEventListener('error', function (e) {
                if(!(e.target.tagName == 'SCRIPT' || e.target.tagName == 'LINK')) {
                    let mask =  document.querySelector('#log-mask')
                   let errDom = document.createElement('div')
                   errDom.setAttribute('style', 'color: red')
                   errDom.innerText = e && e.error && e.error.toString()
                  mask.appendChild(errDom)
                }
            }, true)
        </script>
      <script type="text/javascript">
      
       function createLog(mask, str = '下一步检测开始') {
        let logDom =  document.createElement('div')
         logDom.setAttribute('style', 'color: yellow') 
         logDom.innerText = str
          mask.appendChild(logDom)
       }
      
         let mask = document.createElement('div')
        mask.setAttribute('style', 'width:100vw;height:100vh;background-color: rgba(0,0,0,.8);position: fixed;left:0;top:0;padding-left:30px;padding-top:20px;color:white;line-height: 30px;box-sizing: border-box;padding-right: 30px;word-break: break-all;')
        mask.setAttribute('id', 'log-mask')
        document.body.appendChild(mask)
         createLog(mask, '手机已联网，html下载成功')  
         createLog(mask, '开始进行静态资源检测')   
          let cssLink = document.createElement('link')
        cssLink.href = '${css}'
        cssLink.rel = 'stylesheet'
        document.body.appendChild(cssLink)
         let cssDom = document.createElement('div')
        cssLink.onerror = function(err) {
         cssDom.setAttribute('style', 'color: red;')
         cssDom.innerText = '${css}加载失败！！！！' + err.toString()
          mask.appendChild(cssDom)
          createLog(mask)
        }
        cssLink.onload = function() {
         cssDom.innerText = '${css}加载成功'
         mask.appendChild(cssDom)
         createLog(mask)
       }
        
      
        let vendorScript = document.createElement('script')
        vendorScript.src = '${vendor_path}'
        vendorScript.type = 'text/javascript'
        document.body.appendChild(vendorScript)
         let vendorDom = document.createElement('div')
        vendorScript.onerror = function(err) {
         vendorDom.setAttribute('style', 'color: red;')
         vendorDom.innerText = '${vendor_path}加载失败！！！！' + err.toString()
         mask.appendChild(vendorDom)
         createLog(mask)     
       }
        vendorScript.onload = function() {
         vendorDom.innerText = '${vendor_path}加载成功'
           mask.appendChild(vendorDom)
         createLog(mask)       
       }
       setTimeout(() => {
       let jsScript = document.createElement('script')
        jsScript.src = '${js}'
          jsScript.type = 'text/javascript'
        document.body.appendChild(jsScript)
        let jsDom = document.createElement('div')
        jsScript.onerror = function(err) {
         jsDom.setAttribute('style', 'color: red;')
         jsDom.innerText = '${js}加载失败！！！！'+ err.toString()
           mask.appendChild(jsDom)
         createLog(mask, '检测结束')    
       }
         jsScript.onload = function() {
         jsDom.innerText = '${js}加载成功'
           mask.appendChild(jsDom)
         createLog(mask, '检测结束')
       }
       }, 1000)
       
       </script>
        </body>
        </html>`
}

try {
    let dirs = fs.readdirSync(root)
    let execSync = require('child_process').execSync
    execSync(`rm -rf ${resolve('dist/debug' + envDir)}`)
    console.log(`clear-- ${resolve('dist/debug' + envDir)} has been removed`)
    fs.mkdirSync(root2)
    dirs.map(dir => {
        if (!(dir == 'css' || dir == 'img' || dir == 'js')) {
            const root2_dir_page = path.join(root2, dir)
            fs.mkdirSync(root2_dir_page)
            for (let page of fs.readdirSync(path.join(root, dir))) {
                const file = sourceName(page)
                const css_path = css_list.find(item => item.css_name == file).css_path
                const js_path = js_list.find(item => item.js_name == file).js_path
                const html = toHtml(css_path, js_path)
                console.log(`create debug ${page}`)
                fs.writeFileSync(path.join(root2_dir_page, page), html)
            }
        }
    })
} catch (e) {
    console.error(e)
    process.exit(1)
}
