import { spawnSync } from 'child_process'
import * as path from 'path'
import rimraf from 'rimraf'
import * as util from 'util'

import { invoke } from './api-extractor'

exec()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

async function exec() {
  await clean()
  bundle()
  invokeApiExtractor()

  async function clean() {
    const rm = util.promisify(rimraf)
    await rm('dist')
    await rm(path.join('node_modules', '.cache'))
  }

  function bundle() {
    spawnSync('yarn', ['tsdx', 'build', '--tsconfig', 'tsconfig.prod.json'], {
      stdio: 'inherit'
    })
  }

  function invokeApiExtractor() {
    invoke({
      localBuild: true,
      showVerboseMessages: true
    })
  }
}
