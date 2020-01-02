import { StateTypeSerializedType } from '@edtr-io/plugin'

import { WrapperState, createWrapperPlugin } from '../src'
import {
  createTextState,
  name as textPlugin,
  Text
} from '@edtr-io/plugin-text/__fixtures__'

export const name = 'wrapper'
export const plugin = createWrapperPlugin()

export const states: Record<string, StateTypeSerializedType<WrapperState>> = {
  simple: {
    plugin: textPlugin,
    state: createTextState(Text.create({ text: 'Wrapperdemo' }))
  }
}
