import { StatefulPluginEditorProps, selectors, useStore } from '@edtr-io/core'
import * as React from 'react'

import { rowsState } from '..'
import { Row } from './row'

export const RowsEditor = (
  props: StatefulPluginEditorProps<typeof rowsState>
) => {
  const rows = props.state
  const store = useStore()

  return (
    <React.Fragment>
      {rows.items.map((row, index) => {
        const doc = selectors.getDocument(store.getState(), row.id)
        const plugins = selectors.getPlugins(store.getState())

        if (!doc) return null

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
