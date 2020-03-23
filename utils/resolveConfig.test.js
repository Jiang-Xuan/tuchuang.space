/* eslint-env jest */

jest.mock('./resolveBffConfig', () => jest.fn())
jest.mock('./resolveFrondendConfig.js', () => jest.fn())
jest.mock('./resolveBackendConfig.js', () => jest.fn())
jest.mock('./resolveTestConfig.js', () => jest.fn())

const resolveConfig = require('./resolveConfig')
const resolveBffConfig = require('./resolveBffConfig')
const resolveFrondendConfig = require('./resolveFrondendConfig')
const resolveBackendConfig = require('./resolveBackendConfig')
const resolveTestConfig = require('./resolveTestConfig')

describe('resolveConfig', () => {
  beforeEach(() => {
    resolveBffConfig.mockClear()
    resolveFrondendConfig.mockClear()
    resolveBackendConfig.mockClear()
    resolveTestConfig.mockClear()
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

  test('将 backend 传递给外部依赖 resolveBackendConfig', () => {
    // act
    resolveConfig({
      frondend: {},
      backend: {}
    })
    // assert
    expect(resolveBackendConfig.mock.calls[0][0]).toEqual({})
  })

  test('test 如果不是 undefined, 将其传递给 resolveTestConfig', () => {
    // act
    resolveConfig({
      frondend: {},
      backend: {},
      test: {}
    })
    // assert
    expect(resolveTestConfig.mock.calls[0][0]).toEqual({})
  })

  test('test 如果是 undefined, 不调用 resolveTestConfig, 返回的 test  为 undefined', () => {
    // act
    const result = resolveConfig({
      frondend: {},
      backend: {},
      test: undefined
    })
    // assert
    expect(resolveTestConfig).not.toBeCalled()
    expect(result.test).toEqual(undefined)
  })
})
