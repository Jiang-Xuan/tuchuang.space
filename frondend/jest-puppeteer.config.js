// jest-puppeteer.config.js
module.exports = {
  launch: {
    // dumpio: true,
    // https://github.com/Jiang-Xuan/tuchuang.space/issues/36#issuecomment-561012725
    headless: false,
    devtools: true
  },
  server: {
    command: 'npm run start',
    port: 3400,
    launchTimeout: 60000
  },
  browserContext: 'default'
}
