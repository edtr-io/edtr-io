import { StateTypeSerializedType } from '@edtr-io/plugin'
import { name as textPlugin } from '@edtr-io/plugin-text/__fixtures__'

import { ScMcExercisePluginState, createScMcExercisePlugin } from '../src'

export const name = 'scMcExercise'
export const plugin = createScMcExercisePlugin({
  content: { plugin: 'text', config: { registry: [] } },
  feedback: { plugin: 'text', config: { registry: [] } },
})

export const states: Record<
  string,
  StateTypeSerializedType<ScMcExercisePluginState>
> = {
  singleChoice: {
    isSingleChoice: true,
    answers: [
      {
        isCorrect: true,
        content: {
          plugin: textPlugin,
          state: [
            {
              type: 'p',
              children: [{ text: 'correct' }],
            },
          ],
        },
        feedback: {
          plugin: textPlugin,
          state: [
            {
              type: 'p',
              children: [{ text: 'correct feedback' }],
            },
          ],
        },
      },
      {
        isCorrect: false,
        content: {
          plugin: textPlugin,
          state: [
            {
              type: 'p',
              children: [{ text: 'wrong' }],
            },
          ],
        },
        feedback: {
          plugin: textPlugin,
          state: [
            {
              type: 'p',
              children: [{ text: 'wrong feedback' }],
            },
          ],
        },
      },
    ],
  },
  multipleChoice: {
    isSingleChoice: false,
    answers: [
      {
        isCorrect: true,
        content: {
          plugin: textPlugin,
          state: [
            {
              type: 'p',
              children: [{ text: 'first correct' }],
            },
          ],
        },
        feedback: {
          plugin: textPlugin,
          state: [
            {
              type: 'p',
              children: [{ text: 'correct feedback' }],
            },
          ],
        },
      },
      {
        isCorrect: true,
        content: {
          plugin: textPlugin,
          state: [
            {
              type: 'p',
              children: [{ text: 'second correct' }],
            },
          ],
        },
        feedback: {
          plugin: textPlugin,
          state: [
            {
              type: 'p',
              children: [{ text: '' }],
            },
          ],
        },
      },
      {
        isCorrect: false,
        content: {
          plugin: textPlugin,
          state: [
            {
              type: 'p',
              children: [{ text: 'wrong' }],
            },
          ],
        },
        feedback: {
          plugin: textPlugin,
          state: [
            {
              type: 'p',
              children: [{ text: 'wrong feedback' }],
            },
          ],
        },
      },
    ],
  },
}
