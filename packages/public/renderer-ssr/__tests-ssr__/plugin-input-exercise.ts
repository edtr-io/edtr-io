import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { InputExerciseState } from '@edtr-io/plugin-input-exercise'
import { Text } from 'slate'

import { createTextState } from '../__helpers__'
import { render } from '../src'

test('Input exercise plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<InputExerciseState>
  } = {
    plugin: 'inputExercise',
    state: {
      __version__: 1,
      value: {
        type: 'Text',
        answers: [
          {
            value: 'Apfel',
            isCorrect: true,
            feedback: {
              plugin: 'text',
              state: createTextState([Text.create({ text: 'feedback' })])
            }
          }
        ]
      }
    }
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('<input')
})
