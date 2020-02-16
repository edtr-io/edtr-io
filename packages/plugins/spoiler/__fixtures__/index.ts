import { StateTypeSerializedType } from '@edtr-io/plugin'
import {
  createRowsState,
  name as rowsPlugin
} from '@edtr-io/plugin-rows/__fixtures__'
import { name as textPlugin } from '@edtr-io/plugin-text/__fixtures__'

import { SpoilerState, createSpoilerPlugin } from '../src'

export const name = 'spoiler'
export const plugin = createSpoilerPlugin({
  content: { plugin: 'rows' }
})

export const states: Record<string, StateTypeSerializedType<SpoilerState>> = {
  simple: {
    title: '',
    content: {
      plugin: rowsPlugin,
      state: createRowsState({
        plugin: textPlugin,
        state: [
          {
            type: 'p',
            children: [{ text: 'This is a spoiler' }]
          }
        ]
      })
    }
  }
}
