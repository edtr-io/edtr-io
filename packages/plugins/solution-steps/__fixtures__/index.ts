import { StateTypeSerializedType } from '@edtr-io/plugin'
import {
  createRowsState,
  name as rowsPlugin
} from '@edtr-io/plugin-rows/__fixtures__'
import {
  createTextState,
  name as textPlugin,
  Text
} from '@edtr-io/plugin-text/__fixtures__'

import { SolutionStepsState, createSolutionStepsPlugin } from '../src'

export const name = 'solutionSteps'
export const plugin = createSolutionStepsPlugin()

export const states: Record<
  string,
  StateTypeSerializedType<SolutionStepsState>
> = {
  example: {
    introduction: {
      plugin: textPlugin,
      state: createTextState(Text.create({ text: 'introduction' }))
    },
    hasStrategy: true,
    strategy: { plugin: rowsPlugin, state: createRowsState() },
    solutionSteps: [
      {
        type: 'step',
        isHalf: false,
        content: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'step' }))
        }
      }
    ],
    hasAdditionals: true,
    additionals: { plugin: rowsPlugin, state: createRowsState() }
  }
}
