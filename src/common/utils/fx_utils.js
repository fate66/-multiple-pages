import Vue from 'vue'
import wx from 'weixin-js-sdk'

export default {
  syncHttp(url, params = {}) {
    return Vue.$utils.ps((resolve, reject) => {
      Vue.prototype.$http.get(url, params, res => {
        resolve(res)
      })
    })
  },
  syncPostHttp(url, params = {}) {
    return Vue.$utils.ps((resolve, reject) => {
      Vue.prototype.$http.post(url, params, res => {
        resolve(res)
      })
    })
  },
  async statis(params) {
    let param = Object.assign({
      item_page: Vue.$utils.pageName(),
      item_page_obj: '',
      item_action: '',
      item_action_obj: '',
      item_from: Vue.$utils.urlQuery('wfr'),
      item_from_obj: ''
    }, params)
    const url = Vue.$utils.cookie.get('openid') ? Vue.$comApi.add_wx_statistics : Vue.prototype.$comApi.statisV2Add
    if (Vue.$utils.cookie.get('openid')) {
      await this.syncPostHttp(url, param)
    } else {
      await this.syncHttp(url, param)
    }
  },
  /**
   * 微信
   */
  async wxjsSign(callback, account = 'dingyue') {
    if (!Vue.$utils.ua.isWX()) {
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
  }
}
