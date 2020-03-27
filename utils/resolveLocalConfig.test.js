/* eslint-env jest */
const resolveLocalConfig = require('./resolveLocalConfig')

describe('resolveLocalConfig', () => {
  test('当参数不是 object 时, 抛出错误 TypeError(imageStorageConfig 必须是 object)', () => {
    expect(() => resolveLocalConfig(1234)).toThrow(new TypeError('localConfig 必须是 object'))
    expect(() => resolveLocalConfig('1234')).toThrow(new TypeError('localConfig 必须是 object'))
    expect(() => resolveLocalConfig(true)).toThrow(new TypeError('localConfig 必须是 object'))
    expect(() => resolveLocalConfig(false)).toThrow(new TypeError('localConfig 必须是 object'))
    expect(() => resolveLocalConfig([])).toThrow(new TypeError('localConfig 必须是 object'))
    expect(() => resolveLocalConfig(null)).toThrow(new TypeError('localConfig 必须是 object'))
    expect(() => resolveLocalConfig(undefined)).toThrow(new TypeError('localConfig 必须是 object'))
  })

  test('当参数 path 不是 string 时, 抛出错误 TypeError(path 参数必须是 string)', () => {
    expect(() => resolveLocalConfig({})).toThrow(new TypeError('path 参数必须是 string'))
  })

  test('提供的参数合法, 返回的对象是冻结的', () => {
    const result = resolveLocalConfig({
      path: '/path/to/store/images'
    })

    const isFrozen = Object.isFrozen(result)

    expect(isFrozen).toEqual(true)
  })

  test('提供的参数合法, 返回正确的对象 1', () => {
    expect(resolveLocalConfig({
      path: '/path/to/store/images'
    })).toEqual({
      path: '/path/to/store/images'
    })
  })
})
