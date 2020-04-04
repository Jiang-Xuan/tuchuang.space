const app = require('./app')
const config = require('../../config')

const PORT = config.bff.listenPort

app.listen(PORT, () => {
  console.log(`server is listening at ${PORT} port`)
})
