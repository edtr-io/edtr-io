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
        state: createTextState(Text.create({ text: 'This is a hint' }))
      })
    }
  }
}
