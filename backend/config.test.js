/* eslint-env jest */
const { isInteger } = require('lodash')
const AppConfig = require('./config')

describe('app config', () => {
  let backSeconds
  let backHours
  beforeAll(() => {
    backSeconds = AppConfig.getSeconds()
    backHours = AppConfig.getHours()
  })
  afterAll(() => {
    AppConfig.setSeconds(backSeconds)
    AppConfig.setHours(backHours)
  })
  it('不允许重复实例化', () => {
    const AppConfigConstructor = AppConfig.constructor
    expect(() => {
      return new AppConfigConstructor()
    }).toThrow('AppConfig 为单例模式, 只可以被实例一次')
  })
  it('setSeconds 函数接收 [integer, integer] 参数, 并且全部大于0, 且只能为整数', () => {
    expect(() => {
      AppConfig.setSeconds()
    }).toThrow('期望参数数量为 1 个, 得到了 0 个参数')
    expect(() => {
      AppConfig.setSeconds({})
    }).toThrow('期望 seconds 参数为数组')
    expect(() => {
      AppConfig.setSeconds([])
    }).toThrow('期望参数 seconds 为数组 [integer, integer]')
    expect(() => {
      AppConfig.setSeconds([1.2, 3.4])
    }).toThrow('期望参数 seconds 为数组 [integer, integer]')
  })
  it('getSeconds 函数返回正确的值', () => {
    const [secondsNumber, secondsAllow] = AppConfig.getSeconds()
    expect(isInteger(secondsNumber)).toEqual(true)
    expect(isInteger(secondsAllow)).toEqual(true)
  })
  it('setHours 函数接收 [integer, integer] 参数, 并且全部大于0, 且只能为整数', () => {
    expect(() => {
      AppConfig.setHours()
    }).toThrow('期望参数数量为 1 个, 得到了 0 个参数')
    expect(() => {
      AppConfig.setHours({})
    }).toThrow('期望 hours 参数为数组')
    expect(() => {
      AppConfig.setHours([])
    }).toThrow('期望参数 hours 为数组 [integer, integer]')
    expect(() => {
      AppConfig.setHours([1.2, 3.4])
    }).toThrow('期望参数 hours 为数组 [integer, integer]')
  })
  it('getHours 函数返回正确的值', () => {
    const [hoursNumber, hoursAllow] = AppConfig.getHours()
    expect(isInteger(hoursNumber)).toEqual(true)
    expect(isInteger(hoursAllow)).toEqual(true)
  })
})
