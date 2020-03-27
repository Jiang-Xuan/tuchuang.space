/* eslint-env jest */

jest.mock('./resolveAliOssConfig.js', () => jest.fn(params => params))
jest.mock('./resolveLocalConfig.js', () => jest.fn(params => params))

const resolveAliOssConfig = require('./resolveAliOssConfig')
const resolveImageStorageConfig = require('./resolveImageStorageConfig')
const resolveLocalConfig = require('./resolveLocalConfig')

describe('resolveImageStorageConfig', () => {
  let config

  beforeEach(() => {
    resolveAliOssConfig.mockClear()
    resolveLocalConfig.mockClear()
    config = {
      aliOss: {},
      local: {}
    }
  })

  test('当参数不是 object 时, 抛出错误 TypeError(imageStorageConfig 必须是 object)', () => {
    expect(() => resolveImageStorageConfig(1234)).toThrow(new TypeError('imageStorageConfig 必须是 object'))
    expect(() => resolveImageStorageConfig('1234')).toThrow(new TypeError('imageStorageConfig 必须是 object'))
    expect(() => resolveImageStorageConfig(true)).toThrow(new TypeError('imageStorageConfig 必须是 object'))
    expect(() => resolveImageStorageConfig(false)).toThrow(new TypeError('imageStorageConfig 必须是 object'))
    expect(() => resolveImageStorageConfig([])).toThrow(new TypeError('imageStorageConfig 必须是 object'))
    expect(() => resolveImageStorageConfig(null)).toThrow(new TypeError('imageStorageConfig 必须是 object'))
    expect(() => resolveImageStorageConfig(undefined)).toThrow(new TypeError('imageStorageConfig 必须是 object'))
  })

  test('当参数 alioss, local 都没有提供时, 抛出错误 TypeError(必须至少有一个图片存储源配置)', () => {
    delete config.aliOss
    delete config.local
    expect(() => resolveImageStorageConfig(config)).toThrow(new TypeError('必须至少有一个图片存储源配置'))
  })

  test('只提供 alioss 源时, 返回的对象包括 alioss 源', () => {
    delete config.local

    expect(resolveImageStorageConfig(config)).toEqual({
      aliOss: {}
    })
  })
  test('只提供 alioss 源时, 将参数 aliOss 传递给 resolveAliOssConfig', () => {
    delete config.local
    resolveImageStorageConfig(config)

    expect(resolveAliOssConfig.mock.calls[0][0]).toEqual({})
  })
  test('只提供 local 源时, 返回的对象包括 local 源', () => {
    delete config.aliOss

    expect(resolveImageStorageConfig(config)).toEqual({
      local: {}
    })
  })
  test('只提供 local 源时, 将参数 local 传递给 resolveLocalConfig', () => {
    delete config.aliOss
    resolveImageStorageConfig(config)

    expect(resolveLocalConfig.mock.calls[0][0]).toEqual({})
  })

  test('当提供 alioss, local 多个源的时候, 优先顺序为 alioss > local', () => {
    expect(resolveImageStorageConfig(config)).toEqual({
      aliOss: {}
    })
  })

  test('当提供 alioss, local 多个源的时候, 优先顺序为 alioss > local, 将参数 aliOss 传递给 resolveAliOssConfig', () => {
    resolveImageStorageConfig(config)

    expect(resolveAliOssConfig.mock.calls[0][0]).toEqual({})
  })

  test('将参数 aliOss 传递给 resolveAliOssConfig', () => {
    resolveImageStorageConfig({
      aliOss: {}
    })

    expect(resolveAliOssConfig.mock.calls[0][0]).toEqual({})
  })

  test('提供的参数合法, 返回的对象是冻结的', () => {
    const result = resolveImageStorageConfig({
      aliOss: {}
    })

    const isFrozen = Object.isFrozen(result)

    expect(isFrozen).toEqual(true)
  })
})
