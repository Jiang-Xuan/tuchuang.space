/* eslint-env jest */
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const { promisify } = require('util')
const request = require('supertest')
const app = require('../app')
const promisifyFsExists = promisify(fs.exists)
// const { MAX_FILES } = require('../../shared/constants') // 10
// const { FILE_MAX_SIZE } = require('../../shared/constants') // 10 * 1024 * 1024

const uploadImagesFolderPath = path.resolve(__dirname, '../upload_images')

describe('post images 上传图片', () => {
  it('upload_images 目录默认不存在, 并且被 .gitignore 忽略, 所以需要在程序中判断是否要创建该目录', async () => {
    rimraf.sync(uploadImagesFolderPath)
    const filePath = path.resolve(__dirname, '../../shared/test_images/jpg.jpg')
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)
    const isFolderExists = await promisifyFsExists(uploadImagesFolderPath)
    expect(isFolderExists).toEqual(true)
    expect(res).not.toEqual(undefined)
  })

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

  it('上传的文件命名为 [文件的 md5].[ext]', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/png.png')
    const fileMd5 = '2e425e7fb41bb392b0a6c7245673c4cd'
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)

    const isFsExist = await promisifyFsExists(path.resolve(uploadImagesFolderPath, `${fileMd5}.png`))

    expect(isFsExist).toEqual(true)
  })

  it('支持 .png 格式文件上传至 upload_images 目录下并响应一些字段', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/png.png')
    const fileMd5 = '2e425e7fb41bb392b0a6c7245673c4cd'
    const DELETE_PATH_CALC_KEY = 'foo'
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)
    const isFsExist = await promisifyFsExists(path.resolve(uploadImagesFolderPath, `${fileMd5}.png`))
    expect(isFsExist).toEqual(true)
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('images')
    expect(res.body.images).toHaveProperty(['png.png'])
    expect(res.body.images['png.png'].mimetype).toEqual('image/png')
    expect(res.body.images['png.png'].md5).toEqual(fileMd5)
    expect(res.body.images['png.png'].fileName).toEqual(`${fileMd5}.png`)
    expect(res.body.images['png.png'].deleteKey).toEqual(
      'd593492065ff2885cf2d702184954621da99eec3f49fff5a0caa6d661262cf84e9b3638de6c24a222735ed17fa54371c'
    )
    // 2019-09-26 由于暂时没有接入域名, oss 和 cdn, 暂不支持 域名, oss, cdn 断言
    // expect(res.body).toEqual({
    //   images: {
    //     'png.png': {
    //       mimetype: 'image/png',
    //       md5: fileMd5,
    //       fileName: `${fileMd5}.png`,
    //       ossPath: 'https://tuchuang-space.oss-cn-hangzhou.aliyuncs.com/2e425e7fb41bb392b0a6c7245673c4cd.png',
    //       cdnPath: 'https://images.tuchuang.space/2e425e7fb41bb392b0a6c7245673c4cd.png',
    //       deletePath: 'https://tuchuang.space/api/1.0.0/images/d593492065ff2885cf2d702184954621da99eec3f49fff5a0caa6d661262cf84e9b3638de6c24a222735ed17fa54371c'
    //     }
    //   }
    // })
  })

  it('支持 .webp 格式文件上传至 upload_images 目录下并响应一些字段', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/webp.webp')
    const fileMd5 = '48eb13ccd9d190f210519bed179e08ac'
    const DELETE_PATH_CALC_KEY = 'foo'
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)
    const isFsExist = await promisifyFsExists(path.resolve(uploadImagesFolderPath, `${fileMd5}.webp`))
    expect(isFsExist).toEqual(true)
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('images')
    expect(res.body.images).toHaveProperty(['webp.webp'])
    expect(res.body.images['webp.webp'].mimetype).toEqual('image/webp')
    expect(res.body.images['webp.webp'].md5).toEqual(fileMd5)
    expect(res.body.images['webp.webp'].fileName).toEqual(`${fileMd5}.webp`)
    expect(res.body.images['webp.webp'].deleteKey).toEqual(
      'bf7c65a0f3fad3bcb92d963eccd5a9456fcf4713db51697d5cbf54dfeb724602e20a81e4705297eaeceea815327faf56'
    )
  })

  it('支持 .jpeg 格式文件上传至 upload_images 目录下并响应一些字段', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/jpeg.jpeg')
    const fileMd5 = '2fecf647622e72e8af94147fa1e6c59f'
    const DELETE_PATH_CALC_KEY = 'foo'
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)
    const isFsExist = await promisifyFsExists(path.resolve(uploadImagesFolderPath, `${fileMd5}.jpeg`))
    expect(isFsExist).toEqual(true)
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('images')
    expect(res.body.images).toHaveProperty(['jpeg.jpeg'])
    expect(res.body.images['jpeg.jpeg'].mimetype).toEqual('image/jpeg')
    expect(res.body.images['jpeg.jpeg'].md5).toEqual(fileMd5)
    expect(res.body.images['jpeg.jpeg'].fileName).toEqual(`${fileMd5}.jpeg`)
    expect(res.body.images['jpeg.jpeg'].deleteKey).toEqual(
      '0e9f92caf299d793456c1428379eba1b289eff723c2611274d77c537a3b6db87499ab4edede74c331d9ff91e1c35cc8c'
    )
  })

  /**
   * .jpeg 和 .jpg 是相同的格式, 但是需要保留原始用户的扩展名, 用户上传 jpeg 后缀的文件就保留 .jpeg, 用户上传 .jpg 格式的文件就保留 .jpg
   * https://www.zhihu.com/question/20329498
   */
  it('支持 .jpg 格式文件上传至 upload_images 目录下并响应一些字段', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/jpg.jpg')
    const fileMd5 = '02ff22f42bfee2f745862ffd05facd9f'
    const DELETE_PATH_CALC_KEY = 'foo'
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)
    const isFsExist = await promisifyFsExists(path.resolve(uploadImagesFolderPath, `${fileMd5}.jpg`))
    expect(isFsExist).toEqual(true)
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('images')
    expect(res.body.images).toHaveProperty(['jpg.jpg'])
    expect(res.body.images['jpg.jpg'].mimetype).toEqual('image/jpeg')
    expect(res.body.images['jpg.jpg'].md5).toEqual(fileMd5)
    expect(res.body.images['jpg.jpg'].fileName).toEqual(`${fileMd5}.jpg`)
    expect(res.body.images['jpg.jpg'].deleteKey).toEqual(
      'eaac5508c31173165b15379f0a818988f271a2550e756e97b3a4882d2100dd13a9a48b15831ad61e42c07cc86fbe3046'
    )
  })
})
