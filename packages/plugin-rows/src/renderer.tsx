import { StatefulPluginEditorProps, selectors, useStore } from '@edtr-io/core'
import * as React from 'react'

import { rowsState } from '.'
import { RowContainer } from './row-container'

export const RowsRenderer = (
  props: StatefulPluginEditorProps<typeof rowsState>
) => {
  const store = useStore()

  return (
    <React.Fragment>
      {props.state().map(row => {
        const doc = selectors.getDocument(store.getState(), row.id)

        return (
          <RowContainer
            editable={props.editable || false}
            name={props.name}
            key={row.id}
            noHeight={doc ? doc.plugin === 'notes' : false}
          >
            {row.render()}
          </RowContainer>
        )
      })}
    </React.Fragment>
  )
}
