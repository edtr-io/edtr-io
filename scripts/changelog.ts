import { generateChangelog } from '@splish-me/changelog'
import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

const writeFile = util.promisify(fs.writeFile)

exec().then(() => {})

async function exec(): Promise<void> {
  const content = await generateChangelog([
    {
      tagName: '0.1.0',
      date: '2019-02-08',
      description: 'Initial release'
    }
  ])

  await writeFile(path.join(__dirname, '..', 'CHANGELOG.md'), content)
}
