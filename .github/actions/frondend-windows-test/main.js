const core = require('@actions/core')
const github = require('@actions/github')

try {
  core.setOutput('test', (new Date()).toLocaleTimeString())
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`the event payload: ${payload}`)
} catch (error) {
  core.setFailed(error.message)
}
