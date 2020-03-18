/* eslint-env jest */

const resolveAliossConfig = require('./resolveAliossConfig')

describe('resolveAliossConfig', () => {
  test('当参数不是 object 时, 抛出错误 TypeError(aliOssConfig 必须是 object)', () => {
    expect(() => resolveAliossConfig(1234)).toThrow(new TypeError('aliOssConfig 必须是 object'))
    expect(() => resolveAliossConfig('1234')).toThrow(new TypeError('aliOssConfig 必须是 object'))
    expect(() => resolveAliossConfig(true)).toThrow(new TypeError('aliOssConfig 必须是 object'))
    expect(() => resolveAliossConfig(false)).toThrow(new TypeError('aliOssConfig 必须是 object'))
    expect(() => resolveAliossConfig([])).toThrow(new TypeError('aliOssConfig 必须是 object'))
    expect(() => resolveAliossConfig(null)).toThrow(new TypeError('aliOssConfig 必须是 object'))
    expect(() => resolveAliossConfig(undefined)).toThrow(new TypeError('aliOssConfig 必须是 object'))
  })

  test('当参数 accessKeyId 不是 string 时, 抛出错误 TypeError(accessKeyId 必须是 string)', () => {
    expect(() => resolveAliossConfig({ accessKeyId: 123 })).toThrow(new TypeError('accessKeyId 必须是 string'))
  })
  test('当参数 accessKeySecret 不是 string 时, 抛出错误 TypeError(accessKeySecret 必须是 string)', () => {
    // arrange
    const config = { accessKeyId: '' }

    // act+assert
    expect(() => resolveAliossConfig({
      ...config,
      accessKeySecret: 123
    })).toThrow(new TypeError('accessKeySecret 必须是 string'))
  })
  test('当参数 bucket 不是 string 时, 抛出错误 TypeError(bucket 必须是 string)', () => {
    // arrange
    const config = { accessKeyId: '', accessKeySecret: '' }

    // act+assert
    expect(() => resolveAliossConfig({
      ...config,
      bucket: 123
    })).toThrow(new TypeError('bucket 必须是 string'))
  })
  test('当参数 secure 不是 boolean 时, 抛出错误 TypeError(secure 必须是 boolean)', () => {
    // arrange
    const config = { accessKeyId: '', accessKeySecret: '', bucket: '' }

    // act+assert
    expect(() => resolveAliossConfig({
      ...config,
      secure: 11
    })).toThrow(new TypeError('secure 必须是 boolean'))
  })

  test('当参数 region 不是 string 时, 抛出错误 TypeError(region 必须是 string)', () => {
    // arrange
    const config = { accessKeyId: '', accessKeySecret: '', bucket: '', secure: true }

    // act+assert
    expect(() => resolveAliossConfig({
      ...config,
      region: 11
    })).toThrow(new TypeError('region 必须是 string'))
  })

  test('当参数正确, 返回一样的参数', () => {
    // arrange
    const config = {
      accessKeyId: 'id',
      accessKeySecret: 'secure',
      bucket: 'bucket',
      secure: true,
      region: 'region'
    }

    // act+assert
    expect(resolveAliossConfig(config)).toEqual(config)
  })

  test('当参数正确, 返回的是一个冻结的对象', () => {
    // arrange
    const config = {
      accessKeyId: 'id',
      accessKeySecret: 'secure',
      bucket: 'bucket',
      secure: true,
      region: 'region'
    }

    // act
    const isFrozen = Object.isFrozen(resolveAliossConfig(config))

    // act+assert
    expect(isFrozen).toEqual(true)
  })
})
