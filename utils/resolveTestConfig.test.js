/* eslint-env jest */

jest.mock('./resolveImageStorageConfig.js', () => jest.fn(params => params))

const resolveTestConfig = require('./resolveTestConfig')
const resolveImageStorageConfig = require('./resolveImageStorageConfig')

describe('resolveTestConfig', () => {
  let config

  beforeEach(() => {
    config = {
      imageStorage: {}
    }
  })

  test('当参数不是 object 时, 抛出错误 TypeError(testConfig 必须是 object)', () => {
    expect(() => resolveTestConfig(1234)).toThrow(new TypeError('testConfig 必须是 object'))
    expect(() => resolveTestConfig('1234')).toThrow(new TypeError('testConfig 必须是 object'))
    expect(() => resolveTestConfig(true)).toThrow(new TypeError('testConfig 必须是 object'))
    expect(() => resolveTestConfig(false)).toThrow(new TypeError('testConfig 必须是 object'))
    expect(() => resolveTestConfig([])).toThrow(new TypeError('testConfig 必须是 object'))
    expect(() => resolveTestConfig(null)).toThrow(new TypeError('testConfig 必须是 object'))
    expect(() => resolveTestConfig(undefined)).toThrow(new TypeError('testConfig 必须是 object'))
  })

  test('将参数 imageStorage 传递给依赖 resolveImageStorageConfig', () => {
    resolveTestConfig(config)

    expect(resolveImageStorageConfig.mock.calls[0][0]).toEqual(config.imageStorage)
  })

  test('返回传入的配置对象', () => {
    expect(resolveTestConfig(config)).toEqual(config)
  })

  test('返回冻结的对象', () => {
    const result = resolveTestConfig(config)

    const isFrozen = Object.isFrozen(result)

    expect(isFrozen).toEqual(true)
  })
})
