const webpackMerge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config')
const {
  frondend: {
    asset: {
      webpackPublicPath
    }
  }
} = require('../config')

const { DEPLOY_TYPE } = process.env

console.log(`webpack.prod.config.js  当前发布静态资源的环境为: DEPLOY_TYPE: ${DEPLOY_TYPE}, publicPath: ${webpackPublicPath}`)

const webpackDevConfig = {
  devtool: 'source-map',
  output: {
    publicPath: webpackPublicPath,
    filename: '[chunkhash].bundle.js'
  },
  mode: 'production',
  module: {

  }
}

module.exports = webpackMerge(webpackBaseConfig, webpackDevConfig)
