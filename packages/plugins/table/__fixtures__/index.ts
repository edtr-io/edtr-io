import { StateTypeSerializedType } from '@edtr-io/plugin'

import { TablePluginState, createTablePlugin } from '../src'

export const name = 'table'
export const plugin = createTablePlugin()

export const states: Record<
  string,
  StateTypeSerializedType<TablePluginState>
> = {
  simple: `| col1 | col2 |
    | ------ | ----------- |
    | ex1 | longer text than the rest |
    | some more lines | |
    | empty second |`,
}
