# tuchuang.space

**beta, 还不适用于生产环境**

图床系统

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

## 一期页面功能需求点

1. 无需登录
2. 上传图片, 获取图片的链接
3. api 可以上传图片
4. 允许的图片后缀为 `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`
5. 页面标识用户上传的图片需要符合中华人民共和国法律, 否则用户自己负责, 网站不承担任何责任.
6. 响应式站点

## 一期技术需求点

1. 图片的限制为 10M
2. 图片一次允许上传 10 张
3. 同一个 cookie 每天允许上传 1000 张
4. 同一个 ip 每天允许上传 10000 张
5. 图片走 cdn
6. 限制 cdn 的带宽为 100M
7. cdn 每天的流量上限为 1000G

## 技术选型

### 前端

_JavaScript_

* 底层框架 react
* ui 框架 ant.design
* 路由框架 react-router

### 后端

_Node.js_

* 底层框架 Express.js
* 处理文件上传框架 `multipart/form-data` https://github.com/expressjs/multer

### 服务器

_阿里云_

* 阿里云弹性服务器

