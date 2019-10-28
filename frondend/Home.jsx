import React from 'react'
import { Upload, Tabs, Empty } from 'antd'
import CopyInput from './CopyInput'
import { FILE_MAX_SIZE, FILE_TYPE_ALLOWED } from '../shared/constants'

import './home.less'

const uploadUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:4300/api/v1/images' : '/api/v1/images'

const Home = () => {
  const [fileList, setFileList] = React.useState([])

  const tabsPanes = fileList.map(({ url, status, name, size, type, response }, index) => {
    let result
    if (status === 'uploading') {
      result = <div>uploading</div>
    } else if (status === 'error') {
      result = <div>error</div>
    } else if (status === 'done') {
      const { deleteKey, cdnPath } = response.images[name]
      result = (
        <>
          <CopyInput data-e2e-test-id='UPLOAD_RESULT_HTML' value={`<a href="${cdnPath}"></a>`} addonBefore='HTML' />
          <CopyInput data-e2e-test-id='UPLOAD_RESULT_URL' className='mt-2' value={cdnPath} addonBefore='URL' />
          <CopyInput data-e2e-test-id='UPLOAD_RESULT_MARKDOWN' className='mt-2' value={`![](${cdnPath})`} addonBefore='markdown' />
          <CopyInput data-e2e-test-id='UPLOAD_RESULT_IMAGE' className='mt-2' value={`<img src="${cdnPath}" />`} addonBefore='image' />
          <CopyInput data-e2e-test-id='UPLOAD_RESULT_DELETE' className='mt-2' value={deleteKey} addonBefore={<span className='text-red'>移除图片</span>} />
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
          <li key='类型不对'>格式不正确</li>
        )
      }
      result = (
        <>
          <div>不能上传 {name}, 原因如下:</div>
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
    <>
      <div className='upload' data-e2e-test-id='UPLOAD_CLICK_AREA'>
        <Upload.Dragger
          beforeUpload={handleBeforeUpload}
          multiple
          onChange={handleChange}
          accept='.png, .jpg, .jpeg, .svg, .webp'
          action={uploadUrl}
          name='images'
        >
          <p className='mt-4'>点击或者是拖拽文件到这里来上传</p>
          <small className='d-block mb-4'>允许 .png, .jpg, .jpeg, .svg, .webp 后缀的文件</small>
        </Upload.Dragger>
      </div>
      <div className='result mt-3' data-e2e-test-id='UPLOAD_RESULTS'>
        {tabsPanes.length ? (
          <Tabs>
            {tabsPanes}
          </Tabs>
        ) : (
          <Empty />
        )}
      </div>
    </>
  )
}

export default Home
