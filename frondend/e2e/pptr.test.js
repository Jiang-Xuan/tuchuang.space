/* eslint-env jest */
/* global page */
// 先打包
// 在访问 index.html
// 然后进行测试
const child_process = require('child_process')
const path = require('path')

const indexHtml = path.resolve(__dirname, '../dist/index.html')

const E2E_TEST_ID_ATTR_NAME = 'data-e2e-test-id'

const TEST_ID_STORE = {
  /** @description 用户上传图片的点击区域 @type {'UPLOAD_CLICK_AREA'} */
  UPLOAD_CLICK_AREA: 'UPLOAD_CLICK_AREA'
}

describe('App', () => {
  let imagesUploadPromiseResolve = null
  const imagesUploadPromise = new Promise((resolve) => {
    imagesUploadPromiseResolve = resolve
  })

  beforeAll(async () => {
    await page.setRequestInterception(true)
    page.on('request', (interceptedRequest) => {
      if (
        interceptedRequest.url().includes('api/1.0.0/images')
      ) {
        imagesUploadPromiseResolve(interceptedRequest)
        return
      }
      interceptedRequest.continue()
    })
  })
  it('点击 UPLOAD_CLICK_AREA 发起相应的请求', async () => {
    await page.goto(`file://${indexHtml}`, {
      waitUntil: 'domcontentloaded'
    })
    const fileElement = await page.$(`[${E2E_TEST_ID_ATTR_NAME}="${TEST_ID_STORE.UPLOAD_CLICK_AREA}"]`)
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      fileElement.click()
    ])
    await fileChooser.accept([path.resolve(__dirname, '../../shared/test_images/png.png')])
    const request = await imagesUploadPromise
    expect(request.method()).toEqual('POST')
    // https://github.com/GoogleChrome/puppeteer/issues/4414
    expect(request.headers()['content-type'].includes('multipart/form-data;')).toEqual(true)
  })
})
