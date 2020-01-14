import { StateTypeSerializedType } from '@edtr-io/plugin'
import {
  createRowsState,
  name as rowsPlugin
} from '@edtr-io/plugin-rows/__fixtures__'
import { name as textPlugin } from '@edtr-io/plugin-text/__fixtures__'

import { HintState, createHintPlugin } from '../src'

export const name = 'hint'
export const plugin = createHintPlugin()

export const states: Record<string, StateTypeSerializedType<HintState>> = {
  simple: {
    title: '',
    content: {
      plugin: rowsPlugin,
      state: createRowsState({
        plugin: textPlugin,
        state: [
          {
            type: 'p',
            children: [{ text: 'This is a hint' }]
          }
        ]
      })
    }
  }
}
