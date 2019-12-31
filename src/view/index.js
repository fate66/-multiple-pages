import Vue from 'vue'
import 'src/view/base.js'
import Login from 'src/common/utils/login'

/* eslint-disable no-undef */
if (Login.isLogin()) {
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
  Login.doLogin()
}
