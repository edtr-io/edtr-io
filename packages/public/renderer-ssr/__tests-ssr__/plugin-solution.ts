import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { SolutionState } from '@edtr-io/plugin-solution'

import { render } from '../src'

test('Solution plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<SolutionState>
  } = {
    plugin: 'solution',
    state: {
      title: '',
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
  expect(html).toContain('Lösung')
  expect(html).toContain('anzeigen')
})
