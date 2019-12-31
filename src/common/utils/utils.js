import Vue from 'vue'
import wx from 'weixin-js-sdk'
import ua from './ua'

const _toString = Object.prototype.toString

export default {
  trackAction(action, args) {
    if (!action) {
      console.error('上传的动作不可为空')
      return
    }
    console.log(action, args)
    window.spider.trackAction({
      actionName: action,
      actionArgs: args
    })
  },
  href(url) {
    window.location.href = url
  },
  transferActionBy(url, action = {}, pushPage = true) {
    if (!this.isPlainObject(action)) {
      pushPage = action
      action = {}
    }
    if (!(url && action && action.actionName)) {
      console.error('数据埋点参数不可为空')
      return
    }
    if (pushPage) {
      this.href(window.spider.transferActionBy(url, action))
    } else {
      const net = window.spider.transferActionBy(url, action)
      return net
    }
  },
  urlQuery(key) {
    let m = location.search.match(new RegExp(`(\\?|&)(${key})=([^&$]*)`))
    return m ? m[3] : ''
  },
  syncHttp(url, params = {}) {
    /* eslint-disable no-new */
    return new Promise((resolve, reject) => {
      Vue.prototype.$http.get(url, params, res => {
        resolve(res)
      })
    })
  },
  syncPostHttp(url, params = {}) {
    /* eslint-disable no-new */
    return new Promise((resolve, reject) => {
      Vue.prototype.$http.post(url, params, res => {
        resolve(res)
      })
    })
  },
  pageName() {
    let list = window.location.href.split('/')
    let list2 = list[list.length - 1].split('?')
    return list2[0].split('.')[0]
  },
  async statis(params) {
    let param = Object.assign({
      item_page: this.pageName(),
      item_page_obj: '',
      item_action: '',
      item_action_obj: '',
      item_from: this.urlQuery('wfr'),
      item_from_obj: ''
    }, params)
    const url = Vue.$utils.cookie.get('openid') ? Vue.$comApi.add_wx_statistics : Vue.prototype.$comApi.statisV2Add
    if (Vue.$utils.cookie.get('openid')) {
      await this.syncPostHttp(url, param)
    } else {
      await this.syncHttp(url, param)
    }
  },
  getCookie(name) {
    var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
    if (arr != null) {
      return unescape(arr[2])
    }
    return null
  },
  isObject(obj) {
    return obj !== null && typeof obj === 'object'
  },
  looseEqual(a, b) {
    if (a === b) return true
    const isObjectA = this.isObject(a)
    const isObjectB = this.isObject(b)
    if (isObjectA && isObjectB) {
      try {
        const isArrayA = Array.isArray(a)
        const isArrayB = Array.isArray(b)
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every((e, i) => {
            return this.looseEqual(e, b[i])
          })
        } else if (a instanceof Date && b instanceof Date) {
          return a.getTime() === b.getTime()
        } else if (!isArrayA && !isArrayB) {
          const keysA = Object.keys(a)
          const keysB = Object.keys(b)
          return keysA.length === keysB.length && keysA.every(key => {
            return this.looseEqual(a[key], b[key])
          })
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  },
  deepClone(obj) {
    var o
    if (typeof obj === 'object') {
      if (obj === null) {
        o = null
      } else {
        if (obj instanceof Array) {
          o = []
          for (var i = 0, len = obj.length; i < len; i++) {
            o.push(this.deepClone(obj[i]))
          }
        } else {
          o = {}
          for (var j in obj) {
            o[j] = this.deepClone(obj[j])
          }
        }
      }
    } else {
      o = obj
    }
    return o
  },
  /**
   * 缓存cookie默认存储一个月
   * @type {Object}
   */
  cookie: {
    set: (key, val, time, domain, temporary) => {
      var exp = new Date()
      var t = !time ? (exp.getTime() + 2592000000) : (exp.getTime() + time)
      exp.setTime(t)
      if (domain === true) {
        /* no-useless-escape */
        // .xx.com
        domain = document.domain.replace(/[a-zA-Z]+/, '')
      }
      var extr = domain ? ';domain=' + domain + ';path=/' : ';path=/'
      document.cookie = key + '=' + escape(val) + (temporary ? '' : ';expires=' + exp.toGMTString()) + extr
    },
    get: key => {
      var reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')
      var arr = document.cookie.match(reg)
      return arr ? unescape(arr[2]) : ''
    },
    setObject: (key, val, time, domain, temporary) => {
      val = JSON.stringify(val)
      var exp = new Date()
      var t = !time ? (exp.getTime() + 2592000000) : (exp.getTime() + time)
      exp.setTime(t)
      if (domain === true) {
        /* no-useless-escape */
        // .xx.com
        domain = document.domain.replace(/[a-zA-Z]+/, '')
      }
      var extr = domain ? ';domain=' + domain + ';path=/' : ';path=/'
      document.cookie = key + '=' + escape(val) + (temporary ? '' : ';expires=' + exp.toGMTString()) + extr
    },
    getObject: key => {
      var reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')
      var arr = document.cookie.match(reg)
      let json = null
      try {
        json = JSON.parse(arr ? unescape(arr[2]) : '')
      } catch (e) {
        console.log('缓存数据解决json异常!')
      }
      return json
    },
    del: function (key, domain) {
      var exp = new Date()
      exp.setTime(exp.getTime() - 1)
      var cval = this.get(key)
      if (domain === true) {
        domain = document.domain.replace(/[a-zA-Z]+/, '')
      }
      var extr = domain ? ';domain=' + domain + ';path=/' : ';path=/'
      if (cval) {
        document.cookie = key + '=1;expires=' + exp.toGMTString() + extr
      }
    },
    clear: function (domain) {
      if (domain === true) {
        domain = document.domain.replace(/[a-zA-Z]+/, '')
      }
      var extr = domain ? ';domain=' + domain + ';path=/' : ';path=/'
      var keys = document.cookie.match(/[^ =;]+(?==)/g)
      if (!keys || !keys.length) return
      for (var i = keys.length - 1; i >= 0; i--) {
        document.cookie = keys[i] + '=0;expires=Thu, 01 Jan 1970 00:00:00 GMT;' + extr
      }
    }
  },
  /**
   * 默认存储
   * @param prefix
   * @returns {{set: set, get: (function(String): (string | null)), setObject: setObject, getObject: getObject, del: del, clear: clear, key: (function(Number): string), keys: (function(): string[]), values: (function(): any[]), length: (function(): number)}}
   */
  localStorage(prefix = this.pageName()) {
    const separator = '--'
    /**
     * @desc 存入缓存，String
     * @param {String} key
     * @param {String} val
     * @public
     */
    var set = (key, val) => {
      key = prefix + separator + key
      if (!window.localStorage) {
        window.alert('Your browser not support localStorage. Please check set browser private model.')
        return
      }
      try {
        window.localStorage.setItem(key, val)
      } catch (e) {
        window.console.warn('Your browser not support localStorage. ' + e)
        window.alert('Your browser not support localStorage. Please check set browser private model.')
      }
    }
    /**
     * @desc 获取数据,String
     * @param {String} key
     * @return {String}
     * @public
     */
    var get = key => {
      key = prefix + separator + key
      return window.localStorage.getItem(key)
    }
    return {
      set,
      get,
      /**
       * @desc 存入缓存，Object
       * @param {String} key
       * @param {Object} val
       * @public
       */
      setObject: (key, val) => {
        val = JSON.stringify(val)
        set(key, val)
      },
      /**
       * @desc 获取数据,Object
       * @param {String} key
       * @return {Object}
       * @public
       */
      getObject: key => {
        let result = get(key)
        let json = null
        if (!result) {
          return undefined
        } else {
          try {
            json = JSON.parse(result)
          } catch (e) {
            console.log('缓存数据解决json异常!')
          }
          return json
        }
      },
      /**
       * @desc 删除数据
       * @param {String} key
       * @public
       */
      del: key => {
        key = prefix + separator + key
        window.localStorage.removeItem(key)
      },
      /**
       * @desc 清除数据,instanceId需要保留
       * @param {String} key
       * @public
       */
      clear: () => {
        window.localStorage.clear()
        // this.cookie.clear()
        window.sessionStorage.clear()
      },
      /**
       * @desc 获取key根据角标
       * @param {Number} i
       * @return {String} key
       * @public
       */
      key: i => {
        i = i || 0
        return Object.keys(window.localStorage)[i]
      },
      /**
       * @desc 获取所有的key
       * @param {Number} i
       * @return {Array} key数组
       * @public
       */
      keys: () => {
        return Object.keys(window.localStorage)
      },
      /**
       * @desc 获取所有的value
       * @return {Object} 数据集合
       * @public
       */
      values: () => {
        return Object.values(window.localStorage)
      },
      /**
       * @desc 获取key的数量
       * @return {Number} key数量
       * @public
       */
      length: () => {
        return Object.keys(window.localStorage).length
      }
    }
  },
  /**
   * 获取屏幕宽度
   * @returns {number}
   */
  getWindowWidth() {
    /*
        window.innerWidth Internet Explorer、Chrome、Firefox、Opera 以及 Safari
        document.body.clientWidth || document.documentElement.clientWidth  Internet Explorer 8、7、6、5
     */
    return screen.width || 0
  },
  getWindowHeight() {
    return screen.height || 0
  },
  /**
   * 获取页面滚动的距离
   */
  getScrollTop() {
    /*
        document.documentElement.scrollTop  Chrome、Firefox、Opera
        document.body.scrollTop IE
     */
    return document.documentElement.scrollTop || document.body.scrollTop
  },
  /**
   * 获取dom元素距离顶部的距离
   */
  getOffsetTop(el) {
    return el.offsetTop
  },
  /**
   * 虚拟像素转rem
   * @param px
   * @returns {*|number}
   */
  widthpx2rem(px) {
    return this.dp2rem(this.w2px(px))
  },
  heightpx2rem(px) {
    return this.dp2rem(this.h2px(px))
  },
  /**
   * 虚拟像素转真实像素
   * @param px
   * @returns {*}
   */
  w2px(px) {
    return typeof px === 'number' ? this.getWindowWidth() / 750 * px : ''
  },
  h2px(px) {
    return this.getWindowHeight() / 1334 * px
  },
  /**
   * 真实像素转虚拟像素
   * @param dp
   */
  px2w(dp) {
    return dp * 750 / this.getWindowWidth()
  },
  /**
   * 真实的像素转rem
   * @param dp
   * @returns {number}                      ()
   */
  dp2rem(dp) {
    return window.lib.flexible.px2rem(dp)
  },
  uuid() {
    var s = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'
    let uuid = s.join('')
    return uuid
  },
  /**
   * 获取域名
   * fangxin.com
   * @returns {string}
   */
  getDomain() {
    let list = window.location.href.split('/')
    list.length = list.length - 1
    return list.join('/')
  },
  isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]'
  },
  getUri(params) {
    let param = ''
    if (this.isPlainObject(params)) {
      let keys = Object.keys(params)
      if ((keys && keys.length && !(keys.includes('wfr'))) || !keys || !(keys.length)) {
        params.wfr = this.urlQuery('wfr')
        !params.wfr && Reflect.deleteProperty(params, 'wfr')
      }
      keys = Object.keys(params)
      for (let key of keys) {
        let val = typeof (params[key]) === 'object' ? JSON.stringify(params[key]) : params[key]
        param = param + key + '=' + val + '&'
      }
    }
    param = param && param.slice(0, param.length - 1)
    return param
  },
  /**
   * 跳转页面
   * @param page
   * @param params
   * @param pushPage 是否跳转页面
   * @returns {string}
   */
  push(page, params = {}, pushPage = true) {
    if (!this.isPlainObject(params)) {
      pushPage = params
      params = {}
    }
    let uri = this.getUri(params)
    // window.history.pushState({page: page}, '', ``)
    const url = `${this.getDomain()}/${page}.html${uri ? '?' + uri : ''}`
    if (pushPage) {
      this.href(url)
    } else {
      return url
    }
  },
  replace(page, params) {
    let uri = this.getUri(params)
    // window.history.pushState({page: page}, '', ``)
    window.location.replace(`${this.getDomain()}/${page}.html${uri ? '?' + uri : ''}`)
  },
  back(pages = -1) {
    window.history.go(pages)
    // console.log(document.referrer, self.location, '-0-')
    // self.location = document.referrer
  },
  /**
   * 保留小数，不足不补0
   * @param num
   */
  toDecimal(num, digit = 2) {
    if (isNaN(num)) {
      console.error('必须为数字')
      return false
    }
    let capacit = 1
    let i = 1
    while (i <= digit) {
      capacit *= 10
      i++
    }
    return parseInt(num * capacit) / capacit
  },
  /**
   * 获取网页路径
   */
  urlPathname() {
    return window.location.host + window.location.pathname
  },
  /**
   * 微信
   */
  async wxjsSign(callback, account = 'dingyue') {
    if (!ua.isWX()) {
      console.log('不是微信')
      return false
    }
    let res = await this.syncHttp(Vue.prototype.$comApi.wxjsSign, {url: window.location.href, account: account})
    if (res._ok) {
      try {
        wx.config({
          debug: false,
          appId: res.appId,
          timestamp: parseInt(res.timestamp),
          nonceStr: res.nonceStr,
          signature: res.signature,
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseImage', 'uploadImage', 'scanQRCode']
        })
        wx.ready(function () {
          console.log('微信js初始化成功')
          callback && callback(res)
        })
        wx.error(res => {
          console.log('微信js初始化失败')
          alert(JSON.stringify(res))
        })
      } catch (g) {
        alert(g)
      }
    }
  },
  /**
   * 获取dom元素距离页面顶部的距离
   * @param el
   * @returns {*}
   */
  getElementToPageTop(el) {
    if (el.parentElement) {
      return this.getElementToPageTop(el.parentElement) + el.offsetTop
    }
    return el.offsetTop
  },
  /**
   * pc保存文件
   * @param file
   * @param filename
   */
  fileDownload(file, filename) {
    let eleLink = document.createElement('a')
    eleLink.download = filename
    eleLink.style.display = 'none'
    eleLink.href = file
    document.body.appendChild(eleLink)
    eleLink.click()
    document.body.removeChild(eleLink)
  },
  /**
   * 适配橡皮筋
   * @param self
   * @param ref
   */
  fixRubberUI(self, ref) {
    // if (!ua.isWX()) {
    //   console.log('不是微信')
    //   return false
    // }
    if (self.$refs[ref].offsetHeight < this.getWindowHeight()) {
      self.$refs[ref].style.height = this.dp2rem(this.getWindowHeight()) + 'rem'
    }
  },
  getProjectUrl(page) {
    const list = window.location.href.split('/')
    list[list.length - 1] = `${page}.html`
    return list.join('/')
  },
  copyVal(val) {
    console.log(val)
    let input = document.createElement('input')
    input.value = val
    input.style.opacity = 0.1
    document.body.appendChild(input)
    if (ua.isIOS()) {
      window.getSelection().removeAllRanges()
      var range = document.createRange()
      range.selectNode(input)
      window.getSelection().addRange(range)
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
    } else {
      input.select()
      document.execCommand('Copy')
    }
    document.body.removeChild(input)
  },
  sort(arr) {
    arr.sort(() => Math.random() - 0.5)
  },
  login() {
    this.$http.get('https://gwh5api.fangxin.com/fxx/insurance/get_wx_web_auth', {
      type: 2,
      url: 'https://seals.fangxin.com/yyhd/lottery/give_insurance.html'
    }, res => {
      console.log(res.data.link)
      window.location.href = res.data.link
    })
  },
  url2obj(url) {
    const _o = {}
    const _l = url.split('?')
    const _s = _l.length > 1 ? _l[1] : ''
    if (_s) {
      for (let item of _s.split('&')) {
        const _i = item.split('=')
        _o[_i[0]] = _i.length > 1 ? _i[1] : ''
      }
    }
    return Object.keys(_o) ? _o : ''
  }
}
