const resolveImageStorageConfig = require('./resolveImageStorageConfig')

module.exports = (testConfig) => {
  if (Object.prototype.toString.call(testConfig) !== '[object Object]') {
    throw new TypeError('testConfig 必须是 object')
  }

  const { imageStorage } = testConfig

  const imageStorageConfig = resolveImageStorageConfig(imageStorage)

  return Object.freeze({
    imageStorage: imageStorageConfig
  })
}
