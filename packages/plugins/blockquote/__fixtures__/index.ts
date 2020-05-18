import { StateTypeSerializedType } from '@edtr-io/plugin'
import { name as textPlugin } from '@edtr-io/plugin-text/__fixtures__'

import { BlockquotePluginState, createBlockquotePlugin } from '../src'

export const name = 'blockquote'
export const plugin = createBlockquotePlugin({ content: { plugin: 'text' } })

export const states: Record<
  string,
  StateTypeSerializedType<BlockquotePluginState>
> = {
  simple: {
    plugin: textPlugin,
    state: [
      {
        type: 'p',
        children: [{ text: 'This is a blockquote' }],
      },
    ],
  },
}
