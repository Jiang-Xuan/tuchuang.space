/* eslint-env jest */

jest.mock('./resolveBffConfig', () => jest.fn())
jest.mock('./resolveFrondendConfig.js', () => jest.fn())

const resolveConfig = require('./resolveConfig')
const resolveBffConfig = require('./resolveBffConfig')
const resolveFrondendConfig = require('./resolveFrondendConfig')

describe('resolveConfig', () => {
  beforeEach(() => {
    resolveBffConfig.mockClear()
    resolveFrondendConfig.mockClear()
  })

  test('当参数不是 object 时, 抛出错误 TypeError(selfHostedConfig 必须是 object)', () => {
    expect(() => resolveConfig(123)).toThrow(new TypeError('selfHostedConfig 必须是 object'))
    expect(() => resolveConfig('123')).toThrow(new TypeError('selfHostedConfig 必须是 object'))
    expect(() => resolveConfig(null)).toThrow(new TypeError('selfHostedConfig 必须是 object'))
    expect(() => resolveConfig(undefined)).toThrow(new TypeError('selfHostedConfig 必须是 object'))
    expect(() => resolveConfig([])).toThrow(new TypeError('selfHostedConfig 必须是 object'))
    expect(() => resolveConfig(false)).toThrow(new TypeError('selfHostedConfig 必须是 object'))
    expect(() => resolveConfig(true)).toThrow(new TypeError('selfHostedConfig 必须是 object'))
  })

  test('将 bff 传递给外部依赖 resolveBffConfig', () => {
    // act
    resolveConfig({
      bff: 45
    })
    // assert
    expect(resolveBffConfig.mock.calls[0][0]).toEqual(45)
  })

  test('将 frondend 传递给外部依赖 resolveFrondendConfig', () => {
    // act
    resolveConfig({
      frondend: {}
    })
    // assert
    expect(resolveFrondendConfig.mock.calls[0][0]).toEqual({})
  })
})
