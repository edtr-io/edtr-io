import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { ImageState } from '@edtr-io/plugin-image'

import { render } from '../src'

test('Image plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<ImageState>
  } = {
    plugin: 'image',
    state: {
      src: 'foo',
      href: '#',
      target: '',
      rel: '',
      description: 'foo bar',
      maxWidth: 0
    }
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('<img')
})
