const mongoose = require('mongoose')

module.exports.connectDb = function () {
  return new Promise((resolve, reject) => {
    const readyState = mongoose.connection.readyState

    if (readyState === 1) {
      resolve()
      return
    }
    mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })

    mongoose.connection.once('open', resolve)

    mongoose.connection.on('error', reject)
  })
}
