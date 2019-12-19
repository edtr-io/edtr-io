import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { TableState } from '@edtr-io/plugin-table'

import { render } from '../src'

test('Table plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<TableState>
  } = {
    plugin: 'table',
    state: '| foo |\n|-|'
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('<table')
})
