/* eslint-env jest */
/* global page */
// 先打包
// 在访问 index.html
// 然后进行测试
const path = require('path')

const E2E_TEST_ID_ATTR_NAME = 'data-e2e-test-id'

const devServerPort = 3400

const TEST_ID_STORE = {
  /** @description 用户上传图片的点击区域 @type {'UPLOAD_CLICK_AREA'} */
  UPLOAD_CLICK_AREA: 'UPLOAD_CLICK_AREA',
  /** @description 上传图片的结果区域 @type {'UPLOAD_RESULTS'} */
  UPLOAD_RESULTS: 'UPLOAD_RESULTS',
  /** @description 上传图片的结果区域的 html 输入框 @type {'UPLOAD_RESULT_HTML'} */
  UPLOAD_RESULT_HTML: 'UPLOAD_RESULT_HTML',
  /** @description 上传图片的结果区域的 url 输入框 @type {'UPLOAD_RESULT_URL'} */
  UPLOAD_RESULT_URL: 'UPLOAD_RESULT_URL',
  /** @description 上传图片的结果区域的 markdown 输入框 @type {'UPLOAD_RESULT_MARKDOWN'} */
  UPLOAD_RESULT_MARKDOWN: 'UPLOAD_RESULT_MARKDOWN',
  /** @description 上传图片的结果区域的 image 输入框 @type {'UPLOAD_RESULT_IMAGE'} */
  UPLOAD_RESULT_IMAGE: 'UPLOAD_RESULT_IMAGE',
  /** @description 上传图片的结果区域的 delete 输入框 @type {'UPLOAD_RESULT_DELETE'} */
  UPLOAD_RESULT_DELETE: 'UPLOAD_RESULT_DELETE',
  /** @description 前往 api 文档的按钮 @type {'GOTO_API_DOC_BTN'} */
  GOTO_API_DOC_BTN: 'GOTO_API_DOC_BTN',
  /** @description 前往 contact 页面的按钮 @type {'GOTO_CONTACT_BTN'} */
  GOTO_CONTACT_BTN: 'GOTO_CONTACT_BTN'
}

jest.setTimeout(30000)
// !! 阻止 jest 关闭 browser
// jest.setTimeout(60000)
// function abortPageClosed () {
//   return new Promise((resolve) => setTimeout(resolve, 90000))
// }
// !! 阻止 jest 关闭 browser

