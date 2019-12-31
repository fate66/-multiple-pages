import {Picker} from '../Picker'
import wxDatePicker from './src/wxDatePicker'

let CBF = () => {
}
const getYearArray = (offset) => {
  let currentYear = new Date().getFullYear()
  let yearArr = []
  for (let i = currentYear - offset; i <= currentYear; i++) {
    yearArr.push(i)
  }
  return yearArr
}
const addZero = (i) => i > 9 ? i : '0' + i
const getDayArray = (year, month) => {
  let tday = new Date(year, month, 0)
  let dayArr = []
  for (let i = 1; i <= tday.getDate(); i++) {
    dayArr.push(addZero(i))
  }
  return dayArr
}
const getMonthArray = () => {
  let monthArray = []
  for (let i = 1; i < 13; i++) {
    monthArray.push(addZero(i))
  }
  return monthArray
}
const dfs = defaultValue => {
  return (defaultValue && defaultValue.split('-')) || []
}

let cache = {}

const datePicker = (data, cb) => {
  if (typeof data == 'function') {
    cb = data
    data = {}
  }
  if (!data.defaultValues) {
    let date = new Date()
    data.defaultValues = `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}`
  }
  data.range = data.range || 70
  const op = {
    onConfirm(val, vm) {
      CBF(`${val[0]}-${val[1]}-${val[2]}`)
    },
    onChange(vm, {index, data}) {
      cache[index] = data
      if (index == 0) {
        vm.$set(vm.cacheData, 2, getDayArray(data, cache[1] || 1))
      }
      if (index == 1) {
        vm.$set(vm.cacheData, 2, getDayArray(cache[0], cache[1] || 1))
      }
    }
  }
  CBF = cb
  let options = []
  let defaults = dfs(data.defaultValues)
  cache[0] = defaults[0]
  cache[1] = defaults[1]
  cache[2] = defaults[2]
  options.push(getYearArray(data.range))
  options.push(getMonthArray())
  options.push(getDayArray(defaults[0], parseInt(defaults[1])))
  op.options = options
  console.log(options, 'options')
  op.defaultValues = defaults
  Picker(op)
}
export {
  datePicker,
  wxDatePicker
}
