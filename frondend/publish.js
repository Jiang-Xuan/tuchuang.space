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

const buildPath = path.resolve(__dirname, './dist')

const buildPathState = fs.statSync(buildPath)

if (buildPathState.isDirectory() === false) {
  process.exit(1)
}

/**
 * 上传目录下所有文件
 * @param {string} dir 目录路径
 */
const walkDirAndUploadFile = (walkDir, ossDir = '', exector = Promise.resolve()) => {
  const children = fs.readdirSync(walkDir)

  children.forEach(child => {
    const childPath = path.resolve(walkDir, child)
    if (
      fs.statSync(childPath).isDirectory()
    ) {
      walkDirAndUploadFile(childPath, `${ossDir}/${child}`, exector)
    } else if (
      fs.statSync(childPath).isFile()
    ) {
      exector = exector.then(async () => {
        console.log(`开始上传文件 ${childPath}`)
        await client.put(`${ossDir}/${child}`, fs.createReadStream(childPath))
        console.log(`上传文件 ${childPath} 结束`)

        return Promise.resolve()
      })
    }
  })
}

walkDirAndUploadFile(buildPath)
