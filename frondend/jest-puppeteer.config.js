// jest-puppeteer.config.js
module.exports = {
  launch: {
    dumpio: true,
    headless: process.env.CI === 'true',
    devtools: process.env.CI !== 'true'
  },
  browserContext: 'default'
}
