import { StateTypeSerializedType } from '@edtr-io/plugin'
import {
  createTextState,
  name as textPlugin,
  Text
} from '@edtr-io/plugin-text/__fixtures__'

import { InputExerciseState, createInputExercisePlugin } from '../src'

export const name = 'inputExercise'
export const plugin = createInputExercisePlugin()

export const states: Record<
  string,
  StateTypeSerializedType<InputExerciseState>
> = {
  text: {
    type: 'input-string-normalized-match-challenge',
    unit: '',
    answers: [
      {
        value: 'correct',
        isCorrect: true,
        feedback: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'This is correct' }))
        }
      }
    ]
  },
  number: {
    type: 'input-number-exact-match-challenge',
    unit: '',
    answers: [
      {
        value: '42',
        isCorrect: true,
        feedback: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'This is correct' }))
        }
      }
    ]
  },
  expression: {
    type: 'input-expression-equal-match-challenge',
    unit: '',
    answers: [
      {
        value: '42',
        isCorrect: true,
        feedback: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'This is correct' }))
        }
      }
    ]
  }
}
