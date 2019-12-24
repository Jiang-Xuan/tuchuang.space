const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config')

const SELENIUM = !!process.env.SELENIUM

console.log(SELENIUM)

const webpackDevConfig = {
  devtool: 'source-map',
  mode: 'development',
  module: {

  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.SELENIUM': JSON.stringify(SELENIUM),
      'process.env.SELENIUM_MOCK_SERVER_URL': JSON.stringify(process.env.SELENIUM_MOCK_SERVER_URL)
    })
  ]
}

module.exports = webpackMerge(webpackBaseConfig, webpackDevConfig)
