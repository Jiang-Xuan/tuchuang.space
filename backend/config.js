const { isArray, isNumber, isInteger } = require('lodash')

class AppConfig {
  /**
   *
   * @param {{ seconds?: [number, number], minutes?: [number, number], hours?: [number, number] }} config 配置参数
   */
  constructor (config) {
    if (AppConfig.instance) {
      throw new TypeError('AppConfig 为单例模式, 只可以被实例一次')
    }

    this.config = config

    AppConfig.instance = this
  }

  getSeconds () {
    return this.config.seconds
  }

  /**
   *
   * @param {[number, number]} seconds
   */
  setSeconds (seconds) {
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

  setHours (hours) {
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

module.exports = new AppConfig({
  // 请求频率限制, 按照 秒 限制
  seconds: [1, 10],
  hours: [24, 5000]
})
