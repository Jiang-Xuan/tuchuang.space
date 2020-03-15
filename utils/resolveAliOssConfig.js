/**
 * @typedef {object} IAliOss 阿里云 OSS 服务配置 https://help.aliyun.com/document_detail/64097.html
 * @property {string} accessKeyId - 秘钥 ID
 * @property {string} accessKeySecret - 秘钥 secret
 * @property {string} bucket - bucket 名称
 * @property {boolean} [secure=true] - (secure: true)则使用HTTPS，(secure: false)则使用HTTP
 */

/**
 * @param {IAliOss} aliOss
 * @returns {Readonly<IAliOss>}
 */
module.exports = function resolveAliOss (aliOssConfig) {
  if (Object.prototype.toString.call(aliOssConfig) !== '[object Object]') {
    throw new Error('aliOssConfig 必须是 object')
  }

  const { accessKeyId, accessKeySecret, bucket, secure } = aliOssConfig

  if (typeof accessKeyId !== 'string') {
    throw new TypeError('accessKeyId 必须是 string')
  }

  if (typeof accessKeySecret !== 'string') {
    throw new TypeError('accessKeySecret 必须是 string')
  }

  if (typeof bucket !== 'string') {
    throw new TypeError('bucket 必须是 string')
  }

  if (typeof secure !== 'boolean') {
    throw new TypeError('secure 必须是 boolean')
  }

  return Object.freeze({
    ...aliOssConfig
  })
}
