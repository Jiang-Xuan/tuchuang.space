const resolveBffConfig = require('./resolveBffConfig')
const resolveFrondendConfig = require('./resolveFrondendConfig')
const resolveBackendConfig = require('./resolveBackendConfig')
const resolveTestConfig = require('./resolveTestConfig')

/**
 * @typedef {object} ISelfHostedConfig
 * @property {import("./resolveBffConfig.js").IBffConfig} bff - bff 层配置
 * @property {any} frondend - frondend 层配置
 */

/**
 * @returns {Readonly<ISelfHostedConfig>}
 */
module.exports = function resolveConfig (
  /** @type {ISelfHostedConfig} */
  selfHostedConfig
) {
  if (Object.prototype.toString.call(selfHostedConfig) !== '[object Object]') {
    throw new TypeError('selfHostedConfig 必须是 object')
  }
  const { bff, frondend, backend, test } = selfHostedConfig

  const bffConfig = resolveBffConfig(bff)
  const frondendConfig = resolveFrondendConfig(frondend)
  const backendConfig = resolveBackendConfig(backend)

  let testConfig
  if (test) {
    testConfig = resolveTestConfig(test)
  }

  return Object.freeze({
    bff: bffConfig,
    frondend: frondendConfig,
    backend: backendConfig,
    test: testConfig
  })
}
