import 'src/common/utils/flexible'
import http from 'src/common/utils/http'
import 'src/static/css/common.scss'
import Vue from 'vue'
import {c_1} from 'src/api'
import 'src/common/utils/global'
import * as wxui from '@fxx2019/wxui'
import fxUtils from 'src/common/utils/fx_utils'

Vue.use(wxui)
Vue.prototype.$fxUtils = Vue.$fxUtils = fxUtils
Vue.prototype.$comApi = Vue.$comApi = c_1
Vue.prototype.$http = Vue.$http = http
Vue.prototype.$utils = Vue.$utils = wxui.utils
// if (utils.urlQuery('unionid') || utils.urlQuery('openid')) {
//   utils.cookie.set('unionid', utils.urlQuery('unionid'), 2592000000, '.fangxin.com')
//   utils.cookie.set('openid', utils.urlQuery('openid'), 2592000000, '.fangxin.com')
// }
