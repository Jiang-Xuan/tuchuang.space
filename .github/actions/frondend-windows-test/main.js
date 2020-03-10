const { exec } = require('child_process')
const core = require('@actions/core')
const github = require('@actions/github')

try {
  console.log(process.env)
  const commandChildProcess = exec([
    'dir',
    'cd .\\frondend',
    'yarn cache clean',
    'yarn install',
    'yarn run test:pptr',
    'yarn run test:selenium:windows',
    'yarn run test:karma'
  ].join(' && '), {
    env: {
      ...process.env,
      // CI 模式
      CI: 'true'
      // karma 只运行一次, 然后程序退出
      KARMA_SINGLE_MODE: 'on'
    }
  })

  commandChildProcess.stdout.on('data', (data) => {
    console.log(data)
  })
  commandChildProcess.stderr.on('data', (data) => {
    console.log(data)
  })

  commandChildProcess.on('exit', (single) => {
    process.exit(single)
  })
} catch (error) {
  console.log(error.message)
}
