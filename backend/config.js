const { isArray, isInteger } = require('lodash')
const Oss = require('ali-oss')

class AppConfig {
  /**
   *
   * @param {{
   *  seconds?: [number, number],
   *  minutes?: [number, number],
   *  hours?: [number, number],
   *  alioss: {
   *    region: string,
   *    accessKeyId: string,
   *    accessKeySecret: string,
   *    bucket: string,
   *    secure: boolean
   *  },
   * imageNameSuffix: string
   * }} config 配置参数
   */
  constructor (config) {
    if (AppConfig.instance) {
      throw new TypeError('AppConfig 为单例模式, 只可以被实例一次')
    }

    this.config = config
    this.ossClient = new Oss({
      ...config.alioss
    })

    AppConfig.instance = this
  }

  /**
   * 设置图片名称后缀
   * @param {string} suffix 后缀
   */
  _setImageNameSuffix (suffix) {
    this.config.imageNameSuffix = suffix
  }

  getImageNameSuffix () {
    return this.config.imageNameSuffix
  }

  /**
   * 获取生成 deleteKey 生成秘钥的 key
   */
  getDeleteKeyCryptoKey () {
    return this.config.deleteKeyCryptoKey
  }

  _setDeleteKeyCryptoKey (key) {
    this.config.deleteKeyCryptoKey = key
  }

  /**
   * 设置 oss 客户端
   * **Notes** 该方法只提供给 e2e 测试, 一般不会在程序中调用, 所以该函数以 _ 开头
   * @param {{}} ossClient ali-oss 客户端
   */
  _setOssClient (ossClient) {
    this.ossClient = ossClient
  }

  getSeconds () {
    return this.config.seconds
  }

  /**
   *
   * @param {[number, number]} seconds
   */
  _setSeconds (seconds) {
    if (seconds === undefined) {
      throw new TypeError('期望参数数量为 1 个, 得到了 0 个参数')
    }
    if (!isArray(seconds)) {
      throw new TypeError('期望 seconds 参数为数组')
    }
    const [secondsNumber, secondsAllow] = seconds
    if (
      !isInteger(secondsNumber) ||
      !isInteger(secondsAllow)
    ) {
      throw new TypeError('期望参数 seconds 为数组 [integer, integer]')
    }
    this.config.seconds = seconds
    return this
  }

  getHours () {
    return this.config.hours
  }

  _setHours (hours) {
    if (hours === undefined) {
      throw new TypeError('期望参数数量为 1 个, 得到了 0 个参数')
    }
    if (!isArray(hours)) {
      throw new TypeError('期望 hours 参数为数组')
    }
    const [hoursNumber, hoursAllow] = hours
    if (
      !isInteger(hoursNumber) ||
      !isInteger(hoursAllow)
    ) {
      throw new TypeError('期望参数 hours 为数组 [integer, integer]')
    }
    this.config.hours = hours
    return this
  }
}

const {
  NODE_ENV
} = process.env

let bucketName
let internal

if (NODE_ENV === 'beta') {
  bucketName = 'tuchuang-space-beta'
  internal = true
} else if (NODE_ENV === 'production') {
  bucketName = 'tuchuang-space'
  internal = true
} else {
  bucketName = 'tuchuang-space-localdevelopmont'
  internal = false
}

module.exports = new AppConfig({
  // 请求频率限制, 按照 秒 限制
  seconds: [1, 10],
  hours: [24, 5000],
  alioss: {
    region: 'oss-cn-hangzhou',
    accessKeyId: process.env.BACKEND_STORE_IMAGES_ALI_OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.BACKEND_STORE_IMAGES_ALI_OSS_ACCESS_KEY_SECRET,
    bucket: bucketName,
    secure: true,
    internal: internal
  },
  imageNameSuffix: '',
  deleteKeyCryptoKey: process.env.BACKEND_DELETE_KEY_CRYPTO_KEY
})
