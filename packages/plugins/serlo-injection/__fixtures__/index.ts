import { StateTypeSerializedType } from '@edtr-io/plugin'

import { SerloInjectionPluginState, createSerloInjectionPlugin } from '../src'

export const name = 'serloInjection'
export const plugin = createSerloInjectionPlugin()

export const states: Record<
  string,
  StateTypeSerializedType<SerloInjectionPluginState>
> = {
  simple: '54210'
}
