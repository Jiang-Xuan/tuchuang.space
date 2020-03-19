const resolveAliOssConfig = require('./resolveAliOssConfig')

/**
 * @typedef {object} IImageStorage
 * @property {import("./resolveAliOssConfig").IAliOss} alioss - 阿里云 OSS 存储配置
 */

/**
 * @param {IImageStorage} imageStorageConfig
 */
module.exports = (imageStorageConfig) => {
  if (Object.prototype.toString.call(imageStorageConfig) !== '[object Object]') {
    throw new TypeError('imageStorageConfig 必须是 object')
  }

  const { alioss } = imageStorageConfig

  if (alioss === undefined) {
    throw new TypeError('alioss 必须提供, 目前只支持 alioss')
  }

  const aliossConfig = resolveAliOssConfig(alioss)

  return Object.freeze({
    alioss: aliossConfig
  })
}
