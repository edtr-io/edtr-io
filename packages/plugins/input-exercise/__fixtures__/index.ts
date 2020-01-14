import { StateTypeSerializedType } from '@edtr-io/plugin'
import { name as textPlugin } from '@edtr-io/plugin-text/__fixtures__'

import { InputExerciseState, createInputExercisePlugin } from '../src'

export const name = 'inputExercise'
export const plugin = createInputExercisePlugin()

export const states: Record<
  string,
  StateTypeSerializedType<InputExerciseState>
> = {
  text: {
    __version__: 2,
    value: {
      type: 'input-string-normalized-match-challenge',
      unit: '',
      answers: [
        {
          value: 'correct',
          isCorrect: true,
          feedback: {
            plugin: textPlugin,
            state: [
              {
                type: 'p',
                children: [{ text: 'This is correct' }]
              }
            ]
          }
        }
      ]
    }
  },
  number: {
    __version__: 2,
    value: {
      type: 'input-number-exact-match-challenge',
      unit: '',
      answers: [
        {
          value: '42',
          isCorrect: true,
          feedback: {
            plugin: textPlugin,
            state: [
              {
                type: 'p',
                children: [{ text: 'This is correct' }]
              }
            ]
          }
        }
      ]
    }
  },
  expression: {
    __version__: 2,
    value: {
      type: 'input-expression-equal-match-challenge',
      unit: '',
      answers: [
        {
          value: '42',
          isCorrect: true,
          feedback: {
            plugin: textPlugin,
            state: [
              {
                type: 'p',
                children: [{ text: 'This is correct' }]
              }
            ]
          }
        }
      ]
    }
  }
}
