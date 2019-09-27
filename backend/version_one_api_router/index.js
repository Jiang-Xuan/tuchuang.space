const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const { promisify } = require('util')
const express = require('express')
const multer = require('multer')
const { aes192Crypto } = require('../utils')
const { TuChuangSpaceError } = require('./errors')
const { FILE_MAX_SIZE, FILE_TYPE_ALLOWED, MAX_FILES, MIMETYPE_2_EXT } = require('../../shared/constants')

const promisifyFsCopyFile = promisify(fs.copyFile)
const promisifyFsUnlink = promisify(fs.unlink)

const API_VERSION = '1.0.0'

const imagesFileStorageDestFolderPath = path.resolve(__dirname, 'upload_images/')

const ApiRouter = express.Router()

const VersionOneApiRouter = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, imagesFileStorageDestFolderPath)
  },
  filename: (req, file, callback) => {
    callback(null, `${new Date().valueOf()}-${Math.random()}${MIMETYPE_2_EXT[file.mimetype]}`)
  }
})

const uploadMiddleware = multer({
  storage,
  limits: { files: MAX_FILES, fileSize: FILE_MAX_SIZE },
  fileFilter: (req, file, callback) => {
    const { mimetype } = file

    if (!FILE_TYPE_ALLOWED.includes(mimetype)) {
      callback(new TuChuangSpaceError(TuChuangSpaceError.errors.MIMETYPE_NOT_SUPPORT))
    }
    callback(null, true)
  }
}).fields([
  { name: 'images' }
])

/**
 * 上传文件的 guard 中间件
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {require('express').NextFunction} next
 */
const uploadGuardMiddleware = (req, res, next) => {
  uploadMiddleware(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_COUNT') {
        res.statusCode = 403
        res.json({
          errorMsg: '图片数量超过上限'
        })
        return
      } else if (error.code === 'LIMIT_FILE_SIZE') {
        res.statusCode = 403
        res.json({
          errorMsg: '图片尺寸超出上限'
        })
        return
      } else {
        throw new Error(error)
      }
    } else if (error instanceof TuChuangSpaceError) {
      if (error.code === TuChuangSpaceError.errors.MIMETYPE_NOT_SUPPORT) {
        res.statusCode = 403
        res.json({
          errorMsg: '文件格式不支持'
        })
        return
      } else {
        throw new Error(error)
      }
    } else if (error) {
      throw new Error(error)
    }

    next()
  })
}

// Image 实体操作
VersionOneApiRouter.route('/images')
  .post(
    uploadGuardMiddleware,
    async (req, res, next) => {
      const { images } = req.files
      if (!images) {
        // 抛出错误
      }
      const imagesRenamePromise = images.map(async (file) => {
        // 转移文件: 将文件命名为 md5 hash
        const { path: filePath, mimetype, originalname } = file
        // Step 1: 计算文件的 md5 hash
        const fileHash = await new Promise((resolve, reject) => {
          const fileReadStream = fs.createReadStream(filePath)
          const hash = crypto.createHash('md5')
          fileReadStream.on('data', (chunk) => hash.update(chunk))
          fileReadStream.on('error', (error) => reject(error))
          fileReadStream.on('end', () => {
            resolve(hash.digest('hex'))
          })
        })
        // Step 2: 用复制的方式修改文件名
        await promisifyFsCopyFile(
          filePath,
          path.resolve(imagesFileStorageDestFolderPath, `${fileHash}${MIMETYPE_2_EXT[mimetype]}`)
        )
        // Step 3: 移除原来的文件
        await promisifyFsUnlink(filePath)

        return {
          mimetype,
          md5: fileHash,
          ext: MIMETYPE_2_EXT[mimetype],
          originalname,
          fileName: `${fileHash}${MIMETYPE_2_EXT[mimetype]}`,
          deleteKey: aes192Crypto(fileHash, 'foo')
        }
      })

      const imagesTransformData = await Promise.all(imagesRenamePromise)
      const imagesObj = {}
      images.forEach((image) => {
        const { originalname } = image
        const data = imagesTransformData.find((item) => item.originalname === originalname)
        imagesObj[originalname] = data
      })

      res.json({
        images: imagesObj
      })

      next()
    }
  )

ApiRouter.use(`/${API_VERSION}`, VersionOneApiRouter)

module.exports = ApiRouter
