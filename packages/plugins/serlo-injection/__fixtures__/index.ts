import { StateTypeSerializedType } from '@edtr-io/plugin'

import { SerloInjectionState, createSerloInjectionPlugin } from '../src'

export const name = 'serloInjection'
export const plugin = createSerloInjectionPlugin()

export const states: Record<
  string,
  StateTypeSerializedType<SerloInjectionState>
> = {
  simple: '54210'
}
