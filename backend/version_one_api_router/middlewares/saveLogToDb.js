const mongoose = require('../../mongoose')
const UploadImages = require('../../modals/uploadImages')

/**
 * 用户上传图片的最后一步, 负责 log 数据库, 负责响应数据给用户
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {import("express").NextFunction} next
 */
module.exports = async function (req, res, next) {
  // 1. 连接数据库
  await mongoose.connectDb()
  // 2. 将上传的图片数据 log 存储至数据库, 每一张图片都是一条数据
  // 3. 将数据库的 id 填充至 data 中
  // 4. 将数据响应给用户
  const createTime = new Date()
  const { images } = res.data

  const imagesNames = Object.keys(images)

  const saveToDbPromises = imagesNames.map((imageName) => {
    const { md5, originalname } = images[imageName]
    const newUploadImages = new UploadImages({
      createTime,
      md5,
      originalname
    })

    return newUploadImages.save()
  })

  const saveResult = await Promise.all(saveToDbPromises)

  const responseData = imagesNames.reduce((curr, imageName) => {
    const dbData = saveResult.find((item) => item.md5 === images[imageName].md5)
    return {
      ...curr,
      [imageName]: {
        ...images[imageName],
        _id: dbData._id
      }
    }
  }, {})

  res.json({
    images: responseData
  })

  next()
}
