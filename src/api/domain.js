let apiDomain = ''
let ssoDomain = ''
let thorDomain = ''
const config = require('../../config')
switch (process.env.NODE_ENV) {
  case config.baseENV.dev: {
    break
  }
  case config.baseENV.daily: {
    break
  }
  case config.baseENV.pre: {
    break
  }
  case config.baseENV.production: {
    break
  }
}

const apiHOST = 'https://gwh5api.fangxin.com'

export {
  apiDomain,
  apiHOST,
  ssoDomain,
  thorDomain
}
