module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: '4.2.0',
      skipMD5: true
    },
    autoStart: false
  }
}
