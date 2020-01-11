import { spawnSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import rimraf from 'rimraf'
import * as util from 'util'

import { invoke } from './api-extractor'

exec()

async function exec() {
  bundle()
  invokeApiExtractor()
  await cleanTypes()

  function bundle() {
    spawnSync('yarn', ['tsdx', 'build', '--tsconfig', 'tsconfig.prod.json'], {
      stdio: 'inherit'
    })
  }

  function invokeApiExtractor() {
    invoke({
      localBuild: false,
      showVerboseMessages: true
    })
  }

  async function cleanTypes() {
    const readDir = util.promisify(fs.readdir)
    const stat = util.promisify(fs.stat)
    const rm = util.promisify(rimraf)

    const dist = path.join('dist')
    const files = await readDir(dist)
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i]
      const file = path.join(dist, fileName)
      const info = await stat(file)
      if (info && info.isDirectory()) {
        await rm(file)
      }
      if (path.extname(fileName) === '.ts' && fileName !== 'index.d.ts') {
        await rm(file)
      }
      if (path.extname(fileName) === '.map') {
        await rm(file)
      }
    }
  }
}
