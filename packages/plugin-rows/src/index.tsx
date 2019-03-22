import {
  StatefulPlugin,
  StatefulPluginEditorProps,
  StateType
} from '@edtr-io/core'
import * as React from 'react'

import { RowsEditor } from './editor'
import { RowsRenderer } from './renderer'

export const rowsState = StateType.list(StateType.child(), 1)

const RowsPlugin = (props: StatefulPluginEditorProps<typeof rowsState>) => {
  return props.editable ? (
    <RowsEditor {...props} />
  ) : (
    <RowsRenderer {...props} />
  )
}

export const rowsPlugin: StatefulPlugin<typeof rowsState> = {
  Component: RowsPlugin,
  state: rowsState,
  getFocusableChildren(state) {
    return state()
  }
}
