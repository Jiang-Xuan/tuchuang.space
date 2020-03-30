/* eslint-env jest */

jest.mock('./resolveCloudStorageUploadConfig.js', () => jest.fn(params => params))

const resolveCloudStorageUploadConfig = require('./resolveCloudStorageUploadConfig')
const resolveAssetConfig = require('./resolveAssetConfig')

describe('resolveAssetConfig', () => {
  beforeEach(() => {
    resolveCloudStorageUploadConfig.mockClear()
  })

  test('当参数不是 object 时, 抛出错误 TypeError(assetConfig 必须是 object)', () => {
    expect(() => resolveAssetConfig(1234)).toThrow(new TypeError('assetConfig 必须是 object'))
    expect(() => resolveAssetConfig('1234')).toThrow(new TypeError('assetConfig 必须是 object'))
    expect(() => resolveAssetConfig(true)).toThrow(new TypeError('assetConfig 必须是 object'))
    expect(() => resolveAssetConfig(false)).toThrow(new TypeError('assetConfig 必须是 object'))
    expect(() => resolveAssetConfig([])).toThrow(new TypeError('assetConfig 必须是 object'))
    expect(() => resolveAssetConfig(null)).toThrow(new TypeError('assetConfig 必须是 object'))
    expect(() => resolveAssetConfig(undefined)).toThrow(new TypeError('assetConfig 必须是 object'))
  })

  test('当提供参数 useCloudStorage 时, 如果不是 boolean 类型, 抛出错误 TypeError(useCloudStorage 必须是 boolean)', () => {
    const config = {
      useCloudStorage: '444'
    }

    expect(() => resolveAssetConfig(config)).toThrow(new TypeError('useCloudStorage 必须是 boolean'))
  })

  test('当提供参数 useCloudStorage 为 true 时, 调用 resolveCloudStorageUploadConfig 并传入 cloudStorageUpload', () => {
    // act
    resolveAssetConfig({
      useCloudStorage: true,
      cloudStorageUpload: {}
    })

    // assert
    expect(resolveCloudStorageUploadConfig.mock.calls[0][0]).toEqual({})
  })

  test('当提供参数 useCloudStorage 为 true 时, resolveCloudStorageUploadConfig 的返回值作为返回值的 cloudStorageUpload 字段', () => {
    expect(resolveAssetConfig({
      useCloudStorage: true,
      cloudStorageUpload: {}
    }).cloudStorageUpload).toEqual({})
  })

  test('当提供参数 useCloudStorage 为 false 时, 不调用 resolveCloudStorageUploadConfig', () => {
    // act
    resolveAssetConfig({
      useCloudStorage: false,
      cloudStorageUpload: {}
    })

    // assert
    expect(resolveCloudStorageUploadConfig.mock.calls.length).toEqual(0)
  })

  test('当提供参数 useCloudStorage 为 false 时, location 不提供时, 默认为 .', () => {
    expect(resolveAssetConfig({
      useCloudStorage: false
    }).location).toEqual('.')
  })

  test('当提供参数 useCloudStorage 为 false 时, location 提供时, 如果不是 string, 抛出错误 TypeError(location 必须是 string)', () => {
    expect(() => resolveAssetConfig({
      useCloudStorage: false,
      location: 123
    })).toThrow(new TypeError('location 必须是 string'))
  })

  test('当提供参数 webpackPublicPath 时, 如果不是 string 类型, 抛出错误 TypeError(webpackPublicPath 必须是 string)', () => {
    expect(() => resolveAssetConfig({
      useCloudStorage: false,
      webpackPublicPath: 123
    })).toThrow(new TypeError('webpackPublicPath 必须是 string'))
  })

  test('提供的参数合法, 返回的对象是冻结的', () => {
    const result = resolveAssetConfig({
      useCloudStorage: false
    })

    const isFrozen = Object.isFrozen(result)

    expect(isFrozen).toEqual(true)
  })

  test('提供的参数合法, 返回正确的对象 1', () => {
    expect(resolveAssetConfig({
      useCloudStorage: false
    })).toEqual({
      useCloudStorage: false,
      location: '.'
    })
  })

  test('提供的参数合法, 返回正确的对象 1', () => {
    expect(resolveAssetConfig({
      useCloudStorage: true,
      cloudStorageUpload: {},
      webpackPublicPath: 'test'
    })).toEqual({
      useCloudStorage: true,
      cloudStorageUpload: {},
      webpackPublicPath: 'test'
    })
  })
})
