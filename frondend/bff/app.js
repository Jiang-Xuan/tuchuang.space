const path = require('path')
const express = require('express')

const app = express()

app.get('*', (req, res) => {
  res.sendFile(app._indexFilePath || path.resolve(__dirname, './index.html'))
})

module.exports = app
