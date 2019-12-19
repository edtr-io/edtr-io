import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { MultimediaExplanationState } from '@edtr-io/plugin-multimedia-explanation'
import { Text } from 'slate'

import { createTextState } from '../__helpers__'
import { render } from '../src'

test('Multimedia explanation plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<MultimediaExplanationState>
  } = {
    plugin: 'multimediaExplanation',
    state: {
      illustrating: true,
      explanation: {
        plugin: 'rows',
        state: [
          {
            plugin: 'text',
            state: createTextState([
              Text.create({ text: 'This will be rendered' })
            ])
          }
        ]
      },
      multimedia: {
        plugin: 'image',
        state: {
          src: 'foo',
          href: '#',
          target: '',
          rel: '',
          description: 'foo bar',
          maxWidth: 0
        }
      },
      width: 50
    }
  }

  const { html } = render({ state, plugins })
  expect(html).toContain('This will be rendered')
  expect(html).toContain('<img')
})
