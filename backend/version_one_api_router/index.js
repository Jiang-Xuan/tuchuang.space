const express = require('express')
const multer = require('multer')
const { FILE_MAX_SIZE, FILE_TYPE_ALLOWED, MAX_FILES } = require('../../shared/constants')

const API_VERSION = '1.0.0'

const ApiRouter = express.Router()

const VersionOneApiRouter = express.Router()

const uploadMiddleware = multer({ dest: 'upload_images/', limits: { files: MAX_FILES, fileSize: FILE_MAX_SIZE } }).fields([
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
      res.json({
        length: req.files.length
      })
    }
  )

ApiRouter.use(`/${API_VERSION}`, VersionOneApiRouter)

module.exports = ApiRouter
