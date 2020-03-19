/* eslint-env jest */

jest.mock('./resolveImageStorageConfig.js', () => jest.fn((params) => params))

const resolveImageStorageConfig = require('./resolveImageStorageConfig')
const resolveBackendConfig = require('./resolveBackendConfig')

describe('resolveBackendConfig', () => {
  let config

  beforeEach(() => {
    config = {
      imageStorage: {},
      listenPort: 23,
      deleteKeyCryptoKey: '',
      seconds: [1, 2],
      hours: [1, 2],
      dbPath: 'mongodb://127.0.0.1/tuchuang.space'
    }
  })

  test('当参数不是 object 时, 抛出错误 TypeError(backendConfig 必须是 object)', () => {
    expect(() => resolveBackendConfig(1234)).toThrow(new TypeError('backendConfig 必须是 object'))
    expect(() => resolveBackendConfig('1234')).toThrow(new TypeError('backendConfig 必须是 object'))
    expect(() => resolveBackendConfig(true)).toThrow(new TypeError('backendConfig 必须是 object'))
    expect(() => resolveBackendConfig(false)).toThrow(new TypeError('backendConfig 必须是 object'))
    expect(() => resolveBackendConfig([])).toThrow(new TypeError('backendConfig 必须是 object'))
    expect(() => resolveBackendConfig(null)).toThrow(new TypeError('backendConfig 必须是 object'))
    expect(() => resolveBackendConfig(undefined)).toThrow(new TypeError('backendConfig 必须是 object'))
  })

  test('当不提供 imageStorage 参数时, 抛错误 TypeError(期待提供 imageStorage 参数, 却得到了 undefined)', () => {
    delete config.imageStorage

    expect(() => resolveBackendConfig(config)).toThrow(new TypeError('期待提供 imageStorage 参数, 却得到了 undefined'))
  })

  test('将参数 imageStorage 传递给依赖 resolveImageStorageConfig', () => {
    resolveBackendConfig(config)

    expect(resolveImageStorageConfig.mock.calls[0][0]).toEqual(config.imageStorage)
  })

  test('当 listenPort 参数不是 number 时, 抛错误 TypeError(listenPort 必须是 number)', () => {
    delete config.listenPort

    expect(() => resolveBackendConfig(config)).toThrow(new TypeError('listenPort 必须是 number'))
  })

  test('当 deleteKeyCryptoKey 参数不是 string 时, 抛错误 TypeError(deleteKeyCryptoKey 必须是 string)', () => {
    delete config.deleteKeyCryptoKey

    expect(() => resolveBackendConfig(config)).toThrow(new TypeError('deleteKeyCryptoKey 必须是 string'))
  })

  test('当 seconds 参数不是 [number, number] 时, 抛错误 TypeError(seconds 必须是 [number, number])', () => {
    delete config.seconds

    expect(() => resolveBackendConfig(config)).toThrow(new TypeError('seconds 必须是 [number, number]'))
  })

  test('当 seconds 参数不是 [number, number] 时, 抛错误 TypeError(seconds 必须是 [number, number]) 1', () => {
    config.seconds = ['', undefined]

    expect(() => resolveBackendConfig(config)).toThrow(new TypeError('seconds 必须是 [number, number]'))
  })

  test('当 seconds 参数不是 [number, number] 时, 抛错误 TypeError(seconds 必须是 [number, number]) 2', () => {
    config.seconds = [2, undefined]

    expect(() => resolveBackendConfig(config)).toThrow(new TypeError('seconds 必须是 [number, number]'))
  })

  test('当 seconds 参数不是 [number, number] 时, 抛错误 TypeError(seconds 必须是 [number, number]) 3', () => {
    config.seconds = [2, {}]

    expect(() => resolveBackendConfig(config)).toThrow(new TypeError('seconds 必须是 [number, number]'))
  })

  test('当 seconds 参数不是 [number, number] 时, 抛错误 TypeError(seconds 必须是 [number, number]) 4', () => {
    config.seconds = [2, () => {}]

    expect(() => resolveBackendConfig(config)).toThrow(new TypeError('seconds 必须是 [number, number]'))
  })

  test('当 hours 参数不是 [number, number] 时, 抛错误 TypeError(hours 必须是 [number, number]) 1', () => {
    delete config.hours

    expect(() => resolveBackendConfig(config)).toThrow(new TypeError('hours 必须是 [number, number]'))
  })

  test('当 hours 参数不是 [number, number] 时, 抛错误 TypeError(hours 必须是 [number, number]) 2', () => {
    config.hours = ['', '']

    expect(() => resolveBackendConfig(config)).toThrow(new TypeError('hours 必须是 [number, number]'))
  })

  test('当 hours 参数不是 [number, number] 时, 抛错误 TypeError(hours 必须是 [number, number]) 3', () => {
    config.hours = [3, '']

    expect(() => resolveBackendConfig(config)).toThrow(new TypeError('hours 必须是 [number, number]'))
  })

  test('当 hours 参数不是 [number, number] 时, 抛错误 TypeError(hours 必须是 [number, number]) 4', () => {
    config.hours = [undefined, null]

    expect(() => resolveBackendConfig(config)).toThrow(new TypeError('hours 必须是 [number, number]'))
  })

  test('当 dbPath 参数不是 string 时, 抛错误 TypeError(dbPath 必须是 string)', () => {
    delete config.dbPath

    expect(() => resolveBackendConfig(config)).toThrow(new TypeError('dbPath 必须是 string'))
  })

  test('返回传入的配置对象', () => {
    expect(resolveBackendConfig(config)).toEqual(config)
  })

  test('返回冻结的对象', () => {
    const result = resolveBackendConfig(config)

    const isFrozen = Object.isFrozen(result)

    expect(isFrozen).toEqual(true)
  })
})
