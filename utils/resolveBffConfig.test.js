/* eslint-env jest */

const resolveBffConfig = require('./resolveBffConfig')

describe('resolveBffConfig', () => {
  test('当参数不是 object 时, 抛出错误 TypeError(bffConfig 必须是 object)', () => {
    expect(() => resolveBffConfig(123)).toThrow(new TypeError('bffConfig 必须是 object'))
    expect(() => resolveBffConfig('123')).toThrow(new TypeError('bffConfig 必须是 object'))
    expect(() => resolveBffConfig(null)).toThrow(new TypeError('bffConfig 必须是 object'))
    expect(() => resolveBffConfig(undefined)).toThrow(new TypeError('bffConfig 必须是 object'))
    expect(() => resolveBffConfig(true)).toThrow(new TypeError('bffConfig 必须是 object'))
    expect(() => resolveBffConfig(false)).toThrow(new TypeError('bffConfig 必须是 object'))
    expect(() => resolveBffConfig([])).toThrow(new TypeError('bffConfig 必须是 object'))
  })

  test('当 listenPort 不是数字时, 抛出错误 TypeError(listenPort 必须是 number)', () => {
    expect(
      () => resolveBffConfig({ listenPort: '432' })
    ).toThrow(new TypeError('listenPort 必须是 number'))
    expect(
      () => resolveBffConfig({ listenPort: null })
    ).toThrow(new TypeError('listenPort 必须是 number'))
    expect(
      () => resolveBffConfig({ listenPort: undefined })
    ).toThrow(new TypeError('listenPort 必须是 number'))
    expect(
      () => resolveBffConfig({ listenPort: [] })
    ).toThrow(new TypeError('listenPort 必须是 number'))
    expect(
      () => resolveBffConfig({ listenPort: {} })
    ).toThrow(new TypeError('listenPort 必须是 number'))
    expect(
      () => resolveBffConfig({ listenPort: true })
    ).toThrow(new TypeError('listenPort 必须是 number'))
    expect(
      () => resolveBffConfig({ listenPort: false })
    ).toThrow(new TypeError('listenPort 必须是 number'))
  })

  test('当参数正确时, 返回冻结的参数', () => {
    const result = resolveBffConfig({ listenPort: 1234 })
    expect(result).toEqual({ listenPort: 1234 })
    expect(Object.isFrozen(result)).toEqual(true)
  })
})
