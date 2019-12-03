// jest-puppeteer.config.js
module.exports = {
  launch: {
    // dumpio: true,
    headless: false,
    devtools: false
  },
  server: {
    command: 'npm run start',
    port: 3400,
    launchTimeout: 60000
  },
  browserContext: 'default'
}
