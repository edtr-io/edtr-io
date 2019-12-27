import { StateTypeSerializedType } from '@edtr-io/plugin'
import { name as textPlugin } from '@edtr-io/plugin-text/__fixtures__'

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
          state: [
            {
              type: 'paragraph',
              children: [{ text: 'correct' }]
            }
          ]
        },
        hasFeedback: true,
        feedback: {
          plugin: textPlugin,
          state: [
            {
              type: 'paragraph',
              children: [{ text: 'correct feedback' }]
            }
          ]
        }
      },
      {
        isCorrect: false,
        id: {
          plugin: textPlugin,
          state: [
            {
              type: 'paragraph',
              children: [{ text: 'wrong' }]
            }
          ]
        },
        hasFeedback: true,
        feedback: {
          plugin: textPlugin,
          state: [
            {
              type: 'paragraph',
              children: [{ text: 'wrong feedback' }]
            }
          ]
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
          state: [
            {
              type: 'paragraph',
              children: [{ text: 'first correct' }]
            }
          ]
        },
        hasFeedback: true,
        feedback: {
          plugin: textPlugin,
          state: [
            {
              type: 'paragraph',
              children: [{ text: 'correct feedback' }]
            }
          ]
        }
      },
      {
        isCorrect: true,
        id: {
          plugin: textPlugin,
          state: [
            {
              type: 'paragraph',
              children: [{ text: 'second correct' }]
            }
          ]
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
          state: [
            {
              type: 'paragraph',
              children: [{ text: 'wrong' }]
            }
          ]
        },
        hasFeedback: true,
        feedback: {
          plugin: textPlugin,
          state: [
            {
              type: 'paragraph',
              children: [{ text: 'wrong feedback' }]
            }
          ]
        }
      }
    ]
  }
}
