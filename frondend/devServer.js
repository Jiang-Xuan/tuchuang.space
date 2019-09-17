const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackDevConfig = require('./webpack.dev.config')

const PORT = 3400

const webpackDevServerOps = Object.assign({}, webpackDevConfig.devServer, {
  hot: true
})

const compiler = webpack(webpackDevConfig)

const server = new WebpackDevServer(compiler, webpackDevServerOps)

server.listen(PORT, () => {
  console.log(`webpack-dev-server is running at ${PORT} port.`)
})
