const path = require('path')
const appConfig = require('../../config')
/**
 * 上传图片至 ali oss
 * @param {Express.Request}
 * @param {Express.Response}
 * @param {import("express").NextFunction}
 */
const imagesFileStorageDestFolderPath = path.resolve(__dirname, '../../upload_images')

const uploadImagesToAliOss = async function (req, res, next) {
  const { images } = res.data

  const imagesNames = Object.keys(images)

  const uploadPromises = imagesNames.map((imageName) => {
    const { fileName } = images[imageName]

    return appConfig.ossClient.put(fileName, path.resolve(imagesFileStorageDestFolderPath, fileName))
  })

  const uploadResult = await Promise.all(uploadPromises)

  const resData = imagesNames.reduce((curr, imageName) => {
    const { fileName } = images[imageName]
    const ossData = uploadResult.find((item) => item.name === fileName)
    return {
      ...curr,
      [imageName]: {
        ...images[imageName],
        ossPath: ossData.url
      }
    }
  }, {})
  res.data = {
    images: resData
  }

  next()
}

module.exports = uploadImagesToAliOss
