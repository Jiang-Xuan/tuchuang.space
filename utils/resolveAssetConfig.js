const resolveCloudStorageUploadConfig = require('./resolveCloudStorageUploadConfig')

module.exports = (assetConfig) => {
  if (Object.prototype.toString.call(assetConfig) !== '[object Object]') {
    throw new TypeError('assetConfig 必须是 object')
  }

  const { useCloudStorage, cloudStorageUpload, location, webpackPublicPath } = assetConfig

  if (typeof useCloudStorage !== 'boolean') {
    throw new TypeError('useCloudStorage 必须是 boolean')
  }

  let cloudStorageUploadConfig
  let locationConfig
  let webpackPublicPathConfig

  if (useCloudStorage) {
    cloudStorageUploadConfig = resolveCloudStorageUploadConfig(cloudStorageUpload)
  } else {
    if (location === undefined) {
      locationConfig = '.'
    } else {
      if (typeof location !== 'string') {
        throw new TypeError('location 必须是 string')
      }

      locationConfig = location
    }
  }

  if (
    webpackPublicPath !== undefined &&
    typeof webpackPublicPath !== 'string'
  ) {
    throw new TypeError('webpackPublicPath 必须是 string')
  }

  return Object.freeze({
    useCloudStorage,
    cloudStorageUpload: useCloudStorage ? cloudStorageUploadConfig : undefined,
    location: useCloudStorage ? undefined : locationConfig,
    webpackPublicPath: webpackPublicPathConfig
  })
}
