import React from 'react'
import { Table } from 'antd'

const { Column } = Table

function ApiDoc (props) {
  const postImagesParams = [{
    name: 'images',
    type: 'array',
    isRequired: '是',
    defaultValue: ' - ',
    description: '图片数组'
  }]
  const postImagesResponse = [{
    name: 'images',
    type: 'object',
    isRequired: '是',
    description: '上传的所有图片的信息'
  }, {
    name: 'images.<imageName>',
    type: 'object',
    isRequired: '是',
    description: '上传的某一个图片的信息'
  }, {
    name: 'images.<imageName>.cdnPath',
    type: 'string',
    isRequired: '是',
    description: '上传的图片的 cdn 地址'
  }, {
    name: 'images.<imageName>.ext',
    type: 'string',
    isRequired: '是',
    description: '上传的图片的扩展名'
  }, {
    name: 'images.<imageName>.fileName',
    type: 'string',
    isRequired: '是',
    description: '上传的图片的被处理之后的命名'
  }, {
    name: 'images.<imageName>.mimetype',
    type: 'string',
    isRequired: '是',
    description: '上传的图片的 mimetype'
  }, {
    name: 'images.<imageName>.originalName',
    type: 'string',
    isRequired: '是',
    description: '上传的图片的原始命名, 和 image.<imageName> 一致'
  }, {
    name: 'images.<imageName>.md5',
    type: 'string',
    isRequired: '是',
    description: '上传的图片的 md5 哈希'
  }, {
    name: 'images.<imageName>.deleteKey',
    type: 'string',
    isRequired: '是',
    description: '上传的图片的移除 key, 传递给删除图片接口'
  }]

  const deleteImagesParams = [{
    name: 'key',
    type: 'string',
    isRequired: '是',
    defaultValue: ' - ',
    description: '移除图片的 key, 上传图片时可以获得'
  }]

  return (
    <div>
      <strong>接口严格遵循 RESTFul 风格</strong>

      <h2>images</h2>

      <h3>POST /api/v1/images</h3>

      <p>接口说明: 上传图片</p>

      <p>参数: </p>
      <strong>请求 content-type: multipart/form-data</strong>
      <Table rowKey='name' pagination={false} size='small' dataSource={postImagesParams}>
        <Column dataIndex='name' title='参数名' />
        <Column dataIndex='type' title='参数类型' />
        <Column dataIndex='isRequired' title='是否必须' />
        <Column dataIndex='defaultValue' title='默认值' />
        <Column dataIndex='description' title='描述' />
      </Table>

      <p>响应: </p>
      <strong>响应 content-type: application/json</strong>
      <Table rowKey='name' pagination={false} size='small' dataSource={postImagesResponse}>
        <Column dataIndex='name' title='参数名' />
        <Column dataIndex='type' title='参数类型' />
        <Column dataIndex='isRequired' title='是否必须' />
        <Column dataIndex='description' title='描述' />
      </Table>

      <h3>DELETE /api/v1/images</h3>

      <p>接口说明: 删除图片</p>

      <p>参数:</p>
      <strong>请求 content-type: application/json</strong>
      <Table rowKey='name' pagination={false} size='small' dataSource={deleteImagesParams}>
        <Column dataIndex='name' title='参数名' />
        <Column dataIndex='type' title='参数类型' />
        <Column dataIndex='isRequired' title='是否必须' />
        <Column dataIndex='defaultValue' title='默认值' />
        <Column dataIndex='description' title='描述' />
      </Table>

      <p>响应:</p>
      <strong>HTTP CODE: 204</strong>
      <strong>响应 content-type: application/json</strong>
      <Table rowKey='name' pagination={false} size='small' dataSource={[]}>
        <Column dataIndex='name' title='参数名' />
        <Column dataIndex='type' title='参数类型' />
        <Column dataIndex='isRequired' title='是否必须' />
        <Column dataIndex='description' title='描述' />
      </Table>
    </div>
  )
}

ApiDoc.propTypes = {
}

export default ApiDoc
