const fs = require('fs')
const path = require('path')

if (
  !fs.existsSync(
    path.resolve(__dirname, './self-hosted.config.js')
  )
) {
  throw new Error('self-hosted.config.js 文件不存在, 请查阅文档 https://www.example.com')
}

const selfHostedConfig = require('./self-hosted.config')

const resultConfig = {}

const bff = selfHostedConfig.bff

if (!!bff === false) {
  /** bff 层的默认配置 */
  resultConfig.bff = {
    listenPort: 4303
  }
} else if (Object.prototype.toString.call(bff) !== '[object Object]') {
  throw new Error('bff 配置无效, 请查阅文档 https://www.example.com')
} else {
  const { listenPort } = bff
  if (typeof listenPort !== 'number') {
    throw new Error('bff.listenPort 配置无效, 请查阅文档 https://www.example.com')
  }

  resultConfig.bff = {
    listenPort
  }
}

module.exports = Object.freeze(resultConfig)
