const path = require('path')
const appConfig = require('../../config')
const { CDN_DOMAIN, BETA_CDN_DOMAIN, LOCAL_DEVELOPMENT_CDN_DOMAIN, TEST_CDN_DOMAIN } = require('../../../shared/constants')
const { NODE_ENV } = process.env

let cdnDomain

if (NODE_ENV === 'beta') {
  cdnDomain = BETA_CDN_DOMAIN
} else if (NODE_ENV === 'production') {
  cdnDomain = CDN_DOMAIN
} else {
  cdnDomain = LOCAL_DEVELOPMENT_CDN_DOMAIN
}

if (NODE_ENV === 'test') {
  cdnDomain = TEST_CDN_DOMAIN
}
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
        ossPath: ossData.url,
        cdnPath: `https://${cdnDomain}/${fileName}`
      }
    }
  }, {})
  res.data = {
    images: resData
  }

  next()
}

module.exports = uploadImagesToAliOss
