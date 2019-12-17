const { setup: setupDevServer } = require('jest-dev-server')

module.exports = async function globalSetup () {
  await setupDevServer({
    command: 'npm run start:selenium',
    launchTimeout: 60000,
    port: 3400
  })
}
