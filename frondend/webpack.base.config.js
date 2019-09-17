const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const entry = path.resolve(process.cwd(), './index.jsx')

module.exports = {
  entry: entry,
  resolve: {
    extensions: ['.js', '.jsx', '.less']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader'
    }, {
      test: /\.less$/,
      use: ['style-loader', 'css-loader', {
        loader: 'less-loader',
        options: {
          javascriptEnabled: true
        }
      }]
    }, {
      test: /\.[png|jpg|jpeg|svg]$/,
      loader: 'url-loader',
      options: {
        limit: 8192
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), './template.html')
    })
  ]
}
