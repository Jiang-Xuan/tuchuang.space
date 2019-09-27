const express = require('express')

const ApiRouter = require('./version_one_api_router')

const app = express()

app.use(express.json())

app.use('/api', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Methods', 'post, get, options')
  next()
}, ApiRouter)

module.exports = app
