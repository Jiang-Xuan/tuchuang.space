const path = require('path')
const express = require('express')
const multer = require('multer')
const { TuChuangSpaceError } = require('./errors')
const { FILE_MAX_SIZE, FILE_TYPE_ALLOWED, MAX_FILES } = require('../../shared/constants')

const API_VERSION = '1.0.0'

const ApiRouter = express.Router()

const VersionOneApiRouter = express.Router()

const uploadMiddleware = multer({
  dest: path.resolve(__dirname, 'upload_images/'),
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
    (req, res, next) => {
      const { images } = req.files
      if (!images) {
        // 抛出错误
      }
      images.forEach((file) => {
      })
    }
  )

ApiRouter.use(`/${API_VERSION}`, VersionOneApiRouter)

module.exports = ApiRouter
