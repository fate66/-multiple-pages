import Vue from 'vue'
import 'src/view/base.js'
import {login} from '@fxx2019/fx-constant'

/* eslint-disable no-undef */
if (login.isLogin()) {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    data() {
      return {}
    },
    /* eslint-disable no-undef */
    render: h => h(component)
  })
} else {
  login.doLogin()
}
