import React from 'react'
import { ConfigProvider, Layout, Icon } from 'antd'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import zhCN from 'antd/es/locale/zh_CN'
import Home from './Home'
import ApiDoc from './ApiDoc'
import Nav from './Nav'
import Contact from './Contact'

import './app.less'

let reactRouterBasename = '/'
/* 用于 e2e 测试 */
{
  const isInKarma = !!window.__karma__
  if (isInKarma) {
    reactRouterBasename = window.location.pathname
  }
}
/* END 用于 e2e 测试 */

function App () {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter basename={reactRouterBasename}>
        <Layout className='app'>
          <Layout.Header>
            <Nav />
          </Layout.Header>
          <Layout.Content className='p-5'>
            <Switch>
              <Route exact path='/'><Home /></Route>
              <Route path='/api-doc'><ApiDoc /></Route>
              <Route path='/contact'><Contact /></Route>
            </Switch>
          </Layout.Content>
          <Layout.Footer className='text-center siteFooter'>
            <span data-e2e-test-id='SITE_COPYRIGHT'>请勿上传违反中国大陆法律的图片，违者后果自负。Copyright Ⓒ 2019 tuchuang.space. All rights reserved.</span>
            <span className='ml-2'><a target='_blank' rel='noopener noreferrer' href='http://beian.gov.cn/portal/registerSystemInfo/'>浙ICP备19042875号-1</a></span>
            <span className='ml-2'><a target='_blank' rel='noopener noreferrer' href='https://github.com/Jiang-Xuan/tuchuang.space'><Icon type='github' /></a></span>
          </Layout.Footer>
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
