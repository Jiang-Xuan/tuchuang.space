const resolveAssetConfig = require('./resolveAssetConfig')

/**
 * @typedef {object} IFrondendConfig 前端配置
 * @property {any} asset - 前端静态资源 打包&发布 配置
 */

/**
 * @param {IFrondendConfig} frondendConfig
 * @returns {Readonly<IFrondendConfig>}
 */
module.exports = function resolveFrondendConfig (frondendConfig) {
  if (Object.prototype.toString.call(frondendConfig) !== '[object Object]') {
    throw new TypeError('frondendConfig 必须是 object')
  }

  const { asset } = frondendConfig

  const assetConfig = resolveAssetConfig(asset)

  return Object.freeze({
    asset: assetConfig
  })
}
