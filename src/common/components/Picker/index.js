import Vue from 'vue'
import pickerComponent from './src/index'
import utils from '../../utils/utils'

const wxPicker = pickerComponent

const Picker = (data = {}) => {
  const PickerConstructor = Vue.extend(pickerComponent)
  const init = (propsData) => {
    return new PickerConstructor({
      propsData
    }).$mount(document.createElement('div'))
  }
  Vue.prototype.$utils = utils
  const vm = init({
    options: data.options,
    onConfirm: data.onConfirm,
    onHide: data.onHide,
    onChange: data.onChange,
    defaultValues: data.defaultValues,
    isCom: false
  })
  document.body.appendChild(vm.$el)
  return vm
}

export {
  Picker,
  wxPicker
}
