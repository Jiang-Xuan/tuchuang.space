/* eslint-env jest */
const path = require('path')
const request = require('supertest')
const app = require('../app')
// const { MAX_FILES } = require('../../shared/constants') // 10
// const { FILE_MAX_SIZE } = require('../../shared/constants') // 10 * 1024 * 1024

describe('post images 上传图片', () => {
  it('当文件超出 MAX_FILES 的时候抛出错误', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/png.png')
    const resHandler = request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath) // 1
      .attach('images', filePath)
      .attach('images', filePath)
      .attach('images', filePath)
      .attach('images', filePath)
      .attach('images', filePath)
      .attach('images', filePath)
      .attach('images', filePath)
      .attach('images', filePath)
      .attach('images', filePath) // 10
      .attach('images', filePath) // 11

    const res = await resHandler

    expect(res.status).toEqual(403)
    expect(res.body).toEqual({
      errorMsg: '图片数量超过上限'
    })
  })

  it('当文件尺寸超出 FILE_MAX_SIZE 的时候抛出错误', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/16.1m.jpeg')
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)

    expect(res.status).toEqual(403)
    expect(res.body).toEqual({
      errorMsg: '图片尺寸超出上限'
    })
  })

  it('当文件格式不支持的时候抛出错误', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/text.txt')
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)

    expect(res.status).toEqual(403)
    expect(res.body).toEqual({
      errorMsg: '文件格式不支持'
    })
  })
})
