import { StateTypeSerializedType } from '@edtr-io/plugin'

import { AnchorPluginState, createAnchorPlugin } from '../src'

export const name = 'anchor'
export const plugin = createAnchorPlugin()

export const states: Record<
  string,
  StateTypeSerializedType<AnchorPluginState>
> = {
  simple: 'foo'
}
