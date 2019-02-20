import { StatefulPlugin, StateType } from '@edtr-io/core'

import { RowsPlugin } from './editor'

export const rowsState = StateType.list(StateType.child(), 1)

export const rowsPlugin: StatefulPlugin<typeof rowsState> = {
  Component: RowsPlugin,
  state: rowsState
}
