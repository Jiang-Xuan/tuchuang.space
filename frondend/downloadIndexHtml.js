const fs = require('fs')
const path = require('path')
const Oss = require('ali-oss')

const { DEPLOY_TYPE } = process.env

const bucketName = DEPLOY_TYPE === 'beta' ? 'beta-assets-tuchuang-space' : 'assets-tuchuang-space'

console.log(`当前发布静态资源的环境为: DEPLOY_TYPE: ${DEPLOY_TYPE}, bucketName: ${bucketName}`)

const client = new Oss({
  region: 'oss-cn-hangzhou',
  accessKeyId: 'LTAI4FtS842LoZriQNgbm872',
  accessKeySecret: 's8ILS7u0C3xkAnNqSYDVgOdzzu9CFj',
  bucket: bucketName,
  secure: true
})

const downloadIndexHtml = async () => {
  const result = await client.getStream('index.html')
  const writeStream = fs.createWriteStream(path.resolve(__dirname, './bff/index.html'))
  result.stream.pipe(writeStream)
}

downloadIndexHtml()
