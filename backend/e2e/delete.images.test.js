/* eslint-env jest */
/* eslint-env jest */
const path = require('path')
/**
 * @type {boolean}
 * @description 是否在 CI 环境
 */
const isInCi = process.env.CI === 'true'

if (!isInCi) {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
}

const Oss = require('ali-oss')
const uuidV1 = require('uuid/v1')
const appConfig = require('../config')
const app = require('../app')
const { aes192Crypto } = require('../utils')
const request = require('supertest')
const mongoose = require('mongoose')
const UploadImages = require('../modals/uploadImages')

/**
 * 图片名称生成器
 * @param {string} md5 文件的 md5
 * @param {string?} imageNameSuffix 文件名后缀
 * @param {string} ext 文件后缀, **带有 . 字符**
 */
const imageNameGenerateHelper = (md5, ext, { suffix = '' }) => {
  if (suffix !== '') {
    return `${md5}-${suffix}${ext}`
  } else {
    return `${md5}${ext}`
  }
}

jest.setTimeout(30000)

describe('delete images', () => {
  const testAliOssClient = new Oss({
    region: 'oss-cn-hangzhou',
    accessKeyId: process.env.BACKEND_E2E_TEST_ALI_OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.BACKEND_E2E_TEST_ALI_OSS_ACCESS_KEY_SECRET,
    bucket: 'tuchuang-space-test1',
    secure: true
  })
  const imageNameSuffix = uuidV1()
  const imageNameSuffixBackup = appConfig.getImageNameSuffix()
  console.log(`imageNameSuffix: ${imageNameSuffix}`)
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true })
    appConfig._setOssClient(testAliOssClient)
    appConfig._setImageNameSuffix(imageNameSuffix)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    appConfig._setImageNameSuffix(imageNameSuffixBackup)
  })

  afterEach(async () => {
    await UploadImages.deleteMany({})
    const result = await testAliOssClient.list()
    const names = (result.objects || [])
      .filter((object) => object.name.indexOf(imageNameSuffix) !== -1)
      .map(object => object.name)

    if (names.length) {
      await testAliOssClient.deleteMulti(names)
    }
  })
  test('正确的 key 移除图片返回 204 Not Content', async () => {
    // arrange
    const filePath = path.resolve(__dirname, '../../shared/test_images/png.png')
    const fileMd5 = '637e2ee416a2de90cf6e76b6f4cc8c89'
    const deleteKey = aes192Crypto(`${fileMd5}-${imageNameSuffix}.png`, 'foo')
    await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)
    await testAliOssClient.get(imageNameGenerateHelper(fileMd5, '.png', { suffix: imageNameSuffix }))

    // act
    const res = await request(app)
      .delete('/api/1.0.0/images')
      .set('content-type', 'application/json')
      .send({ key: deleteKey })

    // assert
    expect(res.statusCode).toEqual(204)
    // https://jestjs.io/docs/en/expect#resolves
    await expect(testAliOssClient.get(imageNameGenerateHelper(fileMd5, '.png', { suffix: imageNameSuffix }))).rejects.toThrow()
  })
  test('不存在的 key 返回 404 Not Found', async () => {
    // arrange
    // const filePath = path.resolve(__dirname, '../../shared/test_images/png.png')
    const deleteKey = '2227249e2f654119796067ef696ecaee:4d4c2ca8485550e1faf5b256f2b3bb4ba82d9675bdc5357681b109643ae47d10a1af41c257183ed0aa8a256b2b098f6f'
    const fileMd5 = '637e2ee416a2de90cf6e76b6f4cc8c89'
    await testAliOssClient.delete(imageNameGenerateHelper(fileMd5, '.png', { suffix: imageNameSuffix }))
    // act
    const res = await request(app)
      .delete('/api/1.0.0/images')
      .set('content-type', 'application/json')
      .send({ key: deleteKey })

    // assert
    expect(res.statusCode).toEqual(404)
  })
  test('key 字段缺失返回 422 Unprocessable Entity', async () => {
    // arrange

    // act
    const res = await request(app)
      .delete('/api/1.0.0/images')
      .set('content-type', 'application/json')
      .send({ foo: '' })

    // assert
    expect(res.statusCode).toEqual(422)
    expect(res.body).toEqual({
      message: 'Validation Failed',
      errors: [
        {
          field: 'key',
          code: 'missing_field'
        }
      ]
    })
  })
  test('无法解密的 key 返回 422 Unprocessable Entity', async () => {
    // arrange
    const unDecryptoDeleteKey = 'qwewrewerw'

    // act
    const res = await request(app)
      .delete('/api/1.0.0/images')
      .set('content-type', 'application/json')
      .send({ key: unDecryptoDeleteKey })

    // assert
    expect(res.statusCode).toEqual(422)
    expect(res.body).toEqual({
      message: 'Validation Failed',
      errors: [{
        field: 'key',
        code: 'invalid'
      }]
    })
  })
  test('请求 content-type 不正确返回 400 Bad Request', async () => {
    // arrange

    // act
    const res = await request(app)
      .delete('/api/1.0.0/images')
      .set('content-type', 'text/plain')
      .send('foo')

    // assert
    expect(res.statusCode).toEqual(400)
  })
})
