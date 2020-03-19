const resolveImageStorageConfig = require('./resolveImageStorageConfig')

const varifyTimeconfig = (time) => {
  if (Array.isArray(time) === false) {
    throw new TypeError()
  }

  const [timeConfig, allowNumber] = time

  if (typeof timeConfig !== 'number') {
    throw new TypeError()
  }

  if (typeof allowNumber !== 'number') {
    throw new TypeError()
  }

  return time
}

module.exports = (backendConfig) => {
  if (Object.prototype.toString.call(backendConfig) !== '[object Object]') {
    throw new TypeError('backendConfig 必须是 object')
  }

  const { imageStorage, listenPort, deleteKeyCryptoKey, seconds, hours, dbPath } = backendConfig

  if (imageStorage === undefined) {
    throw new TypeError('期待提供 imageStorage 参数, 却得到了 undefined')
  }

  const imageStorageConfig = resolveImageStorageConfig(imageStorage)

  let listenPortConfig
  if (listenPort === undefined) {
    listenPortConfig = 4300
  } else {
    if (typeof listenPort !== 'number') {
      throw new TypeError('listenPort 必须是 number')
    } else {
      listenPortConfig = listenPort
    }
  }

  if (typeof deleteKeyCryptoKey !== 'string') {
    throw new TypeError('deleteKeyCryptoKey 必须是 string')
  }

  try {
    varifyTimeconfig(seconds)
  } catch (e) {
    throw new TypeError('seconds 必须是 [number, number]')
  }

  try {
    varifyTimeconfig(hours)
  } catch (e) {
    throw new TypeError('hours 必须是 [number, number]')
  }

  if (typeof dbPath !== 'string') {
    throw new TypeError('dbPath 必须是 string')
  }

  return Object.freeze({
    dbPath,
    listenPort: listenPortConfig,
    deleteKeyCryptoKey,
    seconds,
    hours,
    imageStorage: imageStorageConfig
  })
}
