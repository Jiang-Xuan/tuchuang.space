const fs = require('fs')
const path = require('path')
const Oss = require('ali-oss')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const { DEPLOY_TYPE } = process.env

const bucketName = DEPLOY_TYPE === 'beta' ? 'beta-assets-tuchuang-space' : 'assets-tuchuang-space'

console.log(`当前发布静态资源的环境为: DEPLOY_TYPE: ${DEPLOY_TYPE}, bucketName: ${bucketName}`)

const client = new Oss({
  region: 'oss-cn-hangzhou',
  accessKeyId: process.env.F2E_ASSETS_ALI_OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.F2E_ASSETS_ALI_OSS_ACCESS_KEY_SECRET,
  bucket: bucketName,
  secure: true
})

const downloadIndexHtml = async () => {
  const result = await client.getStream('index.html')
  const writeStream = fs.createWriteStream(path.resolve(__dirname, './bff/index.html'))
  result.stream.pipe(writeStream)
}

process.on('unhandledRejection', (reason, promise) => {
  // https://nodejs.org/api/process.html#process_event_unhandledrejection
  console.log('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

downloadIndexHtml()
