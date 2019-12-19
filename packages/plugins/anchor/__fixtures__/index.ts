import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'

import { AnchorState, createAnchorPlugin } from '../src'

export const plugin = createAnchorPlugin()

export const states: Record<string, StateTypeSerializedType<AnchorState>> = {
  simple: 'foo'
}