describe('上传图片时. 向 api/v1/image 接口发起 POST 请求, 且请求的 content-type 为 multiple/form-data', () => {
  let imagesUploadPromiseResolve = null
  const imagesUploadPromise = new Promise((resolve) => {
    imagesUploadPromiseResolve = resolve
  })

  beforeAll(async () => {
    await page.setRequestInterception(true)
    page.on('request', (interceptedRequest) => {
      if (
        interceptedRequest.url().includes('api/v1/images')
      ) {
        imagesUploadPromiseResolve(interceptedRequest)
        return
      }
      interceptedRequest.continue()
    })
  })
  it('点击 UPLOAD_CLICK_AREA 发起相应的请求', async () => {
    await page.goto(`http://127.0.0.1:${devServerPort}`, {
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

describe('上传文件不合法的时候展示错误信息', () => {
  beforeEach(async () => {
    await global.jestPuppeteer.resetBrowser()
  })
  it('图片尺寸过大', async () => {
    await page.goto(`http://127.0.0.1:${devServerPort}`, {
      waitUntil: 'domcontentloaded'
    })
    const fileElement = await page.$(`[${E2E_TEST_ID_ATTR_NAME}="${TEST_ID_STORE.UPLOAD_CLICK_AREA}"]`)
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      fileElement.click()
    ])
    await fileChooser.accept([path.resolve(__dirname, '../../shared/test_images/16.1m.jpeg')])
    // 图片文件过大错误信息
    const uploadResults = await page.$(`[${E2E_TEST_ID_ATTR_NAME}="${TEST_ID_STORE.UPLOAD_RESULTS}"]`)
    const uploadResultsInnerText = await uploadResults.getProperty('innerText')
    const uploadResultsInnerTextJsonValue = await uploadResultsInnerText.jsonValue()

    expect(uploadResultsInnerTextJsonValue.indexOf('不能上传 16.1m.jpeg, 原因如下:\n文件超过最大限制, 最大限制为 10M')).not.toEqual(-1)
  })
  it('格式不支持', async () => {
    await page.goto(`http://127.0.0.1:${devServerPort}`, {
      waitUntil: 'domcontentloaded'
    })
    const fileElement = await page.$(`[${E2E_TEST_ID_ATTR_NAME}="${TEST_ID_STORE.UPLOAD_CLICK_AREA}"]`)
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      fileElement.click()
    ])
    await fileChooser.accept([path.resolve(__dirname, '../../shared/test_images/text.txt')])
    // 图片文件过大错误信息
    const uploadResults = await page.$(`[${E2E_TEST_ID_ATTR_NAME}="${TEST_ID_STORE.UPLOAD_RESULTS}"]`)
    const uploadResultsInnerText = await uploadResults.getProperty('innerText')
    const uploadResultsInnerTextJsonValue = await uploadResultsInnerText.jsonValue()

    expect(uploadResultsInnerTextJsonValue.indexOf('不能上传 text.txt, 原因如下:\n格式不正确')).not.toEqual(-1)
  })
})

describe('接口数据响应正常的时候显示正常的数据', () => {
  beforeAll(async () => {
    await global.jestPuppeteer.resetBrowser()
    await page.goto(`http://127.0.0.1:${devServerPort}`, {
      waitUntil: 'domcontentloaded'
    })
    await page.setRequestInterception(true)
    page.on('request', (interceptedRequest) => {
      if (
        interceptedRequest.url().includes('api/v1/images')
      ) {
        interceptedRequest.respond({
          status: 200,
          'content-type': 'application/json',
          body: JSON.stringify({
            images: {
              'png.png': {
                mimetype: 'image/png',
                md5: '637e2ee416a2de90cf6e76b6f4cc8c89',
                filename: 'test-test.png',
                ossPath: 'http://example.com/test-test.png',
                cdnPath: 'https://i.tuchuang.space/test.png',
                deleteKey: '2436b48115486de952296f2b5295aeb90d284761278661102e7dda990c3f67022133080fb1bcd99d7f94678a991c57f1'
              }
            }
          })
        })
        return
      }
      interceptedRequest.continue()
    })
    const fileElement = await page.$(`[${E2E_TEST_ID_ATTR_NAME}="${TEST_ID_STORE.UPLOAD_CLICK_AREA}"]`)
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      fileElement.click()
    ])
    await fileChooser.accept([path.resolve(__dirname, '../../shared/test_images/png.png')])

    await new Promise((resolve) => setTimeout(resolve, 1000))
  })

  it('html 数据', async () => {
    const input = await page.$(`[${E2E_TEST_ID_ATTR_NAME}="${TEST_ID_STORE.UPLOAD_RESULT_HTML}"]`)
    const inputValue = await input.getProperty('value')
    const inputValueJsonValue = await inputValue.jsonValue()

    expect(inputValueJsonValue).toEqual('<a href="https://i.tuchuang.space/test.png"></a>')
  })

  it('url 数据', async () => {
    const input = await page.$(`[${E2E_TEST_ID_ATTR_NAME}="${TEST_ID_STORE.UPLOAD_RESULT_URL}"]`)
    const inputValue = await input.getProperty('value')
    const inputValueJsonValue = await inputValue.jsonValue()

    expect(inputValueJsonValue).toEqual('https://i.tuchuang.space/test.png')
  })

  it('markdown 数据', async () => {
    const input = await page.$(`[${E2E_TEST_ID_ATTR_NAME}="${TEST_ID_STORE.UPLOAD_RESULT_MARKDOWN}"]`)
    const inputValue = await input.getProperty('value')
    const inputValueJsonValue = await inputValue.jsonValue()

    expect(inputValueJsonValue).toEqual('![](https://i.tuchuang.space/test.png)')
  })

  it('image 数据', async () => {
    const input = await page.$(`[${E2E_TEST_ID_ATTR_NAME}="${TEST_ID_STORE.UPLOAD_RESULT_IMAGE}"]`)
    const inputValue = await input.getProperty('value')
    const inputValueJsonValue = await inputValue.jsonValue()

    expect(inputValueJsonValue).toEqual('<img src="https://i.tuchuang.space/test.png" />')
  })

  it('deleteKey 数据', async () => {
    const input = await page.$(`[${E2E_TEST_ID_ATTR_NAME}="${TEST_ID_STORE.UPLOAD_RESULT_DELETE}"]`)
    const inputValue = await input.getProperty('value')
    const inputValueJsonValue = await inputValue.jsonValue()

    expect(inputValueJsonValue).toEqual('2436b48115486de952296f2b5295aeb90d284761278661102e7dda990c3f67022133080fb1bcd99d7f94678a991c57f1')
  })
})

describe('导航条导航', () => {
  beforeAll(async () => {
    await global.jestPuppeteer.resetBrowser()
    await page.goto(`http://127.0.0.1:${devServerPort}`, {
      waitUntil: 'domcontentloaded'
    })
  })
  it('前往 api 文档的链接正常', async () => {
    const gotoApiDocBtn = await page.$(`[${E2E_TEST_ID_ATTR_NAME}="${TEST_ID_STORE.GOTO_API_DOC_BTN}"]`)
    await gotoApiDocBtn.click()
    const pathname = await page.waitForFunction('location.pathname')
    const pathnameJsonValue = await pathname.jsonValue()

    expect(pathnameJsonValue).toEqual('/api-doc')
  })
  it('前往 contact 的链接正常', async () => {
    const gotoContactBtn = await page.$(`[${E2E_TEST_ID_ATTR_NAME}="${TEST_ID_STORE.GOTO_CONTACT_BTN}"]`)
    await gotoContactBtn.click()
    const pathname = await page.waitForFunction('location.pathname')
    const pathnameJsonValue = await pathname.jsonValue()

    expect(pathnameJsonValue).toEqual('/contact')
  })
})
