const path = require('path')
const config = require('../config')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const app = require('./app')

const PORT = config.backend.listenPort

app.listen(PORT, () => {
  console.log(`server is listening at ${PORT} port`)
})
