import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { SpoilerState } from '@edtr-io/plugin-spoiler'

import { render } from '../src'

test('Spoiler plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<SpoilerState>
  } = {
    plugin: 'spoiler',
    state: {
      title: 'foo',
      content: {
        plugin: 'rows',
        state: []
      }
    }
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('foo')
})
