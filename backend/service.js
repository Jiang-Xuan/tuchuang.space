const app = require('./app')

const PORT = process.env.PORT || 4300

app.listen(PORT, () => {
  console.log(`server is listening at ${PORT} port`)
})
