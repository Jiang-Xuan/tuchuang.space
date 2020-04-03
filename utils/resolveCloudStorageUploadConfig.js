const resolveAliOssConfig = require('./resolveAliOssConfig')

module.exports = (cloudUploadConfig) => {
  if (Object.prototype.toString.call(cloudUploadConfig) !== '[object Object]') {
    throw new TypeError('cloudUploadConfig 必须是 object')
  }

  const { aliOss } = cloudUploadConfig

  const aliOssConfig = resolveAliOssConfig(aliOss)

  return Object.freeze({
    aliOss: aliOssConfig
  })
}
