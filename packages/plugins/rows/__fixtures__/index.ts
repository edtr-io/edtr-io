import { StateTypeSerializedType } from '@edtr-io/plugin'
import { name as textPlugin } from '@edtr-io/plugin-text/__fixtures__'

import {
  RowsPluginState,
  createRowsPlugin,
  defaultRegistryPlugins,
} from '../src'

export const name = 'rows'
export const plugin = createRowsPlugin({
  content: { plugin: 'text' },
  plugins: defaultRegistryPlugins,
})

export const states: Record<
  string,
  StateTypeSerializedType<RowsPluginState>
> = {
  simple: createRowsState({
    plugin: textPlugin,
    state: [
      {
        type: 'p',
        children: [{ text: 'Hello world' }],
      },
    ],
  }),
}

export function createRowsState(
  ...args: { plugin: string; state: unknown }[]
): StateTypeSerializedType<RowsPluginState> {
  return args
}
