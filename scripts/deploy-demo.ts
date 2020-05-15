import { exec, setCommit } from '@edtr-io/internal__demo/__helpers__/deploy'
import { spawnSync } from 'child_process'

/* eslint-disable @typescript-eslint/no-var-requires, import/no-commonjs */
const { version } = require('../lerna.json')
const secret = require('./cloudflare.secret.json')

const commit = getCommit()

exec({
  secret,
  commit,
  ref: version,
  removePreviousCommit: false,
})
  .catch((e) => {
    console.log('Failed', e)
    process.exit(1)
  })
  .then(() => {
    return setCommit({
      secret,
      ref: 'latest',
      commit,
    })
  })

function getCommit() {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], {
    stdio: 'pipe',
  })
  return String(result.stdout).trim()
}
