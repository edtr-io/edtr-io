import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { BlockquoteState } from '@edtr-io/plugin-blockquote'

import { render } from '../src'

test('Blockquote plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<BlockquoteState>
  } = {
    plugin: 'blockquote',
    state: {
      plugin: 'anchor',
      state: 'foo'
    }
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('<blockquote')
})
