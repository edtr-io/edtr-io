import { spawnSync } from 'child_process'
import * as path from 'path'
import * as request from 'request'

const bucket = 'gs://storybook.edtr.io'
exec()

async function exec() {
  const secret = process.env['CF_TOKEN']
  if (!secret) return
  const commit = process.env['GITHUB_SHA']
  if (!commit) return
  const rawRef = process.env['GITHUB_REF']
  if (!rawRef) return
  const ref = encodeURIComponent(rawRef.replace('refs/heads/', ''))
  upload(commit)

  const previousCommit = await new Promise<string | null>((resolve, reject) => {
    request.get(
      `https://api.cloudflare.com/client/v4/accounts/0e24f0f2e24dfe914ff15504899b0156/storage/kv/namespaces/f2d4ac58853245febc094ea6005a92e0/values/${ref}`,
      {
        headers: {
          Authorization: `Bearer ${secret}`
        }
      },
      (error, res) => {
        if (error) return reject(error)
        if (res.statusCode === 404) return resolve(null)
        return resolve(res.body)
      }
    )
  })
  if (previousCommit) {
    spawnSync('gsutil', ['rm', '-r', `${bucket}/${commit}/`], {
      stdio: 'inherit'
    })
  }
  await new Promise<void>((resolve, reject) => {
    request.put(
      `https://api.cloudflare.com/client/v4/accounts/0e24f0f2e24dfe914ff15504899b0156/storage/kv/namespaces/f2d4ac58853245febc094ea6005a92e0/values/${ref}`,
      {
        headers: {
          Authorization: `Bearer ${secret}`
        },
        body: commit
      },
      error => {
        if (error) return reject(error)
        return resolve()
      }
    )
  })
}

function upload(commit: string) {
  const source = path.join(__dirname, '..', 'dist')
  const dest = `${bucket}/${commit}/`

  const { status } = spawnSync('gsutil', ['ls', dest])
  if (status === 0) {
    console.log('Destination folder already exists')
    return
  }
  spawnSync('gsutil', ['-m', 'cp', '-r', path.join(source, '*'), dest], {
    stdio: 'inherit'
  })
}
