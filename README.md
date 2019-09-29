# tuchuang.space

**beta, 还不适用于生产环境**

图床系统

## 测试规范

1. 测试有时候需要代码提供一些钩子, 一般不会提供给 生产环境/开发环境 使用, 方法以 `_` 开头, 比如 `post.images.test.js` 文件中对于 `config.js` 文件的测试

```js
/**
 * 设置 oss 客户端
 * **Notes** 该方法只提供给 e2e 测试, 一般不会在程序中调用, 所以该函数以 _ 开头
 * @param {{}} ossClient ali-oss 客户端
 */
_setOssClient (ossClient) {
  this.ossClient = ossClient
}
```

## Motivation

1. 为了锻炼自己架构一个系统的能力
2. 最简单的一个系统
3. 锻炼自己的 React 能力
4. 锻炼自己的 ant.design 的框架使用能力
5. 锻炼自己的 RESTful 的能力
6. 锻炼自己的 Node.js 能力
7. 锻炼自己 响应式设计 & Coding 的能力

## 同品调研

1. sm.ms
2. 各大云厂商都有提供免费的额度
3. 新浪图床, 需要登录

## Requirement

1. 阿里云账号
2. 一个域名, tuchuang.space

## 技术选型

### 前端

_JavaScript_

* bundler webpack
* 开发环境 webpack-dev-server
* 测试框架 jest
* 底层框架 react
* ui 框架 ant.design
* 路由框架 react-router

### 后端

_Node.js_

* 底层框架 Express.js
* 处理文件上传框架 `multipart/form-data` https://github.com/expressjs/multer
* 开发环境工具 nodemon
* 进程守护工具 pm2
* 数据库连接工具 mongoose

### 数据库

_Mongodb_

### 服务器

_阿里云_

* 阿里云弹性服务器

