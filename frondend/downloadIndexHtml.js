const fs = require('fs')
const path = require('path')
const Oss = require('ali-oss')

const client = new Oss({
  region: 'oss-cn-hangzhou',
  accessKeyId: 'LTAI4FtS842LoZriQNgbm872',
  accessKeySecret: 's8ILS7u0C3xkAnNqSYDVgOdzzu9CFj',
  bucket: 'assets-tuchuang-space',
  secure: true
})

const downloadIndexHtml = async () => {
  const result = await client.getStream('index.html')
  const writeStream = fs.createWriteStream(path.resolve(__dirname, './bff/index.html'))
  result.stream.pipe(writeStream)
}

downloadIndexHtml()
