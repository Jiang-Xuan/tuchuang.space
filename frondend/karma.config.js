// Karma configuration
// Generated on Sun Sep 29 2019 18:30:42 GMT+0800 (China Standard Time)
const os = require('os')
const { cloneDeep } = require('lodash')
const webpackDevConfig = cloneDeep(require('./webpack.dev.config'))

delete webpackDevConfig.entry

function isSingleRun () {
  return process.env.KARMA_SINGLE_MODE === 'on'
}

const browsers = ['Chrome', 'Firefox']

// if (os.platform() === 'darwin') {
//   browsers.push('Safari')
// }

if (os.platform() === 'win32') {
  browsers.push('IE')
}

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    plugins: ['karma-mocha', 'karma-chai', 'karma-webpack', 'karma-chrome-launcher', 'karma-firefox-launcher', 'karma-ie-launcher', 'karma-safari-launcher'],

    // list of files / patterns to load in the browser
    files: [
      { pattern: './e2e/karma.test.js', watched: false }
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './e2e/karma.test.js': ['webpack']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // webpack 的配置文件
    webpack: webpackDevConfig,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: isSingleRun(),

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1
  })
}
