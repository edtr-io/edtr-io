import { exec } from '../__helpers__/deploy'

exec({
  secret: process.env['CF_TOKEN'],
  commit: process.env['COMMIT'],
  ref: process.env['REF'],
  removePreviousCommit: true
}).catch(e => {
  console.log('Failed', e)
  process.exit(1)
})
