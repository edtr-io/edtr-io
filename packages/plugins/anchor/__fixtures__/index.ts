import { StateTypeSerializedType } from '@edtr-io/plugin'

import { AnchorState, createAnchorPlugin } from '../src'

export const name = 'anchor'
export const plugin = createAnchorPlugin()

export const states: Record<string, StateTypeSerializedType<AnchorState>> = {
  simple: 'foo'
}
