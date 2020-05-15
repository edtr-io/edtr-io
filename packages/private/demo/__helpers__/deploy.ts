import { spawnSync } from 'child_process'
import * as path from 'path'
import * as request from 'request'

const bucket = 'gs://storybook.edtr.io'

export async function exec({
  secret,
  commit,
  ref: rawRef,
  removePreviousCommit,
}: Partial<Payload> & { removePreviousCommit: boolean }) {
  if (!secret) throw new Error('secret not set')
  if (!commit) return
  if (!rawRef) return
  const ref = encodeURIComponent(rawRef)

  upload(commit)
  const previousCommit = await getCommit({ ref, secret })
  if (previousCommit && removePreviousCommit) remove(previousCommit)
  await setCommit({
    ref,
    commit,
    secret,
  })
  console.log(`Storybook published: https://storybook.edtr.io/${ref}/`)

  function upload(commit: string) {
    const source = path.join(__dirname, '..', 'dist')
    const dest = `${bucket}/${commit}/`

    const { status } = spawnSync('gsutil', ['ls', dest])
    if (status === 0) {
      console.log('Destination folder already exists')
      return
    }
    spawnSync('gsutil', ['-m', 'cp', '-r', path.join(source, '*'), dest], {
      stdio: 'inherit',
    })
  }

  function remove(commit: string) {
    spawnSync('gsutil', ['rm', '-r', `${bucket}/${commit}/`], {
      stdio: 'inherit',
    })
  }
}

export function getCommit({ secret, ref }: Pick<Payload, 'secret' | 'ref'>) {
  return new Promise<string | null>((resolve, reject) => {
    request.get(
      `https://api.cloudflare.com/client/v4/accounts/0e24f0f2e24dfe914ff15504899b0156/storage/kv/namespaces/f2d4ac58853245febc094ea6005a92e0/values/${ref}`,
      {
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      },
      (error, res) => {
        if (error) return reject(error)
        if (res.statusCode === 404) return resolve(null)
        return resolve(res.body)
      }
    )
  })
}

export function setCommit({ secret, commit, ref }: Payload) {
  return new Promise<void>((resolve, reject) => {
    request.put(
      `https://api.cloudflare.com/client/v4/accounts/0e24f0f2e24dfe914ff15504899b0156/storage/kv/namespaces/f2d4ac58853245febc094ea6005a92e0/values/${ref}`,
      {
        headers: {
          Authorization: `Bearer ${secret}`,
        },
        body: commit,
      },
      (error) => {
        if (error) return reject(error)
        return resolve()
      }
    )
  })
}

export interface Payload {
  secret: string
  commit: string
  ref: string
}
