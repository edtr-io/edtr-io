import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { HintState } from '@edtr-io/plugin-hint'

import { render } from '../src'

test('Hint plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<HintState>
  } = {
    plugin: 'hint',
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
  expect(html).toContain('Tipp')
  expect(html).toContain('anzeigen')
})
