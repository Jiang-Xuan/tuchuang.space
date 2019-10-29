<p align="center">
  <a href="http://tuchuang.space">
    <img width="200" src="https://beta.i.tuchuang.space/3c7185dd08b19791c4141f089616952f.png">
  </a>
</p>

<h1 align="center">tuchuang.space</h1>


<p align="center">

测试驱动开发的图床系统. [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

</p>

## 功能

* 提供 RESTful API
* 提供删除上传图片功能

## 如何贡献

_接受 issue, 对于 pr 很谨慎, 如果有疑问请提 issue 或者 mail 至[这里](mailto:645762213@qq.com)_

## Wiki

### Motivation

* 为了锻炼自己架构一个系统的能力
* 锻炼自己的 React 能力
* 锻炼自己的 ant.design 的框架使用能力
* 锻炼自己的 RESTful 的能力
* 锻炼自己的 Node.js 能力
* 锻炼自己 响应式设计 & Coding 的能力

### 测试规范

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

### 项目技术选型

#### 前端

* bundler webpack
* 开发环境 webpack-dev-server
* 测试框架 jest
* 底层框架 react
* ui 框架 ant.design
* 路由框架 react-router

##### bff 层

* 底层框架 Express.js
* 测试框架 jest, supertest
* 进程守护工具 pm2

#### 后端

* 底层框架 Express.js
* 处理文件上传框架 `multipart/form-data` https://github.com/expressjs/multer
* 开发环境工具 nodemon
* 测试框架 jest, supertest
* 进程守护工具 pm2
* 数据库连接工具 mongoose

#### 数据库

* mongodb

### [Github Actions Secrets](https://github.com/Jiang-Xuan/tuchuang.space/settings/secrets) 解读

| Name | description | notes |
|------|-------------|------ |
| BACKEND_E2E_TEST_ALI_OSS_ACCESS_KEY_ID | 用于后端服务的 e2e 测试的 阿里云 OSS 访问秘钥的 id | |
| BACKEND_E2E_TEST_ALI_OSS_ACCESS_KEY_SECRET | 用于后端服务的 e2e 测试的 阿里云 OSS 访问秘钥的 secret | |
| BACKEND_STORE_IMAGES_ALI_OSS_ACCESS_KEY_ID | 用于存储图片的 阿里云 OSS 的访问秘钥的 key | 自动化部署至生产环境所使用的 |
| BACKEND_STORE_IMAGES_ALI_OSS_ACCESS_KEY_SECRET | 用于存储图片的 阿里云 OSS 的访问秘钥的 secret | 自动化部署至生产环境所使用的 |
| BETA_DEPLOY_HOST | beta 环境服务器的 ip 地址 | 传递给 pm2-deploy |
| BETA_DEPLOY_PATH | beta 环境服务器的部署地址 | 传递给 pm2-deploy |
| BETA_DEPLOY_SSH_PRIVATE_KEY | beta 环境服务器的 ssh 私有 key | 用户自动登录 beta 服务器 |
| BETA_DEPLOY_USER | beta 环境服务器的部署用户名 | |
| BETA_HOST_KEY | beta 环境服务器的 ssh 连接认证 key | 用于填入 github action 环境主机的 `known_hosts` 文件中 |
| F2E_ASSETS_ALI_OSS_ACCESS_KEY_ID | 用于存储前端静态资源的 阿里云 OSS 的访问秘钥的 key | |
| F2E_ASSETS_ALI_OSS_ACCESS_KEY_SECRET | 用于存储前端静态资源的 阿里云 OSS 的访问秘钥的 secret | |
| PROD_DEPLOY_HOST | production 环境服务器的 ip 地址 | 传递给 pm2-deploy |
| PROD_DEPLOY_PATH | production 环境服务器的部署地址 | 传递给 pm2-deploy |
| PROD_DEPLOY_SSH_PRIVATE_KEY | production 环境服务器的 ssh 私有 key | 用户自动登录 production 服务器 |
| PROD_DEPLOY_USER | production 环境服务器的部署用户名 | |
| PROD_HOST_KEY | production 环境服务器的 ssh 连接认证 key | 用于填入 github action 环境主机的 `known_hosts` 文件中 |

### Github Actions 中的一些 ENV 变量解读

| name | description | note | code location example |
|------|-------------|----- |---------------|
| CI | 用于标识当前的环境是处在 CI 环境中 | 所有的 workflow 中都应该设置该变量 | https://github.com/Jiang-Xuan/tuchuang.space/blob/d4e4a021529446fbdb6c86019b92b4bde17027d2/.github/workflows/deploy_to_beta.yml#L30  |
| KARMA_SINGLE_MODE | 用于配置 karma 是否运行在 CI 模式下 | [传递给 karma 的配置文件, 指示 karma 在测试执行完毕之后自动退出](https://karma-runner.github.io/4.0/config/configuration-file.html) | https://github.com/Jiang-Xuan/tuchuang.space/blob/d4e4a021529446fbdb6c86019b92b4bde17027d2/.github/workflows/deploy_to_beta.yml#L31 |
| DEPLOY_TYPE | 用于配置当前的部署环境, beta 将所有的资源部署至 beta 环境, 以及 bff 层 downloadIndexHtml.js 的下载地址 | **该变量比较特殊, 指导着后端的图片上传, 前端的静态资源地址, 并且该变量当前的实现方式很乱, 不太好管理, 动该变量的时候必须测试到位** **TODO: 增强该变量的管理** | https://github.com/Jiang-Xuan/tuchuang.space/blob/d4e4a021529446fbdb6c86019b92b4bde17027d2/.github/workflows/deploy_to_beta.yml#L124 |

### 开发环境, CI/CD 解读

### 本地开发环境

* 图片上传至 localdevelopment.i.tuchuang.space cdn 环境
* 前端静态资源 采用 webpack-dev-server 的本地打包资源

### CI

* 代码 push 将执行 `browsers.yml`, `nodejs.yml`, `dump_actions_context.yml` github actions workflow

### CD

#### beta 环境

代码 merge 至 master 分支将执行 `deploy_to_beta.yml` github actions workflow, 将代码部署至 beta 服务器, `https://beta.tuchuang.space`, `https://www.beta.tuchuang.space` 域名下

#### production 环境

以字母 `v` 开头的 tag 将执行 `deploy_to_prod.yml` github actions workflow, 将代码部署至 production 服务器, `https://tuchuang.space`, `https://www.tuchuang.space` 域名下

## Roadmap

_尚未确定, 容易变化_

* [VSCODE 插件上传图片](https://github.com/Jiang-Xuan/tuchuang.space/issues/5)
* [第三方部署](https://github.com/Jiang-Xuan/tuchuang.space/issues/31)
* [用户登录注册系统, 支持用户的上传文件和查看文件](https://github.com/Jiang-Xuan/tuchuang.space/issues/3)
* [用户级别的 api](https://github.com/Jiang-Xuan/tuchuang.space/issues/4)
