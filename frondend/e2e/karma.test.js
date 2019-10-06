/* eslint-env mocha */
/* global expect */

import React from 'react'
import ReactDom from 'react-dom'
import App from '../App'

const E2E_TEST_ID_ATTR_NAME = 'data-e2e-test-id'

describe('App', () => {
  before(() => {
    const div = document.createElement('div')
    div.id = 'root'
    document.body.append(div)
    ReactDom.render(<App />, div)
  })
  // after(() => {
  //   ReactDom.unmountComponentAtNode(document.querySelector('#root'))
  // })
  it('有且仅有一个 input[type="file"] 输入框', () => {
    const fileInput = document.querySelector('input[type="file"]')
    expect(fileInput).to.be.an.instanceOf(window.HTMLInputElement)
  })

  it('正确的站点 copyright', () => {
    const ele = document.querySelectorAll(`[${E2E_TEST_ID_ATTR_NAME}='SITE_COPYRIGHT']`)
    expect(ele.length).equal(1)
    expect(ele[0].textContent).equal('请勿上传违反中国大陆法律的图片，违者后果自负。Copyright Ⓒ 2019 tuchuang.space. All rights reserved.')
  })
})
