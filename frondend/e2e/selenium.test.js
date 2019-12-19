/* eslint-env jest */

const { platform } = require('os')
const { Builder, Key, By } = require('selenium-webdriver')
const md5 = require('md5')
const jimp = require('jimp')
const { copyLogoToClip, getLogoBitmap } = require('copy-logo-to-clipboard/index')
const mockServer = require('@tuchuang.space/mock-server/app')

if (process.env.CI === 'true') {
  process.env.PATH = `${process.env.PATH};${process.env.GeckoWebDriver};${process.env.ChromeWebDriver};${process.env.IEWebDriver}`
}

jest.setTimeout(60000)

const forBrowser = process.env.SELENIUM_FOR_BROWSER

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

  it(
    forBrowser === 'chrome'
      ? 'chrome 下, 当用户 ctrl+v 粘贴图片时, 上传的图片的 bitmap 和源图片的 bitmap 相同, 另见: https://github.com/Jiang-Xuan/tuchuang.space/issues/36#issuecomment-566868929'
      : 'firefox, ie 下, 当用户 ctrl+v 粘贴图片时, 上传了图片并且图片是 png 格式, 另见: https://github.com/Jiang-Xuan/tuchuang.space/issues/36#issuecomment-566868929',
    async () => {
      // arrange
      await driver.get('http://127.0.0.1:3400')
      await copyLogoToClip()
      // act
      const body = await driver.findElement(By.css('body'))
      let actions

      if (platform() === 'darwin') {
        if (forBrowser === 'chrome') {
          actions = driver.actions().keyDown(Key.SHIFT).keyDown(Key.INSERT).keyUp(Key.INSERT).keyUp(Key.SHIFT)
        } else if (forBrowser === 'firefox') {
          actions = driver.actions().keyDown(Key.COMMAND).keyDown('v').keyUp('v').keyUp(Key.COMMAND)
        }
        await body.click()
        await actions.perform()
      } else if (platform() === 'win32') {
        actions = driver.actions().keyDown(Key.CONTROL).keyDown('v').keyUp('v').keyUp(Key.CONTROL)
        const controlKeyDown = driver.actions().keyDown(Key.CONTROL)
        const vKeyDown = driver.actions().keyDown('v')
        const vKeyUp = driver.actions().keyUp('v')
        const controlKeyUp = driver.actions().keyUp(Key.CONTROL)

        await new Promise((resolve) => setTimeout(resolve, 2000))
        await body.click()
        await controlKeyDown.perform()
        await new Promise((resolve) => setTimeout(resolve, 500))
        await vKeyDown.perform()
        await new Promise((resolve) => setTimeout(resolve, 500))
        await vKeyUp.perform()
        await new Promise((resolve) => setTimeout(resolve, 500))
        await controlKeyUp.perform()
      }

      // assert https://github.com/Jiang-Xuan/tuchuang.space/issues/36#issuecomment-566868929
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const requests = mockServer.search({ path: '/api/v1/images' })
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const outputLogoJimp = await jimp.read(requests[0].files[0].buffer)
      const logoBitmap = await getLogoBitmap()
      if (forBrowser === 'chrome') {
        expect(md5(outputLogoJimp.bitmap.data)).toEqual(md5(logoBitmap))
      } else {
        expect(outputLogoJimp.getMIME()).toEqual('image/png')
      }
    })
})
