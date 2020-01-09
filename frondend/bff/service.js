const app = require('./app')
const { BFF_LISTEN_PORT } = require('../../self-hosted.config').BFF

const DEFAULT_BFF_LISTEN_PORT = 4303

const PORT = BFF_LISTEN_PORT || DEFAULT_BFF_LISTEN_PORT

app.listen(PORT, () => {
  console.log(`server is listening at ${PORT} port`)
})
