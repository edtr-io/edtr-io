import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { HighlightState } from '@edtr-io/plugin-highlight'

import { render } from '../src'

test('Highlight plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<HighlightState>
  } = {
    plugin: 'highlight',
    state: {
      text: 'const el = <div />',
      language: 'javascript',
      lineNumbers: true
    }
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('const')
})
