import { exec } from '@edtr-io/internal__demo/__helpers__/deploy'
import { spawnSync } from 'child_process'

/* eslint-disable @typescript-eslint/no-var-requires, import/no-commonjs */
const { version } = require('../lerna.json')
const secret = require('./cloudflare.secret.json')

spawnSync(
  'yarn',
  ['lerna', 'run', '--scope=@edtr-io/internal__demo', 'build'],
  {
    stdio: 'inherit',
    env: {
      TITLE: version
    }
  }
)

exec({
  secret,
  commit: getCommit(),
  ref: version
}).catch(e => {
  console.log('Failed', e)
  process.exit(1)
})

function getCommit() {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], {
    stdio: 'pipe'
  })
  return String(result.stdout).trim()
}
