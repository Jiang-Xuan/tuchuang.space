/* eslint-env jest */

jest.mock('./resolveCloudStorageUploadConfig.js', () => jest.fn(params => params))

const resolveCloudStorageUploadConfig = require('./resolveCloudStorageUploadConfig')
const resolveAssetConfig = require('./resolveAssetConfig')

describe('resolveAssetConfig', () => {
  beforeEach(() => {
    resolveCloudStorageUploadConfig.mockClear()
  })

  test('当参数不是 object 时, 抛出错误 TypeError(resolveAssetConfig 必须是 object)', () => {
    expect(() => resolveAssetConfig(1234)).toThrow(new TypeError('resolveAssetConfig 必须是 object'))
    expect(() => resolveAssetConfig('1234')).toThrow(new TypeError('resolveAssetConfig 必须是 object'))
    expect(() => resolveAssetConfig(true)).toThrow(new TypeError('resolveAssetConfig 必须是 object'))
    expect(() => resolveAssetConfig(false)).toThrow(new TypeError('resolveAssetConfig 必须是 object'))
    expect(() => resolveAssetConfig([])).toThrow(new TypeError('resolveAssetConfig 必须是 object'))
    expect(() => resolveAssetConfig(null)).toThrow(new TypeError('resolveAssetConfig 必须是 object'))
    expect(() => resolveAssetConfig(undefined)).toThrow(new TypeError('resolveAssetConfig 必须是 object'))
  })

  test('当参数合法时, 将 cloudStorageUpload 配置传递给依赖 resolveCloudStorageUploadConfig 函数 1', () => {
    // act
    resolveCloudStorageUploadConfig({
      cloudStorageUpload: 123
    })
    expect(resolveCloudStorageUploadConfig.mock.calls[0][0]).toEqual(123)
  })
  test('当参数合法时, 将 cloudStorageUpload 配置传递给依赖 resolveCloudStorageUploadConfig 函数 2', () => {
    // act
    resolveCloudStorageUploadConfig({
      cloudStorageUpload: {
        id: '234'
      }
    })
    expect(resolveCloudStorageUploadConfig.mock.calls[0][0]).toEqual({
      id: '234'
    })
  })
})
