import { StateTypeSerializedType } from '@edtr-io/plugin'
import {
  createTextState,
  name as textPlugin,
    Text
} from '@edtr-io/plugin-text/__fixtures__'

import { EquationsState, createEquationsPlugin } from '../src'

export const name = 'equations'
export const plugin = createEquationsPlugin()

export const states: Record<string, StateTypeSerializedType<EquationsState>> = {
  simple: {
    steps: [
      {
        left: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'left' }))
        },
        right: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'right' }))
        },
        transform: {
          plugin: textPlugin,
          state: createTextState(Text.create({ text: 'transform' }))
        }
      }
    ]
  }
}
