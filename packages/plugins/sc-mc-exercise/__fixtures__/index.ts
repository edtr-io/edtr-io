import { StateTypeSerializedType } from '@edtr-io/plugin'
import {
  createTextState,
  name as textPlugin,
  Text
} from '@edtr-io/plugin-text/__fixtures__'

import { ScMcExerciseState, createScMcExercisePlugin } from '../src'

export const name = 'scMcExercise'
export const plugin = createScMcExercisePlugin()

export const states: Record<
  string,
  StateTypeSerializedType<ScMcExerciseState>
> = {
  singleChoice: {
    isSingleChoice: true,
    answers: [
      {
        isCorrect: true,
        content: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'correct' }))
        },
        feedback: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'correct feedback' }))
        }
      },
      {
        isCorrect: false,
        content: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'wrong' }))
        },
        feedback: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'wrong feedback' }))
        }
      }
    ]
  },
  multipleChoice: {
    isSingleChoice: false,
    answers: [
      {
        isCorrect: true,
        content: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'first correct' }))
        },
        feedback: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'correct feedback' }))
        }
      },
      {
        isCorrect: true,
        content: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'second correct' }))
        },
        feedback: undefined
      },
      {
        isCorrect: false,
        content: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'wrong' }))
        },
        feedback: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'wrong feedback' }))
        }
      }
    ]
  }
}
