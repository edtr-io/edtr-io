import { StatefulPluginEditorProps, selectors, useStore } from '@edtr-io/core'
import * as React from 'react'

import { RowContainer } from './row-container'
import { rowsState } from '.'

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
