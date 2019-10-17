const webpackMerge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config')

const webpackDevConfig = {
  devtool: 'source-map',
  mode: 'production',
  module: {

  }
}

module.exports = webpackMerge(webpackBaseConfig, webpackDevConfig)
