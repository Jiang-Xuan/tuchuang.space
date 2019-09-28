const AppConfig = require('../../config')
const UploadImages = require('../../modals/uploadImages')

/**
 * 基础的鉴权中间件, 根据访问者的 ip 和配置进行限制请求的数量和频率
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {import("express").NextFunction} next
 */
module.exports = async function (req, res, next) {
  // 从数据库中查询
  const now = Date.now()
  const [secondsNumber, secondsAllow] = AppConfig.getSeconds()
  // console.log(secondsNumber, secondsAllow)
  const all = await UploadImages.find({
    createTime: {
      $gt: new Date(now - secondsNumber * 1000)
    }
  })
  if (all.length >= secondsAllow) {
    res.statusCode = 403
    res.json({
      errorMsg: '请求频率超限, 请稍后重试'
    })
    return
  }
  next()
}
