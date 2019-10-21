const webpackMerge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config')

const { DEPLOY_TYPE } = process.env

const publicPath = DEPLOY_TYPE === 'beta'
  ? 'https://beta-assets-tuchuang-space.oss-cn-hangzhou.aliyuncs.com'
  : 'assets-tuchuang-space.oss-cn-hangzhou.aliyuncs.com'

const webpackDevConfig = {
  devtool: 'source-map',
  output: {
    publicPath
  },
  mode: 'production',
  module: {

  }
}

module.exports = webpackMerge(webpackBaseConfig, webpackDevConfig)
