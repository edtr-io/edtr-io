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
        id: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'correct' }))
        },
        hasFeedback: true,
        feedback: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'correct feedback' }))
        }
      },
      {
        isCorrect: false,
        id: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'wrong' }))
        },
        hasFeedback: true,
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
        id: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'first correct' }))
        },
        hasFeedback: true,
        feedback: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'correct feedback' }))
        }
      },
      {
        isCorrect: true,
        id: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'second correct' }))
        },
        hasFeedback: false,
        feedback: {
          plugin: textPlugin
        }
      },
      {
        isCorrect: false,
        id: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'wrong' }))
        },
        hasFeedback: true,
        feedback: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'wrong feedback' }))
        }
      }
    ]
  }
}
