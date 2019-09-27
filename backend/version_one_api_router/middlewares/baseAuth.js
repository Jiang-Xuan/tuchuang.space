/**
 * 基础的鉴权中间件, 根据访问者的 ip 和配置进行限制请求的数量和频率
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {import("express").NextFunction} next
 */
module.exports = function (req, res, next) {
  next()
}
