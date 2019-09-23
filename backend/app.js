const express = require('express')
const multer = require('multer')

const ApiRouter = require('./version_one_api_router')

const app = express()

const PORT = 4300

app.use(`/api`, (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
}, ApiRouter)

app.listen(PORT, () => {
  console.log(`server is listening at ${PORT} port`)
})
