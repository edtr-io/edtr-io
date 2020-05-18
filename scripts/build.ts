import { spawnSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import rimraf from 'rimraf'
import * as util from 'util'

import { invoke } from './api-extractor'

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
      await cleanTypes()
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
      'yarn',
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
      localBuild: false,
      showVerboseMessages: true,
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

  async function generateEntries() {
    const readFile = util.promisify(fs.readFile)
    const writeFile = util.promisify(fs.writeFile)
    const mkDir = util.promisify(fs.mkdir)
    const fsOptions = { encoding: 'utf-8' as BufferEncoding }

    const packageJson = await readFile(
      path.join(process.cwd(), 'package.json'),
      { encoding: 'utf-8' }
    )
    const { main, module } = JSON.parse(packageJson)
    await Promise.all(
      ['beta', 'internal'].map(async (release) => {
        const dir = path.join(process.cwd(), release)
        try {
          await mkDir(dir)
        } catch (err) {
          if (err.code !== 'EEXIST') throw err
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
