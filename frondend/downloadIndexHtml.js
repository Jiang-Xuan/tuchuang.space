const fs = require('fs')
const path = require('path')
const Oss = require('ali-oss')
const {
  frondend: {
    asset: {
      useCloudStorage,
      cloudStorageUpload,
      location
    }
  }
} = require('../config')

console.log(`downloadIndexHtml.js: useCloudStorage: ${useCloudStorage}`)

if (useCloudStorage) {
  const client = new Oss(cloudStorageUpload.aliOss)
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
} else {
  let indexPath
  // 如果 location === '.' 表示静态文件被保持在 fronend 目录下的 dist 目录
  if (location === '.') {
    indexPath = path.resolve(process.cwd(), './frondend/dist/index.html')
  } else {
    indexPath = path.resolve(process.cwd(), location, './dist/index.html')
  }
  const read = fs.createReadStream(indexPath)
  const writeStream = fs.createWriteStream(path.resolve(__dirname, './bff/index.html'))
  read.pipe(writeStream)
}
