import { StateTypeSerializedType } from '@edtr-io/plugin'
import {
  createTextState,
  name as textPlugin,
  Text
} from '@edtr-io/plugin-text/__fixtures__'

import { BlockquoteState, createBlockquotePlugin } from '../src'

export const name = 'blockquote'
export const plugin = createBlockquotePlugin()

export const states: Record<
  string,
  StateTypeSerializedType<BlockquoteState>
> = {
  simple: {
    plugin: textPlugin,
    state: createTextState(Text.create({ text: 'This is a blockquote' }))
  }
}
