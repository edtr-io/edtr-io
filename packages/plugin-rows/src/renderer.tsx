import { StatefulPluginEditorProps } from '@edtr-io/core'
import { rowsState } from '.'
import * as React from 'react'

import { RowContainer } from './row'

export const RowsRenderer = (
  props: StatefulPluginEditorProps<typeof rowsState>
) => {
  return (
    <React.Fragment>
      {props.state().map(row => {
        return (
          <RowContainer name={props.name} key={row.id}>
            {row.render()}
          </RowContainer>
        )
      })}
    </React.Fragment>
  )
}
