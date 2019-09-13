import { useScopedStore } from '@edtr-io/core'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { getDocument } from '@edtr-io/store'
import * as React from 'react'

import { rowsState } from '.'
import { RowContainer } from './row-container'

export const RowsRenderer = (
  props: StatefulPluginEditorProps<typeof rowsState>
) => {
  const store = useScopedStore()

  return (
    <React.Fragment>
      {Array.from(props.state).map(row => {
        const doc = getDocument(row.id)(store.getState())

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
