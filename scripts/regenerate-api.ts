import { spawnSync } from 'child_process'
import fs from 'fs'
import * as path from 'path'
import rimraf from 'rimraf'
import * as util from 'util'

import { invoke } from './api-extractor'
import { yarn } from './yarn'

exec()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

async function exec() {
  let i = 0
  while (i++ < 3) {
    try {
      await clean()
      bundle()
      invokeApiExtractor()
      await generateEntries()
      return
    } catch (e) {
      console.log('Failed attempt', i, e)
    }
  }
  throw new Error('exec failed')

  async function clean() {
    const rm = util.promisify(rimraf)
    await rm('dist')
    await rm(path.join('node_modules', '.cache'))
  }

  function bundle() {
    const { status, error } = spawnSync(
      yarn,
      ['tsdx', 'build', '--tsconfig', 'tsconfig.prod.json'],
      {
        stdio: 'inherit',
      }
    )
    if (status !== 0) {
      if (error) throw error
      throw new Error('build failed')
    }
  }

  function invokeApiExtractor() {
    invoke({
      localBuild: true,
      showVerboseMessages: true,
    })
  }

  async function generateEntries() {
    const readFile = util.promisify(fs.readFile)
    const writeFile = util.promisify(fs.writeFile)
    const mkDir = util.promisify(fs.mkdir)
    const fsOptions = { encoding: 'utf-8' as BufferEncoding }

    const packageJson = await readFile(
      path.join(process.cwd(), 'package.json'),
      { encoding: 'utf-8' }
    )
    const { main, module } = JSON.parse(packageJson) as {
      main: string
      module: string
    }
    await Promise.all(
      ['beta', 'internal'].map(async (release) => {
        const dir = path.join(process.cwd(), release)
        try {
          await mkDir(dir)
        } catch (err: unknown) {
          if ((err as { code: string }).code !== 'EEXIST') throw err
        }
        await writeFile(
          path.join(dir, 'package.json'),
          JSON.stringify(
            {
              main: `../${main}`,
              module: `../${module}`,
              typings: `../api/${release}.d.ts`,
            },
            null,
            2
          ),
          fsOptions
        )
      })
    )
  }
}
