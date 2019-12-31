import axios from 'axios'
import axiosUtils from 'axios/lib/utils'
// import {ENVIRON_TYPE} from './const'
// import Login from '@vdian/login'
// import ua from 'src/common/utils/ua'
// import {ssoDomain} from 'src/api/domain'
import Toast from 'src/common/components/wxToast'
import fxLogin from 'src/common/utils/login'
import Vue from 'vue'

function setContentTypeIfUnset(headers, value) {
  if (!axiosUtils.isUndefined(headers) && axiosUtils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value
  }
}

axios.defaults.timeout = 100000
axios.defaults.withCredentials = true
axios.defaults.transformRequest = [function (data, headers) {
  if (axiosUtils.isObject(data)) {
    setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8')
    for (let key in data) {
      if (axiosUtils.isObject(data[key])) {
        data[key] = JSON.stringify(data[key])
      }
    }
    let keys2 = Object.keys(data)
    /* 这里就是把json变成url形式，并进行encode */
    return encodeURI(keys2.map(name => `${name}=${data[name]}`).join('&'))
  }
}]

// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? base.productionHost : base.developtionHost
axios.interceptors.request.use((config) => {
  // config.headers['WD_b_id'] = utils.getCookie('WD_b_id')
  // let user = Vue.prototype.$cacheUtils.localStorage('user').getObject('user')
  // config.headers['_uid'] = utils.getCookie('_uid')
  // config.headers['userId'] = user && user.id ? user.id : ''
  return config
})

axios.interceptors.response.use((res) => {
  return res
})
export default {
  // 默认参数为空配置
  _default(url, params, callback, ext) {
    let options = {}
    options.url = url
    let param = typeof params === 'function' ? {} : params
    options.callback = typeof params === 'function' ? params : callback
    // param.WD_b_id = utils.getCookie('WD_b_id') || utils.getCookie('uid') || utils.getCookie('_uid')
    // param.uid = param.WD_b_id
    options.params = Object.keys(param).length === 0 ? {} : {param}
    Vue.$utils.urlQuery('debug') && (options.params.debug = Vue.$utils.urlQuery('debug'))
    // if (ext) {
    //   !ext.hasOwnProperty('showLogin') && (ext.showLogin = 2)
    // } else {
    //   ext = {showLogin: 2}
    // }
    return options
  },
  // 错误日志
  _errorLog(error) {
    Toast({
      content: error
    })
    console.log(error)
  },
  _cb(o, r) {
    o.callback && o.callback(r)
  },
  _formatRES(res, options, ext) {
    if (ext.native) {
      this._cb(options, res)
      return false
    }
    let result = {}
    let no_cb = false
    if (res.data && res.data.status && (parseInt(res.data.status.code) === 0 || parseInt(res.data.status.status_code) === 0)) {
      if (res.data.result !== null) {
        if (typeof res.data.result === 'object') {
          result = res.data.result
        } else {
          result._result = res.data.result
        }
        result._ok = true
      } else {
        result._ok = false
      }
    } else {
      no_cb = true
      if (parseInt(res.data.status.code) === 2 || parseInt(res.data.status.status_code) === 420010) {
        // if (ua.isWX()) {
        //   window.location.href = Login.wechatSlientLogin({
        //     url: ssoDomain + `/user/synclogin?redirect=${encodeURIComponent(window.location.href)}`,
        //     environment: ENVIRON_TYPE
        //   })
        // } else {
        //   window.location.href = Login.login({environment: ENVIRON_TYPE})
        // }
      } else if (parseInt(res.data.status.status_code) === 40500) {
        fxLogin.doLogin()
      } else {
        Toast({
          content: res.data.status.status_reason || res.data.status.description
        })
      }
    }
    !no_cb && this._cb(options, result)
  },
  get(url, params, callback, ext = {}) {
    let options = this._default(url, params, callback, ext)
    axios.get(options.url, {params: options.params})
        .then(res => {
          this._formatRES(res, options, ext)
        })
        .catch(error => {
          this._errorLog(error)
        })
  },
  post(url, params, callback, ext = {}) {
    let options = this._default(url, params, callback, ext)
    Vue.$utils.urlQuery('debug') && (options.url += `?debug=${Vue.$utils.urlQuery('debug')}`)
    axios.post(options.url, options.params)
        .then(res => {
          this._formatRES(res, options, ext)
        })
        .catch(error => {
          this._errorLog(error)
        })
  }
}
