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
    this.config.seconds = seconds
    return this
  }

  getMinutes () {
    return this.config.minutes
  }

  setMinutes (minutes) {
    this.config.minutes = minutes
    return this
  }

  getHours () {
    return this.config.hours
  }

  setHours (hours) {
    this.config.hours = hours
    return this
  }
}

module.exports = new AppConfig({
  // 请求频率限制
  seconds: [1, 10],
  minutes: [60, 1000],
  hours: [24, 5000]
})
