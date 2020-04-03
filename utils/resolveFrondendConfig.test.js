/* eslint-env jest */

jest.mock('./resolveAssetConfig.js', () => jest.fn(params => params))

const resolveAssetConfig = require('./resolveAssetConfig')
const resolveFrondendConfig = require('./resolveFrondendConfig')

describe('resolveFrondendConfig', () => {
  beforeEach(() => {
    resolveAssetConfig.mockClear()
  })

  test('当参数不是 object 时, 抛出错误 TypeError(frondendConfig 必须是 object)', () => {
    expect(() => resolveFrondendConfig(1234)).toThrow(new TypeError('frondendConfig 必须是 object'))
    expect(() => resolveFrondendConfig('1234')).toThrow(new TypeError('frondendConfig 必须是 object'))
    expect(() => resolveFrondendConfig(true)).toThrow(new TypeError('frondendConfig 必须是 object'))
    expect(() => resolveFrondendConfig(false)).toThrow(new TypeError('frondendConfig 必须是 object'))
    expect(() => resolveFrondendConfig([])).toThrow(new TypeError('frondendConfig 必须是 object'))
    expect(() => resolveFrondendConfig(null)).toThrow(new TypeError('frondendConfig 必须是 object'))
    expect(() => resolveFrondendConfig(undefined)).toThrow(new TypeError('frondendConfig 必须是 object'))
  })

  test('将 asset 参数传递给 resolveAssetConfig 函数', () => {
    resolveFrondendConfig({
      asset: 123
    })

    expect(resolveAssetConfig.mock.calls[0][0]).toEqual(123)
  })

  test('传递合适的对象, 返回的对象是被冻结的', () => {
    const result = resolveFrondendConfig({
      asset: 123
    })

    const isFrozen = Object.isFrozen(result)

    expect(isFrozen).toEqual(true)
  })
})
