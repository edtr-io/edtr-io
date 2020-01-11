import { spawnSync } from 'child_process'
import * as path from 'path'
import rimraf from 'rimraf'
import * as util from 'util'

import { invoke } from './api-extractor'

exec()

async function exec() {
  await clean()
  emitDeclarations()
  invokeApiExtractor()

  async function clean() {
    const dist = path.join('dist')
    const rm = util.promisify(rimraf)
    await rm(dist)
  }

  function emitDeclarations() {
    spawnSync('yarn', ['tsc', '--project', 'src'], {
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
