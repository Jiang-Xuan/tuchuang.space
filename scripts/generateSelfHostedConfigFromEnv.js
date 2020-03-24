/**
 * @description 供 Github Action 使用的 self-hosted.config.js, 敏感信息通过 Github Actions Secret 传递, 非敏感信息全部为默认
 * 主要用在 Backend 的 e2e 测试中
 */

const fs = require('fs')
const path = require('path')

const config = {
  /** @type {{}} bff 服务层 */
  bff: {
    /** @type {number} @description HTTP 服务监听的端口号 */
    listenPort: 4303
  },
  /** @type {{}} 前端 */
  frondend: {
    /** @type {{}} 前端静态资源配置 */
    asset: {
      /** @type {boolean} 是否使用云服务来存储自己的静态资源 */
      useCloudStorage: false
    }
  },
  /** @type {{}} 后端 */
  backend: {
    /** @type {{}} 图片存储源 */
    imageStorage: {
      aliOss: {
        accessKeyId: 'id',
        accessKeySecret: 'secret',
        region: 'region',
        internal: false,
        bucket: 'bucket',
        secure: true
      }
    },
    /** @type {number} HTTP 服务监听的端口号 */
    listenPort: 4300,
    /** @type {string} 生成删除图片 Key 的加密 key */
    deleteKeyCryptoKey: 'crypto key',
    /** @type {[number, number]} 请求频率限制, 以秒为单位 */
    seconds: [1, 10],
    /** @type {[number, number]} 请求频率限制, 以小时为单位 */
    hours: [24, 5000],
    /** @type {string} mongodb 数据库的地址 */
    dbPath: 'mongodb://localhost:3402/test'
  },
  test: {
    imageStorage: {
      aliOss: {
        accessKeyId: process.env.BACKEND_E2E_TEST_ALI_OSS_ACCESS_KEY_ID,
        accessKeySecret: process.env.BACKEND_E2E_TEST_ALI_OSS_ACCESS_KEY_SECRET,
        region: 'oss-cn-hangzhou',
        bucket: 'tuchuang-space-test1',
        secure: true
      }
    }
  }
}

console.log(`将 ${JSON.stringify(config, null, 2)} 写入 ${path.resolve(process.cwd(), './self-hosted.config.js')}`)

fs.writeFileSync(
  path.resolve(process.cwd(), './self-hosted.config.js'),
  `module.exports = ${JSON.stringify(config)}`
)
