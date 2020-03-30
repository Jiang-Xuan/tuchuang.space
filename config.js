const fs = require('fs')
const path = require('path')
const resolveConfig = require('./utils/resolveConfig')

if (
  !fs.existsSync(
    path.resolve(__dirname, './self-hosted.config.js')
  )
) {
  throw new Error('self-hosted.config.js 文件不存在, 请查阅文档 https://www.example.com')
}

const selfHostedConfig = require('./self-hosted.config')

module.exports = resolveConfig(selfHostedConfig)
