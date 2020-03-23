/* eslint-env jest */

jest.mock('./resolveAliOssConfig.js', () => jest.fn(params => params))

const resolveAliOssConfig = require('./resolveAliOssConfig')
const resolveImageStorageConfig = require('./resolveImageStorageConfig')

describe('resolveImageStorageConfig', () => {
  beforeEach(() => {
    resolveAliOssConfig.mockClear()
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

  test('当参数 alioss 没有提供时, 抛出错误 TypeError(aliOss 必须提供, 目前只支持 aliOss)', () => {
    expect(() => resolveImageStorageConfig({})).toThrow(new TypeError('aliOss 必须提供, 目前只支持 aliOss'))
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

  test('提供的参数合法, 返回正确的对象 1', () => {
    expect(resolveImageStorageConfig({
      aliOss: {}
    })).toEqual({
      aliOss: {}
    })
  })

  test('提供的参数合法, 返回正确的对象 2', () => {
    expect(resolveImageStorageConfig({
      aliOss: {
        foo: 123
      }
    })).toEqual({
      aliOss: {
        foo: 123
      }
    })
  })
})
