const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const entry = path.resolve(process.cwd(), './index.jsx')

const { DEPLOY_TYPE, NODE_ENV } = process.env

let ga

if (DEPLOY_TYPE === 'beta') {
  ga = `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-151199887-2"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-151199887-2');
</script>

`
} else if (NODE_ENV !== 'development') {
  ga = `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-151199887-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-151199887-1');
</script>
`
}

console.log(`webpack.base.config.js deployType: ${DEPLOY_TYPE}, ga(UA-151199887-2 匹配 beta 环境, UA-151199887-1 匹配 production 环境): ${ga}`)

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
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
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
      template: path.resolve(process.cwd(), './template.html'),
      ga
    })
  ]
}
