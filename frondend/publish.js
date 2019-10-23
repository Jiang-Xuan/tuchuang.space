const fs = require('fs')
const path = require('path')
const Oss = require('ali-oss')

const {
  DEPLOY_TYPE,
  F2E_ASSETS_ALI_OSS_ACCESS_KEY_ID,
  F2E_ASSETS_ALI_OSS_ACCESS_KEY_SECRET
} = process.env

const bucketName = DEPLOY_TYPE === 'beta' ? 'beta-assets-tuchuang-space' : 'assets-tuchuang-space'

console.log(`当前发布静态资源的环境为: DEPLOY_TYPE: ${DEPLOY_TYPE}, bucketName: ${bucketName}`)

const client = new Oss({
  region: 'oss-cn-hangzhou',
  accessKeyId: F2E_ASSETS_ALI_OSS_ACCESS_KEY_ID,
  accessKeySecret: F2E_ASSETS_ALI_OSS_ACCESS_KEY_SECRET,
  bucket: bucketName,
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
        console.log(`开始分片上传文件 ${childPath}`)
        const progress = async (percentage, checkpoint, res) => {
          console.log(`percentage: ${percentage * 100}%, checkpoint: ${JSON.stringify(checkpoint)}, res: ${JSON.stringify(res)}`)
        }
        await client.multipartUpload(`${ossDir}/${child}`, childPath, {
          progress,
          parallel: 1,
          partSize: 100 * 1024
        })
        console.log(`上传文件 ${childPath} 结束`)

        return Promise.resolve()
      })
    }
  })
}

process.on('unhandledRejection', (reason, promise) => {
  // https://nodejs.org/api/process.html#process_event_unhandledrejection
  console.log('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

walkDirAndUploadFile(buildPath)
