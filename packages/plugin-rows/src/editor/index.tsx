import * as React from 'react'
import {
  EditorContext,
  getDocument,
  StatefulPluginEditorProps
} from '@edtr-io/core'

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
        return (
          //TODO: remove this wrapper if its not needed
          <div key={row.id} style={{ position: 'relative' }}>
            <Row
              {...props}
              index={index}
              doc={doc}
              store={store}
              moveRow={(dragIndex: number, hoverIndex: number) => {
                rows.move(dragIndex, hoverIndex)
              }}
            />
          </div>
        )
      })}
    </React.Fragment>
  )
}
