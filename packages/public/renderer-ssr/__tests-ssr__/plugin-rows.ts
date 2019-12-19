import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { RowsState } from '@edtr-io/plugin-rows'

import { render } from '../src'

test('Rows plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<RowsState>
  } = {
    plugin: 'rows',
    state: [
      {
        plugin: 'anchor',
        state: 'foo'
      }
    ]
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('foo')
})
