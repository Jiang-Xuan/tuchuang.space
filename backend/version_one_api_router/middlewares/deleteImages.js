const { isString } = require('lodash')
const appConfig = require('../../config')
const { aes192Decrypto } = require('../../utils')
/**
 * 移除图片
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {import("express").NextFunction} next
 */
module.exports = async (req, res, next) => {
  const contentType = req.get('content-type')
  if (contentType !== 'application/json') {
    res
      .status(400)
      .json({
        message: 'Body should be a JSON object'
      })
    return
  }

  if (req.body.key === undefined) {
    res
      .status(422)
      .json({
        message: 'Validation Failed',
        errors: [{
          field: 'key',
          code: 'missing_field'
        }]
      })
    return
  }

  if (!isString(req.body.key)) {
    res
      .status(422)
      .json({
        message: 'Validate Failed',
        errors: [{
          field: 'key',
          code: 'invalid'
        }]
      })
    return
  }

  let ossImageKey

  try {
    ossImageKey = aes192Decrypto(req.body.key, 'foo')
  } catch (e) {
    res
      .status(422)
      .json({
        message: 'Validation Failed',
        errors: [{
          field: 'key',
          code: 'invalid'
        }]
      })
    return
  }

  let fileInOss
  try {
    await appConfig.ossClient.get(ossImageKey)
    fileInOss = true
  } catch (e) {
    fileInOss = false
  }

  if (fileInOss === false) {
    res
      .status(404)
      .json()
    return
  }

  await appConfig.ossClient.delete(ossImageKey)

  res.status(204).json()
}
