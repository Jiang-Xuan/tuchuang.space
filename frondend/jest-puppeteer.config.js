// jest-puppeteer.config.js
module.exports = {
  launch: {
    dumpio: true,
    headless: false,
    devtools: process.env.CI !== 'true'
  },
  browserContext: 'default'
}
