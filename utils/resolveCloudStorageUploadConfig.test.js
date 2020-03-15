/* eslint-env jest */

jest.mock('./resolveAliOssConfig.js', () => jest.fn(params => params))

const resolveAliOssConfig = require('./resolveAliOssConfig')
const resolveCloudUploadConfig = require('./resolveCloudStorageUploadConfig')

describe('resolveCloudUploadConfig', () => {
  beforeEach(() => {
    resolveAliOssConfig.mockClear()
  })

  test('当参数不是 object 时, 抛出错误 TypeError(cloudUploadConfig 必须是 object)', () => {
    expect(() => resolveCloudUploadConfig(1234)).toThrow(new TypeError('cloudUploadConfig 必须是 object'))
    expect(() => resolveCloudUploadConfig('1234')).toThrow(new TypeError('cloudUploadConfig 必须是 object'))
    expect(() => resolveCloudUploadConfig(true)).toThrow(new TypeError('cloudUploadConfig 必须是 object'))
    expect(() => resolveCloudUploadConfig(false)).toThrow(new TypeError('cloudUploadConfig 必须是 object'))
    expect(() => resolveCloudUploadConfig([])).toThrow(new TypeError('cloudUploadConfig 必须是 object'))
    expect(() => resolveCloudUploadConfig(null)).toThrow(new TypeError('cloudUploadConfig 必须是 object'))
    expect(() => resolveCloudUploadConfig(undefined)).toThrow(new TypeError('cloudUploadConfig 必须是 object'))
  })
  test('当参数合法时, 将 aliOss 配置传递给依赖 resolveAliOssConfig 函数 1', () => {
    // act
    resolveCloudUploadConfig({
      aliOss: 123
    })
    expect(resolveAliOssConfig.mock.calls[0][0]).toEqual(123)
  })
  test('当参数合法时, 将 aliOss 配置传递给依赖 resolveAliOssConfig 函数 2', () => {
    // act
    resolveCloudUploadConfig({
      aliOss: {
        id: '234'
      }
    })
    expect(resolveAliOssConfig.mock.calls[0][0]).toEqual({
      id: '234'
    })
  })

  test('当参数合法时, 返回传入的对象', () => {
    const config = { aliOss: { secure: false } }

    expect(resolveCloudUploadConfig(config)).toEqual({
      aliOss: {
        secure: false
      }
    })
  })
  test('当参数合法是, 返回的对象需要是被冻结的', () => {
    const config = { aliOss: { id: 123 } }

    const isFrozen = Object.isFrozen(resolveCloudUploadConfig(config))

    expect(isFrozen).toEqual(true)
  })
})
