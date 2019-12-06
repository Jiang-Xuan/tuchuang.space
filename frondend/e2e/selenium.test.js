/* eslint-env jest */

const { Builder, By, Key } = require('selenium-webdriver')
const { copyLogoToClip } = require('copy-logo-to-clipboard/index')
const mockServer = require('@tuchuang.space/mock-server/app')

console.log(process.env.PATH)

jest.setTimeout(60000)

describe('ctrl+v 粘贴图片功能', () => {
  let driver
  beforeAll(async () => {
    driver = await new Builder().forBrowser('firefox').build()
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
    const actions = driver.actions().keyDown(Key.COMMAND).keyDown('v').keyUp('v').keyUp(Key.COMMAND)
    await actions.perform()
  })
})
