const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const app = require('./app')

const PORT = process.env.PORT || 4300

app.listen(PORT, () => {
  console.log(`server is listening at ${PORT} port`)
})
