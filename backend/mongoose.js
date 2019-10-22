const mongoose = require('mongoose')

const { NODE_ENV } = process.env

let dbPath

if (NODE_ENV === 'beta') {
  // beta 环境
  dbPath = 'mongodb://localhost:27017/beta-tuchuang-space'
} else if (NODE_ENV === 'production') {
  // 生产环境
  dbPath = 'mongodb://localhost:27017/tuchuang-space'
} else {
  // 本地开发环境
  dbPath = 'mongodb://localhost:3402/test'
}

console.log(`mongoose.js dbPath: ${dbPath}, NODE_ENV: ${NODE_ENV}`)

module.exports.connectDb = function () {
  return new Promise((resolve, reject) => {
    const readyState = mongoose.connection.readyState

    if (readyState === 1) {
      resolve()
      return
    }
    mongoose.connect(dbPath, { useNewUrlParser: true })

    mongoose.connection.once('open', resolve)

    mongoose.connection.on('error', reject)
  })
}
