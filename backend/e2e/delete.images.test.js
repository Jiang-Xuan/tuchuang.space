/* eslint-env jest */
/* eslint-env jest */
const path = require('path')

const Oss = require('ali-oss')
const uuidV1 = require('uuid/v1')
const appConfig = require('../config')
const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const UploadImages = require('../modals/uploadImages')
const {
  test: {
    imageStorage: {
      aliOss: aliOssConfig
    }
  }
} = require('../../config')

jest.setTimeout(30000)

describe('delete images', () => {
  const testAliOssClient = new Oss({
    ...aliOssConfig
  })
  const imageNameSuffix = uuidV1()
  const imageNameSuffixBackup = appConfig.getImageNameSuffix()
  const deleteKeyCryptoKeyTest = 'foo'
  const deleteKeyCryptoKeyBackup = appConfig.getDeleteKeyCryptoKey()
  console.log(`imageNameSuffix: ${imageNameSuffix}`)
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true })
    appConfig._setOssClient(testAliOssClient)
    appConfig._setImageNameSuffix(imageNameSuffix)
    appConfig._setDeleteKeyCryptoKey(deleteKeyCryptoKeyTest)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    appConfig._setImageNameSuffix(imageNameSuffixBackup)
    appConfig._setDeleteKeyCryptoKey(deleteKeyCryptoKeyBackup)
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
    const uploadRes = await request(app)
      .post('/api/v1/images')
      .attach('images', filePath)
    await expect(
      testAliOssClient.get(uploadRes.body.images['png.png'].fileName)
    ).resolves.toBeInstanceOf(Object)

    // act
    const res = await request(app)
      .delete('/api/v1/images')
      .set('content-type', 'application/json')
      .send({ key: uploadRes.body.images['png.png'].deleteKey })

    // assert
    expect(res.statusCode).toEqual(204)
    // https://jestjs.io/docs/en/expect#resolves
    await expect(
      testAliOssClient.get(uploadRes.body.images['png.png'].fileName)
    ).rejects.toThrow()
  })
  test('不存在的 key 返回 404 Not Found', async () => {
    // arrange
    const filePath = path.resolve(__dirname, '../../shared/test_images/png.png')
    const uploadRes = await request(app)
      .post('/api/v1/images')
      .attach('images', filePath)
    await testAliOssClient.delete(uploadRes.body.images['png.png'].fileName)

    // act
    const res = await request(app)
      .delete('/api/v1/images')
      .set('content-type', 'application/json')
      .send({ key: uploadRes.body.images['png.png'].deleteKey })

    // assert
    expect(res.statusCode).toEqual(404)
  })
  test('key 字段缺失返回 422 Unprocessable Entity', async () => {
    // arrange

    // act
    const res = await request(app)
      .delete('/api/v1/images')
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
      .delete('/api/v1/images')
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
      .delete('/api/v1/images')
      .set('content-type', 'text/plain')
      .send('foo')

    // assert
    expect(res.statusCode).toEqual(400)
  })
})
