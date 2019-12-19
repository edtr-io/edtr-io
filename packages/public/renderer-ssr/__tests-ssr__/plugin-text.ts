import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { TextState } from '@edtr-io/plugin-text'
import { Mark, Text } from 'slate'

import { createTextState } from '../__helpers__'
import { render } from '../src'

test('Text plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<TextState>
  } = {
    plugin: 'text',
    state: createTextState([
      Text.create({ text: 'This will be rendered' }),
      Text.create({
        text: 'bold',
        marks: Mark.createSet(['@splish-me/strong'])
      })
    ])
  }
  const { html } = render({
    state,
    plugins
  })

  expect(html).toContain('This will be rendered')
  expect(html).toContain('<strong')
})

test('Text plugin with colors', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<TextState>
  } = {
    plugin: 'text',
    state: createTextState([
      Text.create({
        text: 'This is colored',
        marks: Mark.createSet([
          { type: '@splish-me/color', data: { colorIndex: 1 } }
        ])
      })
    ])
  }

  const { html } = render({
    state,
    plugins
  })

  expect(html).toContain('This is colored')
})
