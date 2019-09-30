/* eslint-env jest */
// 先打包
// 在访问 index.html
// 然后进行测试
const child_process = require('child_process')

describe('App', () => {
  it('success', async () => {
    await page.goto('https://google.com')
    expect(4).toEqual(4)
  })
})
