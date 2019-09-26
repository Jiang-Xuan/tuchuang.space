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

  it.skip('支持 .png 格式文件上传', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/png.png')
    const fileMd5 = '2e425e7fb41bb392b0a6c7245673c4cd'
    const DELETE_PATH_CALC_KEY = 'foo'
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)

    expect(res.status).toEqual(200)
    expect(res.body).toEqual({
      images: {
        'png.png': {
          mimetype: 'image/png',
          md5: fileMd5,
          fileName: `${fileMd5}.png`,
          ossPath: 'https://tuchuang-space.oss-cn-hangzhou.aliyuncs.com/2e425e7fb41bb392b0a6c7245673c4cd.png',
          cdnPath: 'https://images.tuchuang.space/2e425e7fb41bb392b0a6c7245673c4cd.png',
          deletePath: 'https://tuchuang.space/api/1.0.0/images/d593492065ff2885cf2d702184954621da99eec3f49fff5a0caa6d661262cf84e9b3638de6c24a222735ed17fa54371c'
        }
      }
    })
  })
})
