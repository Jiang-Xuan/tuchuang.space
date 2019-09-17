import React from 'react'
import { Upload, Tabs, Empty, ConfigProvider, Layout, Menu } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import CopyInput from './CopyInput'

import './app.less'

const FILE_MAX_SIZE = 10 * 1024 * 1024
const FILE_TYPE_ALLOWED = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']

function App () {
  const [fileList, setFileList] = React.useState([])

  const tabsPanes = fileList.map(({ url, status, name, size, type }, index) => {
    let result
    if (status === 'uploading') {
      result = <div>uploading</div>
    } else if (status === 'error') {
      result = <div>error</div>
    } else if (status === 'success') {
      result = (
        <>
          <CopyInput value={`<a href="${url}"></a>`} addonBefore='HTML' />
          <CopyInput className='mt-2' value={url} addonBefore='URL' />
          <CopyInput className='mt-2' value={`![](${url})`} addonBefore='markdown' />
          <CopyInput className='mt-2' value={`<img src="${url}" />`} addonBefore='image' />
          <CopyInput className='mt-2' value={`${url}/delete`} addonBefore={<span className='text-red'>移除图片</span>} />
        </>
      )
    } else {
      const errors = []
      if (size > FILE_MAX_SIZE) {
        errors.push(
          <li key='文件超大'>文件超过最大限制, 最大限制为 {FILE_MAX_SIZE / 1024 / 1024}M</li>
        )
      }

      if (!FILE_TYPE_ALLOWED.includes(type)) {
        errors.push(
          <li key='类型不对'>文件类型不符合要求, 允许的文件类型为 {FILE_TYPE_ALLOWED.join(', ')}</li>
        )
      }
      result = (
        <>
          <div>不能上传, 原因如下:</div>
          <ul>
            {errors.length ? errors : '未知错误'}
          </ul>
        </>
      )
    }
    return (
      <Tabs.TabPane tab={`image ${name}`} key={index}>
        {result}
      </Tabs.TabPane>
    )
  })

  const handleBeforeUpload = ({ size, type }) => {
    if (size > FILE_MAX_SIZE) {
      return false
    } else if (!FILE_TYPE_ALLOWED.includes(type)) {
      return false
    }

    return true
  }

  const handleChange = (event) => {
    console.log(event)
    const fileList = [...event.fileList]
    setFileList(fileList)
  }
  return (
    <ConfigProvider locale={zhCN}>
      <Layout className='app'>
        <Layout.Header>
          <div className='logo' />
          <Menu mode='horizontal' theme='dark' style={{ lineHeight: '64px' }}>
            <Menu.Item>Home</Menu.Item>
            <Menu.Item>About</Menu.Item>
            <Menu.Item>Contact</Menu.Item>
            <Menu.Item>Api</Menu.Item>
          </Menu>
        </Layout.Header>
        <Layout.Content className='p-5'>
          <div className='upload'>
            <Upload.Dragger
              beforeUpload={handleBeforeUpload}
              multiple
              onChange={handleChange}
              accept='.png, .jpg, .jpeg, .svg, .webp'
              action='/api/1.0.0/image'
            >
              <p className='mt-4'>点击或者是拖拽文件到这里来上传</p>
              <small className='d-block mb-4'>允许 .png, .jpg, .jpeg, .svg, .webp 后缀的文件</small>
            </Upload.Dragger>
          </div>
          <div className='result mt-3'>
            {tabsPanes.length ? (
              <Tabs>
                {tabsPanes}
              </Tabs>
            ) : (
              <Empty />
            )}
          </div>
        </Layout.Content>
        <Layout.Footer className='text-center'>请勿上传违反中国大陆法律的图片，违者后果自负。Copyright Ⓒ 2019 jiangxuan. All rights reserved.</Layout.Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default App
