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
  const [secondsNumber, secondsAllow] = AppConfig.getSeconds()
  const [hoursNumber, hoursAllow] = AppConfig.getHours()
  if (secondsAllow !== 0) {
    // seconds 限制
    const now = Date.now()
    // console.log(secondsNumber, secondsAllow)
    const all = await UploadImages.find({
      ip: req.ip,
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
  }

  if (hoursAllow !== 0) {
    // hours 限制
    const now = Date.now()
    const all = await UploadImages.find({
      ip: req.ip,
      createTime: {
        $gt: new Date(now - hoursNumber * 60 * 60 * 1000)
      }
    })
    if (all.length >= hoursAllow) {
      res.statusCode = 403
      res.json({
        errorMsg: '请求频率超限, 请稍后重试'
      })
      return
    }
  }
  next()
}
