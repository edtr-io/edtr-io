import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { FilesState, FileType } from '@edtr-io/plugin-files'

import { render } from '../src'

test('Image plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<FilesState>
  } = {
    plugin: 'files',
    state: [
      {
        type: FileType.Image,
        name: 'foo',
        location: 'bar'
      }
    ]
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('<svg')
})
