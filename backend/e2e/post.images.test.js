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

const fs = require('fs')
const rimraf = require('rimraf')
const { promisify } = require('util')
const request = require('supertest')
const mongoose = require('mongoose')
const Oss = require('ali-oss')
const uuidV1 = require('uuid/v1')
const { isString } = require('lodash')
const UploadImages = require('../modals/uploadImages')
const appConfig = require('../config')
const app = require('../app')
const promisifyFsAccess = promisify(fs.access)
// const { MAX_FILES } = require('../../shared/constants') // 10
// const { FILE_MAX_SIZE } = require('../../shared/constants') // 10 * 1024 * 1024

const uploadImagesFolderPath = path.resolve(__dirname, '../upload_images')

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

describe('post images 上传图片', () => {
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
    const names = (result.objects || []).map((object) => {
      return object.name
    })

    if (names.length) {
      await testAliOssClient.deleteMulti(names)
    }
  })

  it('upload_images 目录默认不存在, 并且被 .gitignore 忽略, 所以需要在程序中判断是否要创建该目录', async () => {
    rimraf.sync(uploadImagesFolderPath)
    const filePath = path.resolve(__dirname, '../../shared/test_images/jpg.jpg')
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)
    expect(async () => {
      await promisifyFsAccess(uploadImagesFolderPath)
    }).not.toThrow()
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

  it('上传的文件命名为 [文件的 md5]-[suffix].[ext]', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/png.png')
    const fileMd5 = '637e2ee416a2de90cf6e76b6f4cc8c89'
    await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)

    expect(async () => {
      await promisifyFsAccess(
        path.resolve(uploadImagesFolderPath, imageNameGenerateHelper(fileMd5, '.png', { suffix: imageNameSuffix }))
      )
    }).not.toThrow()
  })

  it('支持 .png 格式文件上传至 upload_images 目录下并响应一些字段', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/png.png')
    const fileMd5 = '637e2ee416a2de90cf6e76b6f4cc8c89'
    // const DELETE_PATH_CALC_KEY = 'foo'
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)
    expect(async () => {
      await promisifyFsAccess(
        path.resolve(uploadImagesFolderPath, imageNameGenerateHelper(fileMd5, '.png', { suffix: imageNameSuffix }))
      )
    }).not.toThrow()
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('images')
    expect(res.body.images).toHaveProperty(['png.png'])
    expect(res.body.images['png.png'].mimetype).toEqual('image/png')
    expect(res.body.images['png.png'].md5).toEqual(fileMd5)
    expect(res.body.images['png.png'].fileName).toEqual(
      imageNameGenerateHelper(fileMd5, '.png', { suffix: imageNameSuffix })
    )
    expect(
      isString(
        res.body.images['png.png'].deleteKey
      )
    ).toEqual(true)
  })

  it('支持 .webp 格式文件上传至 upload_images 目录下并响应一些字段', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/webp.webp')
    const fileMd5 = 'a4345330c12d929089fb828a6faf1188'
    // const DELETE_PATH_CALC_KEY = 'foo'
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)
    expect(async () => {
      await promisifyFsAccess(
        path.resolve(uploadImagesFolderPath, imageNameGenerateHelper(fileMd5, '.webp', { suffix: imageNameSuffix }))
      )
    }).not.toThrow()
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('images')
    expect(res.body.images).toHaveProperty(['webp.webp'])
    expect(res.body.images['webp.webp'].mimetype).toEqual('image/webp')
    expect(res.body.images['webp.webp'].md5).toEqual(fileMd5)
    expect(res.body.images['webp.webp'].fileName).toEqual(
      imageNameGenerateHelper(fileMd5, '.webp', { suffix: imageNameSuffix })
    )
    expect(
      isString(
        res.body.images['webp.webp'].deleteKey
      )
    ).toEqual(true)
  })

  it('支持 .jpeg 格式文件上传至 upload_images 目录下并响应一些字段', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/jpeg.jpeg')
    const fileMd5 = '2fecf647622e72e8af94147fa1e6c59f'
    // const DELETE_PATH_CALC_KEY = 'foo'
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)
    expect(async () => {
      await promisifyFsAccess(
        path.resolve(uploadImagesFolderPath, imageNameGenerateHelper(fileMd5, '.jpeg', { suffix: imageNameSuffix }))
      )
    }).not.toThrow()
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('images')
    expect(res.body.images).toHaveProperty(['jpeg.jpeg'])
    expect(res.body.images['jpeg.jpeg'].mimetype).toEqual('image/jpeg')
    expect(res.body.images['jpeg.jpeg'].md5).toEqual(fileMd5)
    expect(res.body.images['jpeg.jpeg'].fileName).toEqual(
      imageNameGenerateHelper(fileMd5, '.jpeg', { suffix: imageNameSuffix })
    )
    expect(
      isString(
        res.body.images['jpeg.jpeg'].deleteKey
      )
    ).toEqual(true)
  })

  /**
   * .jpeg 和 .jpg 是相同的格式, 但是需要保留原始用户的扩展名, 用户上传 jpeg 后缀的文件就保留 .jpeg, 用户上传 .jpg 格式的文件就保留 .jpg
   * https://www.zhihu.com/question/20329498
   */
  it('支持 .jpg 格式文件上传至 upload_images 目录下并响应一些字段', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/jpg.jpg')
    const fileMd5 = 'd9d003268cd2dc9ed82ad671d168881b'
    // const DELETE_PATH_CALC_KEY = 'foo'
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)
    expect(async () => {
      await promisifyFsAccess(
        path.resolve(uploadImagesFolderPath, imageNameGenerateHelper(fileMd5, '.jpg', { suffix: imageNameSuffix }))
      )
    }).not.toThrow()
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('images')
    expect(res.body.images).toHaveProperty(['jpg.jpg'])
    expect(res.body.images['jpg.jpg'].mimetype).toEqual('image/jpeg')
    expect(res.body.images['jpg.jpg'].md5).toEqual(fileMd5)
    expect(res.body.images['jpg.jpg'].fileName).toEqual(
      imageNameGenerateHelper(fileMd5, '.jpg', { suffix: imageNameSuffix })
    )
    expect(
      isString(
        res.body.images['jpg.jpg'].deleteKey
      )
    ).toEqual(true)
  })

  it('支持 .svg 格式文件上传至 upload_images 目录下并响应一些字段', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/svg.svg')
    const fileMd5 = '0797503940a344aff23ed9a9a70a8d7d'
    // const DELETE_PATH_CALC_KEY = 'foo'
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)
    expect(async () => {
      await promisifyFsAccess(
        path.resolve(uploadImagesFolderPath, imageNameGenerateHelper(fileMd5, '.svg', { suffix: imageNameSuffix }))
      )
    }).not.toThrow()
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('images')
    expect(res.body.images).toHaveProperty(['svg.svg'])
    expect(res.body.images['svg.svg'].mimetype).toEqual('image/svg+xml')
    expect(res.body.images['svg.svg'].md5).toEqual(fileMd5)
    expect(res.body.images['svg.svg'].fileName).toEqual(imageNameGenerateHelper(fileMd5, '.svg', { suffix: imageNameSuffix }))
    expect(
      isString(
        res.body.images['svg.svg'].deleteKey
      )
    ).toEqual(true)
  })

  it('支持 .gif 格式文件上传至 upload_images 目录下并响应一些字段', async () => {
    const filePath = path.resolve(__dirname, '../../shared/test_images/gif.gif')
    const fileMd5 = 'a5d04b4ab641306351e3687faf17d7e6'
    // const DELETE_PATH_CALC_KEY = 'foo'
    const res = await request(app)
      .post('/api/1.0.0/images')
      .attach('images', filePath)
    expect(async () => {
      await promisifyFsAccess(
        path.resolve(uploadImagesFolderPath, imageNameGenerateHelper(fileMd5, '.gif', { suffix: imageNameSuffix }))
      )
    }).not.toThrow()
    expect(res.status).toEqual(200)
    expect(res.body).toHaveProperty('images')
    expect(res.body.images).toHaveProperty(['gif.gif'])
    expect(res.body.images['gif.gif'].mimetype).toEqual('image/gif')
    expect(res.body.images['gif.gif'].md5).toEqual(fileMd5)
    expect(res.body.images['gif.gif'].fileName).toEqual(imageNameGenerateHelper(fileMd5, '.gif', { suffix: imageNameSuffix }))
    expect(
      isString(
        res.body.images['gif.gif'].deleteKey
      )
    ).toEqual(true)
  })

  describe('进行上传数据的存储和接口的基础鉴权', () => {
    it('上传图片完成之后将上传记录存储至数据库', async () => {
      const filePath = path.resolve(__dirname, '../../shared/test_images/gif.gif')
      const fileMd5 = 'a5d04b4ab641306351e3687faf17d7e6'
      const res = await request(app)
        .post('/api/1.0.0/images')
        .attach('images', filePath)

      expect(res.body.images['gif.gif']).toHaveProperty('_id')
      expect(typeof res.body.images['gif.gif']._id).toEqual('string')

      const dbItem = await UploadImages.findById(res.body.images['gif.gif']._id)

      expect(dbItem).toHaveProperty('_id')
      expect(dbItem.originalname).toEqual('gif.gif')
      expect(dbItem.md5).toEqual(fileMd5)
      expect(dbItem.createTime).toBeInstanceOf(Date)
    })
    it('上传图片的数据库记录符合数据库 modal', async () => {
      const filePath = path.resolve(__dirname, '../../shared/test_images/gif.gif')
      const fileMd5 = 'a5d04b4ab641306351e3687faf17d7e6'
      const res = await request(app)
        .post('/api/1.0.0/images')
        .attach('images', filePath)

      const dbItem = await UploadImages.findById(res.body.images['gif.gif']._id)
      /**
       * {
       *  _id: <MongoDb Id>,
       *  createTime: <创建时间>,
       *  ip: <请求者的 ip>,
       *  originalname: <上传的原始文件名>
       * }
       */
      expect(dbItem.md5).toEqual(fileMd5)
      expect(dbItem.createTime).toBeInstanceOf(Date)
      expect(dbItem.originalname).toEqual('gif.gif')
      expect(dbItem.ip).toEqual('127.0.0.1')
    })
    describe('每 x 秒 允许上传 x 张图片(根据 ip 限制)', () => {
      const filePath = path.resolve(__dirname, '../../shared/test_images/gif.gif')
      /*
       * mock 请求者的 ip https://stackoverflow.com/questions/16698284/testing-remote-ip-address-behaviors-on-a-node-express-server
       */
      // 测试: 每 60 s 允许上传 2 张图片
      const backSeconds = appConfig.getSeconds()
      appConfig._setSeconds([60, 2])
      const ip = '192.168.1.1'
      const createTime = new Date()
      const createTime2 = new Date()
      beforeAll(async () => {
        // 插入多条数据
        app.enable('trust proxy')
        await new UploadImages({ ip, createTime }).save()
        await new UploadImages({ ip, createTime: createTime2 }).save()
      })
      afterAll(() => {
        app.disable('trust proxy')
        appConfig._setSeconds(backSeconds)
      })
      it('请求者为相同的 ip 进行限制', async () => {
        // 然后再发起请求, 该请求应该被拒绝
        const res = await request(app)
          .post('/api/1.0.0/images')
          .set('X-Forwarded-For', '192.168.1.1')
          .attach('images', filePath)

        expect(res.status).toEqual(403)
        expect(res.body).toEqual({
          errorMsg: '请求频率超限, 请稍后重试'
        })
      })
      it('请求者为不同的 ip 不进行限制', async () => {
        const res = await request(app)
          .post('/api/1.0.0/images')
          .set('X-Forwarded-For', '192.168.1.0')
          .attach('images', filePath)

        expect(res.status).toEqual(200)
        // expect(res.body).toEqual()
      })
    })
    describe('每 x 小时 允许上传 x 张图片(根据 ip 限制)', () => {
      const filePath = path.resolve(__dirname, '../../shared/test_images/gif.gif')
      // 测试: 每 1 小时允许上传 2 张
      const backHours = appConfig.getHours()
      appConfig._setHours([1, 2])
      const ip = '192.168.1.1'
      /**
       * 将日期按照分钟数回退
       * @param {Date} date 日期
       * @param {number} minutes 分钟数
       */
      const backMinutes = (date, minutes) => {
        const milisecondes = minutes * 60 * 1000
        return new Date(date.valueOf() - milisecondes)
      }
      const createTime = backMinutes(new Date(), 30)
      const createTime2 = backMinutes(new Date(), 40)
      beforeAll(async () => {
        // 插入多条数据
        app.enable('trust proxy')
        await new UploadImages({ ip, createTime }).save()
        await new UploadImages({ ip, createTime: createTime2 }).save()
      })
      afterAll(() => {
        app.disable('trust proxy')
        appConfig._setHours(backHours)
      })
      it('请求者为相同的 ip 进行限制', async () => {
        // 然后再发起请求, 该请求应该被拒绝
        const res = await request(app)
          .post('/api/1.0.0/images')
          .set('X-Forwarded-For', '192.168.1.1')
          .attach('images', filePath)

        expect(res.status).toEqual(403)
        expect(res.body).toEqual({
          errorMsg: '请求频率超限, 请稍后重试'
        })
      })
      it('请求者为不同的 ip 不进行限制', async () => {
        const res = await request(app)
          .post('/api/1.0.0/images')
          .set('X-Forwarded-For', '192.168.1.0')
          .attach('images', filePath)

        expect(res.status).toEqual(200)
        // expect(res.body).toEqual()
      })
    })

    it('接入 阿里云 oss 系统, 返回关于 oss 的链接作为 ossPath 字段', async () => {
      const filePath = path.resolve(__dirname, '../../shared/test_images/svg.svg')
      const fileMd5 = '0797503940a344aff23ed9a9a70a8d7d'
      const res = await request(app)
        .post('/api/1.0.0/images')
        .attach('images', filePath)
      await testAliOssClient.get(imageNameGenerateHelper(fileMd5, '.svg', { suffix: imageNameSuffix }))
      expect(res.body.images['svg.svg']).toHaveProperty('ossPath')
      expect(res.body.images['svg.svg'].ossPath).toEqual(`https://tuchuang-space-test1.oss-cn-hangzhou.aliyuncs.com/${
        imageNameGenerateHelper(fileMd5, '.svg', { suffix: imageNameSuffix })
      }`)
    })

    it('接入 阿里云 cdn 系统, 返回关于 cdn 的链接作为 cdnPath 字段', async () => {
      const filePath = path.resolve(__dirname, '../../shared/test_images/svg.svg')
      const fileMd5 = '0797503940a344aff23ed9a9a70a8d7d'
      const res = await request(app)
        .post('/api/1.0.0/images')
        .attach('images', filePath)
      await testAliOssClient.get(imageNameGenerateHelper(fileMd5, '.svg', { suffix: imageNameSuffix }))
      expect(res.body.images['svg.svg']).toHaveProperty('ossPath')
      expect(res.body.images['svg.svg'].cdnPath).toEqual(`https://i.tuchuang.space/${
        imageNameGenerateHelper(fileMd5, '.svg', { suffix: imageNameSuffix })
      }`)
    })
  })
})
