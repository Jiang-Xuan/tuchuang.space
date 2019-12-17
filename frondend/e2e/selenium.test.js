/* eslint-env jest */

const { Builder, Key, By } = require('selenium-webdriver')
const md5 = require('md5')
const { copyLogoToClip, logoMd5Hash } = require('copy-logo-to-clipboard/index')
const mockServer = require('@tuchuang.space/mock-server/app')

if (process.env.CI === 'true') {
  process.env.PATH = `${process.env.PATH};${process.env.GeckoWebDriver};${process.env.ChromeWebDriver};${process.env.IEWebDriver}`
}

jest.setTimeout(600000000)

const forBrowser = 'firefox'

describe('ctrl+v 粘贴图片功能', () => {
  let driver
  beforeAll(async () => {
    driver = await new Builder().forBrowser(forBrowser).build()
    mockServer.config.configResponse({
      body: {
        images: {
          'image_from_clipboard.png': {
            mimetype: 'image/png',
            md5: '637e2ee416a2de90cf6e76b6f4cc8c89',
            filename: 'test-test.png',
            ossPath: 'http://example.com/test-test.png',
            cdnPath: 'https://i.tuchuang.space/test.png',
            deleteKey: '2436b48115486de952296f2b5295aeb90d284761278661102e7dda990c3f67022133080fb1bcd99d7f94678a991c57f1'
          }
        }
      }
    })
    await mockServer.start()
  })

  afterAll(async () => {
    await driver.quit()
    await mockServer.close()
  })

  it('当用户 ctrl+v 粘贴图片时, 发起请求并传递相应参数', async () => {
    // arrange
    await driver.get('http://127.0.0.1:3400')
    await copyLogoToClip()
    // act
    await driver.findElement(By.css('body')).click()
    let actions
    if (forBrowser === 'chrome') {
      actions = driver.actions().keyDown(Key.SHIFT).keyDown(Key.INSERT).keyUp(Key.INSERT).keyUp(Key.SHIFT)
    } else if (forBrowser === 'firefox') {
      actions = driver.actions().keyDown(Key.COMMAND).keyDown('v').keyUp('v').keyUp(Key.COMMAND)
    }
    await actions.perform()

    // assert
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const requests = mockServer.search({ path: '/api/v1/images' })
    console.log(requests, requests[0].files)
    await new Promise((resolve) => setTimeout(resolve, 2000000))
    expect(md5(requests[0].files[0].buffer)).toEqual(logoMd5Hash)
  })
})
