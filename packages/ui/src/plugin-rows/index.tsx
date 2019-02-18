import { StatefulPlugin, StateType } from '@edtr-io/core'

import { RowsPlugin } from './editor'

export const rowsState = StateType.list(StateType.child())

export const rowsPlugin: StatefulPlugin<typeof rowsState> = {
  Component: RowsPlugin,
  state: rowsState
}
