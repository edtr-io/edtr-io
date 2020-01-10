import { StateTypeSerializedType } from '@edtr-io/plugin'
import {
  createRowsState,
  name as rowsPlugin
} from '@edtr-io/plugin-rows/__fixtures__'
import { name as textPlugin } from '@edtr-io/plugin-text/__fixtures__'

import { SolutionState, createSolutionPlugin } from '../src'

export const name = 'solution'
export const plugin = createSolutionPlugin()

export const states: Record<string, StateTypeSerializedType<SolutionState>> = {
  simple: {
    title: '',
    content: {
      plugin: rowsPlugin,
      state: createRowsState({
        plugin: textPlugin,
        state: [
          {
            type: 'p',
            children: [{ text: 'This is a solution' }]
          }
        ]
      })
    }
  }
}
