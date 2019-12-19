import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { ImportantStatementState } from '@edtr-io/plugin-important-statement'

import { render } from '../src'

test('Important statement plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<ImportantStatementState>
  } = {
    plugin: 'importantStatement',
    state: {
      plugin: 'anchor',
      state: 'foo'
    }
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('foo')
})
