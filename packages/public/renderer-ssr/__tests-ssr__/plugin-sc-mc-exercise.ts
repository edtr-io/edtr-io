import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { ScMcExerciseState } from '@edtr-io/plugin-sc-mc-exercise'
import { Text } from 'slate'

import { createTextState } from '../__helpers__'
import { render } from '../src'

test('Sc-Mc exercise plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<ScMcExerciseState>
  } = {
    plugin: 'scMcExercise',
    state: {
      isSingleChoice: true,
      answers: [
        {
          id: {
            plugin: 'text',
            state: createTextState([Text.create({ text: 'option a' })])
          },
          isCorrect: true,
          feedback: {
            plugin: 'text',
            state: createTextState([Text.create({ text: 'feedback' })])
          },
          hasFeedback: true
        }
      ]
    }
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('option a')
})
