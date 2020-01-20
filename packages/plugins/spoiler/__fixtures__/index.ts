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

import { SpoilerState, createSpoilerPlugin } from '../src'

export const name = 'spoiler'
export const plugin = createSpoilerPlugin()

export const states: Record<string, StateTypeSerializedType<SpoilerState>> = {
  simple: {
    title: '',
    content: {
      plugin: rowsPlugin,
      state: createRowsState({
        plugin: textPlugin,
        state: createTextState(Text.create({ text: 'This is a spoiler' }))
      })
    }
  }
}
