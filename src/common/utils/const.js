import config from '../../../config'
/* eslint-disable */
const ENVIRON_TYPE = function () {
  let type = 3
  switch (process.env.NODE_ENV) {
    case config.baseENV.dev: {
      type = 3
      break
    }
    case config.baseENV.daily: {
      type = 1
      break
    }
    case config.baseENV.pre: {
      type = 2
      break
    }
    case config.baseENV.production: {
      type = 3
      break
    }
  }
  return type
}()

export {
  ENVIRON_TYPE
}
