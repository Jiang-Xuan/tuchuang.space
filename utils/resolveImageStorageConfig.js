const resolveAliOssConfig = require('./resolveAliOssConfig')
const resolveLocalConfig = require('./resolveLocalConfig')

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

  const { aliOss, local } = imageStorageConfig

  if (
    aliOss === undefined &&
    local === undefined
  ) {
    throw new TypeError('必须至少有一个图片存储源配置')
  }

  let aliossConfig
  let localConfig

  if (aliOss) {
    aliossConfig = resolveAliOssConfig(aliOss)
  } else {
    localConfig = resolveLocalConfig(local)
  }

  return Object.freeze({
    aliOss: aliossConfig,
    local: localConfig
  })
}
