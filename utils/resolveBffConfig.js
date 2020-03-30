
/**
 * @typedef {object} IBffConfig
 * @property {number} listenPort - HTTP 服务监听的端口
 */

/**
 * @returns {Readonly<IBffConfig>}
 */
module.exports = function resolveBffConfig (
  /** @type {IBffConfig} */
  bffConfig
) {
  if (Object.prototype.toString.call(bffConfig) !== '[object Object]') {
    throw new TypeError('bffConfig 必须是 object')
  }

  const { listenPort } = bffConfig

  if (typeof listenPort !== 'number') {
    throw new TypeError('listenPort 必须是 number')
  }

  return Object.freeze({
    listenPort
  })
}
