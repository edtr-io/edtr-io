import { StateTypeSerializedType } from '@edtr-io/plugin'
import { name as textPlugin } from '@edtr-io/plugin-text/__fixtures__'

import { EquationsState, createEquationsPlugin } from '../src'

export const name = 'equations'
export const plugin = createEquationsPlugin()

export const states: Record<string, StateTypeSerializedType<EquationsState>> = {
  simple: {
    steps: [
      {
        left: {
          plugin: textPlugin,
          state: [
            {
              type: 'p',
              children: [{ text: 'left' }]
            }
          ]
        },
        right: {
          plugin: textPlugin,
          state: [
            {
              type: 'p',
              children: [{ text: 'right' }]
            }
          ]
        },
        transform: {
          plugin: textPlugin,
          state: [
            {
              type: 'p',
              children: [{ text: 'transform' }]
            }
          ]
        }
      }
    ]
  }
}
