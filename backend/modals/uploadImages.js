const mongoose = require('mongoose')

const uploadImagesSchema = new mongoose.Schema({
  ip: String,
  ossAddress: String,
  cdnAddress: String,
  md5: String,
  createTime: Date,
  originalname: String
})

module.exports = mongoose.model('uploadImages', uploadImagesSchema)
