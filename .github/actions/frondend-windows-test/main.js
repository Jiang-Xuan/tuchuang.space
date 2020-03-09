const { exec } = require('child_process')
const core = require('@actions/core')
const github = require('@actions/github')

const command = `
cd .\\frondend
call yarn cache clean || exit 1
call yarn install || exit 1
call yarn run test:karma || exit 1
call yarn run test:pptr || exit 1
call yarn run test:selenium:windows || exit 1
`

try {
  const commandChildProcess = exec(command)

  commandChildProcess.stdout.on('data', (data) => {
    console.log(data)
  })
  commandChildProcess.stderr.on('data', (data) => {
    console.log(data)
  })
} catch (error) {
  console.log(error.message)
}
