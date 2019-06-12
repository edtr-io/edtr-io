import {
  EditorContext,
  getDocument,
  getPlugins,
  PluginState,
  StatefulPluginEditorProps
} from '@edtr-io/core'
import * as React from 'react'

import { rowsState } from '..'
import { Row } from './row'

export const RowsEditor = (
  props: StatefulPluginEditorProps<typeof rowsState>
) => {
  const rows = props.state
  const store = React.useContext(EditorContext)
  return (
    <React.Fragment>
      {rows.items.map((row, index) => {
        const doc = getDocument(store.state, row.id)
        const plugins = getPlugins(store.state)
        return (
          <div key={row.id} style={{ position: 'relative' }}>
            <Row
              {...props}
              index={index}
              doc={doc}
              store={store}
              moveRow={rows.move}
              insert={rows.insert}
              plugins={plugins}
            />
          </div>
        )
      })}
    </React.Fragment>
  )
}
