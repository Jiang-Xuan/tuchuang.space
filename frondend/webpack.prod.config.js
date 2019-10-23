const webpackMerge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config')

const { DEPLOY_TYPE } = process.env

const publicPath = DEPLOY_TYPE === 'beta'
  ? 'https://beta-assets-tuchuang-space.oss-cn-hangzhou.aliyuncs.com'
  : 'https://assets-tuchuang-space.oss-cn-hangzhou.aliyuncs.com'

console.log(`webpack.prod.config.js  当前发布静态资源的环境为: DEPLOY_TYPE: ${DEPLOY_TYPE}, publicPath: ${publicPath}`)

const webpackDevConfig = {
  devtool: 'source-map',
  output: {
    publicPath,
    filename: '[chunkhash].bundle.js'
  },
  mode: 'production',
  module: {

  }
}

module.exports = webpackMerge(webpackBaseConfig, webpackDevConfig)
