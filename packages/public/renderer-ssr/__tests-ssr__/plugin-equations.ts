import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { EquationsState } from '@edtr-io/plugin-equations'
import { Text } from 'slate'

import { createTextState } from '../__helpers__'
import { render } from '../src'

test('Equations plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<EquationsState>
  } = {
    plugin: 'equations',
    state: {
      steps: [
        {
          left: {
            plugin: 'text',
            state: createTextState([Text.create({ text: 'left' })])
          },
          right: {
            plugin: 'text',
            state: createTextState([Text.create({ text: 'right' })])
          },
          transform: {
            plugin: 'text',
            state: createTextState([Text.create({ text: 'transform' })])
          }
        }
      ]
    }
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('left')
})
