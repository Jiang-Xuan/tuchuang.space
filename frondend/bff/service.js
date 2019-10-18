const app = require('./app')

const PORT = process.env.PORT || 4303

app.listen(PORT, () => {
  console.log(`server is listening at ${PORT} port`)
})
