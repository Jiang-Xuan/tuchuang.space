const express = require('express')
const multer = require('multer')

const API_VERSION = '1.0.0'

const ApiRouter = express.Router()

const VersionOneApiRouter = express.Router()

const upload = multer({ dest: 'upload_images/' })

VersionOneApiRouter.route('/image')
  .get((req, res, next) => {
    res.send('test')
  })
  .post(
    upload.single('file'),
    (req, res, next) => {
      res.send('test')
    }
  )

ApiRouter.use(`/${API_VERSION}`, VersionOneApiRouter)

module.exports = ApiRouter
