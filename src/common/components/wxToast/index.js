import Vue from 'vue'
import Toast from './src/wxToast'
import utils from '../../utils/utils'

const ToastConstructor = Vue.extend(Toast)

const removeDom = el => {
  el.parentNode.removeChild(el)
}

ToastConstructor.prototype.close = function () {
  removeDom(this.$el)
}
Vue.prototype.$utils = utils
const init = () => {
  return new ToastConstructor().$mount(document.createElement('div'))
}

const wxToast = (data = {}, cb) => {
  const vm = init()
  if (typeof data === 'function') {
    cb = data
    data = {}
  }
  vm.duration = data.duration || 2000
  vm.content = data.content || ''
  vm.icon = data.icon || ''
  vm.autoClose = data.autoClose || true
  vm.cb = cb || ''
  document.body.appendChild(vm.$el)
  if (vm.autoClose) {
    setTimeout(() => {
      vm.cb && vm.cb()
      vm.close()
    }, vm.duration)
  }
  return vm
}

export default wxToast
