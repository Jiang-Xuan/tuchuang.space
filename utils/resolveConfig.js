const resolveBffConfig = require('./resolveBffConfig')
const resolveFrondendConfig = require('./resolveFrondendConfig')

/**
 * @typedef {object} ISelfHostedConfig
 * @property {import("./resolveBffConfig.js").IBffConfig} bff - bff 层配置
 * @property {any} frondend - frondend 层配置
 */

/**
 * @returns {Readonly<ISelfHostedConfig>}
 */
module.exports = function resolveConfig (
  /** @type {ISelfHostedConfig} */
  selfHostedConfig
) {
  if (Object.prototype.toString.call(selfHostedConfig) !== '[object Object]') {
    throw new TypeError('selfHostedConfig 必须是 object')
  }
  const { bff, frondend } = selfHostedConfig

  const bffConfig = resolveBffConfig(bff)
  const frondendConfig = resolveFrondendConfig(frondend)

  return Object.freeze({
    bff: bffConfig,
    frondend: frondendConfig
  })
}

// module.exports = function resolveConfig (selfHostedConfig) {
//   const resultConfig = {}

//   const bff = selfHostedConfig.bff

//   if (!!bff === false) {
//     /** bff 层的默认配置 */
//     resultConfig.bff = {
//       listenPort: 4303
//     }
//   } else if (Object.prototype.toString.call(bff) !== '[object Object]') {
//     throw new Error('bff 配置无效, 请查阅文档 https://www.example.com')
//   } else {
//     const { listenPort } = bff
//     if (typeof listenPort !== 'number') {
//       throw new Error('bff.listenPort 配置无效, 请查阅文档 https://www.example.com')
//     }

//     resultConfig.bff = {
//       listenPort
//     }
//   }

//   const frondend = selfHostedConfig.frondend

//   if (!!frondend === false) {
//     throw new Error('frondend 需要配置, 请查阅文档 https://www.example.com')
//   } else if (Object.prototype.toString.call(frondend) !== '[object Object]') {
//     throw new Error('frondend 配置需要是 object, 请查阅文档 https://www.example.com')
//   } else {
//     const { asset } = frondend
//     resultConfig.asset = {}
//     if (!!asset === false) {
//       throw new Error('frondend.asset 需要配置, 请查阅文档 https://www.example.com')
//     } else if (Object.prototype.toString.call(frondend) !== '[object Object]') {
//       throw new Error('frondend.asset 配置需要是 object, 请查阅文档 https://www.example.com')
//     } else {
//       const { useCloudStorage, cloudStorageUploadConfig, location, webpackPublicPath } = asset
//       resultConfig.asset.cloudStorageUploadConfig = {}
//       if (useCloudStorage) {
//         if (!!cloudStorageUploadConfig === false) {
//           throw new Error('frondend.asset.useCloudStorage 为 true, 需要指定云存储服务商配置, 请参阅文档 https://www.example.com')
//         } else if (Object.prototype.toString.call(cloudStorageUploadConfig) !== '[object Object]') {
//           throw new Error('frondend.asset.cloudStorageUploadConfig 配置需要是 object, 请查阅文档 https://www.example.com')
//         } else {
//           const { alioss } = cloudStorageUploadConfig
//           resultConfig.asset.cloudStorageUploadConfig.alioss = {}

//           if (!!alioss === false) {
//             throw new Error('frondend.asset.useCloudStorage 为 true, 需要指定阿里云存储服务商配置(目前只支持阿里云), 请参阅文档 https://www.example.com')
//           } else if (Object.prototype.toString.call(cloudStorageUploadConfig) !== '[object Object]') {
//             throw new Error('frondend.asset.cloudStorageUploadConfig.alioss 配置需要是 object, 请查阅文档 https://www.example.com')
//           } else {
//             const { region, accessKeyId, accessKeySecret, bucket, secure } = alioss
//             if (typeof region !== 'string') {
//               throw new Error('frondend.asset.cloudStorageUploadConfig.alioss.region 配置需要是 string, 请参阅文档 https://www.example.com')
//             }
//             if (typeof accessKeyId === 'string') {
//               throw new Error('frondend.asset.cloudStorageUploadConfig.alioss.accessKeyId 配置需要是 string, 请参阅文档 https://www.example.com')
//             }
//             if (typeof accessKeySecret === 'string') {
//               throw new Error('frondend.asset.cloudStorageUploadConfig.alioss.accessKeySecret 配置需要是 string, 请参阅文档 https://www.example.com')
//             }
//             if (typeof bucket === 'string') {
//               throw new Error('frondend.asset.cloudStorageUploadConfig.alioss.bucket 配置需要是 string, 请参阅文档 https://www.example.com')
//             }
//             if (!!secure === false) {
//               console.warn('frondend.asset.cloudStorageUploadConfig.alioss.secure 建议是 true, 请参阅文档 https://www.example.com')
//             }

//             resultConfig.asset.cloudStorageUploadConfig.alioss = {
//               region,
//               accessKeyId,
//               accessKeySecret,
//               bucket,
//               secure
//             }
//           }
//         }
//       } else {
//         if (typeof resultConfig.asset.location !== 'string') {
//           throw new Error('frondend.asset.location 配置需要是 string, 请查阅 https://www.example.com')
//         }
//         resultConfig.asset.location = location
//       }

//       if (typeof webpackPublicPath !== 'string') {
//         throw new Error('frondend.asset.location 配置需要是 string, 请查阅文档 https://www.example.com')
//       }

//       resultConfig.asset.webpackPublicPath = webpackPublicPath
//     }
//   }
// }
