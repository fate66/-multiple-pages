import Picker from '../Picker'
import adsData from './addressData'

let CBF = () => {
}
for (let item of adsData) {
  item.label = item.name
  item.cityList.forEach(sub => {
    sub.label = sub.name
    sub.areaList.forEach(sun => {
      sun.label = sun.name
    })
  })
}
const dfs = defaultValue => {
  return (defaultValue && defaultValue.split('-')) || []
}

const getADSD = (k, val, list) => {
  let l1
  console.log()
  for (let item of list) {
    if (item.name === val) {
      l1 = item[k]
      break
    }
  }
  return l1 || list[0][k]
}

const op = {
  onConfirm(val, vm) {
    CBF(val)
  },
  onChange(vm, {index, data}) {
    if (index == 0) {
      vm.$set(vm.cacheData, 1, data.cityList)
      vm.$set(vm.cacheData, 2, data.cityList[0].areaList)
    } else if (index == 1) {
      vm.$set(vm.cacheData, 2, data.areaList)
    }
  }
}
const exF = (defaultValue, confirm) => {
  if (typeof defaultValue == 'function') {
    confirm = defaultValue
    defaultValue = ''
  }
  CBF = confirm
  let options = []
  let defaults = dfs(defaultValue)
  console.log(defaults, 'defaults')
  let citys = getADSD('cityList', defaults[0] || '', adsData)
  options.push(adsData)
  options.push(citys)
  options.push(getADSD('areaList', defaults[1] || '', citys))
  op.options = options
  op.defaultValues = defaults
  console.log(op.options, '223232')
  Picker(op)
}
export default exF
